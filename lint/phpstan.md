# PHPStan (PHP)

## Detect

- Config: `phpstan.neon` / `phpstan.neon.dist` / `phpstan.dist.neon` at repo root.
- Project is PHP if `composer.json` exists.

Psalm is a comparable alternative (`psalm.xml`) — if a project already has Psalm configured, use it instead rather than adding a second, competing static analyzer; don't introduce PHPStan alongside an existing Psalm setup without asking.

## Detect the binary

Prefer the project-local Composer install:

```bash
test -x ./vendor/bin/phpstan && ./vendor/bin/phpstan --version
```

If missing:

```bash
composer require --dev phpstan/phpstan
```

## Scaffold a config

No existing config: start at a moderate level and let the user raise it later — level 9 (max) on an existing codebase with no prior static analysis typically produces thousands of findings and is discouraging as a first run.

```neon
parameters:
    level: 5
    paths:
        - src
```

Levels run 0 (loosest) to 9 (strictest, requires full type coverage). Ask before jumping straight to a high level on a brownfield codebase.

## Run

```bash
./vendor/bin/phpstan analyze --error-format=json --no-progress <path...> > out.json
```

**`--no-progress` is required** — without it, PHPStan writes a progress bar to stdout (`░░░/▓▓▓` blocks) ahead of the JSON, which breaks JSON parsing exactly like the `npx eslint` noise issue. If a `phpstan.neon` sets `paths:`, you can omit the path argument and it will use the config's paths.

## Parse

```json
{
  "totals": {"errors": 0, "file_errors": 2},
  "files": {
    "/abs/path/src/Bad.php": {
      "errors": 2,
      "messages": [{"message": "...", "line": 6, "identifier": "variable.undefined", "ignorable": true}]
    }
  },
  "errors": []
}
```

- `totals.file_errors` — count of actual code findings (what you want to report).
- `totals.errors` and the top-level `errors` array — tool-level failures (bad config, PHP parse error, etc.), not code findings. Check this is empty before trusting `file_errors` as complete.
- `files` is keyed by **absolute path**.
- PHPStan has no separate error/warning severity — everything under `messages` is a finding at the configured level. Use `identifier` (e.g. `argument.type`, `variable.undefined`) to categorize.

## Exit codes

- `0` — no findings
- `1` — findings present (normal) or a tool-level error occurred — check `totals.errors`/the top-level `errors` array to tell which
- `2` — internal/fatal error (rare)

## Fix

PHPStan has no autofix. For simple categories (e.g. `declare(strict_types=1)` missing, some type coverage), `rector` (a separate tool, `rector/rector`) can autofix but is a bigger addition — don't install it as a side effect of a lint request; mention it as an option if the user wants automated fixes at scale.

## Gotchas

- Composer must have already run (`vendor/` present) or `./vendor/bin/phpstan` won't exist — this is a "dependencies not installed" state, not a "tool missing" state; tell the user to run `composer install`.
- Raising `level` in an existing config is a scope decision (more findings, possibly a lot more) — confirm with the user before bumping it, don't do it silently while "just running lint."
- `--memory-limit` may be needed on large codebases (PHPStan can hit PHP's default memory limit); if analysis dies with a memory error, retry with `--memory-limit=1G` (or higher) rather than reporting a false "0 findings."
