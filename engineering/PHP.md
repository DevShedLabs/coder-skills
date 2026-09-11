# PHP

- Follow **PSR-12**.
- Declare **strict types** and **all** parameter/return types. *(php.1 — error)*
- Use **prepared statements** (PDO or Eloquent). Never concatenate SQL. *(php.2 — error)*
- Escape all output with `htmlspecialchars()` or a template engine. *(php.3 — error)*
- **Never `eval()`**. Use `preg_replace_callback()` for legacy `/e` migration.
- **No interceptor magic methods.** Avoid `__get`, `__set`, `__call`, `__callStatic`, `__isset`, `__unset` — they defeat static analysis, add runtime overhead, and hide the API surface. Use explicit typed methods/properties or DTOs. `__construct`, `__invoke`, `__toString`, `__serialize`, `__unserialize` are acceptable. *(php.6 — error)*
- Use **DTOs / Value Objects** for data. No bare arrays for structured data.
- **No superglobals** (`$_GET`, `$_POST`, `$_REQUEST`) in business logic. Inject `Request` objects.
- Use **constructor property promotion** (PHP 8+).
- Use Composer **PSR-4 autoloading**. No `include`/`require` for logic.
- Use `filter_var` / `filter_input` to validate and sanitize user data.
