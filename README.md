# CocoaCanvas plugins

The official plugin catalogue for [CocoaCanvas](https://github.com/CocoaSuite/cocoacanvas). In the app, tap the puzzle button and choose **Browse plugins…**. Each file is checked against the SHA-256 checksum in `index.json` before it is installed.

| Plugin | What it does |
|---|---|
| Apple Design Kit | Unofficial iOS-style components: status, navigation and tab bars, buttons, switches, segmented controls, lists, alerts, action sheet, keyboard and iPhone screens. Light and dark. |
| Google Design Kit | Unofficial Material 3-style components coloured from your own seed colour: app bars, navigation bar, FABs, buttons, chips, switches, fields, cards, lists, dialogs and Android screens. |
| Icons | About 6,000 icons: Lucide, plus Material Symbols outlined and filled. |
| Placeholder Graphics | Buttons, fields, checkboxes, avatars, image and video boxes, cards, tabs, dialogs, toasts and skeletons, built with auto layout. |
| Pattern Generator | Seamless vector patterns that fill a frame. |
| Noise Generator | Grain, colour noise, clouds and paper texture as a blend layer. |
| Charts & Tables | Column, bar, line, area, pie and donut charts and tables from pasted data, as editable shapes. |
| Sticky Notes | Notes and to-do lists that float above the canvas, outside layers and exports. |
| Radius Sync | Nested corners that follow the outer radius minus the gap. |
| Remove Background | Cuts the subject out of any photo with an on-device AI model (BiRefNet lite or ormbg), or plain backgrounds without a download. |
| QR Code | Links, text, Wi-Fi, email, phone, SMS and contacts as editable vectors. |
| Lorem Ipsum | Placeholder text in Latin, English or Russian. |

All plugins are **sealed**: they run in an isolated worker with no file access and only the permissions shown when you install them. Only plugins with the `net` permission can reach the internet, and only jsDelivr and Hugging Face.

The design kits are independent recreations drawn from scratch. They are not affiliated with or endorsed by Apple or Google. Apple, iPhone and iOS are trademarks of Apple Inc. Google, Android and Material Design are trademarks of Google LLC.

## Writing a plugin

A plugin is one JavaScript file that starts with a header:

```js
// ==CocoaCanvas Plugin==
// @id my-plugin
// @name My Plugin
// @version 1.0.0
// @author You
// @description What it does.
// @icon ★
// @color #D15A2C
// @permissions ui menu helper read insert edit
// ==/CocoaCanvas Plugin==
cocoa.addMenuItem('Say hello', () => cocoa.toast('Hello!'));
```

The optional fields `@name_ru` and `@description_ru` give Russian text. Add `@access full` only if the plugin really needs to run inside the app; users get a strong warning before installing one.

### Permissions

| Permission | Allows |
|---|---|
| `ui` | `cocoa.ui.form()` windows |
| `menu` | `cocoa.addMenuItem()` entries in the Plugins menu |
| `helper` | `cocoa.helper.addCommand()` commands for Cocoa Helper |
| `read` | `cocoa.selection()`, `cocoa.bounds()`, `cocoa.on()` |
| `insert` | `cocoa.insert()` new layers |
| `edit` | `cocoa.update()`, `cocoa.updateMany()`, `cocoa.setImage()`, `cocoa.remove()` |
| `net` | Load code from jsDelivr and AI models from Hugging Face (only those hosts), and keep downloads with `cocoa.cache` |

### API

Every call returns a Promise in sealed plugins.

- `cocoa.t(en, ru)` picks the string for the user's language. `cocoa.lang` is `'en'` or `'ru'`.
- `cocoa.toast(text)` shows a short message.
- `cocoa.insert(item, options)` adds layers and selects them. `item` is one of:
  - `{nodes:[…]}`: CocoaCanvas layer objects. Types are `frame`, `group`, `rect`, `ellipse`, `poly`, `star`, `path`, `text`, `image` (with `src` as a data: URL) and `svg` (with an `svg` string plus `x`, `y`, `w`, `h`).
  - `{svg:'<svg…>'}`: converted into editable vectors.
  - `{image:'data:image/png;base64,…', w, h}`.
  - `{text:'…', fs:16}`.

  `options` can be:
  - `{place:'new'}` puts a new screen beside the others.
  - `{fit:'selection'}` sizes the layer to the selection and puts it on top.
  - `{at:{x,y}}` puts it at a specific point.
  - `{top:true}` keeps it on the canvas itself, never inside the selected frame.

  By default, the layer goes into the selected frame or the visible centre.
- `cocoa.preview(item)` returns an SVG string of the item for thumbnails.
- `cocoa.selection()` returns the selected layers as plain objects. `cocoa.bounds()` returns `{selection, view}`.
- `cocoa.update(id, props)` and `cocoa.remove(id)` change layers. Each change is one undo step.
- `cocoa.addNote({kind:'note'|'todo', color, text, title, items, w, fs})` adds a sticky note above the canvas (`insert`). Notes are not layers and are never exported.
- `cocoa.updateMany([{id, props}, …])` changes many layers as a single undo step.
- `cocoa.imageData(id)` returns an image layer's pixels as a data URL (`read`). `cocoa.setImage(id, dataURL)` replaces them with a PNG, JPEG or WebP (`edit`).
- `cocoa.addMenuItem(label, fn)` adds an action to the Plugins menu.
- `cocoa.helper.addCommand(/regex/i, (text, match) => …, 'short description')` adds a command that Cocoa Helper recognises.
- `cocoa.ui.form({title, text, ok, fields, onInput, onSubmit, hide})` opens a panel docked on the right (a sheet on phones).
  - Field types: `heading`, `info`, `text`, `textarea`, `number`, `range`, `color`, `select`, `toggle`, `chips`, `preview` (an SVG string or `{src}`) and `gallery` (`items:[{id, svg, label, bg}]`, plus `search`, `columns`, `aspect`, `labels`).
  - `onInput(values)` can return new field values. It can also return `$hide:[keys]` to hide fields.
  - With `onSubmit`, the panel stays open after the OK button is pressed. Without it, the Promise resolves with the values.
- `cocoa.closeForm()` closes the panel.
- `cocoa.on('selection' | 'change', fn)` runs `fn` when the selection or the document changes.
- `cocoa.cache.get(key)`, `cocoa.cache.put(key, arrayBuffer)` and `cocoa.cache.clear()` keep large downloads such as AI models on the device (`net`). They are deleted when the plugin is removed.
- `cocoa.storage.get(key)` and `cocoa.storage.set(key, value)` give each plugin up to 200 KB per key.

## The catalogue

`index.json` lists each plugin with its path and SHA-256 checksum. `tools/build.py` rebuilds the files in `plugins/` from `src/`, embedding the icon data and the QR library, and then rewrites `index.json`.

## Licences

The plugin code is © CocoaSuite. Third-party parts keep their own licences (full texts are in `licenses/`):

- Lucide icons: ISC
- Material Symbols: Apache 2.0
- Remove Background downloads, at runtime, Transformers.js (Apache 2.0), ONNX Runtime Web (MIT), BiRefNet lite (MIT) and ormbg (Apache 2.0).
- QR Code Generator by Kazuhiko Arase: MIT. "QR Code" is a registered trademark of DENSO WAVE INCORPORATED.
