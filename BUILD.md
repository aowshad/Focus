# Building Focus for macOS 🍎

This guide takes you from the web app in this repo to a real, installable
**Focus.app** published on GitHub Releases — the same pipeline used by apps like
[prayer-times-macos](https://github.com/tareq1988/prayer-times-macos).

The desktop build uses [Tauri v2](https://tauri.app): your existing
`index.html` + `css/` + `js/` become the app's UI inside a native shell.
No code changes needed — the web app and the macOS app share one codebase.

---

## 0. One-time setup (on your Mac)

**Xcode Command Line Tools** (compilers, codesign):
```sh
xcode-select --install
```

**Rust** (Tauri's build system):
```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
Restart your terminal afterwards, then verify with `cargo --version`.

**Tauri CLI:**
```sh
cargo install tauri-cli --version "^2"
```
(First install takes a few minutes — it's compiling the CLI.)

---

## 1. Generate the full icon set (one time)

The repo ships with `app-icon.png` (1024×1024). Turn it into every size macOS
needs, including `icon.icns`:

```sh
cd focus
cargo tauri icon app-icon.png
```

This fills `src-tauri/icons/` automatically.

---

## 2. Run the app in development

```sh
cargo tauri dev
```

A native window opens with the app inside. The **first run compiles the Rust
shell and takes several minutes** — every run after that starts in seconds.

> Data note: the desktop app has its own localStorage, separate from your
> browser's. Your first launch starts fresh (Settings → Load sample history to
> preview analytics).

---

## 3. Build the release app

```sh
cargo tauri build
```

When it finishes, your artifacts are at:

```
src-tauri/target/release/bundle/macos/Focus.app     ← the app
src-tauri/target/release/bundle/dmg/Focus_1.1.0_aarch64.dmg   ← the installer
```

Double-click `Focus.app` to test it, or drag it into `/Applications`. That's
it — it's a real Mac app with your icon in the Dock.

> **Apple silicon vs Intel:** the build targets your Mac's architecture.
> On an M-series Mac you get an `aarch64` build (fine for the vast majority of
> users today). A universal binary is possible later with
> `cargo tauri build --target universal-apple-darwin` after adding the Intel
> toolchain (`rustup target add x86_64-apple-darwin`).

---

## 4. Publish a release on GitHub

1. Zip the app (keeps the bundle intact):
   ```sh
   cd src-tauri/target/release/bundle/macos
   ditto -c -k --keepParent Focus.app Focus-1.1.0-mac.zip
   ```
2. On your repo page: **Releases → Draft a new release**
   - Tag: `v1.1.0`
   - Title: `Focus 1.1.0 — first macOS release`
   - Attach `Focus-1.1.0-mac.zip` (and the `.dmg` if you like)
   - Write short release notes (features + install steps)
3. **Publish.** Visitors can now download and install your app.

Or with the GitHub CLI in one line:
```sh
gh release create v1.1.0 Focus-1.1.0-mac.zip --title "Focus 1.1.0" --notes "First macOS release 🎉"
```

---

## 5. The Gatekeeper warning (important — read this)

Your build is **not notarized** (that requires a $99/year Apple Developer
account), so when users first open it macOS says *"Focus" can't be opened /
Apple could not verify it is free of malware.*

This is normal for indie open-source apps. Users fix it in one of two ways:

- **System Settings → Privacy & Security → scroll down → "Open Anyway"**, or
- Terminal: `xattr -dr com.apple.quarantine /Applications/Focus.app`

**Do what prayer-times-macos does:** put this exact note (with screenshots)
in your README's Install section. Users are used to it, and it builds trust
to be upfront.

If the app takes off, buy the Apple Developer membership and add notarization —
the warning disappears entirely and you can also enable auto-updates.

---

## 6. Optional next steps

- **Homebrew tap** — create a `homebrew-tap` repo with a cask file so people
  can `brew install --cask <you>/tap/focus`. ~20 lines of Ruby.
- **Menu bar countdown** — Tauri's tray API can put the remaining time next to
  your clock. Great v1.2 feature.
- **Auto-updates** — Tauri's updater plugin + GitHub Releases.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `cargo: command not found` | Restart terminal after installing Rust, or run `source "$HOME/.cargo/env"` |
| Build fails mentioning `xcrun` | Run `xcode-select --install` and retry |
| Blank window in dev | Make sure `dist/` was created — the `beforeDevCommand` copies the web files there automatically; check for errors in the terminal |
| "Focus is damaged and can't be opened" | The quarantine flag — run the `xattr` command from step 5 |
| Notifications don't fire in the app | macOS: System Settings → Notifications → Focus → Allow |
