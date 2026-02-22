/**
 * Soundscape audio file URLs organized by category
 * All files hosted on Cloudflare R2
 */

// Rainfall soundscape
export const RAINFALL_URLS = {
  AMBIANCE:
    'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/rainfall/ambiance-heavy-rain-loop.ogg',
  UMBRELLA:
    'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/rainfall/rain-medium-umbrella.ogg',
};

// Forest soundscape
export const FOREST_URLS = {
  BIRDS:
    'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/forest/birds.ogg',
  INSECTS:
    'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/forest/insects.ogg',
  WIND: 'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/forest/wind.ogg',
};

// Garden soundscape
export const GARDEN_URLS = {
  CHIMES:
    'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/garden/chimes.ogg',
  INSECTS:
    'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/garden/insects.ogg',
  WIND: 'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/garden/wind.ogg',
};

// River soundscape
export const RIVER_URLS = {
  BIRDS:
    'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/river/birds.ogg',
  BUBBLES:
    'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/river/bubbles.ogg',
  RIVER:
    'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/river/river.ogg',
  WIND: 'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/river/wind.ogg',
};

// Thunderstorm soundscape
export const THUNDERSTORM_URLS = {
  RAIN: 'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/thunderstorm/rain.ogg',
  THUNDER:
    'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/thunderstorm/thunder.ogg',
  WIND: 'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/thunderstorm/wind.ogg',
};

/**
 * YouTube ambient music categories with multiple streams/radios
 * Each category can have multiple video streams
 * Format: YouTube video ID (11 characters after watch?v=)
 * Example: https://www.youtube.com/watch?v=jfKfPfyJRdk -> 'jfKfPfyJRdk'
 */
export const YOUTUBE_CATEGORIES = {
  LOFI: {
    name: 'Lo-fi Hip Hop',
    icon: 'Music2',
    streams: [
      {
        name: 'Lofi Girl - beats to relax/study to',
        id: 'jfKfPfyJRdk',
        icon: 'Radio',
      },
      {
        name: 'Chillhop Radio - jazzy & lofi hip hop beats',
        id: '5yx6BWlEVcY',
        icon: 'Radio',
      },
      {
        name: 'lofi hip hop radio - beats to sleep/chill to',
        id: 'rUxyKA_-grg',
        icon: 'Radio',
      },
    ],
  },
  STUDY: {
    name: 'Study Music',
    icon: 'BookOpen',
    streams: [
      {
        name: 'Deep Focus - Calm Study Music',
        id: '5qap5aO4i9A',
        icon: 'Radio',
      },
      {
        name: 'Peaceful Piano - Relaxing Music',
        id: 'lTRiuFIWV54',
        icon: 'Radio',
      },
    ],
  },
  JAZZ: {
    name: 'Jazz & Coffee',
    icon: 'Coffee',
    streams: [
      {
        name: 'Smooth Jazz Radio',
        id: 'Dx5qFachd3A',
        icon: 'Radio',
      },
      {
        name: 'Jazz Café Music',
        id: 'fEvM-OUbaKs',
        icon: 'Radio',
      },
    ],
  },
  AMBIENT: {
    name: 'Ambient & Chill',
    icon: 'Headphones',
    streams: [
      {
        name: 'Chill Vibes',
        id: '7NOSDKb0HlU',
        icon: 'Radio',
      },
      {
        name: 'Ambient Music for Studying',
        id: 'ztxC4vvFrKo',
        icon: 'Radio',
      },
    ],
  },
};

/**
 * Icon requirements for soundscape elements:
 *
 * Already available (lucide-react):
 * - CloudRain (rainfall)
 * - Cloud (thunderstorm)
 * - Leaf (garden)
 * - Waves (river)
 * - Trees (forest)
 *
 * Needed icons (to be added):
 * - Bird icon (for birds tracks)
 * - Bug/Insect icon (for insects tracks)
 * - Wind icon (for wind tracks)
 * - Bell/Chimes icon (for chimes track)
 * - Droplet/Bubbles icon (for bubbles track)
 * - Zap/Bolt icon (for thunder track)
 */
