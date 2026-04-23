## 2024-05-14 - AIAssistant Accessibility

**Learning:** When inspecting the `AIAssistant.tsx` component, several icon-only buttons do not have an `aria-label` or `title` attribute, causing issues with screen reader accessibility. Additionally, there's no clear visual indicator for when the AI is processing the request, and the input form is missing an explicit `aria-label`.

**Action:** Add `aria-label` or `title` attributes to all icon-only buttons (like the trigger button to open the assistant, the close button, and the send button). Introduce a loading state visual (e.g., a small loading indicator) when the AI is processing to provide better feedback.
