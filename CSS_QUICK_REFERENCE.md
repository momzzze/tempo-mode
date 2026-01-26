# TempoMode CSS Quick Reference

## 🎨 Colors

```css
/* Neon (use sparingly) */
--neon-400: #2bdc75 (primary active state) --neon-500: #33ff88 (hover/emphasis)
  /* Text */ --gray-300: #... (headings) --gray-400: #7a887f (body)
  --gray-500: #56625a (labels) /* Backgrounds */ --surface-1: #101411 (cards)
  --surface-2: #151a16 (inputs, secondary) --surface-3: #1b211d (tertiary)
  /* Borders */ --border-outer: #243029 (main borders) --border-inner: #0a0f0c
  (inset);
```

## 📦 Component Classes

### Containers

```html
<div class="card">Content</div>
<div class="card card--secondary">Secondary</div>
<div class="timer-card">Timer</div>
```

### Buttons

```html
<button class="btn">Default</button>
<button class="btn btn--primary">Primary (Neon)</button>
<button class="btn" disabled>Disabled</button>
```

### Inputs

```html
<div class="form-group">
  <label>Label</label>
  <input class="form-group__input" type="text" />
</div>
```

### Segmented Control

```html
<div class="segmented">
  <button class="active">Active</button>
  <button>Inactive</button>
</div>
```

### Dividers

```html
<div class="divider">// SECTION TITLE</div>
```

### Terminal Logs

```html
<div class="terminal">
  <div class="terminal__line">Normal</div>
  <div class="terminal__line--success">Success</div>
  <div class="terminal__line--warn">Warning</div>
  <div class="terminal__line--error">Error</div>
</div>
```

### Timer Display

```html
<div class="timer--running">
  <div class="timer__digits">25:00</div>
</div>
```

### Status Grid

```html
<div class="status-strip">
  <div class="status-item">
    <div class="status-item__label">Label</div>
    <div class="status-item__value">123</div>
  </div>
</div>
```

### Toggle Switch

```html
<div class="toggle"></div>
<div class="toggle active"></div>
```

## 🎯 Layout Classes

```html
<!-- Full page layout -->
<div class="pomodoro">
  <div class="app-header"></div>
  <div class="pomodoro__layout">
    <div>Main content</div>
    <div class="sidebar">Sidebar</div>
  </div>
</div>
```

## 📐 Spacing (use in CSS or inline)

```css
--space-1: 4px --space-2: 8px --space-3: 12px --space-4: 16px --space-5: 20px
  --space-6: 24px --space-8: 32px;
```

## 🔤 Typography

```css
--font-ui:
  'JetBrains Mono',
  monospace --font-size-xs: 11px --font-size-sm: 12px --font-size-md: 14px
    (default) --font-size-lg: 18px --font-size-xl: 28px --font-size-xxl: 44px;
```

## ✨ Effects

```css
--glow-soft: 0 0 6px rgba(51, 255, 136, 0.35) --glow-focus: 0 0 0 2px
  rgba(51, 255, 136, 0.35) --shadow-panel: inset 0 0 0 1px var(--border-inner);
```

## 🎭 States

### Hover

- Text color brightens
- Border color changes (for inputs)
- Primary buttons show glow

### Focus (Tab)

- Always show `--glow-focus`
- No default browser outline
- Works with keyboard navigation

### Active

- Segmented shows neon underline
- Toggle shows neon background
- Buttons scale down slightly

### Disabled

- `opacity: 0.5`
- `cursor: not-allowed`

### Running (Timer)

- `.timer--running .timer__digits` → neon color + glow

## 📱 Responsive

```css
@media (max-width: 768px) {
  /* Stack to 1 column */
}

@media (max-width: 640px) {
  /* Adjust font sizes, grid */
}
```

## ⚡ Do's

- ✅ Use token variables
- ✅ Neon only for active/CTA
- ✅ Keep borders hairline (1px)
- ✅ Test keyboard nav (Tab)
- ✅ Respect `prefers-reduced-motion`

## ❌ Don'ts

- ❌ Neon text everywhere
- ❌ Big glows (max 6px blur)
- ❌ Rainbow gradients
- ❌ Auto-playing animations
- ❌ Inline styles (use CSS vars)

## 🔗 Files

```
styles/tokens.css      → All variables
styles/base.css        → Global styles
styles/layout.css      → Grid layout
styles/components/     → Component CSS
styles/pages/          → Page layouts
```

## 📖 Full Docs

See `src/styles/README.md` for complete documentation.

---

**When in doubt**: Check how it's used in `src/App.tsx` (demo component).
