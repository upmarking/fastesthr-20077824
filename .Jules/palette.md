## 2025-03-24 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<button>` elements that lacked `aria-label` attributes for screen readers. Notably in Settings.tsx, HolidayCalendar.tsx, EmployeeDetail.tsx, and Performance.tsx.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2025-03-27 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<Button>` elements that lacked `aria-label` attributes for screen readers across `Topbar.tsx`, `NotificationsDropdown.tsx`, `AppSidebar.tsx`, `ApplyLeave.tsx`, `Documents.tsx`, `HelpDesk.tsx`, `Payroll.tsx`, `Settings.tsx`, `Employees.tsx`, and `Performance.tsx`.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2026-04-17 - Adding aria-labels to AIAssistant and DomainSettings
**Learning:** Found several more icon-only `<Button>` components lacking `aria-label` attributes, specifically in `AIAssistant.tsx` and `DomainSettings.tsx`. This confirms that any newly added floating action buttons or settings controls need these attributes to be accessible.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility and documenting this pattern so future buttons will be accessible by default.
