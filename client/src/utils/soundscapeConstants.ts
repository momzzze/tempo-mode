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
