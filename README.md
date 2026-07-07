# Focus ⏳

A beautiful, dependency-free Pomodoro timer for the web — with tasks, a GitHub-style focus heatmap, streaks, and deep session analytics. Dark, calm, and fast. All data stays in your browser.

> Built with **zero dependencies**: one HTML file, one stylesheet, one script. No build step, no framework, no tracking.

## ✨ Features

### Timer
- Classic Pomodoro cycle — focus → short break → long break, fully configurable
- Timestamp-based engine that stays accurate in background tabs
- Cycle dots showing completed sessions and a live-pulsing current session
- Countdown in the tab title and sidebar, chime + optional system notifications
- Keyboard: `Space` to start/pause

### Tasks
- Today / Upcoming / All / Completed / Deleted smart views
- Attach a task to your focus sessions — its time shows up in the analytics
- Due dates, overdue highlighting, soft delete with restore

### Analytics
- 🔥 **Focus heatmap** — a GitHub-style contribution graph of your last six months, scaled to your daily goal. Click any cell to jump to that day.
- **Streaks** — current streak, best streak, total active days
- Daily goal ring with rule-based insights
- This Week / Last 10 Days / This Month bar charts
- Per-task time breakdown (pie) and a chronological day timeline
- Monthly history cards with month-over-month trends

### Privacy
Everything is stored in `localStorage`. Nothing ever leaves your machine.

## 🚀 Getting started

No install. Clone and open:

```bash
git clone https://github.com/<you>/focus.git
cd focus
open index.html        # or just double-click it
```

Or serve it (needed for system notifications in some browsers):

```bash
npx serve .
```

Deploys as-is to GitHub Pages, Vercel, or Netlify — it's static files.

> **Tip:** open **Settings → Load sample history** to fill six months of demo sessions and explore the analytics instantly.

## 🗂 Project structure

```
focus/
├── index.html        # markup + inline SVG icon slots
├── css/styles.css    # design tokens → layout → components
└── js/app.js         # icons → store → engine → analytics → ui → events
```

The code is layered deliberately:

- **`engine`** — a pure, UI-independent timer state machine
- **`A` (analytics)** — pure functions over the session log; every chart, streak and trend is derived, never stored
- **`ui`** — rendering only
- **`store`** — a tiny persistence adapter (localStorage with in-memory fallback)

This makes it straightforward to port — e.g. wrapping it in [Tauri](https://tauri.app) for a native macOS app.

## 🛣 Roadmap

- [ ] Ambient / fullscreen timer mode
- [ ] Data export & import (JSON)
- [ ] Weekly focus report
- [ ] PWA install + offline manifest
- [ ] Native macOS build (Tauri) with menu bar countdown

## 🤝 Contributing

Issues and PRs are welcome. Keep the zero-dependency rule: if a feature needs a package, it needs a very good reason.

## 📄 License

[MIT](LICENSE) © Aowshad Himel
