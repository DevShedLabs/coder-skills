# TypeScript

- `strict: true` in `tsconfig.json`. Everything must be type-safe.
- **`any` is forbidden.** Use `unknown` + narrowing. *(ts.1 — error)*
- All functions must have **explicit return type** annotations. *(ts.2 — error)*
- **No `eval()` or `new Function()`.** *(ts.3 — error)*
- Replace `as Type` assertions with type guards. *(ts.4 — prefer)*
- Prefer `readonly` / `ReadonlyArray` / `as const`. *(ts.5 — prefer)*
- Use **discriminated unions** for state machines and API responses.
- Validate at boundaries with **Zod / TypeBox**. No `JSON.parse() as MyType`.
- No deep merging of untrusted objects. Use `structuredClone` or a safe library.
- ES modules only. No `require`, no namespaces.
