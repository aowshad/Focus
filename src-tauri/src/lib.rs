use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, LogicalPosition, Manager, WebviewWindow,
};

/// Web app -> menu bar text (e.g. "24:13"). Empty string = icon only.
#[tauri::command]
fn set_menubar(app: tauri::AppHandle, label: String) {
    if let Some(tray) = app.tray_by_id("main") {
        let _ = tray.set_title(if label.is_empty() { None } else { Some(&label) });
    }
}

/// Web app (popover) asks to hide itself.
#[tauri::command]
fn hide_popover(app: tauri::AppHandle) {
    if let Some(win) = app.get_webview_window("popover") {
        let _ = win.hide();
    }
}

/// Relay a popover control action to the main window (which owns the engine).
/// Using a command (not window->window events) makes delivery reliable.
#[tauri::command]
fn popover_action(app: tauri::AppHandle, action: String) {
    if action == "open" {
        show_main(&app);
        return;
    }
    if action == "quit" {
        app.exit(0);
        return;
    }
    // toggle / skip / restart -> tell the main window's engine
    let _ = app.emit_to("main", "engine-control", action);
}

fn show_main(app: &tauri::AppHandle) {
    if let Some(win) = app.get_webview_window("popover") {
        let _ = win.hide();
    }
    if let Some(win) = app.get_webview_window("main") {
        let _ = win.show();
        let _ = win.unminimize();
        let _ = win.set_focus();
    }
}

/// Toggle the popover, anchoring its top edge just below the tray icon.
fn toggle_popover(popover: &WebviewWindow, anchor: Option<(f64, f64)>) {
    if popover.is_visible().unwrap_or(false) {
        let _ = popover.hide();
        return;
    }
    if let Some((cx, bottom)) = anchor {
        let scale = popover.scale_factor().unwrap_or(1.0);
        let w = popover
            .outer_size()
            .map(|s| s.width as f64)
            .unwrap_or(320.0);
        // cx/bottom are physical px; convert to logical for positioning
        let x = (cx - w / 2.0) / scale;
        let y = bottom / scale + 6.0;
        let _ = popover.set_position(LogicalPosition::new(x.max(8.0), y));
    }
    let _ = popover.show();
    let _ = popover.set_focus();
    let _ = popover.emit("popover-shown", ());
}

/// Decode the embedded tray PNG into a Tauri Image (raw RGBA).
fn tray_image() -> Option<tauri::image::Image<'static>> {
    let bytes = include_bytes!("../icons/tray-icon.png");
    let decoder = png::Decoder::new(std::io::Cursor::new(bytes.as_slice()));
    let mut reader = decoder.read_info().ok()?;
    let mut buf = vec![0u8; reader.output_buffer_size()];
    let info = reader.next_frame(&mut buf).ok()?;
    buf.truncate(info.buffer_size());
    // png is written as RGBA8, matching what Image::new expects.
    Some(tauri::image::Image::new_owned(buf, info.width, info.height))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![set_menubar, hide_popover, popover_action])
        .setup(|app| {
            let handle = app.handle();

            let show_i = MenuItem::with_id(app, "show", "Show Focus", true, None::<&str>)?;
            let toggle_i = MenuItem::with_id(app, "toggle", "Start / Pause", true, None::<&str>)?;
            let sep = PredefinedMenuItem::separator(app)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit Focus", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &toggle_i, &sep, &quit_i])?;

            TrayIconBuilder::with_id("main")
                .icon(tray_image().unwrap_or_else(|| app.default_window_icon().unwrap().clone()))
                .icon_as_template(true)
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => show_main(app),
                    "toggle" => {
                        let _ = app.emit("tray-toggle", ());
                    }
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        rect,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(pop) = app.get_webview_window("popover") {
                            let scale = pop.scale_factor().unwrap_or(1.0);
                            let pos = rect.position.to_physical::<f64>(scale);
                            let size = rect.size.to_physical::<f64>(scale);
                            let cx = pos.x + size.width / 2.0;
                            let bottom = pos.y + size.height;
                            toggle_popover(&pop, Some((cx, bottom)));
                        }
                    }
                })
                .build(app)?;

            if let Some(pop) = app.get_webview_window("popover") {
                let pop2 = pop.clone();
                pop.on_window_event(move |ev| {
                    if let tauri::WindowEvent::Focused(false) = ev {
                        let _ = pop2.hide();
                    }
                });
            }

            if let Some(tray) = handle.tray_by_id("main") {
                let _ = tray.set_title(None::<&str>);
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Focus");
}
