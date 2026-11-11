---
name: coder-command-hints
description: "Coder app only: create or fix a custom command-hint spec so the Coder desktop IDE's integrated terminal suggests subcommands, flags and values while the user types a CLI command it doesn't already know (a personal script, an internal tool, a new CLI). Writes ~/.coder/completions/<command>.json. Use only when the user asks for Coder terminal hints/autocomplete for a specific command. Do NOT use for zsh/bash/fish completion scripts, VS Code, or any other terminal."
---

# Coder custom command hints

Coder's integrated terminal shows a suggestion list as the user types. Tools like git, npm and docker are built in. For any other command the user supplies a **spec**: one JSON file describing the command's subcommands, flags and values. Your job is to write that file accurately from the tool's real behavior.

```
~/.coder/completions/<command>.json     (~/.coder-dev/completions/ for a dev build of Coder)
```

- The file name is the command **exactly as typed in the shell**: `devscan` → `devscan.json`. That name is the only thing Coder matches on.
- Create the `completions` folder if it is missing.
- A spec with the same name as a built-in one **replaces** the built-in.
- Coder re-reads the file whenever it changes. No restart, no new terminal.
- Hints work in zsh and bash terminals inside Coder, and only while **Settings → General → Terminal → Command hints** is on.

## Workflow

1. **Learn the tool from the tool.** Never write flags from memory or from the name.
   - Run `<command> --help` and note every subcommand and global flag.
   - Run `<command> <sub> --help` for **each** subcommand (and nested ones) and note its own flags. Descriptions come from here; copy them, shortened.
   - If the help output is missing or unusable, read the tool's source or README. If it is a Go/Cobra tool, `<command> __complete ""` prints subcommands with descriptions.
   - If the command is a script you can't run, read the script's argument parsing.
2. **Write `<command>.json`** using the format below. Prefer a complete, boring spec over a clever one.
3. **Validate:** `node validate.mjs ~/.coder/completions/<command>.json` (the script sits next to this SKILL.md). Fix every `ERROR`; read the warnings.
   If the script isn't available (some agents don't copy bundled scripts), check the JSON parses with `node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>` and re-read "Getting the details right" below against your file.
4. **Cross-check against the tool once more.** Pick two subcommands and one flag with a value and compare them with `--help`. The validator proves the JSON is well formed, not that it is true.
5. **Tell the user how to try it:** open a Coder terminal and type `<command> ` with a trailing space (subcommands should appear), then `<command> <sub> -` (that subcommand's flags, plus global ones).
6. If you can't write under `~/.coder`, show the file contents and say where it goes.

## Format

The top level is the command itself; `subcommands` nest to any depth.

```json
{
  "name": "mytool",
  "description": "Does useful things",
  "options": [
    { "name": "--verbose", "description": "More output", "isPersistent": true },
    { "name": ["-f", "--format"], "description": "Output format",
      "args": { "name": "format", "suggestions": ["table", "json"] } }
  ],
  "subcommands": [
    { "name": "scan", "description": "Scan a folder",
      "options": [{ "name": "--path", "description": "Folder to scan", "args": { "name": "dir", "template": "folders" } }] },
    { "name": ["deploy", "ship"], "description": "Deploy to an environment",
      "args": { "name": "env", "suggestions": ["staging", "production"] } }
  ]
}
```

| Field | Meaning |
|---|---|
| `name` | String, or an array of aliases (`["-o", "--output"]`). Options start with `-`; subcommands never do. |
| `description` | Shown beside the hint. Short: one clause, no trailing period needed. |
| `subcommands` | Same shape, nested. |
| `options` | Flags. `isPersistent: true` makes a flag valid in every subcommand below it. `isRepeatable: true` allows repeats. |
| `args` | What follows a flag or command: one object, or an array for several positional values. |
| `args.suggestions` | Fixed values: strings, or `{ "name": "json", "description": "…" }`. |
| `args.template` | `"filepaths"` (files and folders) or `"folders"`. Nothing else is supported. |
| `args.isOptional`, `args.isVariadic` | Value may be omitted / accepts many. |
| `args.generators` | `[{ "script": ["mytool", "list-envs"], "splitOn": "\n" }]` runs the tool and uses each output line as a value. |
| `hidden`, `deprecated` | Keep an entry out of the list. |

JSON only: no comments, no trailing commas, no functions. An invalid file is ignored by Coder (silently, from the user's side).

## Getting the details right

- **Value flag vs switch.** A flag that takes a value (`--format json`, `--path DIR`) **needs `args`**; a boolean switch (`--verbose`) must **not** have it. Getting this wrong makes the next word complete as a flag instead of a value, or the reverse. Check the help line: `--format string`, `--depth int`, `FILE` after the flag all mean "takes a value".
- **Global flags go once.** Flags the tool accepts on every subcommand belong in the top-level `options` with `isPersistent: true`. Do not copy them into each subcommand.
- **Both spellings.** If the help shows `-o, --output`, write `"name": ["-o", "--output"]` as one option, not two.
- **Enumerations from help text** (`table|json|compact`, `critical|high|medium|low`) become `suggestions`. Don't invent values the help doesn't state.
- **Value kinds.** A path argument → `template`. A free-form value (a package name, a number) → just `"args": { "name": "package" }` with no suggestions; it keeps the next word from being treated as a subcommand.
- **Aliases** of subcommands (`["deploy", "ship"]`) are one entry.
- **`generators`** run on keystrokes. Use them only when the valid values come from the tool itself and change (environments, projects), the script must start with the same command, and it must be fast and side-effect free. When in doubt, leave it out.
- **Don't add what isn't there.** Skip `--help`/`-h` and `--version` unless the user wants them listed; they add noise. If included, `"--help"` is a persistent option at the top level.
- Leave out hidden/internal subcommands that the help doesn't list.

## Worked example (from `devscan --help`)

Root flags `--format string  Output format: table|json|compact`, `--path string`, `--severity string  critical|high|medium|low` apply to every subcommand, so:

```json
{
  "name": "devscan",
  "description": "Security and health scanner for developer environments",
  "options": [
    { "name": "--format", "description": "Output format", "isPersistent": true,
      "args": { "name": "format", "suggestions": ["table", "json", "compact"] } },
    { "name": "--path", "description": "Explicit project path to scan", "isPersistent": true,
      "args": { "name": "path", "template": "folders" } },
    { "name": "--severity", "description": "Filter by severity", "isPersistent": true,
      "args": { "name": "level", "suggestions": ["critical", "high", "medium", "low"] } },
    { "name": "--no-color", "description": "Disable color output", "isPersistent": true }
  ],
  "subcommands": [
    { "name": "audit", "description": "Vulnerability scan only" },
    { "name": "fix", "description": "Suggest fix commands",
      "options": [{ "name": "--dry-run", "description": "Print suggested fixes without running them" }] },
    { "name": "intercept", "description": "Manage package manager shims",
      "subcommands": [
        { "name": "enable", "description": "Install shims and patch shell profiles" },
        { "name": "disable", "description": "Remove shims and clean shell profiles" },
        { "name": "status", "description": "Show which shims are active" }
      ] }
  ]
}
```

`--dry-run` is a switch (no `args`); `--format` takes a value (has `args`); `--severity` is shared by every subcommand, so it is persistent at the top, not repeated.

## If hints don't appear

Wrong file name (must match the typed command, case-sensitive), invalid JSON (run the validator), the terminal is not zsh/bash, or Command hints is switched off in Settings → General → Terminal. Existing terminals opened before Coder was updated may need to be reopened once.
