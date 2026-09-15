# ESLint (JavaScript/TypeScript)

## Detect

- Config: `eslint.config.js` / `eslint.config.mjs` / `eslint.config.ts` (flat config, ESLint ≥9) or legacy `.eslintrc*`.
- Project uses flat config if `package.json` has `"type": "module"` or the config file is `.mjs`/uses `export default`.

## Detect the binary

Prefer the project-local install over a global one — version mismatches between global `eslint` and the project's plugins (e.g. `typescript-eslint`, `eslint-plugin-react-hooks`) produce confusing errors.

```bash
test -x ./node_modules/.bin/eslint && ./node_modules/.bin/eslint --version
```

If missing, it's a project dependency issue, not a "tool not installed" issue — tell the user `node_modules` needs `npm install` (or `pnpm install`/`yarn`, whichever lockfile is present), don't install eslint globally as a workaround.

## Scaffold a config

No existing config: run `npm init @eslint/config@latest` interactively, or hand-write flat config. Minimum for TS:

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'build', 'node_modules'] },
  { files: ['**/*.{ts,tsx}'], extends: [js.configs.recommended, ...tseslint.configs.recommended] },
)
```

Add `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` if the project has `.tsx`/React. Ask before adding a project-specific structural rule (e.g. a `max-lines` cap) — that's a team-standards decision, not a default.

## Run

```bash
./node_modules/.bin/eslint --format json <path...> > out.json
```

**Do not invoke via `npx eslint ...`** — npx prepends `npm notice run ...` lines to stdout, which breaks JSON parsing. Use the local binary directly, or `npm --silent exec eslint -- <args>` if the local binary path is unknown.

## Parse

Output is a single JSON array, one object per file:

```json
[{"filePath": "...", "errorCount": 1, "warningCount": 0, "messages": [
  {"ruleId": "max-lines", "severity": 2, "message": "...", "line": 12, "column": 1}
]}]
```

`severity`: `2` = error, `1` = warning. Sum `errorCount`/`warningCount` across files for a total before listing individual messages.

## Exit codes

- `0` — no errors (warnings may still be present; check `warningCount`, don't rely on exit code alone)
- `1` — one or more lint errors found (this is expected/normal, not a tool failure)
- `2` — ESLint itself failed (bad config path, syntax error in config, etc.) — this is a real failure, stop and report the stderr message rather than treating it as "0 findings"

## Fix

```bash
./node_modules/.bin/eslint --fix <path...>
```

Re-run without `--fix` afterward to report what remains (not everything is auto-fixable).

## Gotchas

- Flat config can define different rules per `files` glob (e.g. this repo splits renderer `src/**` vs main-process `electron/**` with different globals). Don't assume one ruleset applies repo-wide — the JSON output already reflects per-file rules correctly, but if you're reasoning about *why* a file wasn't flagged for something, check which block matched it.
- `no-unused-vars` and `no-explicit-any` are commonly turned `off` in projects that lean on TypeScript's own compiler for that class of check — an absence of these findings doesn't mean the code has no unused vars, it means ESLint isn't the tool checking for it here. Don't report "no unused variables found" as if ESLint verified that.
- A rule that looks like it should fire (undeclared variable, duplicate params) may be silently absent from `js.configs.recommended` under `typescript-eslint` because TypeScript's own compiler already catches it at the type-check level — ESLint and `tsc` are complementary, not redundant.
