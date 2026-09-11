# JavaScript

- **No `var`.** `const` by default, `let` only when reassigning. *(js.1 — error)*
- **No `eval()`, `setTimeout(string)`, `setInterval(string)`.** *(js.2 — error)*
- **No `innerHTML`.** Use `textContent` or safe DOM APIs + DOMPurify. *(js.3 — error)*
- Prefer `const` over `let`. *(js.4 — prefer)*
- Use `?.` and `??` instead of `&&`/`||` for existence checks. *(js.5 — prefer)*
- Use `#private` fields, not `_convention`.
- Prefer pure functions. Avoid mutation — use spread, `Object.freeze`.
- Set CSP headers. Avoid inline scripts.