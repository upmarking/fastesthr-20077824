## 2025-03-24 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<button>` elements that lacked `aria-label` attributes for screen readers. Notably in Settings.tsx, HolidayCalendar.tsx, EmployeeDetail.tsx, and Performance.tsx.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2025-03-27 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<Button>` elements that lacked `aria-label` attributes for screen readers across `Topbar.tsx`, `NotificationsDropdown.tsx`, `AppSidebar.tsx`, `ApplyLeave.tsx`, `Documents.tsx`, `HelpDesk.tsx`, `Payroll.tsx`, `Settings.tsx`, `Employees.tsx`, and `Performance.tsx`.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.
## 2024-04-04 - Adding aria-label to icon-only buttons
**Learning:** Icon-only buttons without `aria-label` or `title` are a common accessibility issue. Ensuring all such buttons have descriptive labels is crucial for screen reader users. In this app, show/hide password buttons in auth forms lacked these labels.
**Action:** Added `aria-label` to 'show/hide password' buttons in Login and Register forms, and will check for other similar missing labels.
