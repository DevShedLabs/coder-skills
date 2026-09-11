---
name: accessibility
description: "Apply WCAG 2.1 AA accessibility best practices to frontend code. Use this skill whenever the user is building, reviewing, or fixing any HTML, CSS, React, or web UI — even if they don't explicitly mention accessibility. Triggers include: building a UI component, form, navigation, modal, button, table, card, or any interactive element; requests to make it accessible, add ARIA, fix a11y, or audit this UI; mentions of screen readers, keyboard navigation, color contrast, or focus management. Also trigger for ANY frontend code review task — always check accessibility proactively. Do NOT skip this skill just because the user didn't explicitly ask for it; most frontend work has accessibility implications."
---

# Accessibility Best Practices Skill

Apply this skill to produce frontend code that is genuinely accessible — not just technically compliant, but usable by people with disabilities in real conditions. Target **WCAG 2.1 Level AA** as the baseline.

## How to Use This Skill

1. **For new UI builds**: Apply the relevant sections below as you write code. Don't bolt it on at the end.
2. **For audits / reviews**: Work through the checklist in `references/audit-checklist.md`.
3. **For specific components**: Jump directly to the relevant section in `references/component-patterns.md`.
4. **For color work**: Use the contrast rules and tools in `references/color-contrast.md`.

---

## The Five Pillars (POUR)

Every accessible interface is:
- **Perceivable** — Information can be seen, heard, or felt
- **Operable** — All functionality works via keyboard and assistive tech
- **Understandable** — Content and UI behavior are predictable and clear
- **Robust** — Works across browsers, devices, and assistive technologies

---

## Critical Rules (Always Apply)

These are non-negotiable. Apply them to every piece of frontend output.

### 1. Semantic HTML First

Use the right element for the job. ARIA can't fix wrong semantics.

```html
<!-- ❌ Wrong -->
<div onclick="submit()">Submit</div>
<span class="heading">Page Title</span>

<!-- ✅ Right -->
<button type="submit">Submit</button>
<h1>Page Title</h1>
```

**Element selection guide:**
- Actions → `<button>` (not `<div>`, not `<a>` without href)
- Navigation → `<a href="...">` (not `<button>`)
- Page structure → `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`, `<section>`
- Lists → `<ul>/<ol>/<li>` (not styled `<div>`s)
- Data → `<table>` with `<th scope>`, `<caption>` (not layout grids)
- Forms → `<label>` + `<input>` pairs, always

### 2. Keyboard Navigation

Every interactive element must be reachable and operable via keyboard alone.

```css
/* NEVER do this — it kills keyboard visibility */
:focus { outline: none; }
*:focus { outline: 0; }

/* ✅ Custom focus that's still visible */
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
  border-radius: 2px;
}
```

**Tab order rules:**
- Logical DOM order = logical tab order (don't rely on `tabindex` to fix bad DOM)
- `tabindex="0"` → makes custom elements focusable (use sparingly)
- `tabindex="-1"` → focusable via JS only (good for modals, tooltips)
- `tabindex="1+"` → almost always wrong, avoid it

**Keyboard interactions for custom components:**
- Buttons → `Enter` and `Space` activate
- Links → `Enter` activates
- Dropdowns/menus → `Arrow` keys navigate, `Escape` closes
- Modals → `Escape` closes, focus trapped inside while open
- Sliders → `Arrow` keys change value

### 3. Color Contrast

Minimum ratios for WCAG 2.1 AA:
- **Normal text** (< 18pt / < 14pt bold): **4.5:1**
- **Large text** (≥ 18pt / ≥ 14pt bold): **3:1**
- **UI components & icons**: **3:1** against adjacent color
- **Decorative elements**: no requirement

**Never convey information by color alone.** Always add a second signal (icon, pattern, label, text).

```html
<!-- ❌ Color only -->
<span style="color: red">Error</span>

<!-- ✅ Color + icon + text -->
<span class="error">
  <svg aria-hidden="true"><!-- error icon --></svg>
  Error: Email is required
</span>
```

### 4. Images and Media

```html
<!-- Informative image -->
<img src="chart.png" alt="Bar chart showing Q3 revenue up 42% YoY">

<!-- Decorative image (hidden from screen readers) -->
<img src="divider.svg" alt="" role="presentation">

<!-- Icon button — label the button, not the icon -->
<button aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false">...</svg>
</button>

<!-- Complex image (chart, diagram) -->
<figure>
  <img src="flowchart.png" alt="Onboarding flow: sign up, verify email, complete profile">
  <figcaption>User onboarding steps</figcaption>
</figure>
```

**Video/Audio rules:**
- Video: captions required, audio description for visual-only info
- Audio: transcript required
- Auto-play: never auto-play with sound; always provide pause control

### 5. Forms

Forms are the most common accessibility failure point.

```html
<!-- ✅ Fully accessible form field -->
<div class="field">
  <label for="email">
    Email address
    <span aria-hidden="true" class="required">*</span>
  </label>
  <input
    id="email"
    type="email"
    name="email"
    autocomplete="email"
    aria-required="true"
    aria-describedby="email-hint email-error"
  >
  <span id="email-hint" class="hint">We'll never share your email.</span>
  <span id="email-error" class="error" role="alert" aria-live="polite"></span>
</div>
```

**Form rules:**
- Every `<input>`, `<select>`, `<textarea>` has a `<label>` (not just placeholder)
- Required fields: `aria-required="true"` + visible indicator
- Error messages: associated via `aria-describedby`, announced via `role="alert"` or `aria-live`
- Group related fields: `<fieldset>` + `<legend>` (especially radio/checkbox groups)
- `autocomplete` attributes for personal data (name, email, address, etc.)
- Don't clear fields on error — preserve user input

---

## ARIA — Use With Care

**The first rule of ARIA: don't use ARIA if native HTML does the job.**

ARIA augments semantics; it doesn't fix broken HTML. When you must use it:

```html
<!-- Roles -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">

<!-- States -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<input aria-invalid="true" aria-errormessage="field-error">

<!-- Live regions (for dynamic content) -->
<div aria-live="polite">  <!-- non-urgent updates -->
<div aria-live="assertive">  <!-- urgent alerts only -->
<div role="status">  <!-- status messages -->
<div role="alert">   <!-- errors/warnings -->
```

**Common ARIA mistakes to avoid:**
- `aria-label` on non-interactive elements (use visible text instead)
- Redundant ARIA (e.g., `<button role="button">`)
- `aria-hidden="true"` on focusable elements
- Missing `aria-expanded` on toggles
- Forgetting to update ARIA states when UI changes (use JS)

---

## Focus Management

Critical for SPAs, modals, and dynamic content.

```javascript
// After opening a modal — move focus to first focusable element or the dialog itself
dialog.setAttribute('aria-hidden', 'false');
dialog.removeAttribute('hidden');
const firstFocusable = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
firstFocusable?.focus();

// After closing a modal — return focus to the trigger
closeButton.addEventListener('click', () => {
  dialog.setAttribute('aria-hidden', 'true');
  triggerButton.focus(); // Return to where user was
});

// Focus trap for modals
function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}
```

---

## Page Structure

```html
<body>
  <!-- Skip link — FIRST element in body -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header>
    <nav aria-label="Primary">
      <!-- main navigation -->
    </nav>
  </header>

  <main id="main-content" tabindex="-1">
    <h1>Page Title</h1>
    <!-- content -->
  </main>

  <nav aria-label="Breadcrumb">...</nav>
  <aside aria-label="Related content">...</aside>
  <footer>...</footer>
</body>
```

```css
/* Skip link — visible only on focus */
.skip-link {
  position: absolute;
  transform: translateY(-100%);
  transition: transform 0.2s;
}
.skip-link:focus {
  transform: translateY(0);
}
```

**Heading hierarchy rules:**
- One `<h1>` per page (the page title)
- Don't skip levels (h1 → h2 → h3, never h1 → h3)
- Headings describe content, not just visual size — use CSS for sizing

---

## Motion and Animation

```css
/* Always wrap animations in this media query */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Rules:
- No content that flashes more than 3 times per second (seizure risk)
- Parallax, auto-scroll, or large motion effects: disable when `prefers-reduced-motion: reduce`
- Animation that conveys state change → also communicate via text/ARIA

---

## Responsive and Touch

- Touch targets: minimum **44×44px** (WCAG 2.5.5) — use padding, not just icon size
- Don't rely on hover-only interactions (use click/tap as primary)
- Pinch-to-zoom: never disable (`user-scalable=no` is harmful)
- Content reflows at 400% zoom without horizontal scrolling (WCAG 1.4.10)

---

## Reference Files

For deeper detail, see:
- **`references/component-patterns.md`** — Accessible patterns for: modals, tabs, accordions, dropdowns, tooltips, carousels, data tables, toast notifications
- **`references/audit-checklist.md`** — Full WCAG 2.1 AA checklist for auditing existing UIs
- **`references/color-contrast.md`** — Contrast ratios, tools, and palette design guidance

---

## Quick Self-Check Before Shipping

Before finalizing any frontend output, verify:

- [ ] Semantic HTML used throughout (no div-soup for interactive elements)
- [ ] Every `<img>` has meaningful `alt` or `alt=""`
- [ ] Every form input has a visible, associated `<label>`
- [ ] `:focus-visible` styles are visible and not removed
- [ ] Color is not the only way information is conveyed
- [ ] Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large/UI)
- [ ] `prefers-reduced-motion` respected
- [ ] Skip link present on full pages
- [ ] Heading hierarchy is logical (one h1, no skipped levels)
- [ ] Interactive custom components have keyboard support and ARIA states
- [ ] Dynamic content changes announced via `aria-live` or `role="alert"`
