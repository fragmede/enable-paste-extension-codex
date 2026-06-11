# Todo

- [x] Initialize git repository and create project directories.
- [x] Implement a Manifest V3 Chrome extension that restores paste in editable fields.
- [x] Add a local test page that intentionally blocks paste events.
- [x] Run static checks and manual verification prep.
- [x] Document verification results.
- [x] Commit completed changes to git.

## PartSelect Test

- [x] Target the checkout URL at `https://www.partselect.com/purchase/`.
- [x] Check whether Chrome can load the unpacked extension into an automated profile.
- [x] Test paste-restoration behavior on the checkout page.
- [x] Document PartSelect results.

## GitHub Publish

- [x] Rewrite `README.md` for public GitHub release.
- [x] Add MIT license.
- [x] Validate manifest and content script.
- [x] Commit README/license changes.
- [x] Create public GitHub repository with `gh`.
- [x] Push `main` to GitHub.

## Plan

Build a focused Chrome extension with a content script that runs at `document_start` in all frames. The content script will intercept paste-related user actions on native editable targets, stop page handlers from canceling those actions, and leave the browser default paste behavior intact.

Verification will include manifest/script syntax checks and a local HTML page that blocks paste with common techniques (`paste`, `beforeinput`, keyboard shortcut, and context menu event handlers).

## Review

- `node --check src/restore-paste.js` passed.
- `manifest.json` parsed successfully as JSON.
- A mocked DOM behavior check verified that paste-related events are stopped for editable targets and ignored for non-paste or non-editable cases.
- Manual browser verification path is documented in `README.md` using `test/block-paste.html`.
- In-app browser render verification was attempted, but direct `file://` navigation was blocked by the browser URL policy.
- PartSelect checkout verification used Chrome for Testing 143 because branded Chrome 149 ignored `--load-extension`.
- With the extension loaded on `https://www.partselect.com/purchase/?guid=e6c3a2b3-e8cc-496e-a09e-e3dcb69f5e83`, Chrome registered `Do Not Block Paste` and injected isolated content-script worlds into the PartSelect page and a Stripe card-number iframe.
- A controlled blocker probe on the checkout `promocode` field verified that page handlers for `paste`, `beforeinput` paste, paste keyboard shortcut, and `contextmenu` did not receive or cancel those events.
- The same probe without the extension confirmed the blockers received and canceled all four events.
- Public GitHub repository created at `https://github.com/fragmede/do-not-block-paste`.
