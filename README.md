[English](./README.md) | [中文](./README_zh.md)

# YOCIM BENCH

A sleek, desktop-style online developer toolbox built with Vue 3. 20+ tools in one place — no install, no login, just open and use.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Vue 3](https://img.shields.io/badge/Vue-3.4-42b883.svg)
![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)

## ✨ Features

- 🖥️ **Desktop-style UI** — Draggable windows, taskbar, icon grid
- 🌙 **Dark Mode** — One-click toggle, persists locally
- 🌍 **i18n** — English / 中文 / 日本語
- 🔀 **Drag-to-reorder** — Rearrange icons, layout saved locally
- 📦 **Zero backend** — Everything runs in the browser

## 🛠️ Tools (20)

| Category | Tools |
|----------|-------|
| ✏️ Text Editing | Notepad, Markdown Editor |
| 💻 Code Tools | Code Formatter, Regex Tester, JSON to TS, Diff Checker |
| 📊 Data Format | JSON Viewer, Data Converter (JSON/YAML/XML), Radix Converter |
| 🔐 Encoding | Base64 Codec, URL Codec, Image to Base64, QR Code |
| 🌐 Network | Domain Lookup, CRON Generator |
| 🎨 Design | Color Picker, Drawing Board |
| 🔒 Security | Password & Hash Generator |
| ⏱️ Utilities | Timestamp Converter, Pomodoro Timer |

### Tool Details

**Notepad** — Create, edit, delete notes with auto-save & download as .txt

**Markdown Editor** — Split-pane editor with live preview, syntax-highlighted code blocks, export .md/.html

**Code Formatter** — 15 languages (JS, TS, HTML, CSS, JSON, XML, SQL, Python, Java, C/C++, Go, Rust, PHP, Markdown, YAML)

**Regex Tester** — Real-time match highlighting, capture groups, 6 presets, 4 flags (g/i/m/s)

**JSON to TS** — Recursive JSON → TypeScript interfaces, nested object splitting, union types

**Diff Checker** — Side-by-side & unified views, line numbers, add/delete stats

**JSON Viewer** — Tree visualization, collapse/expand, search highlighting, path copy

**Data Converter** — Bidirectional JSON ↔ YAML ↔ XML conversion, auto-detect format

**Radix Converter** — BIN/OCT/DEC/HEX real-time conversion, bit-width selection, ASCII/Unicode table

**Base64 Codec** — Text & file encode/decode, URL-safe mode

**URL Codec** — Encode/decode, URL parser with query parameter table

**Image to Base64** — Drag/paste/upload, resize, format conversion (PNG/JPEG/WebP), 4 output formats

**QR Code** — Generate (text/URL/vCard/WiFi) with style options, parse from image with type detection

**Domain Lookup** — IP geolocation, DNS records (7 types), HTTP response headers

**CRON Generator** — Visual builder, 8 presets, human-readable description, next 5 execution times

**Color Picker** — HSV palette, HEX/RGB/HSL sync, saved swatches, random color

**Drawing Board** — Brush/eraser/line/rect/circle, 12 colors, undo/redo, download PNG

**Password & Hash** — Configurable password generation, strength meter, 10 hash algorithms + HMAC + file hash

**Timestamp Converter** — Unix ↔ datetime, 6 formats, relative time, live clock

**Pomodoro** — 25/5/15/20 timer, audio notification, session counter

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/YOCIM888/Work-bench.git
cd Work-bench

# Install
npm install

# Dev
npm run dev

# Build
npm run build
```

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Vue 3 (Composition API) |
| Build | Vite 5 |
| i18n | Custom (provide/inject) |
| Theme | CSS Custom Properties |
| Markdown | marked + highlight.js |
| Code Format | js-beautify |
| Diff | diff (Myers algorithm) |
| YAML | js-yaml |
| XML | fast-xml-parser |
| CRON | cron-parser |
| QR Generate | qrcode |
| QR Parse | jsqr |

## 📁 Project Structure

```
src/
├── apps/                    # Each tool is an independent app
│   ├── notepad/
│   ├── code-formatter/
│   ├── color-picker/
│   ├── regex-tester/
│   ├── markdown-editor/
│   ├── json-viewer/
│   ├── diff-checker/
│   ├── timestamp-converter/
│   ├── password-generator/
│   ├── base64/
│   ├── pomodoro/
│   ├── drawing-board/
│   ├── url-codec/
│   ├── cron-generator/
│   ├── image-base64/
│   ├── json-to-ts/
│   ├── domain-lookup/
│   ├── data-converter/
│   ├── radix-converter/
│   └── qrcode/
├── components/              # Shell components
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── AppWindow.vue
│   ├── Desktop.vue
│   └── DesktopIcon.vue
├── composables/
│   └── useTheme.js
├── i18n/
│   ├── index.js
│   └── locales/
│       ├── en.js
│       ├── zh.js
│       └── ja.js
├── App.vue
├── main.js
└── style.css
```

## 📄 License

[ISC](./LICENSE) © YOCIM888
