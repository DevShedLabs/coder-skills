# Go

- Follow **Effective Go**. Run `go fmt` on every file. *(go.1 — error)*
- **Check every error.** Never discard with `_`. Wrap with `fmt.Errorf("context: %w", err)`. *(go.2 — error)*
- Use **parameterized queries** (`$1`, `$2`, …). Never `Sprintf` into SQL. *(go.3 — error)*
- **No `crypto/md5` or `crypto/sha1`.** Use SHA-256/512. *(go.4 — error)*
- No package-level `var` (except `Err*` sentinels). Inject deps via constructors. *(go.5 — prefer)*
- Keep interfaces small (1–3 methods). Accept interfaces, return structs.
- Use `crypto/rand` for tokens/passwords/nonces. Never `math/rand`.
- Terminate TLS at the server or proxy. HTTPS only.