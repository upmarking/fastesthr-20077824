## 2025-03-24 - Accessibility improvements for icon buttons
**Learning:** Found multiple instances of icon-only `<button>` elements that lacked `aria-label` attributes for screen readers. Notably in Settings.tsx, HolidayCalendar.tsx, EmployeeDetail.tsx, and Performance.tsx.
**Action:** Adding `aria-label` attributes to improve screen reader accessibility.

## 2024-03-28 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** Many core layout and UI components use icon-only buttons without `aria-label`s, breaking accessibility for screen readers. Components like Topbar (theme toggle), AIAssistant (chat trigger, close, send), NotificationsDropdown (bell icon), and AppSidebar (sign out) all use `size="icon"` buttons containing only an SVG.
**Action:** When adding icon-only buttons (`<Button size="icon">` or similar with only an SVG/Icon child), always include an `aria-label` or `title` attribute explaining the button's action.
