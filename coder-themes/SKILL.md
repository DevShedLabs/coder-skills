---
name: coder-themes
description: "Coder app only: create or fix a custom color theme for the Coder editor (the Coder desktop IDE) from a described color preference. Writes ~/.coder/themes/<id>/ui.css (app chrome) and editor.json (code syntax colors + terminal colors). Use only when the user asks for a Coder theme, Coder editor colors, or a fix for a Coder custom theme's health-check warnings. Do NOT use for theming a website, web app, VS Code, a terminal emulator, or any other project."
---

# Coder custom themes

Turn a described color preference ("dark, warm, low contrast like old Sublime", "solarized but softer") into a custom theme for **Coder**. Themes live in `~/.coder/themes/<id>/` (`~/.coder-dev/themes/` when running a dev build). The folder name **is** the theme id. Both files are optional, but make both unless asked otherwise.

```
~/.coder/themes/<id>/
  ui.css        app chrome: sidebar, panels, menus, title bar
  editor.json   code syntax colors, editor chrome, and terminal colors
```

The UI theme and editor theme are picked separately in Settings → General (both dropdowns have a **Custom** group). Coder rescans when Settings opens, so no restart is needed.

## Workflow

1. **Pin down the look.** If the request is vague, ask one question at most: dark or light, and one or two hue words (warm/cool, neon/muted). Otherwise decide and go. Name a seed palette in one line so the user can correct it.
2. **Define roles first, then fill files.** Pick 12 colors: `bg`, `surface`, `overlay`, `text`, plus `keyword`, `string`, `number`, `type`, `class`, `function`, `comment`, `red`, `delimiter`. Every file below reuses these, which is what keeps a theme coherent.
3. **Write `ui.css`, then `editor.json`.** Folder id: lowercase kebab-case, not the same as a built-in (`coder-dark`, `coder-light`, `coder-macchiato`, `coder-frappe`, `coder-charcoal-*`, `coder-cappuccino-*`).
4. **Check contrast** (rules below), then tell the user to open Settings → General and pick it. The **health check** under the Editor theme dropdown lists anything missing. If it reports issues, fix them and ask them to reopen Settings.
5. If you can't write under `~/.coder`, show the file contents and say where each goes.

## ui.css

Plain `--var: value;` declarations (optionally inside `:root { }`). **All 15 are required** or the whole UI theme is skipped. Also set `--terminal-bg` to the same value as `terminal_theme.background` (optional: if omitted it defaults to `--bg-surface`, which may not match the terminal palette).

```css
:root {
  --bg-base: #1e1e2e;      /* main background */
  --bg-surface: #181825;   /* sidebar, panels (slightly off from base) */
  --bg-overlay: #313244;   /* inputs, cards, raised surfaces */
  --bg-hover: #45475a;     /* hover background */
  --border: #262637;
  --text-primary: #cdd6f4;
  --text-secondary: #a6adc8;
  --text-muted: #898b98;   /* placeholders; keep >= 4.5:1 on --bg-base */
  --accent: #89b4fa;       /* links, active states, primary buttons */
  --accent-dim: #1e3a5f;   /* accent at low emphasis, e.g. selected row bg */
  --green: #a6e3a1;        /* success / added */
  --red: #f38ba8;          /* error / removed */
  --dark-red: #bb1041;     /* destructive-action emphasis */
  --yellow: #f9e2af;       /* warning */
  --mauve: #cba6f7;        /* secondary accent */
  --terminal-bg: #181825;
}
```

Surfaces step in one direction: in a dark theme `--bg-surface` is darker than `--bg-base`, then overlay and hover get lighter. In a light theme, the reverse.

## editor.json

A Monaco theme object plus a `terminal_theme`. Required top level: `"base"` (`"vs-dark"` or `"vs"`), `"inherit": true`, `"semanticHighlighting": true`, `"terminal_theme"`, `"rules"`, `"colors"`.

**Why so many rules:** with `inherit: true`, any token you don't color falls back to Monaco's stock VS Code color (HTML tags and JSON keys turn VS Code blue/orange, off your palette). Cover every scope below. Each line is `{ "token": "<scope>", "foreground": "rrggbb" }` (no `#`; add `"fontStyle": "italic"` where noted).

| Role color | Scopes to give it |
|---|---|
| comment (italic) | `comment`, `comment.doc` |
| keyword | `keyword`, `keyword.flow`, `keyword.flow.scss`, `keyword.json` |
| string | `string`, `string.html`, `string.yaml`, `string.sql`, `string.value.json`, `attribute.value`, `attribute.value.html`, `attribute.value.xml`, `metatag.content.html` |
| number | `number`, `number.hex`, `constant`, `annotation`, `enumMember`, `attribute.value.number`, `attribute.value.number.css`, `attribute.value.unit`, `attribute.value.unit.css`, `attribute.value.hex.css` |
| type | `type`, `type.identifier`, `interface`, `typeParameter`, `property`, `key`, `string.key.json` |
| class | `class`, `enum`, `namespace`, `attribute.name`, `tag.id.pug`, `tag.class.pug`, `meta.scss` |
| function | `function`, `function-call`, `member`, `predefined`, `predefined.sql`, `tag`, `meta.tag` |
| variable (text) | `variable`, `identifier` |
| variable (italic) | `parameter`, `variable.parameter` |
| operator | `operator`, `operator.scss`, `operator.sql`, `operator.swift` |
| delimiter | `delimiter`, `delimiter.html`, `delimiter.xml` |
| escape / teal | `regexp` |
| red | `invalid`, `variable.predefined` |
| meta (yellow) | `metatag`, `metatag.html`, `metatag.xml` |

Optional PHP polish (generic rules already cover PHP): `variable.php` in a pinkish/red role color so `$vars` stand apart, `variable.predefined.php` red + bold, `function-call.php` function color, `string.escape.php` escape color.

`colors` must include (hex with `#`): `editor.background`, `editor.foreground`, `editorLineNumber.foreground`, `editorLineNumber.activeForeground`, `editor.selectionBackground`, `editor.inactiveSelectionBackground`, `editorCursor.foreground`, `editor.lineHighlightBackground`, `editorIndentGuide.background1`, `editorIndentGuide.activeBackground1`, `editorBracketMatch.background`, `editorBracketMatch.border`, `scrollbarSlider.background`, `scrollbarSlider.hoverBackground` (use an 8-digit hex with alpha like `#31324488` for the scrollbars). Match `editor.background` to `--bg-base`.

### terminal_theme

The integrated terminal follows the editor theme. All 18 keys, hex with `#` (`cursor` optional):

```json
"terminal_theme": {
  "background": "#1e1e2e", "foreground": "#cdd6f4", "cursor": "#f5c2e7",
  "black": "#45475a", "red": "#c44554", "green": "#a6e3a1", "yellow": "#f9e2af",
  "blue": "#89b4fa", "magenta": "#cba6f7", "cyan": "#94e2d5", "white": "#f0f0f5",
  "brightBlack": "#585b70", "brightRed": "#c26f86", "brightGreen": "#a6e3a1", "brightYellow": "#f9e2af",
  "brightBlue": "#89b4fa", "brightMagenta": "#f5c2e7", "brightCyan": "#94e2d5", "brightWhite": "#ffffff"
}
```

**Error banners:** composer, phpunit and npm print errors as ANSI white on red (`white` on `red`, `brightWhite` on `brightRed`). Pastel reds with grey text are unreadable. Keep `white`/`brightWhite` near white and make `red`/`brightRed` mid-dark enough for **3:1 or better** against them, while still readable as red text on `background`. In light themes `white` is a near-white too, even though that is faint as plain text.

## Contrast rules

- Body text (`editor.foreground`, `--text-primary`) vs its background: 7:1 or better.
- Every syntax color vs `editor.background`: 3:1 or better. Comments may be dimmer but not below 2.5:1.
- `--text-muted` vs `--bg-base`: 4.5:1.
- The health check warns below 2:1 (nearly invisible) and below 3:1 for banners. Aim higher.

Compute ratios rather than guessing: relative luminance per WCAG, `(L1 + 0.05) / (L2 + 0.05)`.

## Finishing

Summarize in a few lines: the id, the seed palette (role → hex), and the steps (open Settings → General, pick it under **Custom** in both dropdowns). If the health check shows warnings, fix them rather than explaining them away.
