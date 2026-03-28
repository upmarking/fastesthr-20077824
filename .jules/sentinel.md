## 2024-03-24 - Unintended regex backreference substitution vulnerability

**Vulnerability:** Found multiple instances of `String.prototype.replace(regex, value)` where `value` was user-controlled input. If `value` contained special regex patterns like `$&`, `$'`, etc., the JavaScript engine would interpret them as replacement patterns rather than literal strings, potentially exposing unintended data or altering HTML structure unexpectedly (e.g. if a user enters "$&" for their name, it replaces it with the matched string like "{{name}}").
**Learning:** `String.prototype.replace()` natively supports special replacement patterns in the second argument even if the first argument is a Regex, unless a callback function is used.
**Prevention:** Always use a callback function `() => value` when replacing strings with dynamic, untrusted user input using `String.prototype.replace()`.
