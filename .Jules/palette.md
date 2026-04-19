## 2025-03-24 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<button>` elements that lacked `aria-label` attributes for screen readers. Notably in Settings.tsx, HolidayCalendar.tsx, EmployeeDetail.tsx, and Performance.tsx.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2025-03-27 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<Button>` elements that lacked `aria-label` attributes for screen readers across `Topbar.tsx`, `NotificationsDropdown.tsx`, `AppSidebar.tsx`, `ApplyLeave.tsx`, `Documents.tsx`, `HelpDesk.tsx`, `Payroll.tsx`, `Settings.tsx`, `Employees.tsx`, and `Performance.tsx`.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2025-04-19 - Dynamic ARIA labels for stateful toggles
**Learning:** For stateful toggle buttons like password visibility controls (Eye/EyeOff icons), static `aria-label`s are insufficient. Screen readers need to know the *resulting action* of the next click, not just the current state.
**Action:** Adding dynamically updating `aria-label` attributes (e.g., `aria-label={showPassword ? 'Hide password' : 'Show password'}`) to accurately inform screen reader users.
