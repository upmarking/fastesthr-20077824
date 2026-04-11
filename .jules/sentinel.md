## 2024-03-24 - HTML Injection in PDF Templates
**Vulnerability:** XSS/HTML Injection vulnerability in `src/lib/pdf-generator.ts` where unescaped user inputs (e.g., candidate names, custom template variables) were directly substituted into HTML strings before being rendered to PDF and persisted.
**Learning:** The PDF generator natively executes `<script>` tags found in templates for features like CTC calculations before capturing `.innerHTML`. Using robust sanitizers like DOMPurify on the full template would strip these required scripts and break the feature.
**Prevention:** Rather than sanitizing the entire compiled template block or pulling in heavy dependencies, escape individual variable values (e.g., `&`, `<`, `>`, `"`, `'`) specifically during variable substitution. This ensures user input is safe while preserving the template's intentional functional elements.

## 2024-10-18 - String.prototype.replace Vulnerability in Dynamic Variable Substitution
**Vulnerability:** Regex backreference substitution vulnerabilities (e.g., unintended substitution if input contains `$&`, `$'`, `` $` ``) in dynamic string replacements (`String.prototype.replace()`) where user inputs (e.g. employee names, bonus amounts) are passed directly as the replacement string.
**Learning:** `String.prototype.replace(regex, replacementString)` interprets special `$N` patterns in `replacementString` natively. If the user controls the `replacementString`, they can manipulate the output layout or access matching metadata unintendedly.
**Prevention:** When dynamically replacing strings with user-provided input, always use a callback function (`.replace(regex, () => userInput)`) instead of directly passing the string. The callback bypasses the special `$N` interpolation engine safely.
