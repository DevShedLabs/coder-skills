# Accessible Component Patterns

Reference patterns for common UI components. Each pattern is keyboard-navigable, screen-reader-friendly, and WCAG 2.1 AA compliant.

---

## Modal / Dialog

```html
<!-- Trigger -->
<button id="open-modal" aria-haspopup="dialog">Open settings</button>

<!-- Dialog -->
<div
  id="settings-modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
  hidden
>
  <h2 id="modal-title">Settings</h2>
  <p id="modal-desc">Adjust your preferences below.</p>

  <!-- content -->

  <button id="close-modal" aria-label="Close settings dialog">×</button>
</div>

<!-- Backdrop -->
<div id="modal-backdrop" aria-hidden="true" hidden></div>
```

```javascript
const modal = document.getElementById('settings-modal');
const trigger = document.getElementById('open-modal');

function openModal() {
  modal.removeAttribute('hidden');
  backdrop.removeAttribute('hidden');
  document.body.setAttribute('aria-hidden', 'true'); // hide background
  modal.setAttribute('aria-hidden', 'false');
  trapFocus(modal);
  modal.querySelector('button, input, [tabindex]').focus();
}

function closeModal() {
  modal.setAttribute('hidden', '');
  backdrop.setAttribute('hidden', '');
  document.body.removeAttribute('aria-hidden');
  trigger.focus(); // return focus to trigger
}

// Close on Escape
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
```

---

## Tabs

```html
<div class="tabs">
  <div role="tablist" aria-label="Account settings">
    <button role="tab" aria-selected="true" aria-controls="panel-profile" id="tab-profile" tabindex="0">
      Profile
    </button>
    <button role="tab" aria-selected="false" aria-controls="panel-security" id="tab-security" tabindex="-1">
      Security
    </button>
    <button role="tab" aria-selected="false" aria-controls="panel-billing" id="tab-billing" tabindex="-1">
      Billing
    </button>
  </div>

  <div role="tabpanel" id="panel-profile" aria-labelledby="tab-profile">
    <h2>Profile settings</h2>
    <!-- content -->
  </div>
  <div role="tabpanel" id="panel-security" aria-labelledby="tab-security" hidden>
    <!-- content -->
  </div>
  <div role="tabpanel" id="panel-billing" aria-labelledby="tab-billing" hidden>
    <!-- content -->
  </div>
</div>
```

```javascript
// Arrow key navigation for tabs
tablist.addEventListener('keydown', (e) => {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const index = tabs.indexOf(document.activeElement);

  let newIndex;
  if (e.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
  if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
  if (e.key === 'Home') newIndex = 0;
  if (e.key === 'End') newIndex = tabs.length - 1;

  if (newIndex !== undefined) {
    e.preventDefault();
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', i === newIndex ? 'true' : 'false');
      t.setAttribute('tabindex', i === newIndex ? '0' : '-1');
    });
    tabs[newIndex].focus();
    // show/hide panels
  }
});
```

---

## Accordion

```html
<div class="accordion">
  <h3>
    <button
      type="button"
      aria-expanded="false"
      aria-controls="section-1-body"
      id="section-1-header"
    >
      What is your return policy?
    </button>
  </h3>
  <div
    id="section-1-body"
    role="region"
    aria-labelledby="section-1-header"
    hidden
  >
    <p>Returns accepted within 30 days...</p>
  </div>
</div>
```

```javascript
button.addEventListener('click', () => {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', !expanded);
  panel.toggleAttribute('hidden');
});
```

---

## Dropdown / Combobox

```html
<!-- Simple select: use native <select> whenever possible -->
<label for="country">Country</label>
<select id="country" name="country" autocomplete="country-name">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<!-- Custom combobox (only when native won't do) -->
<label for="fruit-input">Fruit</label>
<div role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-owns="fruit-list">
  <input
    id="fruit-input"
    type="text"
    autocomplete="off"
    aria-autocomplete="list"
    aria-controls="fruit-list"
    aria-activedescendant=""
  >
</div>
<ul id="fruit-list" role="listbox" aria-label="Fruits" hidden>
  <li role="option" id="opt-apple" aria-selected="false">Apple</li>
  <li role="option" id="opt-banana" aria-selected="false">Banana</li>
</ul>
```

**Keys for custom listbox:** `ArrowDown/Up` navigate, `Enter` selects, `Escape` closes, `Home/End` jump to first/last.

---

## Tooltip

```html
<!-- Prefer title-less approach; use aria-describedby -->
<button
  type="button"
  aria-describedby="tooltip-copy"
  id="copy-btn"
>
  <svg aria-hidden="true"><!-- copy icon --></svg>
  <span class="sr-only">Copy to clipboard</span>
</button>

<div role="tooltip" id="tooltip-copy" hidden>
  Copied!
</div>
```

```css
/* Visually hidden but screen-reader accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Rules:**
- Tooltips must be dismissible (Escape key)
- Tooltip content must be readable (not just on hover — also on focus)
- Don't put essential information only in tooltips

---

## Navigation Menu (Megamenu / Dropdown Nav)

```html
<nav aria-label="Primary">
  <ul role="list">
    <li>
      <button
        aria-expanded="false"
        aria-controls="products-submenu"
        aria-haspopup="true"
      >
        Products
      </button>
      <ul id="products-submenu" role="list" hidden>
        <li><a href="/widget">Widget</a></li>
        <li><a href="/gadget">Gadget</a></li>
      </ul>
    </li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

**Keys:** `Enter/Space` opens submenu, `Escape` closes & returns focus to trigger, `Arrow` keys navigate within submenu.

---

## Data Table

```html
<table>
  <caption>Q3 Sales by Region</caption>
  <thead>
    <tr>
      <th scope="col">Region</th>
      <th scope="col">Revenue</th>
      <th scope="col">
        <!-- Sortable column -->
        <button aria-sort="ascending">Units Sold</button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">North America</th>
      <td>$4.2M</td>
      <td>12,400</td>
    </tr>
    <!-- more rows -->
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>$11.8M</td>
      <td>34,200</td>
    </tr>
  </tfoot>
</table>
```

- `scope="col"` on column headers, `scope="row"` on row headers
- `<caption>` always — it's the table's accessible name
- For complex tables with multiple header levels, use `id` + `headers` attributes
- Sortable columns: `aria-sort="ascending|descending|none"` on the `<th>`

---

## Toast / Notification

```html
<!-- Container — always present in DOM, announced when content changes -->
<div
  id="toast-container"
  aria-live="polite"
  aria-atomic="true"
  class="toast-container"
>
  <!-- Toasts injected here by JS -->
</div>
```

```javascript
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <svg aria-hidden="true"><!-- icon --></svg>
    <span>${message}</span>
    <button aria-label="Dismiss notification">×</button>
  `;
  container.appendChild(toast);

  // Auto-dismiss after 5s, but keep for screen readers long enough to read
  setTimeout(() => toast.remove(), 5000);
}
```

**Rules:**
- Success/info: `aria-live="polite"` (waits for user to finish current action)
- Errors: `role="alert"` (interrupts immediately)
- Never auto-dismiss error toasts — let users dismiss manually
- Don't stack more than 3 toasts

---

## Carousel / Slider

Carousels are high-risk for accessibility. Use only when content truly benefits from it.

```html
<section aria-label="Featured articles" aria-roledescription="carousel">
  <div aria-live="off" aria-atomic="false">
    <div
      role="group"
      aria-roledescription="slide"
      aria-label="1 of 3"
    >
      <!-- slide content -->
    </div>
  </div>

  <div class="carousel-controls">
    <button aria-label="Previous slide">‹</button>
    <button aria-label="Pause auto-rotation" aria-pressed="false">⏸</button>
    <button aria-label="Next slide">›</button>
  </div>

  <div role="tablist" aria-label="Slides">
    <button role="tab" aria-label="Slide 1" aria-selected="true"></button>
    <button role="tab" aria-label="Slide 2" aria-selected="false"></button>
    <button role="tab" aria-label="Slide 3" aria-selected="false"></button>
  </div>
</section>
```

**Rules:**
- Auto-rotation: must pause on hover, focus, and when user activates pause button
- `aria-live="off"` while rotating (set to `"polite"` momentarily after user-initiated slide change)
- Always provide prev/next buttons

---

## Search

```html
<search> <!-- HTML5 landmark, or use role="search" on a div/form -->
  <label for="site-search">Search</label>
  <input
    id="site-search"
    type="search"
    name="q"
    autocomplete="off"
    aria-autocomplete="list"
    aria-controls="search-results"
    aria-activedescendant=""
    spellcheck="false"
  >
  <button type="submit">
    <svg aria-hidden="true"><!-- search icon --></svg>
    <span class="sr-only">Submit search</span>
  </button>

  <!-- Live results -->
  <ul id="search-results" role="listbox" aria-label="Search suggestions">
    <!-- dynamically populated -->
  </ul>
</search>
```

---

## Progress / Loading States

```html
<!-- Determinate -->
<div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress">
  <div class="bar" style="width: 65%"></div>
</div>

<!-- Indeterminate (spinner) -->
<div role="status" aria-label="Loading results">
  <svg class="spinner" aria-hidden="true">...</svg>
</div>

<!-- Skeleton screen -->
<div aria-busy="true" aria-label="Loading content">
  <div class="skeleton" aria-hidden="true"></div>
</div>
```
