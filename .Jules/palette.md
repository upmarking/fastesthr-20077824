## 2025-03-24 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<button>` elements that lacked `aria-label` attributes for screen readers. Notably in Settings.tsx, HolidayCalendar.tsx, EmployeeDetail.tsx, and Performance.tsx.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2025-03-27 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<Button>` elements that lacked `aria-label` attributes for screen readers across `Topbar.tsx`, `NotificationsDropdown.tsx`, `AppSidebar.tsx`, `ApplyLeave.tsx`, `Documents.tsx`, `HelpDesk.tsx`, `Payroll.tsx`, `Settings.tsx`, `Employees.tsx`, and `Performance.tsx`.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.
## 2026-04-16 - Add ARIA Labels to Role Permissions Grid
**Learning:** Data grids with unlabeled checkboxes inside table cells or headers lack context for screen reader users, preventing them from understanding what they are toggling. The checkboxes need dynamic labels combining the row/column context (e.g., 'Toggle View permission for Dashboard').
**Action:** Always provide dynamically generated `aria-label` attributes to checkboxes in table structures to articulate exactly what is being selected or toggled.
