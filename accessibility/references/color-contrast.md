# Color Contrast & Accessible Color Design

## WCAG 2.1 Contrast Requirements

| Text Type | Minimum (AA) | Enhanced (AAA) |
|---|---|---|
| Normal text (< 18pt or < 14pt bold) | 4.5:1 | 7:1 |
| Large text (≥ 18pt or ≥ 14pt bold) | 3:1 | 4.5:1 |
| UI components (inputs, buttons borders) | 3:1 | — |
| Meaningful icons / graphics | 3:1 | — |
| Decorative elements | None | — |
| Disabled elements | None | — |
| Logotypes | None | — |

**18pt = 24px. 14pt bold = ~18.67px bold.**

---

## How Contrast Ratio Works

Contrast ratio = (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color's relative luminance and L2 is the darker.

- White on white = 1:1
- Black on white = 21:1 (maximum)

You don't need to calculate manually — use tools below.

---

## Contrast Checking Tools

**Quick online:**
- https://webaim.org/resources/contrastchecker/
- https://www.siegemedia.com/contrast-ratio

**Design tools:**
- Figma: A11y Annotation Kit plugin, Able plugin
- Sketch: Stark plugin
- Adobe XD: Stark plugin

**Development:**
- Chrome DevTools: Elements panel → color swatch shows contrast ratio
- axe DevTools browser extension: flags contrast failures automatically
- Storybook a11y addon

---

## Building Accessible Color Systems

### Strategy 1: Start with Contrast

Pick your background first, then find text colors that meet 4.5:1.

```css
:root {
  /* Backgrounds */
  --color-bg: #ffffff;
  --color-bg-subtle: #f4f4f5;
  --color-bg-emphasis: #18181b;

  /* Text on white bg — all ≥ 4.5:1 */
  --color-text-primary: #18181b;   /* 19.1:1 */
  --color-text-secondary: #52525b; /* 7.4:1 */
  --color-text-tertiary: #71717a;  /* 4.6:1 ✓ AA, barely */
  --color-text-disabled: #a1a1aa;  /* 2.3:1 — ok for disabled only */

  /* Accent / brand */
  --color-primary: #2563eb;        /* 4.5:1 on white ✓ */
  --color-primary-dark: #1d4ed8;   /* 6.9:1 on white ✓ */
  --color-primary-text: #ffffff;   /* 4.5:1 on --color-primary ✓ */
}
```

### Strategy 2: Test Dark Mode Separately

Dark mode contrast failures are extremely common. Test both themes.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #09090b;
    --color-text-primary: #fafafa;    /* 19.9:1 ✓ */
    --color-text-secondary: #a1a1aa;  /* 6.1:1 ✓ */
    /* Don't just invert — recalculate all ratios */
  }
}
```

### Strategy 3: Semantic Color Roles

Name colors by their role, not their hue. Keeps accessibility intentional.

```css
:root {
  /* Semantic status colors — all must meet 4.5:1 on white bg */
  --color-success: #16a34a;  /* green — 4.5:1 ✓ */
  --color-warning: #d97706;  /* amber — 4.5:1 ✓ */
  --color-error: #dc2626;    /* red — 4.5:1 ✓ */
  --color-info: #2563eb;     /* blue — 4.5:1 ✓ */

  /* Never use these as standalone text colors without checking */
  /* Common failures: bright yellow text, light green text */
}
```

---

## Common Contrast Failures to Avoid

❌ **Light gray text on white** — extremely common, almost always fails
```css
color: #999; background: #fff; /* 2.85:1 — FAIL */
color: #767676; background: #fff; /* 4.54:1 — barely passes */
```

❌ **Placeholder text** — browsers render it light by default
```css
::placeholder { color: #999; } /* Fails */
::placeholder { color: #767676; } /* Passes AA */
```

❌ **Colored text on colored background** — always verify, never assume
```css
color: #ff6b6b; background: #fff; /* red — 3.0:1 — FAIL for normal text */
```

❌ **Focus rings on similar-colored backgrounds**
```css
/* Blue focus ring on blue button — invisible */
:focus { outline: 2px solid #2563eb; }
/* Fix: use outline-offset or a contrasting color */
:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

❌ **White text on pastel backgrounds**
```css
color: #fff; background: #fbbf24; /* yellow — 1.83:1 — FAIL */
color: #fff; background: #86efac; /* light green — 1.57:1 — FAIL */
```

---

## Color Independence (Not Just Contrast)

Color alone must never be the only way to convey information. Always pair color with a second signal.

### Status Indicators
```html
<!-- ❌ Color only -->
<span class="dot dot--green"></span> Active
<span class="dot dot--red"></span> Inactive

<!-- ✅ Color + text label -->
<span class="status status--active">
  <span class="dot" aria-hidden="true"></span>
  Active
</span>

<!-- ✅ Color + icon -->
<span class="status status--error">
  <svg aria-hidden="true" class="icon-error"><!-- ! icon --></svg>
  Error
</span>
```

### Charts and Graphs
- Use patterns/textures in addition to color to distinguish data series
- Label data directly when possible (avoid relying on legend + matching colors)
- Tools: Highcharts has built-in pattern fills, D3 can use `<pattern>` SVG fills

### Form Validation
```html
<!-- ❌ Red border only -->
<input class="input--error">

<!-- ✅ Red border + icon + error message -->
<input class="input--error" aria-invalid="true" aria-describedby="email-error">
<div id="email-error" class="error-message">
  <svg aria-hidden="true"><!-- × icon --></svg>
  Enter a valid email address.
</div>
```

### Links in Body Text
Links must be distinguishable from surrounding text by more than color alone (unless contrast ratio between link and text ≥ 3:1).
```css
/* Safe approach */
a { text-decoration: underline; } /* always distinguishable */

/* Alternative: high enough contrast between link and body text */
body { color: #18181b; }
a { color: #2563eb; /* 3.7:1 vs body text — meets the 3:1 threshold */ }
/* Then you can remove underline if desired */
```

---

## High Contrast Mode

Support Windows High Contrast Mode (Forced Colors). Don't fight it.

```css
/* Check if forced colors are active */
@media (forced-colors: active) {
  /* Use system colors where needed */
  .custom-checkbox {
    border: 2px solid ButtonText;
    background: ButtonFace;
  }

  .custom-checkbox:checked {
    background: Highlight;
  }

  /* Never hide focus rings in forced colors */
  :focus-visible {
    outline: 2px solid Highlight;
  }
}
```

**System color keywords for forced-colors mode:**
- `ButtonFace` — button background
- `ButtonText` — button text
- `Highlight` — selected/active
- `HighlightText` — text on highlight
- `Canvas` — page background
- `CanvasText` — page text
- `LinkText` — link color
- `GrayText` — disabled text
