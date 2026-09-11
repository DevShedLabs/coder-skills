# Rust

- Follow the **Rust API Guidelines**. Pass `cargo clippy` with zero warnings.
- Use `Result<T, E>` for fallible functions. **Never `unwrap()` / `expect()` in production.** *(rust.1 — error)*
- `unsafe { }` blocks must include a `// SAFETY:` comment justifying invariants. *(rust.2 — error)*
- All public types must derive `Debug`. *(rust.3 — prefer)*
- Use `?` for error propagation, not `match` + `unwrap`. *(rust.4 — prefer)*
- Dependencies must pass `cargo audit` with no advisories. *(rust.5 — error)*
- Use `serde` with `#[serde(deny_unknown_fields)]` for strict input validation.
- Use vetted crypto crates (`ring`, `rustls`, `argon2`). Never roll your own.
- Favor owned types for APIs; use `&T` only for borrowing.
- One module per file; re-export public API from `lib.rs`.
