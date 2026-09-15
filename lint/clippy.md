# Clippy (Rust)

## Detect

- Project is Rust if `Cargo.toml` exists.
- Config (optional): `clippy.toml` or `.clippy.toml` at repo root — only needed to tune thresholds (e.g. cognitive-complexity limits) or allow/deny specific lints project-wide; clippy works fully without one.

## Detect the binary

Clippy ships as a rustup component, not a standalone install:

```bash
cargo clippy --version
```

If missing:

```bash
rustup component add clippy
```

## Scaffold a config

Most projects don't need one. If the user wants project-wide lint-level overrides, prefer `[lints.clippy]` in `Cargo.toml` (modern, per-crate) over a separate `clippy.toml` file (which only holds *configuration values* like thresholds, not lint on/off switches):

```toml
[lints.clippy]
all = "warn"
pedantic = "warn"
```

## Run

```bash
cargo clippy --message-format=json > out.jsonl 2>/dev/null
```

## Parse

**Output is NDJSON (one JSON object per line), not a single JSON array** — unlike eslint/golangci-lint. Parse line by line:

```json
{"reason":"compiler-message","message":{"level":"warning","message":"...","spans":[{"file_name":"...","line_start":148}]}}
```

Filter to `reason == "compiler-message"` (other lines are `"reason":"build-finished"` etc. with no finding data). `message.level` is `"warning"`, `"error"`, `"note"`, or `"help"` — `note`/`help` lines are usually sub-explanations attached to a warning/error, not separate findings; don't double-count them.

## Exit codes

- **`0` even when warnings are present** — clippy does not fail the build on warnings by default. Do not treat exit 0 as "no findings"; always check the parsed output count.
- Nonzero — an actual compile error (not just a lint), or `-D warnings` was passed and a warning-level lint fired.

To make warnings fail the run (useful for a strict scan mode):

```bash
cargo clippy --message-format=json -- -D warnings
```

## Fix

```bash
cargo clippy --fix --allow-dirty
```

`--allow-dirty` is required if there are uncommitted changes in the working tree — confirm with the user before running against a dirty tree, since it will modify files in place.

## Gotchas

- First run compiles the whole crate graph (same as `cargo build`) — can be slow on a cold cache; not a hang.
- The default lint set is deliberately conservative. `clippy::pedantic` and `clippy::nursery` groups catch much more but are opt-in and noisier — don't enable them by default when scaffolding a config; ask first.
