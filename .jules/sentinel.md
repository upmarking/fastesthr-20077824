## 2023-10-27 - Fix XSS Vulnerability in External Links
**Vulnerability:** User-supplied URLs rendered directly in `href` attributes without protocol validation could lead to Cross-Site Scripting (XSS) if they contain `javascript:` URIs.
**Learning:** Found instances where meeting links (`interview.meeting_link`) and company external links (`website`, `linkedin_url`) were directly injected into `<a>` tags.
**Prevention:** Always validate external URLs to ensure they start with safe protocols (`http://` or `https://`) before rendering them in `href` attributes using a centralized utility function like `isSafeUrl`.
