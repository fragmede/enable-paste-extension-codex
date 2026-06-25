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

## Certified Offer Bug

- [x] Reproduce paste blocking on `https://www.certifiedofferservice.com/CertifiedOffer/offer/submitOffer.do?accountType=newCustomer`.
- [x] Identify the blocker pattern that bypasses the current extension.
- [x] Patch the extension with the smallest robust fix.
- [x] Verify the fix against the Certified Offer page and existing checks.
- [x] Document results and commit the fix.

## Certified Offer Add-Card Flow

- [x] Record that the visible card box can be read-only before the add-card action opens the editable UI.
- [x] Inspect the live `makeOffer.do` page for the actual add-card control.
- [x] Open the add-card UI without intentionally submitting the offer.
- [x] Attempt dummy card paste in the editable card-entry field.
- [x] Document results and commit any repository note changes.

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
- Certified Offer embeds the payment fields in SecurePay's `token-iframe`; its `securepay.js` attaches a numeric `keypress` validator to `#cardNumber`, which can intercept `Cmd+V` before the previous extension build handled it.
- The extension now treats paste shortcuts on both `keydown` and `keypress` as paste-related events while allowing ordinary numeric typing to continue.
- The unpacked `Do Not Block Paste` extension was installed and reloaded in the user's regular Chrome profile, then the payment iframe was reloaded without refreshing the full offer page.
- A controlled SecurePay test tab verified that dummy card number `4111111111111111` pasted into `#cardNumber`; no real card data was read and no payment or offer form was submitted.
- Follow-up correction: the page can show a read-only credit-card display field, and the real verification path must use the separate add-card button that opens the editable card-entry UI.
- In the real add-card flow, the separate `Add credit card` button opens a hosted card modal with an editable Card Number field; the read-only `creditCardForm.*` fields on the page are display/token fields and are not paste targets.
- Privacy and 1Password browser overlays appeared over the hosted card modal and captured focus during the live test. After closing the overlay, further field interaction caused the site to return to `submitOffer.do` with an "OOPS" validation banner rather than completing the offer.
- No final offer submission or payment confirmation was intentionally clicked. Further live testing should either disable/close payment-autofill overlays first or be done only with explicit confirmation because the real form is transactional.
