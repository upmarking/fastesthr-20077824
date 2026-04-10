## 2025-03-24 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<button>` elements that lacked `aria-label` attributes for screen readers. Notably in Settings.tsx, HolidayCalendar.tsx, EmployeeDetail.tsx, and Performance.tsx.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2025-03-27 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<Button>` elements that lacked `aria-label` attributes for screen readers across `Topbar.tsx`, `NotificationsDropdown.tsx`, `AppSidebar.tsx`, `ApplyLeave.tsx`, `Documents.tsx`, `HelpDesk.tsx`, `Payroll.tsx`, `Settings.tsx`, `Employees.tsx`, and `Performance.tsx`.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.
## 2024-04-10 - AIAssistant Accessibility & Typing Indicator
**Learning:** For floating components like the AIAssistant, adding ARIA labels to icon-only buttons (open/close/send) is crucial. Furthermore, adding a visual typing indicator (bouncing dots) with `aria-label` and `sr-only` text greatly enhances the perceived responsiveness and accessibility of the simulated AI interactions.
**Action:** Always verify icon-only buttons have proper `aria-label` attributes and consider visual+accessible feedback for simulated async states (like AI typing).
