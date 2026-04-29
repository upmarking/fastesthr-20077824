## 2025-03-24 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<button>` elements that lacked `aria-label` attributes for screen readers. Notably in Settings.tsx, HolidayCalendar.tsx, EmployeeDetail.tsx, and Performance.tsx.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2025-03-27 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<Button>` elements that lacked `aria-label` attributes for screen readers across `Topbar.tsx`, `NotificationsDropdown.tsx`, `AppSidebar.tsx`, `ApplyLeave.tsx`, `Documents.tsx`, `HelpDesk.tsx`, `Payroll.tsx`, `Settings.tsx`, `Employees.tsx`, and `Performance.tsx`.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.
## 2026-04-18 - AI Assistant Accessibility and Auto-focus
**Learning:** Found that the AI Assistant chat interface lacked basic accessibility (missing `aria-label` on icon-only Open, Close, and Send buttons) and forced the user to manually click into the input field after opening the chat overlay.
**Action:** Adding `aria-label`s for screen reader support and the `autoFocus` prop to the main chat input so it's ready for typing immediately when the overlay opens.
## 2024-04-29 - Password Visibility Toggles

**Learning:** When dealing with multiple related password fields (e.g., 'New Password' and 'Confirm Password'), both fields must have independent visibility toggles. Additionally, accessibility requires dynamic `aria-label` updates on stateful buttons (`aria-label={showPassword ? 'Hide password' : 'Show password'}`) rather than static labels, as the action of the button changes based on its current state.
**Action:** Always verify that every password input on a page, especially in complex forms like registration or resets, includes its own individual show/hide toggle. Ensure stateful toggle buttons have dynamic ARIA labels that describe the *next* action they will perform.
