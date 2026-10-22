# HTML Email Template Editor

A simple desktop app to edit HTML email templates with a live side-by-side preview.
Built on top of NodeJS + Electron framework.
Fast and responsive graphics.

## Features

- Visual Studio Code-style editor (Monaco)
- Edit HTML in real time.
- See the rendered preview instantly next to the editor.
- Variable placeholders for dynamic content, with a dedicated variables table.
- Detachable external preview window.
- Settings window (theme, default template, variable regex pattern).
- Useful for creating and refining custom email templates.
- Simple workflow for testing layout, text, and inline styles.
- Export to `.html` and Base64.
- Import file `.html` directly into the app storage database (single or multiple files).
- Dark mode

## Use Case

This project is designed for anyone who needs to build or adjust personalized HTML email templates quickly, without switching between an editor and a browser preview.

## How It Works

1. Open the app.
2. Paste or write / Import your HTML template in the editor.
3. Watch the live preview update alongside your code.
4. Save the final template when it is ready.

## Requirements

- Node.js (LTS) and npm
- macOS, Windows, or Linux

## Setup

Install dependencies:

```bash
npm i
```

Build the renderer bundles (required at least once, and again after changing anything under `src/renderer`):

```bash
npm run wprender:all
```

## Run in development

```bash
npm start
```

## Build for distribution

```bash
npm run dist       # current platform
npm run distMac    # macOS .dmg
```

Packaging is done via `electron-builder` (see the `build` section in `package.json` for supported targets: macOS dmg, Windows zip/nsis/portable, Linux AppImage/deb).

## How to use

- Save template changes: `Ctrl/Cmd + S`
- Save template name: click the name, edit the input box, then press Enter

## Possible Future Improvements

- Support / Test for linux
- Improve Variables system
- Improve UI/UX
- Adding a serious Frontend framework
- CSS inlining support.
- Template gallery.
- Plugin system for export to external Databases.

## Status

Work in progress.

## Preview

![til](/preview.gif)

## License

[MIT](LICENSE)
