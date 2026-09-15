# golangci-lint (Go)

## Detect

- Config: `.golangci.yml` / `.golangci.yaml` / `.golangci.toml` / `.golangci.json` at repo root.
- Project is Go if `go.mod` exists.

## Detect the binary

```bash
command -v golangci-lint && golangci-lint --version
```

If missing:

```bash
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
```

Confirm `$(go env GOPATH)/bin` (typically `~/go/bin`) is on `$PATH` — this is the most common "installed but not found" cause.

## Scaffold a config

No existing config: golangci-lint runs with a small built-in default linter set even with no config file, which is a reasonable starting point — don't assume you must write one before the first run. If the user wants a config to customize/extend it:

```yaml
linters:
  enable:
    - govet
    - staticcheck
    - errcheck
    - unused
    - gosimple
    - ineffassign
run:
  timeout: 5m
```

## Run

```bash
golangci-lint run --out-format json ./... > out.json
```

## Parse

```json
{"Issues": [{"FromLinter": "errcheck", "Text": "...", "Severity": "", "Pos": {"Filename": "...", "Line": 148, "Column": 13}}]}
```

`Issues` is a flat list (no per-file grouping) — group by `Pos.Filename` yourself if reporting per-file. `Severity` is often an empty string; golangci-lint doesn't strongly distinguish error/warning the way eslint does — treat every issue as worth reporting, and use `FromLinter` to categorize (e.g. `errcheck`/`govet` findings are typically more load-bearing than style linters like `gofmt`/`goimports`).

## Exit codes

- `0` — no issues found
- `1` — issues found (normal, not a tool failure)
- other — configuration or execution error; check stderr

## Fix

```bash
golangci-lint run --fix ./...
```

Only a subset of linters support autofix (e.g. `gofmt`, `goimports`). Re-run without `--fix` to report what's left.

## Gotchas

- `./...` scans the whole module from the current directory — run from the repo root (where `go.mod` lives), not a subpackage, unless you deliberately want a partial scan.
- First run after install can be slow (linter binary downloads/builds analysis caches) — don't mistake a long first run for a hang.
- If a repo has multiple `go.mod` files (a multi-module workspace), `./...` only covers the module rooted at the current directory — check for nested `go.mod` files and run per-module if needed.
