# Soundscape System Architecture

This directory contains the complete Web Audio API implementation for multi-layer soundscape mixing in TempoMode.

## Overview

The soundscape system provides:

- **Multi-layer mixing**: Each soundscape has 2-4 independent audio tracks (loops and random events)
- **Per-track volume control**: Smooth gain ramping (200ms transitions) for each layer
- **Thunder scheduling**: Random playback intervals (8-25 seconds) for dynamic elements
- **Audio caching**: Prevents re-fetching decoded buffers on toggle/replay
- **Browser compatibility**: Handles audioContext suspend/resume for autoplay restrictions

## Architecture

### Core Components

#### `soundscapes.ts` (Configuration)

Defines all available soundscapes and their track configurations:

- **5 soundscapes**: Thunderstorm, River, Forest, Garden, Rainfall
- **15 total tracks**: Mix of looped backgrounds and random thunder events
- **Audio storage**: Cloudflare R2 hosted `.ogg` files
- **Exports**: `SOUNDSCAPES`, `getSoundscape()`, track icon map

#### `AudioBufferCache.ts` (Caching)

Manages decoded audio buffers with deduplication:

- Cache: `Map<url, AudioBuffer>` for decoded buffers
- Pending: `Map<url, Promise>` to prevent duplicate fetches
- Methods: `get(url)` async, `clear()`, `size()`
- Fetch pipeline: `fetch(url)` → `arrayBuffer()` → `decodeAudioData()`

#### `TrackPlayer.ts` (Looped Tracks)

Handles continuous playback of looped audio:

- One player per looped track
- Manages `AudioBufferSourceNode` lifecycle
- Volume control via `GainNode` with smooth ramping
- Methods: `play()`, `stop()`, `setVolume()`, `dispose()`

#### `ThunderScheduler.ts` (Random Events)

Manages random-interval playback (e.g., thunder):

- Schedules next playback: 8000 + random(0, 17000) ms
- Creates new `AudioBufferSourceNode` for each playback (sources can't restart)
- Volume control via `GainNode` with smooth ramping
- Methods: `start()`, `stop()`, `scheduleNext()`, `dispose()`

#### `SoundscapeEngine.ts` (Orchestrator)

Main singleton orchestrator for soundscape playback:

- Manages `AudioContext`, caching, and all players/schedulers
- Tracks state: current soundscape, play/pause, per-track settings
- Methods:
  - `selectSoundscape(id)` - Load and setup new soundscape
  - `play()` / `pause()` - Control all tracks
  - `toggleTrack(id, enabled)` - Start/stop with volume ramp
  - `setTrackVolume(id, volume)` - Update volume (0-1)
  - `getTrackStates()` - Current state snapshot
- Singleton pattern: `getAudioEngine()`, `disposeAudioEngine()`

## React Integration

### `useSoundscapeEngine.ts` (React Hook)

Custom hook for React components:

- Manages local state: `currentSoundscapeId`, `isPlaying`, `tracks[]`, `error`
- Polling: Updates state every 100ms from engine
- Actions: `selectSoundscape()`, `play()`, `pause()`, `toggleTrack()`, `setTrackVolume()`
- Error handling with try/catch
- Cleanup via `useEffect` return function

## Audio Technical Details

### Gain Ramping

Smooth volume transitions prevent audio popping:

```typescript
gainNode.linearRampToValueAtTime(targetVolume, audioContext.currentTime + 0.2);
```

- Ramp duration: 200ms
- Applied on: volume changes, track enable/disable

### AudioBufferSourceNode Lifecycle

Important: Sources cannot restart. Implementation strategy:

- Looped tracks: Create once, reuse (set `loop = true`)
- Thunder events: Create new source for each playback
- Proper cleanup: `source.disconnect()`, `source.stop()`

### Browser Restrictions

AudioContext autoplay restrictions:

- Context starts in "suspended" state until user interaction
- Solution: Call `audioContext.resume()` in `selectSoundscape()` (user click context)

### Audio Files

Location: `https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes`

Structure:

```
soundscapes/
├── thunderstorm/
│   ├── rain.ogg
│   ├── wind.ogg
│   └── thunder.ogg
├── river/
│   ├── river.ogg
│   ├── birds.ogg
│   ├── wind.ogg
│   └── bubbles.ogg
├── forest/
│   ├── birds.ogg
│   ├── insects.ogg
│   └── wind.ogg
├── garden/
│   ├── chimes.ogg
│   ├── insects.ogg
│   └── wind.ogg
└── rainfall/
    ├── rain.ogg
    └── umbrella.ogg
```

## UI Components

Located in `../components/sounds/`:

### `SoundsPanel.tsx`

Soundscape selection grid:

- Displays 5 soundscape cards with icons
- Click to select soundscape
- Shows active state with neon border

### `NowPlayingPanel.tsx`

Track control panel for selected soundscape:

- Play/Pause button for entire soundscape
- Per-track controls:
  - Toggle button (enable/disable)
  - Volume slider (0-100%)
  - Volume percentage display
- Track icons and labels

### `sounds.css`

Complete styling (290+ lines):

- Dark translucent panels
- Neon accent color for active/enabled states
- Custom range slider styling
- Smooth transitions
- Uses CSS custom properties: `var(--neon-400)`, `var(--surface-1)`, etc.

## Usage Flow

1. User clicks soundscape card → `selectSoundscape(id)`
2. Engine loads soundscape config from `soundscapes.ts`
3. Engine creates `TrackPlayer` or `ThunderScheduler` for each track
4. Engine caches decoded audio buffers
5. `NowPlayingPanel` opens showing tracks
6. User can:
   - Click Play/Pause to control all tracks
   - Toggle individual tracks on/off
   - Adjust per-track volumes with sliders
7. All changes reflected in UI via hook state polling

## Type Safety

All components use strict TypeScript:

- No `any` types
- Explicit types for all parameters and returns
- Type-only imports for interface types
- Proper handling of `null` / `undefined`

## Error Handling

- Try/catch in React hook
- Failed audio loads disable affected tracks
- Network errors shown in UI state
- Console logging for debugging

## Performance Considerations

- **Audio caching**: Decoded buffers reused, no re-fetching
- **Gain ramping**: Prevents audio artifacts (pops/clicks)
- **State polling**: 100ms interval balances responsiveness vs. CPU
- **Lazy loading**: Audio files fetched only when soundscape selected
- **Disposal**: Cleanup methods prevent memory leaks

## Future Extensions

- Spotify/YouTube integration (stubbed out)
- Custom soundscape creation
- Recording/saving custom mixes
- More predefined soundscapes
- EQ/filter controls per track
