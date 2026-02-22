# Soundscape Icons Requirements

This document lists all icons needed for the soundscape player feature.

## Already Available (from lucide-react)

These icons are already being used for the main soundscape categories:

- ✅ `CloudRain` - Rainfall soundscape
- ✅ `Cloud` - Thunderstorm soundscape
- ✅ `Leaf` - Garden soundscape
- ✅ `Waves` - River soundscape
- ✅ `Trees` - Forest soundscape
- ✅ `Music` - Main soundscape player button

## Icons Needed for Individual Tracks

These icons need to be added from lucide-react for the individual audio tracks:

### High Priority (used in multiple soundscapes)

- 🔴 **`Bird`** - Used in: Forest, River
- 🔴 **`Bug`** - Used in: Forest, Garden
- 🔴 **`Wind`** - Used in: Forest, Garden, River, Thunderstorm

### Medium Priority (soundscape-specific)

- 🟡 **`Bell`** - Used in: Garden (chimes)
- 🟡 **`Droplet`** - Used in: River (bubbles)
- 🟡 **`Zap`** - Used in: Thunderstorm (thunder)
- 🟡 **`Umbrella`** - Used in: Rainfall (umbrella rain)

## Implementation Notes

All icons should be imported from `lucide-react`:

```typescript
import { Bird, Bug, Wind, Bell, Droplet, Zap, Umbrella } from 'lucide-react';
```

These icons will be used in the `SoundscapeDetail` component to display individual track controls with visual indicators for each sound layer.
