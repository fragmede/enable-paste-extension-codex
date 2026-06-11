# Todo

- [x] Initialize git repository and create project directories.
- [x] Implement a Manifest V3 Chrome extension that restores paste in editable fields.
- [x] Add a local test page that intentionally blocks paste events.
- [x] Run static checks and manual verification prep.
- [x] Document verification results.
- [x] Commit completed changes to git.

## Plan

Build a focused Chrome extension with a content script that runs at `document_start` in all frames. The content script will intercept paste-related user actions on native editable targets, stop page handlers from canceling those actions, and leave the browser default paste behavior intact.

Verification will include manifest/script syntax checks and a local HTML page that blocks paste with common techniques (`paste`, `beforeinput`, keyboard shortcut, and context menu event handlers).

## Review

- `node --check src/restore-paste.js` passed.
- `manifest.json` parsed successfully as JSON.
- A mocked DOM behavior check verified that paste-related events are stopped for editable targets and ignored for non-paste or non-editable cases.
- Manual browser verification path is documented in `README.md` using `test/block-paste.html`.
- In-app browser render verification was attempted, but direct `file://` navigation was blocked by the browser URL policy.
