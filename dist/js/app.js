"use strict";
/* =====================================================================
   Focus — app.js
   Layers: icons → store → state → engine → analytics → ui → events
   Zero dependencies. All data stays in the browser (localStorage).
   ===================================================================== */

/* =====================================================================
   ICONS — inline SVG set (feather-style, stroke-based)
   ===================================================================== */
const ICONS = {
  "clock":        '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  "star":         '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  "calendar":     '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  "inbox":        '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  "check-circle": '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  "check":        '<polyline points="20 6 9 17 4 12"/>',
  "trash":        '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  "bar-chart":    '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  "sliders":      '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  "play":         '<polygon points="6 3.5 21 12 6 20.5" fill="currentColor" stroke="none"/>',
  "pause":        '<rect x="5" y="4" width="4.5" height="16" rx="1.5" fill="currentColor" stroke="none"/><rect x="14.5" y="4" width="4.5" height="16" rx="1.5" fill="currentColor" stroke="none"/>',
  "skip-fwd":     '<polygon points="5 4 15 12 5 20" fill="currentColor" stroke="none"/><line x1="19" y1="5" x2="19" y2="19" stroke-width="2.5"/>',
  "skip-back":    '<polygon points="19 4 9 12 19 20" fill="currentColor" stroke="none"/><line x1="5" y1="5" x2="5" y2="19" stroke-width="2.5"/>',
  "crosshair":    '<circle cx="12" cy="12" r="9"/><line x1="21" y1="12" x2="17" y2="12"/><line x1="7" y1="12" x2="3" y2="12"/><line x1="12" y1="7" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="17"/>',
  "x":            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  "plus":         '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  "rotate":       '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  "zap":          '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  "pie":          '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  "battery":      '<rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/>',
  "database":     '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  "flame":        '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  "award":        '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  "grid":         '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  "chev-l":       '<polyline points="15 18 9 12 15 6"/>',
  "chev-r":       '<polyline points="9 18 15 12 9 6"/>',
  "trend-up":     '<polyline points="7 13 12 8 17 13"/><polyline points="7 19 12 14 17 19"/>',
  "trend-down":   '<polyline points="7 11 12 16 17 11"/><polyline points="7 5 12 10 17 5"/>',
  "trend-flat":   '<line x1="6" y1="12" x2="18" y2="12"/>'
};
const ic = (name, size = 16, cls = "") =>
  `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
const hydrateIcons = root => (root || document).querySelectorAll("[data-ic]").forEach(el => {
  el.innerHTML = ic(el.dataset.ic, +(el.dataset.sz || 16));
});

/* =====================================================================
   PERSISTENCE — localStorage with in-memory fallback
   ===================================================================== */
const store = (() => {
  const mem = {}; let ok = false;
  try { localStorage.setItem("__t", "1"); localStorage.removeItem("__t"); ok = true; } catch (e) {}
  return {
    get(k, d) { try { const v = ok ? localStorage.getItem(k) : mem[k]; return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { const s = JSON.stringify(v); mem[k] = s; if (ok) { try { localStorage.setItem(k, s); } catch (e) {} } },
    del(k) { delete mem[k]; if (ok) { try { localStorage.removeItem(k); } catch (e) {} } }
  };
})();

/* =====================================================================
   STATE
   ===================================================================== */
const DEFAULTS = { focus: 25, short: 5, long: 15, cycle: 4, goal: 8, sound: true, notify: false, auto: false };
let settings = Object.assign({}, DEFAULTS, store.get("fx.settings", {}));
let tasks    = store.get("fx.tasks", []);     // {id,title,due,status,createdAt,completedAt}
let sessions = store.get("fx.sessions", []);  // {id,start,end,kind,taskId}  kind: focus|short|long
let activeTaskId = store.get("fx.activeTask", null);
const saveAll = () => { store.set("fx.settings", settings); store.set("fx.tasks", tasks); store.set("fx.sessions", sessions); store.set("fx.activeTask", activeTaskId); };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ---------- date helpers ---------- */
const DAY = 86400000;
const startOfDay  = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const sameDay     = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();
const startOfWeek = d => { const x = startOfDay(d); x.setDate(x.getDate() - x.getDay()); return x; }; // Sunday start
const fmtHM  = mins => mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
const fmtClock = t => t.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

/* =====================================================================
   TIMER ENGINE — timestamp-based state machine, UI-independent
   ===================================================================== */
const engine = {
  phase: "focus", running: false, endsAt: 0, remainMs: 0, phaseStart: 0, cycleCount: 0, _iv: null,
  durMs(p) { return { focus: settings.focus, short: settings.short, long: settings.long }[p] * 60000; },
  init() { this.remainMs = this.durMs(this.phase); },
  start() {
    if (this.running) return;
    if (this.remainMs <= 0) this.remainMs = this.durMs(this.phase);
    this.running = true;
    this.phaseStart = this.phaseStart || (Date.now() - (this.durMs(this.phase) - this.remainMs));
    this.endsAt = Date.now() + this.remainMs;
    this._iv = setInterval(() => this.tick(), 250);
    ui.notifyPermission();
    ui.renderTimer();
  },
  pause() {
    if (!this.running) return;
    this.running = false; clearInterval(this._iv);
    this.remainMs = Math.max(0, this.endsAt - Date.now());
    ui.renderTimer();
  },
  tick() {
    this.remainMs = Math.max(0, this.endsAt - Date.now());
    if (this.remainMs <= 0) this.complete(true);
    ui.renderTimer(true);
  },
  restartPhase() { this.pause(); this.remainMs = this.durMs(this.phase); this.phaseStart = 0; ui.renderTimer(); },
  skip() { this.complete(false); },
  complete(natural) {
    clearInterval(this._iv); this.running = false;
    const spentMs = this.durMs(this.phase) - this.remainMs;
    // Log the session if meaningful time was spent (>=30s); full credit on natural completion
    if (natural || spentMs >= 30000) {
      const end = Date.now();
      sessions.push({
        id: uid(), start: end - (natural ? this.durMs(this.phase) : spentMs), end,
        kind: this.phase, taskId: this.phase === "focus" ? activeTaskId : null
      });
      saveAll();
    }
    if (this.phase === "focus" && (natural || spentMs >= 30000)) this.cycleCount++;
    // advance the state machine
    if (this.phase === "focus") this.phase = (this.cycleCount > 0 && this.cycleCount % settings.cycle === 0) ? "long" : "short";
    else this.phase = "focus";
    if (this.phase === "focus" && this.cycleCount >= settings.cycle) this.cycleCount = 0;
    this.remainMs = this.durMs(this.phase); this.phaseStart = 0;
    if (natural) { ui.chime(); ui.notify(this.phase); }
    if (natural && settings.auto) this.start();
    ui.renderAll();
  }
};

/* =====================================================================
   ANALYTICS — pure functions over the sessions array
   ===================================================================== */
const A = {
  onDay(d, kind) {
    const s0 = startOfDay(d).getTime(), s1 = s0 + DAY;
    return sessions.filter(s => s.start >= s0 && s.start < s1 && (!kind || s.kind === kind));
  },
  focusMins(list) { return Math.round(list.reduce((a, s) => a + (s.end - s.start), 0) / 60000); },
  daySummary(d) {
    const f = this.onDay(d, "focus");
    return { sessions: f.length, mins: this.focusMins(f), short: this.onDay(d, "short").length, long: this.onDay(d, "long").length };
  },
  range(from, days) {
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(from.getTime() + i * DAY), f = this.onDay(d, "focus");
      return { date: d, count: f.length, mins: this.focusMins(f) };
    });
  },
  dayCounts() { // Map of dayStartMs -> focus session count (for heatmap/streaks)
    const m = new Map();
    for (const s of sessions) if (s.kind === "focus") {
      const k = startOfDay(new Date(s.start)).getTime();
      m.set(k, (m.get(k) || 0) + 1);
    }
    return m;
  },
  streaks() {
    const days = new Set(this.dayCounts().keys());
    // current streak: today counts if active; otherwise the streak is still alive through yesterday
    let cur = 0, t = startOfDay(new Date()).getTime();
    if (!days.has(t)) t -= DAY;
    while (days.has(t)) { cur++; t -= DAY; }
    // best streak
    let best = 0, run = 0, prev = null;
    for (const d of [...days].sort((a, b) => a - b)) {
      run = (prev != null && d - prev === DAY) ? run + 1 : 1;
      best = Math.max(best, run); prev = d;
    }
    return { cur, best, total: days.size };
  },
  taskBreakdown(d) {
    const map = new Map();
    for (const s of this.onDay(d, "focus")) {
      const key = s.taskId || "__none";
      const e = map.get(key) || { count: 0, mins: 0 };
      e.count++; e.mins += Math.round((s.end - s.start) / 60000); map.set(key, e);
    }
    return [...map.entries()].map(([taskId, v]) => ({
      taskId, ...v,
      title: taskId === "__none" ? "No task" : (tasks.find(t => t.id === taskId)?.title || "Deleted task")
    })).sort((a, b) => b.mins - a.mins);
  },
  months() {
    const map = new Map();
    for (const s of sessions) { if (s.kind !== "focus") continue;
      const d = new Date(s.start), k = d.getFullYear() * 100 + d.getMonth();
      const e = map.get(k) || { y: d.getFullYear(), m: d.getMonth(), days: new Set(), sessions: 0, mins: 0 };
      e.days.add(startOfDay(d).getTime()); e.sessions++; e.mins += Math.round((s.end - s.start) / 60000); map.set(k, e);
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([, e]) => ({ ...e, activeDays: e.days.size }));
  }
};
const trend = (cur, prev) => prev == null ? "" : cur > prev ? "up" : cur < prev ? "down" : "flat";
const trendIcon = t => t ? ic("trend-" + t, 14) : "";

/* =====================================================================
   UI
   ===================================================================== */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const QUOTES = [
  ["There is nothing so useless as doing efficiently that which should not be done at all.", "Peter Drucker"],
  ["It is not enough to be busy; so are the ants. The question is: what are we busy about?", "Henry David Thoreau"],
  ["The shorter way to do many things is to do only one thing at a time.", "Mozart"],
  ["Amateurs sit and wait for inspiration; the rest of us just get up and go to work.", "Stephen King"],
  ["What gets measured gets managed.", "Peter Drucker"],
  ["Focus is a matter of deciding what things you're not going to do.", "John Carmack"]
];
let currentNav = "timer", currentFilter = "today";
let selDate = startOfDay(new Date()), weekAnchor = startOfWeek(new Date()), chartMode = "week";

const ui = {
  /* ----- navigation ----- */
  nav(name, filter) {
    currentNav = name; if (filter) currentFilter = filter;
    $$(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + name));
    $$("[data-nav]").forEach(b => {
      const on = b.dataset.nav === name && (name !== "tasks" || !b.dataset.filter || b.dataset.filter === currentFilter);
      b.classList.toggle("active", on);
    });
    this.renderAll();
  },

  /* ----- timer ----- */
  /* Push the current time/phase to the native macOS menu bar (Tauri only; no-op in browser) */
  _tauriInvoke() { return window.__TAURI__ && window.__TAURI__.core && window.__TAURI__.core.invoke; },
  syncMenubar() {
    const invoke = this._tauriInvoke();
    if (!invoke) return; // running in a browser — nothing to do
    let label = "";
    if (engine.running) {
      const rem = engine.remainMs;
      label = `${String(Math.floor(rem / 60000)).padStart(2, "0")}:${String(Math.floor(rem / 1000) % 60).padStart(2, "0")}`;
    }
    try { invoke("set_menubar", { label }); } catch (e) {}
    // Publish runtime state so the menu bar popover can mirror it, then ping it.
    try {
      store.set("fx.runtime", { phase: engine.phase, running: engine.running, remainMs: engine.remainMs, ts: Date.now() });
      if (window.__TAURI__ && window.__TAURI__.event) window.__TAURI__.event.emit("fx-updated", {});
    } catch (e) {}
  },

  renderTimer(light) {
    const total = engine.durMs(engine.phase), rem = engine.remainMs;
    const mm = String(Math.floor(rem / 60000)).padStart(2, "0"), ss = String(Math.floor(rem / 1000) % 60).padStart(2, "0");
    $("#timeBig").textContent = `${mm}:${ss}`;
    $("#sideClock").textContent = `${mm}:${ss}`;
    document.title = engine.running ? `${mm}:${ss} · Focus` : "Focus";
    this.syncMenubar();
    const C = 282.74;
    $("#ringFill").style.strokeDashoffset = C * (1 - rem / total);
    $("#ringBox").classList.toggle("running", engine.running);
    $("#btnPlay").innerHTML = ic(engine.running ? "pause" : "play", 24);
    if (light) return;

    const names = { focus: "Focus", short: "Short Break", long: "Long Break" };
    $("#phaseLabel").textContent = engine.running ? names[engine.phase] : "Next Up: " + names[engine.phase];
    $("#phaseSub").textContent = engine.running
      ? (engine.phase === "focus" ? "Focus session in progress" : "On a break — step away from the screen")
      : "Ready when you are";

    // cycle dots: done → solid, current → glowing (pulses while running)
    const curIdx = engine.phase === "focus" ? engine.cycleCount : -1;
    $("#cycleDots").innerHTML = Array.from({ length: settings.cycle }, (_, i) => {
      const cls = i < engine.cycleCount ? "done" : (i === curIdx ? "cur" + (engine.running ? " live" : "") : "");
      return `<i class="${cls}"></i>`;
    }).join("");

    // active task chip
    const t = tasks.find(t => t.id === activeTaskId && t.status === "active");
    $("#taskChip").hidden = !t;
    if (t) $("#taskChipName").textContent = t.title;

    // side stats
    const today = new Date();
    $("#todayName").textContent = today.toLocaleDateString([], { weekday: "long" });
    $("#msFocus").innerHTML = A.focusMins(A.onDay(today, "focus")) + "<em> m</em>";
    $("#msShort").innerHTML = A.focusMins(A.onDay(today, "short")) + "<em> m</em>";
    $("#msLong").innerHTML  = A.focusMins(A.onDay(today, "long"))  + "<em> m</em>";
    $("#miniTimeline").innerHTML = this.timelineHTML(today, 5) || `<div class="empty">Completed sessions will appear here.</div>`;
  },

  /* ----- tasks ----- */
  renderTasks() {
    const titles = { today: "Today", upcoming: "Upcoming", all: "All tasks", completed: "Completed", deleted: "Deleted" };
    $("#tasksTitle").textContent = titles[currentFilter];
    $("#taskAddRow").style.display = ["completed", "deleted"].includes(currentFilter) ? "none" : "flex";
    const now = startOfDay(new Date()).getTime();
    const list = tasks.filter(t => {
      if (currentFilter === "deleted")   return t.status === "deleted";
      if (currentFilter === "completed") return t.status === "completed";
      if (t.status !== "active") return false;
      if (currentFilter === "today")    return !t.due || t.due <= now;
      if (currentFilter === "upcoming") return t.due && t.due > now;
      return true;
    }).sort((a, b) => (a.due || 9e15) - (b.due || 9e15) || a.createdAt - b.createdAt);

    const empties = {
      today: "Nothing for today. Add a task above and start a focus session.",
      upcoming: "No upcoming tasks. Tasks with a future due date land here.",
      all: "No active tasks yet.",
      completed: "Completed tasks will appear here.",
      deleted: "Deleted tasks can be restored from here."
    };
    $("#taskList").innerHTML = list.length ? list.map(t => {
      const due = t.due ? new Date(t.due) : null;
      const late = due && t.status === "active" && due.getTime() < now;
      const focusMins = Math.round(sessions.filter(s => s.taskId === t.id && s.kind === "focus").reduce((a, s) => a + (s.end - s.start), 0) / 60000);
      const meta = [
        due ? `<span class="${late ? "late" : ""}">Due ${due.toLocaleDateString([], { month: "short", day: "numeric" })}</span>` : "",
        focusMins ? `${fmtHM(focusMins)} focused` : ""
      ].filter(Boolean).join(" · ");
      const acts = t.status === "active"
        ? `<button class="focus-btn ${activeTaskId === t.id ? "on" : ""}" data-act="focus" title="Focus on this task">${ic("crosshair", 16)}</button>
           <button data-act="del" title="Delete">${ic("trash", 16)}</button>`
        : t.status === "completed"
        ? `<button data-act="reopen" title="Reopen">${ic("rotate", 15)}</button><button data-act="del" title="Delete">${ic("trash", 16)}</button>`
        : `<button data-act="restore" title="Restore">${ic("rotate", 15)}</button><button data-act="purge" title="Delete forever">${ic("x", 15)}</button>`;
      return `<div class="task ${t.status === "completed" ? "done" : ""}" data-id="${t.id}">
        <button class="chk" data-act="toggle" title="${t.status === "completed" ? "Reopen" : "Complete"}">${t.status === "completed" ? ic("check", 12) : ""}</button>
        <div class="t-title"><b>${esc(t.title)}</b><div class="t-meta">${meta}</div></div>
        <div class="t-act">${acts}</div></div>`;
    }).join("") : `<div class="empty">${empties[currentFilter]}</div>`;
    this.renderCounts();
  },
  renderCounts() {
    const now = startOfDay(new Date()).getTime();
    const act = tasks.filter(t => t.status === "active");
    const n = {
      today: act.filter(t => !t.due || t.due <= now).length,
      upcoming: act.filter(t => t.due && t.due > now).length,
      all: act.length
    };
    $$("[data-count]").forEach(el => { const v = n[el.dataset.count]; el.textContent = v || ""; });
  },

  /* ----- activity ----- */
  renderActivity() {
    this.renderStreaks();
    const today = startOfDay(new Date());

    // date strip
    $("#dayPills").innerHTML = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekAnchor.getTime() + i * DAY);
      const future = d.getTime() > today.getTime();
      return `<button class="day-pill ${sameDay(d, selDate) ? "sel" : ""} ${sameDay(d, today) ? "today" : ""}" data-ts="${d.getTime()}" ${future ? "disabled" : ""}>
        <div class="dw">${DOW[d.getDay()]}</div><div class="dn">${d.getDate()}</div></button>`;
    }).join("");

    // daily goal
    const sum = A.daySummary(selDate);
    const pct = Math.min(1, sum.sessions / settings.goal);
    $("#goalFill").style.strokeDashoffset = 414.7 * (1 - pct);
    $("#goalNum").textContent = sum.sessions;
    $("#goalHead").textContent = pct >= 1 ? "Goal reached 🎉" : `${sum.sessions} of ${settings.goal} sessions`;
    $("#goalSub").textContent = pct >= 1
      ? `You went ${sum.sessions - settings.goal > 0 ? (sum.sessions - settings.goal) + " over — " : ""}beyond the goal.`
      : `${settings.goal - sum.sessions} focus session${settings.goal - sum.sessions === 1 ? "" : "s"} to go.`;

    // insights
    const isToday = sameDay(selDate, new Date());
    const st = A.streaks();
    let ins;
    if (sum.sessions === 0) {
      ins = isToday
        ? (st.cur > 0 ? `Your ${st.cur}-day streak is on the line. One focus session keeps it alive.` : "You haven't started any focus sessions today. Start your first session now and get the day moving.")
        : "No focus sessions were logged on this day.";
    } else if (pct >= 1) {
      ins = st.cur >= 3 ? `Goal met — that's ${st.cur} days in a row. Protect the streak.` : "Daily goal met. Same time tomorrow.";
    } else {
      const y = A.daySummary(new Date(selDate.getTime() - DAY));
      ins = sum.sessions > y.sessions
        ? `You're ahead of yesterday by ${sum.sessions - y.sessions} session${sum.sessions - y.sessions === 1 ? "" : "s"}. Keep the pace.`
        : `${settings.goal - sum.sessions} more session${settings.goal - sum.sessions === 1 ? "" : "s"} closes the goal.`;
    }
    $("#insightText").textContent = ins;

    // summary + day-over-day trends
    const prev = A.daySummary(new Date(selDate.getTime() - DAY));
    $("#sumSessions").textContent = sum.sessions;
    $("#sumWork").textContent = (sum.mins / 60).toFixed(sum.mins % 60 === 0 ? 0 : 1);
    $("#sumShort").textContent = sum.short; $("#sumLong").textContent = sum.long;
    const t1 = trend(sum.sessions, prev.sessions), t2 = trend(sum.mins, prev.mins);
    $("#trSessions").className = "trend " + t1; $("#trSessions").innerHTML = trendIcon(t1);
    $("#trWork").className = "trend " + t2;     $("#trWork").innerHTML = trendIcon(t2);

    this.renderBarChart();
    this.renderTaskActivity();
    $("#dayTimeline").innerHTML = this.timelineHTML(selDate) || `<div class="empty">No sessions on this day.</div>`;
    this.renderMonths();
  },

  /* ----- consistency: streaks + heatmap ----- */
  renderStreaks() {
    const st = A.streaks();
    $("#streakRow").innerHTML = `
      <div class="streak-stat"><div class="s-ic hot">${ic("flame", 19)}</div>
        <div><div class="num">${st.cur}<em>day${st.cur === 1 ? "" : "s"}</em></div><div class="cap">Current streak</div></div></div>
      <div class="streak-stat"><div class="s-ic best">${ic("award", 19)}</div>
        <div><div class="num">${st.best}<em>day${st.best === 1 ? "" : "s"}</em></div><div class="cap">Best streak</div></div></div>
      <div class="streak-stat"><div class="s-ic days">${ic("grid", 18)}</div>
        <div><div class="num">${st.total}<em>days</em></div><div class="cap">Active days total</div></div></div>`;
    this.renderHeatmap();
  },

  renderHeatmap() {
    const WEEKS = 26, today = startOfDay(new Date());
    const end = new Date(startOfWeek(today).getTime() + 6 * DAY);           // Saturday of this week
    const start = new Date(end.getTime() - (WEEKS * 7 - 1) * DAY);          // 26 weeks back, Sunday
    const counts = A.dayCounts();
    const LEVELS = ["var(--h0)", "var(--h1)", "var(--h2)", "var(--h3)", "var(--h4)"];
    const cell = 12, gap = 3, top = 18, left = 30;
    const W = left + WEEKS * (cell + gap), H = top + 7 * (cell + gap);

    let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Focus heatmap, last six months">`;
    // weekday labels
    [1, 3, 5].forEach(r => {
      svg += `<text x="0" y="${top + r * (cell + gap) + cell - 2}" fill="var(--faint)" font-size="9.5" font-family="var(--sans)">${DOW[r]}</text>`;
    });
    let prevMonth = -1;
    for (let w = 0; w < WEEKS; w++) {
      const weekStart = new Date(start.getTime() + w * 7 * DAY);
      if (weekStart.getMonth() !== prevMonth) {
        svg += `<text x="${left + w * (cell + gap)}" y="11" fill="var(--faint)" font-size="9.5" font-family="var(--sans)">${MONTHS[weekStart.getMonth()].slice(0, 3)}</text>`;
        prevMonth = weekStart.getMonth();
      }
      for (let r = 0; r < 7; r++) {
        const d = new Date(start.getTime() + (w * 7 + r) * DAY);
        if (d.getTime() > today.getTime()) continue;
        const c = counts.get(d.getTime()) || 0;
        const lvl = c === 0 ? 0 : Math.min(4, Math.ceil(c / Math.max(1, settings.goal) * 4));
        const x = left + w * (cell + gap), y = top + r * (cell + gap);
        const sel = sameDay(d, selDate) ? ' stroke="var(--green-hi)" stroke-width="1.5"' : "";
        svg += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3" fill="${LEVELS[lvl]}" data-ts="${d.getTime()}" style="cursor:pointer"${sel}>
          <title>${d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}: ${c} focus session${c === 1 ? "" : "s"}</title></rect>`;
      }
    }
    $("#heatmap").innerHTML = svg + "</svg>";
  },

  renderBarChart() {
    let from, days, label;
    const today = startOfDay(new Date());
    if (chartMode === "week")      { from = startOfWeek(selDate); days = 7; label = "week"; }
    else if (chartMode === "ten")  { from = new Date(today.getTime() - 9 * DAY); days = 10; label = "10 days"; }
    else { from = new Date(selDate.getFullYear(), selDate.getMonth(), 1); days = new Date(selDate.getFullYear(), selDate.getMonth() + 1, 0).getDate(); label = "month"; }
    const data = A.range(from, days);
    const totC = data.reduce((a, d) => a + d.count, 0), totM = data.reduce((a, d) => a + d.mins, 0);
    $("#chartTotal").innerHTML = `<b>${totC}</b> focus sessions / <b>${Math.floor(totM / 60)}</b> h <b>${totM % 60}</b> m`;
    const last = new Date(from.getTime() + (days - 1) * DAY);
    $("#chartRange").textContent = `${MONTHS[from.getMonth()].slice(0, 3)} ${from.getDate()} – ${from.getMonth() !== last.getMonth() ? MONTHS[last.getMonth()].slice(0, 3) + " " : ""}${last.getDate()} · this ${label}`;

    const W = 640, H = 190, padB = 24, padR = 30, max = Math.max(4, ...data.map(d => d.count));
    const step = Math.max(1, Math.ceil(max / 4));
    const bw = Math.min(46, (W - padR) / days * 0.62), gap = (W - padR) / days;
    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Focus sessions per day">
      <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4ce467"/><stop offset="100%" stop-color="#28b93f"/></linearGradient></defs>`;
    for (let v = 0; v <= max; v += step) {
      const y = (H - padB) * (1 - v / max) + 2;
      svg += `<line x1="0" x2="${W - padR}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1"/>
              <text x="${W - padR + 8}" y="${y + 4}" fill="var(--faint)" font-size="10.5" font-family="var(--sans)">${v}</text>`;
    }
    data.forEach((d, i) => {
      const h = d.count / max * (H - padB - 6);
      const x = i * gap + (gap - bw) / 2, y = (H - padB) - h;
      const isSel = sameDay(d.date, selDate);
      if (d.count > 0) svg += `<rect x="${x}" y="${y}" width="${bw}" height="${Math.max(3, h)}" rx="5" fill="url(#barGrad)" opacity="${isSel ? 1 : .82}">
        <title>${d.date.toDateString()}: ${d.count} sessions</title></rect>`;
      const lbl = chartMode === "week" ? DOW[d.date.getDay()] : (days > 12 ? (d.date.getDate() % 5 === 1 ? d.date.getDate() : "") : d.date.getDate());
      if (lbl !== "") svg += `<text x="${x + bw / 2}" y="${H - 7}" text-anchor="middle" fill="${isSel ? "var(--green)" : "var(--faint)"}" font-size="10.5" font-family="var(--sans)">${lbl}</text>`;
    });
    $("#barChart").innerHTML = svg + "</svg>";
  },

  renderTaskActivity() {
    const parts = A.taskBreakdown(selDate);
    if (!parts.length) { $("#taskActivity").innerHTML = `<div class="empty">Attach a task to a focus session to see the split here.</div>`; return; }
    const COLORS = ["var(--blue)", "var(--purple)", "var(--pink)", "var(--green)", "var(--amber)", "var(--indigo)", "var(--cyan)"];
    const total = parts.reduce((a, p) => a + p.mins, 0) || 1;
    let a0 = -Math.PI / 2, pie = `<svg width="170" height="170" viewBox="0 0 170 170" role="img" aria-label="Time per task">`;
    parts.forEach((p, i) => {
      const frac = p.mins / total, a1 = a0 + frac * 2 * Math.PI;
      if (parts.length === 1) { pie += `<circle cx="85" cy="85" r="80" fill="${COLORS[0]}"/>`; }
      else {
        const large = frac > .5 ? 1 : 0;
        const x0 = 85 + 80 * Math.cos(a0), y0 = 85 + 80 * Math.sin(a0), x1 = 85 + 80 * Math.cos(a1), y1 = 85 + 80 * Math.sin(a1);
        pie += `<path d="M85,85 L${x0},${y0} A80,80 0 ${large} 1 ${x1},${y1} Z" fill="${COLORS[i % COLORS.length]}" stroke="var(--card-bot)" stroke-width="1.5"/>`;
      }
      a0 = a1;
    });
    pie += "</svg>";
    const legend = parts.map((p, i) => `<div class="t-legend"><span class="sw" style="background:${COLORS[i % COLORS.length]}"></span>
      <div class="nm"><b>${esc(p.title)}</b><span>${p.count} focus session${p.count === 1 ? "" : "s"} / ${fmtHM(p.mins)}</span></div></div>`).join("");
    $("#taskActivity").innerHTML = `<div class="pie-row">${pie}</div>${legend}`;
  },

  renderMonths() {
    const ms = A.months();
    if (!ms.length) { $("#monthCards").innerHTML = `<div class="empty">Monthly history builds up as you complete sessions.<br><br>Want a preview? Load sample history in Settings.</div>`; return; }
    const thisYear = new Date().getFullYear();
    $("#monthCards").innerHTML = ms.map((m, i) => {
      const prev = ms[i + 1];
      const tS = trend(m.sessions, prev?.sessions), tW = trend(m.mins, prev?.mins);
      return `<div class="month-card"><h3>${MONTHS[m.m]}${m.y !== thisYear ? " " + m.y : ""}</h3>
        <div class="sub">${m.activeDays} active day${m.activeDays === 1 ? "" : "s"}</div>
        <div class="m-stats">
          <div><div class="lbl">Focus sessions</div><div class="val">${m.sessions} <span class="trend ${tS}">${trendIcon(tS)}</span></div></div>
          <div><div class="lbl">Work time</div><div class="val">${Math.round(m.mins / 60)} h <span class="trend ${tW}">${trendIcon(tW)}</span></div></div>
        </div></div>`;
    }).join("");
  },

  timelineHTML(day, limit) {
    const list = A.onDay(day).sort((a, b) => a.start - b.start);
    const items = (limit ? list.slice(-limit) : list).map((s, i, arr) => {
      const names = { focus: "Focus Session", short: "Short Break", long: "Long Break" };
      const mins = Math.round((s.end - s.start) / 60000);
      const task = s.taskId ? tasks.find(t => t.id === s.taskId) : null;
      const brk = s.kind !== "focus";
      return `<div class="tl-item"><div class="tl-rail"><span class="nd ${brk ? "brk" : ""}"></span>${i < arr.length - 1 ? '<span class="ln"></span>' : ""}</div>
        <div class="tl-body"><div class="r1"><b class="${brk ? "brk" : ""}">${names[s.kind]}</b><time>${fmtClock(new Date(s.start))} – ${fmtClock(new Date(s.end))}</time></div>
        <div class="r2">${mins} m${task ? " · " + esc(task.title) : ""}</div></div></div>`;
    });
    return items.join("");
  },

  /* ----- settings ----- */
  renderSettings() {
    $("#setFocus").value = settings.focus; $("#setShort").value = settings.short; $("#setLong").value = settings.long;
    $("#setCycle").value = settings.cycle; $("#setGoal").value = settings.goal;
    $("#setSound").classList.toggle("on", settings.sound);
    $("#setNotify").classList.toggle("on", settings.notify);
    $("#setAuto").classList.toggle("on", settings.auto);
  },

  /* ----- alerts ----- */
  chime() {
    if (!settings.sound) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [880, 1108.7, 1318.5].forEach((f, i) => { // A5–C#6–E6 arpeggio
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = f; o.type = "sine"; o.connect(g); g.connect(ctx.destination);
        const t = ctx.currentTime + i * 0.14;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        o.start(t); o.stop(t + 0.55);
      });
    } catch (e) {}
  },
  /* Native notifications when running inside Tauri (macOS app), web API otherwise */
  _tauriNotif() { return window.__TAURI__ && window.__TAURI__.notification; },
  notifyPermission() {
    if (!settings.notify) return;
    const tn = this._tauriNotif();
    if (tn) { tn.isPermissionGranted().then(g => { if (!g) tn.requestPermission(); }).catch(() => {}); return; }
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  },
  notify(nextPhase) {
    if (!settings.notify) return;
    const msg = nextPhase === "focus"
      ? "Break's over — ready for the next focus session."
      : (nextPhase === "long" ? "Great cycle. Take a long break." : "Focus session complete. Take a short break.");
    const tn = this._tauriNotif();
    if (tn) {
      tn.isPermissionGranted().then(g => { if (g) tn.sendNotification({ title: "Focus", body: msg }); }).catch(() => {});
      return;
    }
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    try { new Notification("Focus", { body: msg }); } catch (e) {}
  },

  renderAll() {
    this.renderTimer();
    if (currentNav === "tasks") this.renderTasks(); else this.renderCounts();
    if (currentNav === "activity") this.renderActivity();
    if (currentNav === "settings") this.renderSettings();
  }
};

/* =====================================================================
   EVENTS
   ===================================================================== */
$$("[data-nav]").forEach(b => b.addEventListener("click", () => ui.nav(b.dataset.nav, b.dataset.filter)));
$("#btnPlay").onclick = () => engine.running ? engine.pause() : engine.start();
$("#btnSkip").onclick = () => engine.skip();
$("#btnPrev").onclick = () => engine.restartPhase();
document.addEventListener("keydown", e => {
  if (e.code === "Space" && !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    e.preventDefault(); engine.running ? engine.pause() : engine.start();
  }
});
$("#taskChipClear").onclick = () => { activeTaskId = null; saveAll(); ui.renderAll(); };

/* tasks */
const addTask = () => {
  const title = $("#newTaskTitle").value.trim(); if (!title) return;
  const dueStr = $("#newTaskDue").value;
  tasks.push({ id: uid(), title, due: dueStr ? startOfDay(new Date(dueStr + "T12:00:00")).getTime() : null, status: "active", createdAt: Date.now(), completedAt: null });
  $("#newTaskTitle").value = ""; $("#newTaskDue").value = "";
  saveAll(); ui.renderTasks();
};
$("#btnAddTask").onclick = addTask;
$("#newTaskTitle").addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });
$("#taskList").addEventListener("click", e => {
  const btn = e.target.closest("[data-act]"); if (!btn) return;
  const id = e.target.closest(".task").dataset.id, t = tasks.find(t => t.id === id);
  const act = btn.dataset.act;
  if (act === "toggle" || act === "reopen") {
    t.status = t.status === "completed" ? "active" : "completed";
    t.completedAt = t.status === "completed" ? Date.now() : null;
    if (t.status === "completed" && activeTaskId === id) activeTaskId = null;
  }
  else if (act === "del")     { t.status = "deleted"; if (activeTaskId === id) activeTaskId = null; }
  else if (act === "restore") { t.status = "active"; }
  else if (act === "purge")   { tasks = tasks.filter(x => x.id !== id); }
  else if (act === "focus")   { activeTaskId = activeTaskId === id ? null : id; }
  saveAll(); ui.renderAll();
});

/* activity */
$("#dayPills").addEventListener("click", e => {
  const p = e.target.closest(".day-pill"); if (!p || p.disabled) return;
  selDate = startOfDay(new Date(+p.dataset.ts)); ui.renderActivity();
});
$("#heatmap").addEventListener("click", e => {
  const r = e.target.closest("rect[data-ts]"); if (!r) return;
  selDate = startOfDay(new Date(+r.dataset.ts));
  weekAnchor = startOfWeek(selDate);
  ui.renderActivity();
});
$("#weekPrev").onclick = () => { weekAnchor = new Date(weekAnchor.getTime() - 7 * DAY); ui.renderActivity(); };
$("#weekNext").onclick = () => {
  const n = new Date(weekAnchor.getTime() + 7 * DAY);
  if (n.getTime() <= startOfWeek(new Date()).getTime()) { weekAnchor = n; ui.renderActivity(); }
};
$("#rangeSeg").addEventListener("click", e => {
  const b = e.target.closest("[data-range]"); if (!b) return;
  chartMode = b.dataset.range;
  $$("#rangeSeg button").forEach(x => x.classList.toggle("on", x === b));
  ui.renderBarChart();
});

/* settings */
const bindNum = (id, key, min, max) => {
  $(id).addEventListener("change", e => {
    settings[key] = Math.min(max, Math.max(min, +e.target.value || DEFAULTS[key]));
    e.target.value = settings[key];
    if (!engine.running) engine.remainMs = engine.durMs(engine.phase);
    saveAll(); ui.renderAll();
  });
};
bindNum("#setFocus", "focus", 1, 180); bindNum("#setShort", "short", 1, 60); bindNum("#setLong", "long", 1, 120);
bindNum("#setCycle", "cycle", 1, 12);  bindNum("#setGoal", "goal", 1, 30);
const bindSwitch = (id, key, after) => {
  $(id).onclick = () => { settings[key] = !settings[key]; saveAll(); ui.renderSettings(); if (after) after(); };
};
bindSwitch("#setSound", "sound"); bindSwitch("#setAuto", "auto");
bindSwitch("#setNotify", "notify", () => ui.notifyPermission());

/* demo data */
$("#btnSeed").onclick = () => {
  if (!confirm("Load six months of sample sessions? Your real sessions are kept.")) return;
  const demoTasks = ["Write first draft", "Prepare presentation", "Reply to emails", "Design review", "Research competitors"].map(title => {
    let t = tasks.find(x => x.title === title);
    if (!t) { t = { id: uid(), title, due: null, status: "active", createdAt: Date.now(), completedAt: null }; tasks.push(t); }
    return t;
  });
  const today = startOfDay(new Date());
  for (let d = 185; d >= 1; d--) {
    const day = new Date(today.getTime() - d * DAY);
    const ramp = (185 - d) / 185;                        // history gradually improves → upward trends
    if (Math.random() > 0.28 + ramp * 0.45) continue;    // more active days recently
    const n = Math.max(1, Math.round((2 + ramp * 8) * (0.6 + Math.random() * 0.8)));
    let t = day.getTime() + (9 + Math.random() * 2) * 3600000;
    for (let i = 0; i < n; i++) {
      const fm = settings.focus * 60000;
      sessions.push({ id: uid(), start: t, end: t + fm, kind: "focus", taskId: demoTasks[Math.floor(Math.random() * demoTasks.length)].id });
      t += fm;
      const isLong = (i + 1) % settings.cycle === 0;
      const bm = (isLong ? settings.long : settings.short) * 60000;
      if (i < n - 1) { sessions.push({ id: uid(), start: t, end: t + bm, kind: isLong ? "long" : "short", taskId: null }); t += bm + Math.random() * 1200000; }
    }
  }
  sessions.sort((a, b) => a.start - b.start);
  saveAll(); ui.renderAll();
  alert("Sample history loaded. Open Activity to explore it.");
};
$("#btnWipe").onclick = () => {
  if (!confirm("Erase all tasks, sessions and settings? This can't be undone.")) return;
  tasks = []; sessions = []; activeTaskId = null; settings = Object.assign({}, DEFAULTS);
  ["fx.settings", "fx.tasks", "fx.sessions", "fx.activeTask"].forEach(k => store.del(k));
  engine.phase = "focus"; engine.cycleCount = 0; engine.pause(); engine.init(); ui.renderAll();
};

/* =====================================================================
   BOOT
   ===================================================================== */
hydrateIcons();

/* Wrap Settings number inputs in Apple-style -/+ steppers */
["#setFocus","#setShort","#setLong","#setCycle","#setGoal"].forEach(sel => {
  const input = $(sel); if (!input || input.closest(".stepper")) return;
  const wrap = document.createElement("div"); wrap.className = "stepper";
  const minus = document.createElement("button"); minus.type = "button"; minus.textContent = "−"; minus.setAttribute("aria-label", "Decrease");
  const plus = document.createElement("button"); plus.type = "button"; plus.textContent = "+"; plus.setAttribute("aria-label", "Increase");
  input.parentNode.insertBefore(wrap, input);
  wrap.append(minus, input, plus);
  const bump = dir => {
    const min = +input.min || 1, max = +input.max || 999;
    input.value = Math.min(max, Math.max(min, (+input.value || min) + dir));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };
  minus.onclick = () => bump(-1);
  plus.onclick = () => bump(1);
});

/* Native menu bar bridge (Tauri only) */
if (window.__TAURI__ && window.__TAURI__.event) {
  const ev = window.__TAURI__.event;
  const control = (a) => {
    if (a === "toggle") engine.running ? engine.pause() : engine.start();
    else if (a === "skip") engine.skip();
    else if (a === "restart") engine.restartPhase();
  };
  // tray right-click "Start / Pause"
  ev.listen("tray-toggle", () => control("toggle"));
  // popover mini-controls, relayed via the Rust command
  ev.listen("engine-control", (e) => control(e && e.payload));
}

const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
$("#quoteText").innerHTML = `&ldquo;${q[0]}&rdquo;<span class="who">— ${q[1]}</span>`;
engine.init();
ui.nav("timer");
