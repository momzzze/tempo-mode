# TempoMode UI Components - Visual Reference

## 🎨 Color Palette

```
NEON GREEN (Primary Active)
  #2bdc75 ████████████████████████ ← Status: OK, Running timer, Button active
  #33ff88 ████████████████████████ ← Bright accent, Hover
  #1fae5a ████████████████████████ ← Dim, Disabled

GRAYSCALE (Backgrounds & Text)
  #0b0e0c ████████████████████████ ← Gray 950 (black-est)
  #101411 ████████████████████████ ← Gray 900 (card bg)
  #151a16 ████████████████████████ ← Gray 850 (secondary surface)
  #1b211d ████████████████████████ ← Gray 800 (tertiary surface)
  #56625a ████████████████████████ ← Gray 500 (labels)
  #7a887f ████████████████████████ ← Gray 400 (body text)

BORDERS
  #243029 ████████████████████████ ← Outer (visible)
  #0a0f0c ████████████████████████ ← Inner (inset shadow)

STATUS COLORS
  #2bdc75 ████████████████████████ ← OK (green)
  #9fa84a ████████████████████████ ← WARN (muted yellow)
  #7a3a3a ████████████████████████ ← BAD (muted red)
```

---

## 🧩 Component Examples

### CARD (Containers)

```
┌─────────────────────────────────────┐
│ Title                      [×]      │  ← card__header
├─────────────────────────────────────┤
│                                     │
│   Content goes here                 │  ← card__body
│                                     │
├─────────────────────────────────────┤
│  [Cancel]  [Primary]                │  ← card__footer
└─────────────────────────────────────┘

Variants: default, --secondary, --tertiary
```

### BUTTONS

```
Default:     [    BUTTON    ]
Primary:     [    START     ]  ← Neon border & text, glows on hover
Disabled:    [    BUTTON    ]  ← Faded (0.5 opacity)
Hover:       [    BUTTON    ]  ← Text brightens, glow appears
Active:      [    BUTTON    ]  ← Scales down slightly (0.98)
```

### SEGMENTED CONTROL (Mode Selector)

```
┌──────────────┬──────────────┬──────────────┐
│   Focus ✓    │    Short     │    Long      │  ← Active has neon underline
└──────────────┴──────────────┴──────────────┘

Active state:
┌──────────────┬──────────────┬──────────────┐
│ Focus ═══════│              │              │  ← Neon underline + tint
└──────────────┴──────────────┴──────────────┘
```

### DIVIDERS

```
// MISSION CONTROL

// STATUS

// TERMINAL LOG
```

### INPUT FIELDS

```
Label
┌─────────────────────────────────┐
│ Placeholder text or input...    │  ← Gray 500
└─────────────────────────────────┘

Focused:
┌═════════════════════════════════┐
│ Text input here...              │  ← Neon border + glow
└═════════════════════════════════┘
```

### TOGGLE SWITCH

```
Off:  ○──────                     ← Gray 600 background
On:   ──────●                     ← Neon green background
```

### TERMINAL LOG

```
┌─────────────────────────────────────────────┐
│ > READY                                     │  ← Default (dim neon)
│ > SESSION STARTED                           │  ← Success (bright green)
│ > WARNING: 60 SEC REMAINING                 │  ← Warn (yellow-green)
│ > ERROR: Invalid input                      │  ← Error (red-brown)
└─────────────────────────────────────────────┘
```

### TIMER DISPLAY (Main)

```
Non-running:
    25:00                   ← Gray 400 text, no glow

Running:
    25:00                   ← Neon green text, soft glow
    ✨ text-shadow ✨
```

### STATUS STRIP (Metrics)

```
┌──────────┬──────────┬──────────┬──────────┐
│  STREAK  │ SESSIONS │ FOCUS MIN│ BREAKS   │
│    7     │    12    │   300    │    11    │  ← Large numbers
└──────────┴──────────┴──────────┴──────────┘
```

### FORM GROUP

```
Label
┌────────────────────────────────────┐
│                                    │
│   Input with focus glow            │
│                                    │
└────────────────────────────────────┘
```

---

## 🎭 Interactive States

### BUTTON STATES

```
1. Default
   [Button] ← Gray border, gray text

2. Hover
   [Button] ← Same (subtle)

3. Focus (Tab key)
   [◎ Button ◎] ← Glow outline (neon)

4. Active (Pressed)
   [Button] ← Scales down (0.98)

5. Disabled
   [Button] ← Faded (0.5 opacity)
```

### PRIMARY BUTTON STATES

```
1. Default
   [START] ← Neon border, neon text

2. Hover
   [START] ← Soft glow around button
   ✨      ✨

3. Focus
   [◎ START ◎] ← Focus glow (neon outline)

4. Active
   [START] ← Scales down slightly

5. Disabled
   [START] ← Faded (0.5 opacity)
```

### INPUT FOCUS STATES

```
1. Idle (not focused)
   ┌────────────────┐
   │ Placeholder    │ ← Gray 500 text

2. Hover
   ┌────────────────┐  ← Border slightly brighter
   │ Placeholder    │

3. Focus (Tab/Click)
   ┌════════════════┐
   │ Type here...   │ ← Neon border + glow
   └════════════════┘

4. Filled
   ┌════════════════┐
   │ My input text  │ ← Still highlighted
   └════════════════┘
```

---

## 📐 Spacing Reference

```
Extra compact:  4px   (--space-1)
Compact:        8px   (--space-2)
Cozy:          12px   (--space-3)  ← Common between elements
Standard:      16px   (--space-4)  ← Card padding
Roomy:         20px   (--space-5)  ← Card padding, headers
Generous:      24px   (--space-6)  ← Gap between cards
Spacious:      32px   (--space-8)  ← Section gaps
```

### In Practice

```
Card padding: 20px (--space-5)
Card margins: 24px (--space-6)
Button padding: 8px 16px (--space-2 + --space-4)
Input padding: 8px 12px (--space-2 + --space-3)
```

---

## 🔤 Typography Sizes

```
xs (11px)   ▌▌  Labels, small text, terminal
sm (12px)   ▌▌▌ Descriptions, secondary text
md (14px)   ▌▌▌▌ Body text, normal
lg (18px)   ▌▌▌▌▌▌ Section titles
xl (28px)   ▌▌▌▌▌▌▌▌▌ Page titles
xxl (44px)  ▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌ Timer digits
```

---

## 🌊 Glow Effects

### Soft Glow (Hover)

```
0 0 6px rgba(51, 255, 136, 0.35)
├─ 6px blur
└─ 35% opacity (subtle, not bright)
```

Visual:

```
  ┌─ ┌─ ┌─────────┐ ─┐ ─┐
  │ ┌┴─ │ Button  │ ─┴─┐ │
  │ │   └─────────┘   │ │
  └─└──  soft glow  ──┘ ┘
        (very subtle)
```

### Focus Glow (Tab)

```
0 0 0 2px rgba(51, 255, 136, 0.35)
├─ 2px outline
└─ 35% opacity
```

Visual:

```
  ┌─────────────┐
  │ ◎ Button ◎ │ ← Ring of glow
  └─────────────┘
```

### Running Timer Glow

```
text-shadow: 0 0 8px rgba(51,255,136,0.25)
├─ Glow behind text
├─ 8px blur (moderate)
└─ 25% opacity (visible but not harsh)
```

Visual:

```
     25:00
    ✨  ✨ ✨    ← Soft glow around digits
   ✨       ✨
```

---

## 📱 Responsive Breakpoints

```
Desktop (1024px+)
┌──────────────────────────────────────┐
│ Header with logo                     │
├──────────────────────────┬───────────┤
│                          │           │
│   Main content (2/3)     │ Sidebar   │
│                          │ (1/3)     │
│                          │           │
└──────────────────────────┴───────────┘

Tablet (768px - 1023px)
┌──────────────────────────┐
│ Header                   │
├──────────────────────────┤
│                          │
│   Full-width content     │
│                          │
├──────────────────────────┤
│   Full-width sidebar     │
└──────────────────────────┘

Mobile (375px - 767px)
┌──────────────────┐
│ Header           │
├──────────────────┤
│ Content          │
│ (single column)  │
├──────────────────┤
│ Sidebar          │
│ (collapsible)    │
└──────────────────┘
```

---

## 🎯 Layout Grid Example

```
POMODORO PAGE LAYOUT (2-COLUMN)

┌─────────────────────────────────────────────────────────┐
│ tempo-mode                   [uptime: 4d 12h]  [14:32]  │
├─────────────────────────────────────────────────────────┤
│
│  // POMODORO
│
│  ┌──────────────────────────────┐  ┌─────────────────┐
│  │                              │  │  TERMINAL LOG   │
│  │       25:00                  │  ├─────────────────┤
│  │  ┌──────┬──────┬──────┐      │  │ > READY         │
│  │  │Focus │Short │ Long │      │  │ > SESSION START │
│  │  └──────┴──────┴──────┘      │  │ > FOCUS ACTIVE  │
│  │                              │  │ > 60 SEC LEFT   │
│  │  [START] [PAUSE] [RESET]     │  │                 │
│  │                              │  └─────────────────┘
│  │  Task: [Enter task...]       │
│  │                              │
│  ├──────────────────────────────┤
│  │ // STATUS                    │
│  │ ┌──┬──┬──┬──┐                │
│  │ │7 │12│300│11│               │
│  │ └──┴──┴──┴──┘                │
│  │ streak sessions min breaks   │
│  └──────────────────────────────┘
│
└─────────────────────────────────────────────────────────┘
```

---

## ⌨️ Keyboard Navigation

```
Tab          → Cycle through buttons, inputs
Shift+Tab    → Reverse cycle
Enter        → Activate button
Space        → Toggle checkbox/radio or button
Arrow Keys   → Navigate segmented control
Escape       → Close modal (when implemented)
```

All interactive elements show `.btn:focus-visible { box-shadow: glow-focus }`

---

## ✨ Animation Transitions

All transitions are **0.15s ease-out** (if motion not reduced):

```
Button hover:      Border color
Input focus:       Border color + glow
Toggle switch:     Thumb position + background
Segmented active:  Underline position
```

When `prefers-reduced-motion: reduce` is set, all transitions become **0.01ms** (effectively instant).

---

## 🔍 Debugging Tips

### Component Not Styled?

1. Check class name spelling (case-sensitive)
2. Verify CSS is imported in index.css
3. Look for z-index conflicts
4. Test in DevTools (inspect element)

### Colors Look Different?

- Check browser's color management
- Compare to tokens.css (official values)
- Use Chrome DevTools color picker on working element

### Glow Not Showing?

- Check browser supports box-shadow
- Verify button state (hover/focus triggers it)
- Check for `outline: none` interference
- Inspect with DevTools to see actual box-shadow

### Responsive Looks Wrong?

- Open DevTools responsive mode
- Test at exact breakpoint (768px, 640px)
- Check media query order in CSS
- Use mobile device for final testing

---

**Visual Reference Last Updated**: January 26, 2026  
**All colors verified against tokens.css**  
**All components tested in build**
