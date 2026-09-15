---
name: lint
description: Run the real linter/static-analysis tool for a language (eslint, phpstan, golangci-lint, clippy), parse its output, and report or fix findings. Use when asked to lint a project, check code quality, run static analysis, set up linting when scoping a new project, or fix lint errors/warnings.
---

Each language has its own real linter with type/scope-aware rules that no generic pattern-matcher can replicate — this skill drives the actual tool per language rather than approximating its rules. See `[language].md` in this directory for the tool-specific contract (detect, install, config scaffold, run, parse, gotchas):

- [ESLint (JS/TS)](eslint.md)
- [PHPStan (PHP)](phpstan.md)
- [golangci-lint (Go)](golangci-lint.md)
- [Clippy (Rust)](clippy.md)

## Dispatch

1. **Detect language(s) present.** Look for `package.json` (+ `tsconfig.json`/`.tsx`/`.jsx` files → JS/TS), `composer.json` (→ PHP), `go.mod` (→ Go), `Cargo.toml` (→ Rust). A project can have more than one — run each language's linter independently, don't merge configs.
2. **Detect existing config.** Each per-language file lists the config file(s) to look for. If found, use it as-is — do not overwrite a user's existing lint config without asking.
3. **Detect the binary.** Each per-language file lists how to check for and install the tool. If missing, tell the user what's missing and the exact install command — do not silently skip or silently install without confirmation for anything that isn't project-local (e.g. a global Go/Rust toolchain install).
4. **No config found:** offer to scaffold one (see each file's "Scaffold a config" section) rather than running with bare defaults, since bare defaults tend to be noisy or too permissive.
5. **Run** using the tool's machine-readable output format (each file documents the exact flags — avoid `npx`/wrapper noise contaminating stdout, see eslint.md).
6. **Parse and report.** Normalize to: file, line, column, severity (error/warning), rule id, message. Summarize counts by severity before listing individual findings; for large result sets, group by file.
7. **Fixing:** if asked to fix, prefer the tool's own `--fix`/autofix where available (eslint, clippy) and re-run to confirm the fix reduced findings. For issues with no autofix, fix manually and re-run to verify.

## Scoping a new project

When a user asks to scope/set up a new project (or explicitly asks to "set up linting"), offer to run this skill's config-scaffold step for each detected language, using that language's real standard tool rather than a generic ruleset. Don't do this unprompted for an existing project that already has lint config — respect what's already there.

## Missing dependency notices

If a required binary is absent, state clearly:
- which tool is missing
- the exact install command (from the relevant `[language].md`)
- that you're stopping rather than guessing at results

Never fabricate lint output or claim a scan ran when the binary was unavailable.
