---
name: mermaid-mindmap
description: Create or edit a `.mindmap.md` mindmap file that Coder renders as an interactive canvas (drag nodes, pan/zoom, export to PNG/PDF).
---

# Mindmap files

A file ending in `.mindmap.md` is a mindmap. Coder shows it two ways: as plain text in a Code tab, and — via Cmd+Shift+X, or "Open Canvas" — as an interactive diagram in a Canvas tab that live-updates as the text changes.

## Syntax

```
mindmap
  root((Project Launch))
    Design
      Wireframes
      User research
    Build
      Backend
      Frontend
    Launch
      Marketing
      Support
```

Rules:
- **First non-blank line must be exactly `mindmap`.** Nothing else on that line.
- **Second line is the root node**, written as `root(( Label ))` — the word `root` is a required keyword, not part of the label. Only the root line uses this keyword.
- **Every other line is a node**, indented under its parent. **Indentation depth defines tree structure** — a line indented further than the line above it becomes that line's child; a line indented the same or less closes out to the nearest ancestor at that indent level. Use consistent indentation (2 spaces per level is simplest).
- **One node per line.** No inline children, no commas — structure comes entirely from indentation.

## Node shapes

The root is always a circle. For any other node, wrap the label in delimiters to pick a shape — or leave it bare for the default:

| Syntax | Shape |
|---|---|
| `Label` | default (plain box) |
| `(Label)` | rounded rectangle |
| `[Label]` | square/sharp rectangle |
| `((Label))` | circle/ellipse |

Shape is purely visual — it does not affect tree structure. Pick shapes to group related ideas (e.g. circles for phases, squares for concrete deliverables) or skip them entirely and use bare labels throughout.

## Node colors

Add up to two trailing `{...}` markers after the label (outside any shape delimiters): the first sets background (fill), the second sets border color. Both are a Coder-specific extension, not part of real mermaid syntax.

```
mindmap
  root((Q3 Marketing Plan)) {#0d47a1} {#ffffff}
    Content
      Blog series
    Paid {#00ff33}
      [Search ads] {#f43f5e} {#f43f5e}
    Events {cornflowerblue}
```

- Accepts a hex code (`{#0f3}`, `{#00ff33}`, or 8-digit with alpha `{#00ff33ff}`) or any standard CSS color name (`{red}`, `{cornflowerblue}`, etc.).
- Goes after the closing shape delimiter, e.g. `(Label) {red}`, not inside it (`(Label {red})` is wrong — it becomes part of the label text).
- **The root node's markers set the whole mindmap's defaults.** `root((Label)) {fill} {border}` makes every other node use that fill and that border unless it overrides them itself:
  - A node with **no** `{...}` marker at all → uses the root's fill and the root's border.
  - A node with **only a fill** marker (one `{...}` block) → uses its own fill, but still the root's border (not an auto-shade of its own fill).
  - A node with **both** markers → uses exactly what it wrote, fully opted out of the root defaults. Write the same color in both slots (e.g. `{#f43f5e} {#f43f5e}`) for a border that matches that node's own fill.
- If the mindmap has no root color markers at all, nodes with only a fill marker get an automatically darkened shade of their own fill as the border (no root default to fall back to).
- Text color inside a colored node is chosen automatically (black or white, whichever is legible) based on the fill's brightness — never set text color directly, there's no syntax for it.
- Optional — a node with no `{...}` marker uses the default theme color and theme text color.
- An invalid value (`{#zz0000}`, `{notacolor}`) is a parse error, same as any other malformed line.

## What NOT to do

- Don't add mermaid syntax beyond this subset (no `%%` comments, no `class`/`style` directives, no icons via `::icon()`) — the parser only understands the grammar above plus the `{...}` color markers, and will report a line-numbered error for anything else.
- Don't nest shape delimiters or split a label across multiple lines.
- Don't reuse `root` as a keyword anywhere except the second line.
- Don't add a 3rd `{...}` block — only fill and border are recognized; anything past the second block is treated as part of the label text.
- Keep labels short (a few words) — long labels widen nodes but the layout doesn't wrap text.

## Example: writing one from scratch

Given a goal like "outline a Q3 marketing plan," produce:

```
mindmap
  root((Q3 Marketing Plan)) {#0d47a1} {#ffffff}
    Content
      Blog series
      Case studies
    Paid {#f59e0b}
      [Search ads]
      [Social ads]
    Events {#10b981} {#10b981}
      (Webinar)
      (Conference booth)
```

Here `Content` and `Paid`'s children inherit the root's navy fill and white border; `Paid` itself overrides just the fill (amber) but keeps the white border; `Events` opts out of the border default entirely with a matching green border.

Save it as `<name>.mindmap.md` anywhere in the project. The user can open the canvas immediately — no build step, no extra configuration.
