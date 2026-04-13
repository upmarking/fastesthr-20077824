## 2024-03-24 - HTML Injection in PDF Templates
**Vulnerability:** XSS/HTML Injection vulnerability in `src/lib/pdf-generator.ts` where unescaped user inputs (e.g., candidate names, custom template variables) were directly substituted into HTML strings before being rendered to PDF and persisted.
**Learning:** The PDF generator natively executes `<script>` tags found in templates for features like CTC calculations before capturing `.innerHTML`. Using robust sanitizers like DOMPurify on the full template would strip these required scripts and break the feature.
**Prevention:** Rather than sanitizing the entire compiled template block or pulling in heavy dependencies, escape individual variable values (e.g., `&`, `<`, `>`, `"`, `'`) specifically during variable substitution. This ensures user input is safe while preserving the template's intentional functional elements.

## 2024-05-18 - String.prototype.replace() regex backreference vulnerability
**Vulnerability:** A vulnerability exists when substituting variables in templates using `String.prototype.replace(regex, safeValue)` because user inputs containing regex backreference syntax like `$&` are unintentionally evaluated as match replacers by the replace function.
**Learning:** Even if the string input is HTML-escaped, `replace` interprets characters like `$&` in the substitution string as special replacement patterns if passed directly as a string argument.
**Prevention:** When substituting user-provided variables using `replace`, always pass a callback function `() => safeValue` as the replacement argument instead of a string to avoid evaluating regex backreferences.
