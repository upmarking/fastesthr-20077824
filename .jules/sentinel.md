## 2024-03-24 - HTML Injection in PDF Templates
**Vulnerability:** XSS/HTML Injection vulnerability in `src/lib/pdf-generator.ts` where unescaped user inputs (e.g., candidate names, custom template variables) were directly substituted into HTML strings before being rendered to PDF and persisted.
**Learning:** The PDF generator natively executes `<script>` tags found in templates for features like CTC calculations before capturing `.innerHTML`. Using robust sanitizers like DOMPurify on the full template would strip these required scripts and break the feature.
**Prevention:** Rather than sanitizing the entire compiled template block or pulling in heavy dependencies, escape individual variable values (e.g., `&`, `<`, `>`, `"`, `'`) specifically during variable substitution. This ensures user input is safe while preserving the template's intentional functional elements.

## 2024-05-18 - [MEDIUM] Fix regex backreference substitution vulnerability in template rendering
**Vulnerability:** The functions replacing template variables (`replaceVariables`, `replaceDocVariables`, and `substituteVariables`) used `String.prototype.replace(regex, string)`. When a user provides input containing special regex replacement characters like `$&` or `$1`, it performs unintended backreference substitutions in the template.
**Learning:** When using `String.prototype.replace` to replace a literal string with a variable value that might contain user-supplied text, passing the replacement string directly is unsafe if it contains special characters.
**Prevention:** Always pass a callback function to the replacement method (e.g., `content.replace(regex, () => safeValue)`) to ensure the value is treated purely as a literal string.
