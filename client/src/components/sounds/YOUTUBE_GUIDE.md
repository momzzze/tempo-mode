# YouTube Integration Guide

## How to Add More YouTube Streams

All YouTube streams are organized by category in [soundscapeConstants.ts](../utils/soundscapeConstants.ts).

### Structure

```typescript
export const YOUTUBE_CATEGORIES = {
  CATEGORY_KEY: {
    name: 'Display Name', // Shows on the category card
    icon: 'LucideIconName', // Icon from lucide-react
    streams: [
      // Array of available streams
      {
        name: 'Stream Name', // Shows in stream list
        id: 'YouTube_Video_ID', // 11-char ID from YouTube URL
        icon: 'Radio', // Icon for this stream
      },
      // Add more streams here...
    ],
  },
};
```

### Example: Adding a New Stream to Lo-fi Category

```typescript
LOFI: {
  name: 'Lo-fi Hip Hop',
  icon: 'Music2',
  streams: [
    // Existing streams...
    {
      name: 'Lofi Girl - beats to relax/study to',
      id: 'jfKfPfyJRdk',
      icon: 'Radio',
    },
    // ADD NEW STREAM HERE:
    {
      name: 'Your New Lo-fi Stream',
      id: 'YOUTUBE_VIDEO_ID', // Get from: youtube.com/watch?v=THIS_PART
      icon: 'Radio',
    },
  ],
},
```

### Example: Adding a Completely New Category

```typescript
ELECTRONIC: {
  name: 'Electronic Music',
  icon: 'Zap',
  streams: [
    {
      name: 'Synthwave Radio',
      id: 'abc123xyz89',
      icon: 'Radio',
    },
    {
      name: 'Chillstep Mix',
      id: 'def456uvw78',
      icon: 'Radio',
    },
  ],
},
```

## How to Get YouTube Video ID

From a YouTube URL like: `https://www.youtube.com/watch?v=jfKfPfyJRdk`

The video ID is: `jfKfPfyJRdk` (the 11 characters after `v=`)

## Icon Options

Use any icon from [lucide-react](https://lucide.dev/icons/):

- `Radio` - Radio waves icon
- `Music` - Music note
- `Music2` - Alternative music icon
- `Headphones` - Headphones
- `Disc` - Vinyl disc
- `ListMusic` - Music playlist
- `Mic2` - Microphone
- etc.

## How It Works

1. When you click a YouTube category (e.g., "Lo-fi Hip Hop"), it opens a detail view
2. The detail view shows all available streams in that category
3. Click a stream to select it (first stream is selected by default)
4. The selected stream plays in the background when the focus timer is running
5. The player keeps running even if you close the modal
6. Automatically pauses during break mode

## Current Categories

- **Lo-fi Hip Hop** - 3 streams
- **Study Music** - 2 streams
- **Jazz & Coffee** - 2 streams
- **Ambient & Chill** - 2 streams

Add more streams to any category or create new categories as needed!
