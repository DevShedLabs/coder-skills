---
name: handoff-to-claude-code
description: 'Hand the current task off to a real Claude Code CLI session (subscription-authenticated, not API-billed), or pick up results Claude Code left behind. Use when the user says "send this to Claude Code", "hand off to claude", or asks what Claude Code left for you.'
---

Coder's own agent and a terminal-run `claude` session don't share memory — this skill bridges them through a plain file, since a project's `.claude/handoff/` folder is the one thing both tools can read and write without any IPC between the terminal process and the Electron app.

## Handoff file format

Location: `.claude/handoff/<slug>.md` in the project root (create the folder if missing). One file per handoff — never overwrite an existing one, pick a new slug (e.g. task-derived, or append `-2`).

```
---
direction: to-claude-code | to-coder
status: pending | done
created: <ISO 8601 timestamp>
title: <short task title>
---

## Context
<open files, relevant task/ticket, anything Claude Code needs that isn't obvious from the repo itself>

## Task
<what to do>

## Result
<left blank on send — the receiving side fills this in and flips status to done>
```

## Sending to Claude Code

1. Gather context: current task, relevant open files, anything decided in this conversation that a fresh Claude Code session wouldn't know.
2. Write the handoff file with `direction: to-claude-code`, `status: pending`.
3. Tell the user the file path and the exact command to run in their terminal:
   ```
   claude "Read .claude/handoff/<slug>.md and follow the handoff-from-coder skill"
   ```
   Do not attempt to type this into a terminal yourself via run_command — the point of this handoff is the subscription-authenticated interactive session the user already has open; launching a new headless `claude` invocation would bill via API instead.

## Receiving from Claude Code

1. List `.claude/handoff/*.md`, find files with `direction: to-coder` and `status: pending`.
2. If none, say so plainly — don't invent a handoff.
3. If found, read the `## Result` (or `## Task`, if Claude Code is asking Coder to do something) and act on it.
4. Once handled, edit the file: append anything Coder produced under a new `## Coder Result` heading and flip `status: done`. Don't delete the file — it's the audit trail.
