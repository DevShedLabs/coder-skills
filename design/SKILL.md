---
name: design
description: Use this skill whenever you are building, reviewing, or extending any website, landing page, or web UI — regardless of the CSS framework (Bootstrap, Tailwind, plain CSS, CSS Modules, etc.), the requested style, or the framework.
---

# Build a Website Well

> A framework-agnostic design process and pattern guide. The **patterns and rules below apply to every site**; the **visual theme is a decision you make with the user**, not something this skill prescribes. Ask the user (or infer from the brief) what theme they want, then apply it on top of these patterns.

## Process

1. **Clarify the theme first.** Confirm palette, typography, overall feel (minimal, playful, corporate, editorial…), and surface/motion preference. If the brief implies one, state your interpretation and proceed.
2. **Define design tokens** as CSS variables at `:root` (colors, spacing scale, fonts, radius, shadows, motion) — this is what makes a theme swappable.
3. **Build structure with semantic HTML**, then style it through the tokens.
4. **Add responsive behavior** (mobile-first).
5. **Run the a11y, SEO, and quality gates** below before calling it done.

## Rules (apply to every site)

- Use **CSS variables** for colors, spacing, and typography. No magic numbers scattered in rules.
- Use **`rem`** for font sizes and spacing; reserve `em` for things scaling with their own font size.
- **Reuse utility classes** where possible; write a **custom class only when** a utility won't express it clearly.
- Use **semantic HTML** (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) with headings in order.
- **Don't** overuse `clamp()` — only where fluid scaling genuinely helps (e.g. hero type).
- **Don't** use inline styles.
- **Don't** invent a naming convention; follow the framework/team one consistently.
- **Be stacking-aware.** Blurred/floating/overlapping surfaces need correct `z-index` and `position`; document the order for nav, modals, overlays.
- **Support theming** — provide light + dark color sets via CSS variables so swapping is trivial.

## The theme layer (configurable, not prescribed)

Decisions you make with the user and encode once in the tokens:

- **Color palette** — primary, secondary, accents, backgrounds, text. Contrast-first so text passes WCAG AA.
- **Typography** — a heading face and body face with a clear scale and hierarchy.
- **Surface treatment** — flat, bordered, elevated shadows, or frosted-glass (`backdrop-filter` + translucent bg); pick one, apply consistently.
- **Motion** — hover states, transitions, scroll animations, parallax; subtle, honoring `prefers-reduced-motion`.
- **Mood/vibe** — described in words (e.g. "trustworthy B2B", "playful SaaS", "editorial/minimal"), then reflected in palette, type, copy.

## Standard page anatomy

A starting point, not a mandate — reorder or drop sections to fit the goal. Single-column scrolling by default; no sidebars unless the design calls for them; sections stack with clear separation and each needs a visual anchor (heading or icon).

1. **Nav** — logo/wordmark, links (mobile menu), primary CTA.
2. **Hero** — headline, subheadline, primary CTA, supporting visual. Above the fold.
3. **Social proof** — logos, testimonials, or a stat bar.
4. **Features / value** — 3–6 blocks with icon, title, short description.
5. **Process** — numbered steps or a flow.
6. **Conversion** — pricing tiers, a form, or a standalone CTA block.
7. **Footer** — links, legal, copyright.

## Reusable component patterns

Build small, consistent components and reuse: **Button/CTA** (primary, secondary, disabled, sizes), **Card** (consistent padding/radius/surface; for features, pricing, testimonials), **Nav** (sticky, mobile collapse, active states, accessible toggle), **Hero**, **Section header** (eyebrow + heading + supporting copy), **Form** (labeled inputs, focus states, error/success messaging), **Modal/dialog** (focus trap, ESC to close, accessible label), **Back-to-top/scroll progress** (optional, unobtrusive).

## Accessibility (WCAG 2.1 AA)

Text-to-background contrast ≥ 4.5:1 (3:1 for large text) · keyboard-navigable with visible focus states · `<label>` on every input with clear errors · modals: focus management + dialog semantics · images: meaningful `alt`, decorative `alt=""`/`aria-hidden` · motion honors `prefers-reduced-motion`, no flashing · touch targets ≥ 44×44px where practical.

## SEO

One `<h1>` describing the page · unique `<title>` + meta description per page · semantic landmarks/heading hierarchy · descriptive link text (no "click here") · meaningful `alt` + lazy-load below-the-fold media · fast initial render (minimal blocking CSS/JS).

## Quality gate

Before done, confirm: theme encoded via CSS variables (light + dark) · no inline styles or hard-coded values outside tokens · responsive on mobile/tablet/desktop · a11y + SEO pass · stacking order verified · matches the project's naming convention/framework usage.
