# Do Not Block Paste

A small Manifest V3 Chrome extension that restores native paste behavior on pages that block pasting into editable fields.

Some sites attach aggressive event handlers to prevent paste into checkout, login, confirmation, or form fields. This extension gets out of the way of the browser's normal paste action by stopping those page handlers from seeing paste-related events on editable controls.

## Features

- Restores paste in `input`, `textarea`, and `contenteditable` fields.
- Runs early with `document_start`.
- Covers all frames, including embedded checkout/payment frames.
- Does not request clipboard permissions.
- Does not read, store, or transmit clipboard contents.
- Does not alter non-editable page interactions.

## Install Locally

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Choose this repository directory.

The extension is active immediately after loading. Reload any page that was already open before testing paste behavior.

## How It Works

The content script runs at `document_start` and captures these paste-related events before page scripts can cancel them:

- `paste`
- `beforeinput` with `insertFromPaste`
- paste keyboard shortcuts such as `Cmd+V` and `Ctrl+V`
- `contextmenu`

When the event target is editable, the extension calls `stopImmediatePropagation()` so page-level blockers do not receive the event. It intentionally does not call `preventDefault()`, so Chrome's native paste behavior continues normally.

## Manual Test

This repository includes a local test page that blocks paste using common page-level techniques.

1. Load the extension in Chrome.
2. Open [test/block-paste.html](test/block-paste.html).
3. Copy any text.
4. Paste into the input, textarea, and contenteditable fields.

Expected result: pasted text appears in each editable field, and the page's blocked-event counter does not increase.

## PartSelect Verification

The extension was tested against the PartSelect checkout page:

`https://www.partselect.com/purchase/?guid=e6c3a2b3-e8cc-496e-a09e-e3dcb69f5e83`

Automated verification used Chrome for Testing 143 because branded Chrome 137 and newer no longer load unpacked extensions with the `--load-extension` command-line flag. The test confirmed:

- The extension registered as `Do Not Block Paste`.
- The content script injected into the PartSelect checkout page.
- The content script injected into a Stripe card-number iframe.
- A controlled blocker probe on the checkout promo-code field could not intercept `paste`, `beforeinput`, paste shortcut, or `contextmenu` events while the extension was active.
- The same probe without the extension intercepted and canceled all four events.

## Development

Run the basic checks:

```bash
node --check src/restore-paste.js
node -e "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8')); console.log('manifest.json ok')"
```

For automated extension testing, use Chrome for Testing or Chromium. For regular Chrome, install manually through `chrome://extensions` and **Load unpacked**.

## Privacy

This extension does not collect data. It does not use a background service worker, does not request clipboard access, and does not make network requests.

## License

MIT. See [LICENSE](LICENSE).
