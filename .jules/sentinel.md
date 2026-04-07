## 2024-03-24 - HTML Injection in PDF Templates
**Vulnerability:** XSS/HTML Injection vulnerability in `src/lib/pdf-generator.ts` where unescaped user inputs (e.g., candidate names, custom template variables) were directly substituted into HTML strings before being rendered to PDF and persisted.
**Learning:** The PDF generator natively executes `<script>` tags found in templates for features like CTC calculations before capturing `.innerHTML`. Using robust sanitizers like DOMPurify on the full template would strip these required scripts and break the feature.
**Prevention:** Rather than sanitizing the entire compiled template block or pulling in heavy dependencies, escape individual variable values (e.g., `&`, `<`, `>`, `"`, `'`) specifically during variable substitution. This ensures user input is safe while preserving the template's intentional functional elements.

## 2024-05-24 - Regex Replacement Injection Vulnerability
**Vulnerability:** String backreference substitution vulnerability in template variable replacements. Using `String.prototype.replace(regex, value)` with user-supplied `value` allows attackers to inject regex replacement patterns like `$&` (matched substring), `` $` `` (prefix), or `$'` (suffix), altering the template structure in unintended ways.
**Learning:** Even when user input is escaped for HTML/XSS, passing the string directly to the replacement parameter of `replace()` exposes the string to backreference substitution logic.
**Prevention:** Always use a replacer function (e.g., `string.replace(regex, () => safeValue)`) instead of directly passing the replacement string when handling user input. This avoids the regex engine interpreting special `$` sequences.
