# TempoMode UI System Implementation Guide

## Overview

The TempoMode UI system is an indie terminal / sci-fi control panel aesthetic with dark-first, minimal glow, and restrained neon usage.

---

## 🎨 Design Tokens

All design tokens are defined in `src/styles/tokens.css` and include:

### Color System

- **Grayscale Base**: `--gray-950` to `--gray-400` (cool, desaturated palette)
- **Neon Accent**: `--neon-500`, `--neon-400`, `--neon-300` (used sparingly)
- **Neon Dim**: `--neon-dim-1` (35% opacity), `--neon-dim-2` (18% opacity)
- **Status Colors**: OK (green), WARN (muted yellow-green), BAD (muted red-brown)

### Surfaces & Borders

- **Surfaces**: `--surface-1` (900), `--surface-2` (850), `--surface-3` (800)
- **Borders**: Hairline (1px), outer (#243029), inner (#0a0f0c)

### Effects

- **Glow Soft**: 6px blur at 35% opacity (hover/active)
- **Glow Focus**: 2px outline at 35% opacity
- **Shadow Panel**: Inset 1px border

### Spacing Scale

4px, 8px, 12px, 16px, 20px, 24px, 32px (use `--space-1` through `--space-8`)

### Typography

- **Font**: JetBrains Mono (600 for headers, 400 for body)
- **Sizes**: xs (11px), sm (12px), md (14px), lg (18px), xl (28px), xxl (44px)
- **Letter Spacing**: wide (0.08em), ui (0.04em)

---

## 🏗️ CSS Architecture

All CSS is organized in `src/styles/`:

```
styles/
├─ tokens.css          (design variables)
├─ base.css            (global resets, body)
├─ layout.css          (grid layout, app shell)
├─ components/
│  ├─ card.css         (panel containers)
│  ├─ button.css       (buttons, primary/secondary)
│  ├─ divider.css      (// section separators)
│  ├─ segmented.css    (radio-style selector)
│  ├─ terminal.css     (log display)
│  └─ inputs.css       (form fields)
└─ pages/
   ├─ pomodoro.css     (main timer view)
   ├─ settings.css     (settings & toggles)
   └─ stats.css        (analytics view)
```

**Import order** (in `index.css`):

1. tokens.css
2. base.css
3. layout.css
4. components/ (card, button, divider, segmented, terminal, inputs)
5. pages/ (pomodoro, settings, stats)

---

## 🧩 Component Classes

### Cards (`.card`)

```html
<div class="card">
  <h2 class="card__title">Title</h2>
  <div class="card__body">Content</div>
</div>
```

Variants:

- `.card--secondary` (surface-2)
- `.card--tertiary` (surface-3)

### Buttons (`.btn`)

```html
<button class="btn">Default</button>
<button class="btn btn--primary">Primary (Neon)</button>
```

Focus/hover shows glow only for primary.

### Dividers (`.divider`)

```html
<div class="divider">// MISSION CONTROL</div>
```

Creates thin line with centered text.

### Segmented Control (`.segmented`)

```html
<div class="segmented">
  <button class="active">Focus</button>
  <button>Short</button>
  <button>Long</button>
</div>
```

Active state has neon underline & background tint.

### Terminal (`.terminal`)

```html
<div class="terminal">
  <div class="terminal__line">READY</div>
  <div class="terminal__line--success">SESSION STARTED</div>
  <div class="terminal__line--warn">Warning</div>
  <div class="terminal__line--error">Error</div>
</div>
```

Automatic `>` prefix, colored lines (success/warn/error).

### Inputs (`.form-group`)

```html
<div class="form-group">
  <label class="form-group__label">Label</label>
  <input class="form-group__input" />
</div>
```

Auto-focus glow, hover border change, placeholder styling.

---

## 📄 Page Layouts

### Pomodoro (Main)

```
.app-header
  ├─ .app-logo
  └─ .app-status (uptime, time)

.pomodoro__layout
  ├─ Column 1:
  │  ├─ .timer-card
  │  │  ├─ .timer__digits (large condensed mono)
  │  │  ├─ .timer__mode-selector (segmented)
  │  │  ├─ .timer__controls (Start/Pause/Reset/Skip)
  │  │  ├─ .task-input-group
  │  │  └─ .status-strip (streak, sessions, minutes, time)
  │  └─ (Stats on mobile)
  │
  └─ Column 2 (desktop), Collapsible (mobile):
     └─ .terminal-panel
        ├─ .terminal-panel__header
        └─ .terminal
```

**Timer Running State**: `.timer--running .timer__digits` applies neon color + soft glow.

### Settings

Grid of `.settings-card` elements with:

- `.setting-row` (label + control)
- `.toggle` (switch)
- `.form-group` (input fields)

### Stats

- `.stats__grid` (overview cards)
- `.chart-container` (activity/trends)
- `.stats-list` (table of sessions)
- `.stats__period-selector` (week/month/all)

---

## ✨ Key Principles

### ✅ DO:

- Use neon **only** for:
  - Active states (timer running, button focus)
  - Running timer digits
  - Focused form inputs
  - CTA buttons
- Maintain dark backgrounds
- Use hairline borders (1px)
- Keep spacing consistent (multiples of 4px)
- Test keyboard navigation (Tab, Enter, Space)

### ❌ DON'T:

- Neon text everywhere
- Neon borders on static cards
- Big glows or animations
- Colorful gradients
- Overuse transitions

---

## 🎯 Typography Usage

```css
/* Headings */
.app-logo {
  font-size: var(--font-size-lg);
}

/* Page titles */
h1 {
  font-size: var(--font-size-xl);
}

/* Section titles */
h2,
h3 {
  font-size: var(--font-size-md);
}

/* Body text */
p {
  font-size: var(--font-size-md);
}

/* Small labels */
label {
  font-size: var(--font-size-xs);
}

/* Uppercase labels */
.label {
  text-transform: uppercase;
  letter-spacing: var(--letter-wide);
}
```

---

## 🎮 Interactions

### Button Hover

- Border color stays same
- Text brightens
- Primary shows soft glow

### Button Focus (Tab)

- Always shows glow focus
- Outline: none

### Input Focus

- Border → neon-dim-1
- Glow focus applied
- Background lightens slightly

### Segmented Active

- Neon color
- Bottom border-bottom (inset)
- Slight background tint

### Terminal Line Colors

- Default: neon-dim-1
- `.terminal__line--success`: status-ok
- `.terminal__line--warn`: status-warn
- `.terminal__line--error`: status-bad

---

## 📱 Responsive Breakpoints

- **Desktop**: Full 2-column layout (pomodoro)
- **Tablet** (768px): Stack to 1 column
- **Mobile** (640px): Adjust font sizes, segmented, status grid to 2x2

---

## 🚀 Implementation Checklist

- [x] Design tokens (tokens.css)
- [x] Base styles (base.css, body reset)
- [x] Layout grid (layout.css)
- [x] Component library (card, button, divider, segmented, terminal, inputs)
- [x] Page layouts (pomodoro, settings, stats)
- [x] Accessibility (prefers-reduced-motion, focus visible)
- [x] Fonts (JetBrains Mono via Google Fonts)
- [ ] React components wired to CSS
- [ ] Mobile testing at 375px
- [ ] Final QA (no unnecessary glow, consistent spacing)

---

## 🔍 Testing

### Keyboard Navigation

```
Tab     → cycle through controls
Enter   → activate button
Space   → toggle checkbox
Arrow   → navigate segmented/radio
```

### Motion Accessibility

The CSS respects `prefers-reduced-motion: reduce` (disables transitions).

### Mobile Testing

Test at **375px width** (min-width for modern phones).

### Color Contrast

- Neon on dark: passes AA
- Text on surface: passes AA

---

## 📦 Font Setup

```html
<!-- In index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

Fallback: `'IBM Plex Mono', 'Share Tech Mono', monospace`

---

## 🎨 Final Notes

- **Borders feel engineered**, not decorative
- **Spacing can be slightly uneven** (indie feel)
- **UI is a tool**, not a game
- **Glow is restraint** (0.35 opacity, 6px blur max)
- **Every pixel serves a purpose**

The system is ready to integrate with React components. Apply classes to JSX elements, use CSS variables for theme consistency, and avoid inline styles.
