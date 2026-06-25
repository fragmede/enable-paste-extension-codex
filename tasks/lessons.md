# Lessons

- When a user reports the extension does not work on a specific live site, reproduce against that exact URL with the unpacked extension loaded before assuming the existing event interception strategy is sufficient. Different sites may block paste through field attributes, late value resets, delegated handlers, or browser behaviors not covered by earlier tests.
- Include `keypress` paste-shortcut blockers in extension tests when debugging payment or numeric-entry fields. Some validators block all nonnumeric keypresses, which can catch `Cmd+V` or `Ctrl+V` after `keydown` has already been handled.
- For payment pages, distinguish read-only display fields from the actual editable add-card flow before judging paste behavior. Verify the same UI path the user is using, including any button that opens hosted card-entry fields.
- On live transactional pages, stop before repeating form interactions if third-party autofill overlays capture focus or the page navigates to validation. Do not continue toward submit/confirmation without an explicit user go-ahead.
