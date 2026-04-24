## 2025-03-24 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<button>` elements that lacked `aria-label` attributes for screen readers. Notably in Settings.tsx, HolidayCalendar.tsx, EmployeeDetail.tsx, and Performance.tsx.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2025-03-27 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<Button>` elements that lacked `aria-label` attributes for screen readers across `Topbar.tsx`, `NotificationsDropdown.tsx`, `AppSidebar.tsx`, `ApplyLeave.tsx`, `Documents.tsx`, `HelpDesk.tsx`, `Payroll.tsx`, `Settings.tsx`, `Employees.tsx`, and `Performance.tsx`.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2025-02-18 - Dynamic ARIA Labels for State Toggles
**Learning:** When using state-dependent icons (like Eye/EyeOff for password visibility) in icon-only buttons, sighted users get immediate visual feedback of the state change. However, screen reader users miss this context if the `aria-label` is static (e.g., just "Toggle password").
**Action:** Always use a dynamic `aria-label` that describes the *result* of the next click (e.g., `aria-label={showPassword ? 'Hide password' : 'Show password'}`) for stateful toggle buttons.
