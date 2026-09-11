# React

- **Function components + Hooks only.** No class components. *(react.1 — error)*
- **Follow the Rules of Hooks.** Never call hooks in conditions, loops, or callbacks. *(react.4 — error)*
- **Stable list keys.** Never use array index as key. *(react.3 — error)*
- `dangerouslySetInnerHTML` requires DOMPurify + code review. *(react.2 — error)*

### `useEffect` Discipline *(critical — most misused hook)*

`useEffect` is for **synchronizing with external systems only** — not data flow or state derivation.

- **Never derive state in effects.** Compute during render (`useMemo` or inline). *(react.6 — error)*
  - ❌ `useEffect(() => setFiltered(filterTodos(todos, filter)), [todos, filter])`
  - ✅ `const filtered = useMemo(() => filterTodos(todos, filter), [todos, filter])`
- **Cleanup is mandatory.** Any subscription (listeners, timers, sockets, observers) must return a cleanup function. *(react.7 — error)*
- **No effect chains.** Don't set state in an effect that triggers another effect. Use `useReducer`.
- **No event logic in effects.** User interactions belong in event handlers.
- **Avoid fetching in effects.** Use React Query / SWR / framework data loading. *(react.8 — prefer)*

## Other React Rules

- Extract complex state into custom hooks (`use*`).
- Use `useReducer` for multi-field state; avoid many `useState` calls.
- Favor Server Components (Next.js App Router); use `'use client'` sparingly.
- Never store tokens in `localStorage` (XSS-accessible). Prefer httpOnly cookies.
- Keep components under ~200 lines. *(react.5 — prefer)*