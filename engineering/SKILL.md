---
name: engineering
description: When writing code in a programming language, PHP, Go, Rust, Python, JaveScript/TypeScript, etc...
---

# Universal Principles

1. **SOLID is mandatory.** Apply all five principles to every module, class, and function.
   - **SRP** — One reason to change per unit. Split multi-concern units.
   - **OCP** — Extend via composition, strategy, or config. Never edit existing code to add behavior.
   - **LSP** — Subtypes must be fully substitutable. Never weaken preconditions or strengthen postconditions.
   - **ISP** — Keep interfaces small and focused. Split fat interfaces.
   - **DIP** — Inject abstractions. Never hard-code concrete dependencies.
2. **DRY** — No duplication. Extract shared logic.
3. **YAGNI** — Don't build for speculative needs.
4. **No hard-coded secrets.** Use env vars or a secrets manager.
5. **Document public APIs.** Docstrings / JSDoc / rustdoc on every public surface.
6. **Lint + format before merge.** Every language must pass its standard linter and formatter.
7. **Test every new feature** — At least one automated test (unit, integration, or snapshot).
8. **Prefer early returns over `else`** across all languages.
9. **Keep files under ~300 lines.** Split when a file does too much.

## Language Specific
- [PHP](PHP.md)
- [Go](Go.md)
- [JavaScript](JavaScript.md)
- [TypeScript](TypeScript.md)
- [Python](Python.md)
- [React](React.md)
- [Electron](Electron.md)
- [Rust](Rust.md)
