# Do Not Block Paste

Chrome extension that restores native paste behavior on pages that block pasting into editable fields.

## Install Locally

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Select **Load unpacked**.
4. Choose this project directory.

The extension runs on all pages and all frames. It does not request clipboard permissions or read clipboard contents.

Chrome 137 and newer branded builds no longer support loading unpacked extensions with the `--load-extension` command-line flag. Use the manual **Load unpacked** flow above for your regular Chrome profile, and use Chrome for Testing or Chromium for automated extension tests.

## How It Works

The content script runs at `document_start` and captures paste-related events before page scripts can cancel them. For native editable targets (`input`, `textarea`, and `contenteditable`), it stops the page's event handlers from seeing paste events while preserving the browser's default paste behavior.

## Manual Test

1. Load the unpacked extension.
2. Open `test/block-paste.html` in Chrome.
3. Copy any text.
4. Paste into the input, textarea, and contenteditable fields.

With the extension loaded, pasted text should appear and the blocked event count should remain unchanged.
