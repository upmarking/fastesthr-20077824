## 2025-03-24 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<button>` elements that lacked `aria-label` attributes for screen readers. Notably in Settings.tsx, HolidayCalendar.tsx, EmployeeDetail.tsx, and Performance.tsx.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2025-03-27 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<Button>` elements that lacked `aria-label` attributes for screen readers across `Topbar.tsx`, `NotificationsDropdown.tsx`, `AppSidebar.tsx`, `ApplyLeave.tsx`, `Documents.tsx`, `HelpDesk.tsx`, `Payroll.tsx`, `Settings.tsx`, `Employees.tsx`, and `Performance.tsx`.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.
## 2026-04-15 - Missing ARIA Labels on Stateful Icon Toggles
**Learning:** Icon-only buttons used for stateful toggles (like password visibility) frequently miss `aria-label` attributes, making them inaccessible to screen readers. For these elements, the `aria-label` must be dynamic (e.g., `showPassword ? 'Hide password' : 'Show password'`) to accurately reflect the action that will occur on the *next* click.
**Action:** When adding or reviewing icon-only buttons (`size="icon"`), always verify the presence of an `aria-label`. For stateful toggles, ensure the label dynamically describes the resulting action.
