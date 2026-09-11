# WCAG 2.1 AA Audit Checklist

Use this when reviewing existing UI for accessibility issues. Work through each section systematically.

**Legend:** 🔴 Failure | 🟡 Needs review | ✅ Pass

---

## 1. Perceivable

### 1.1 Text Alternatives
- [ ] All `<img>` have `alt` attribute
- [ ] Informative images: `alt` describes the purpose/content
- [ ] Decorative images: `alt=""` (empty, not missing)
- [ ] Complex images (charts, diagrams): extended description via `longdesc`, `aria-describedby`, or visible caption
- [ ] Icon-only buttons: `aria-label` on button, `aria-hidden="true"` on SVG/icon
- [ ] Background images that convey info: text equivalent exists in DOM
- [ ] Video: captions available, transcript linked
- [ ] Audio: transcript available
- [ ] CAPTCHA: audio alternative exists

### 1.2 Time-based Media
- [ ] Pre-recorded video: closed captions available (not auto-generated only)
- [ ] Pre-recorded audio: text transcript available
- [ ] Live video: real-time captions (Level AA)
- [ ] No content auto-plays for more than 3 seconds OR stop/pause/mute control exists

### 1.3 Adaptable
- [ ] Information is not conveyed by visual formatting alone (color, shape, position)
- [ ] Reading/navigation order makes sense when CSS is disabled
- [ ] Page makes sense with CSS off (no content disappears that's essential)
- [ ] Orientation not locked to portrait or landscape (unless essential)
- [ ] `autocomplete` attributes on personal data inputs (name, email, address, phone, CC)

### 1.4 Distinguishable
- [ ] Color is not the only way to distinguish elements or convey info
- [ ] Normal text contrast ≥ 4.5:1
- [ ] Large text contrast ≥ 3:1 (≥18pt or ≥14pt bold)
- [ ] UI components (inputs, buttons) and meaningful icons: ≥ 3:1 contrast against background
- [ ] Focus indicator has ≥ 3:1 contrast against adjacent colors
- [ ] Text can be resized to 200% without loss of content or functionality
- [ ] No loss of content when page zoomed to 400% (horizontal scroll allowed only for maps/complex content)
- [ ] Text spacing overrides (line height 1.5×, letter spacing 0.12em, word spacing 0.16em) don't break layout
- [ ] Content that appears on hover/focus: dismissible (Escape), hoverable (pointer can move to it), persistent (doesn't vanish)
- [ ] Background audio can be turned off, or is ≤ 20dB below foreground

---

## 2. Operable

### 2.1 Keyboard Accessible
- [ ] All functionality operable via keyboard
- [ ] No keyboard traps (user can always navigate away)
- [ ] Keyboard shortcuts (if present) can be turned off or remapped, or only activate on focus
- [ ] Custom widgets: correct keyboard interactions implemented (see component-patterns.md)

### 2.2 Enough Time
- [ ] Session timeouts: user warned with ≥ 20 seconds to extend, OR timeout is ≥ 20 hours, OR data is preserved
- [ ] Moving/blinking content that lasts > 5 seconds: user can pause/stop/hide
- [ ] Auto-updating content: user can pause/stop/control frequency
- [ ] No timing constraints on form completion (unless essential)

### 2.3 Seizures and Physical Reactions
- [ ] No content flashes more than 3 times per second
- [ ] Animations respect `prefers-reduced-motion: reduce`
- [ ] Large areas of flashing are avoided (< 25% of screen)

### 2.4 Navigable
- [ ] Skip navigation link present and works (first focusable element on the page)
- [ ] Page has a descriptive `<title>` (format: "Page Name - Site Name")
- [ ] Focus order is logical (matches visual/reading order)
- [ ] Focus never goes to invisible or off-screen element without intent
- [ ] `:focus-visible` styles are present and visible (not `outline: none`)
- [ ] Link purpose is clear from link text alone (avoid "click here", "read more", "learn more")
- [ ] Multiple ways to navigate site (nav + search, OR nav + sitemap)
- [ ] Section headings present and describe content
- [ ] Location within site is indicated (breadcrumbs, active nav state)

### 2.5 Input Modalities
- [ ] All functionality works with single pointer (no multi-pointer-only gestures without alternative)
- [ ] Pointer gestures have keyboard/single-tap equivalent
- [ ] Actions don't trigger on pointer down (use `click`, not `mousedown`)
- [ ] Accidental activation can be undone or aborted (up event, not down event)
- [ ] Touch targets ≥ 44×44px
- [ ] No motion-based input without alternative (don't require device shake, tilt, etc.)
- [ ] Labels for inputs match their accessible name (for voice control users)

---

## 3. Understandable

### 3.1 Readable
- [ ] `<html lang="...">` attribute present and correct
- [ ] Language changes within page marked with `lang` attribute (e.g., `<span lang="fr">`)
- [ ] Unusual words/jargon: defined inline, in glossary, or via `<abbr title>`
- [ ] Abbreviations expanded on first use (`<abbr title="Web Content Accessibility Guidelines">WCAG</abbr>`)
- [ ] Reading level of content is appropriate (aim for clear, plain language)

### 3.2 Predictable
- [ ] Changing focus doesn't trigger unexpected context changes
- [ ] Changing input value doesn't trigger navigation (e.g., selecting from a dropdown shouldn't auto-navigate)
- [ ] Navigation components appear in same location across pages
- [ ] Components with same function have same accessible name across pages
- [ ] Requested changes are preceded by warning (destructive actions)

### 3.3 Input Assistance
- [ ] Form errors identified in text (not just color or icon)
- [ ] Error messages tell user what went wrong AND how to fix it
- [ ] Error messages associated with their field (`aria-describedby` or `aria-errormessage`)
- [ ] Required fields marked with text or aria (`aria-required="true"`)
- [ ] Form labels or instructions visible before submission (not just on error)
- [ ] Suggested input format shown for dates, phone numbers, etc.
- [ ] Important submissions: reversible (undo), checked (review step), or confirmed (are you sure?)

---

## 4. Robust

### 4.1 Compatible
- [ ] No duplicate `id` attributes on the page
- [ ] All HTML elements properly nested (no invalid nesting like `<p>` inside `<span>`)
- [ ] All HTML elements have complete start and end tags
- [ ] ARIA used correctly (roles, states, properties match ARIA spec)
- [ ] Custom components communicate name, role, and value to assistive tech
- [ ] Status messages announced without requiring focus (using `role="status"`, `role="alert"`, or `aria-live`)
- [ ] Page works without JavaScript (or graceful fallback exists)
- [ ] No reliance on CSS pseudo-content for meaningful information

---

## Quick Wins (High Impact, Easy Fixes)

When you need to improve a11y quickly, start here:

1. **Add missing `alt` attributes** — instant screen reader fix
2. **Fix color contrast** — affects all low-vision users
3. **Remove `outline: none` from focus styles** — fixes keyboard navigation
4. **Add `<label>` to all form inputs** — fixes form usability
5. **Add `aria-label` to icon buttons** — fixes unlabeled controls
6. **Add `lang` to `<html>`** — screen readers use correct pronunciation
7. **Add skip link** — saves keyboard users from tabbing through nav every page
8. **Fix link text** — replace "click here" with descriptive text
9. **Add `aria-live` to dynamic content** — screen readers announce updates
10. **Test with keyboard only** — reveals the most critical failures

---

## Testing Tools

- **Browser**: Chrome DevTools Accessibility panel, Firefox Accessibility Inspector
- **Automated**: axe DevTools (browser extension), Lighthouse accessibility audit
- **Contrast**: WebAIM Contrast Checker, Colour Contrast Analyser (desktop app)
- **Screen readers**: NVDA + Firefox (Windows, free), VoiceOver + Safari (Mac/iOS, built-in), TalkBack (Android, built-in)
- **Keyboard**: unplug mouse entirely and use Tab, Shift+Tab, Enter, Space, Arrows, Escape
- **Zoom**: test at 200% and 400% browser zoom
