/**
 * Soundscape configuration
 * All audio files are hosted on Cloudflare R2
 */

export type TrackKind = 'loop' | 'thunder';

export interface Track {
  id: string;
  label: string;
  url: string;
  loop: boolean;
  defaultVolume: number;
  kind: TrackKind;
  icon: string;
}

export interface Soundscape {
  id: string;
  name: string;
  icon: string;
  tracks: Track[];
}

// Cloudflare R2 bucket URL for all audio files
export const BASE_URL =
  'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes';

export const SOUNDSCAPES: Soundscape[] = [
  {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    icon: 'CloudRain',
    tracks: [
      {
        id: 'rain',
        label: 'Rain',
        url: `${BASE_URL}/thunderstorm/rain.ogg`,
        loop: true,
        defaultVolume: 0.6,
        kind: 'loop',
        icon: 'CloudDrizzle',
      },
      {
        id: 'wind',
        label: 'Wind',
        url: `${BASE_URL}/thunderstorm/wind.ogg`,
        loop: true,
        defaultVolume: 0.4,
        kind: 'loop',
        icon: 'Wind',
      },
      {
        id: 'thunder',
        label: 'Thunder',
        url: `${BASE_URL}/thunderstorm/thunder.ogg`,
        loop: false,
        defaultVolume: 0.7,
        kind: 'thunder',
        icon: 'Zap',
      },
    ],
  },
  {
    id: 'river',
    name: 'River',
    icon: 'Waves',
    tracks: [
      {
        id: 'river_flow',
        label: 'River Flow',
        url: `${BASE_URL}/river/river.ogg`,
        loop: true,
        defaultVolume: 0.7,
        kind: 'loop',
        icon: 'Waves',
      },
      {
        id: 'birds',
        label: 'Birds',
        url: `${BASE_URL}/river/birds.ogg`,
        loop: true,
        defaultVolume: 0.5,
        kind: 'loop',
        icon: 'Bird',
      },
      {
        id: 'wind_river',
        label: 'Wind',
        url: `${BASE_URL}/river/wind.ogg`,
        loop: true,
        defaultVolume: 0.3,
        kind: 'loop',
        icon: 'Wind',
      },
      {
        id: 'bubbles',
        label: 'Bubbles',
        url: `${BASE_URL}/river/bubbles.ogg`,
        loop: true,
        defaultVolume: 0.4,
        kind: 'loop',
        icon: 'Droplets',
      },
    ],
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: 'Trees',
    tracks: [
      {
        id: 'birds_forest',
        label: 'Birds',
        url: `${BASE_URL}/forest/birds.ogg`,
        loop: true,
        defaultVolume: 0.6,
        kind: 'loop',
        icon: 'Bird',
      },
      {
        id: 'insects',
        label: 'Insects',
        url: `${BASE_URL}/forest/insects.ogg`,
        loop: true,
        defaultVolume: 0.4,
        kind: 'loop',
        icon: 'Bug',
      },
      {
        id: 'wind_forest',
        label: 'Wind',
        url: `${BASE_URL}/forest/wind.ogg`,
        loop: true,
        defaultVolume: 0.5,
        kind: 'loop',
        icon: 'Wind',
      },
    ],
  },
  {
    id: 'garden',
    name: 'Garden',
    icon: 'Flower',
    tracks: [
      {
        id: 'chimes',
        label: 'Chimes',
        url: `${BASE_URL}/garden/chimes.ogg`,
        loop: true,
        defaultVolume: 0.5,
        kind: 'loop',
        icon: 'Bell',
      },
      {
        id: 'insects_garden',
        label: 'Insects',
        url: `${BASE_URL}/garden/insects.ogg`,
        loop: true,
        defaultVolume: 0.4,
        kind: 'loop',
        icon: 'Bug',
      },
      {
        id: 'wind_garden',
        label: 'Wind',
        url: `${BASE_URL}/garden/wind.ogg`,
        loop: true,
        defaultVolume: 0.3,
        kind: 'loop',
        icon: 'Wind',
      },
    ],
  },
  {
    id: 'rainfall',
    name: 'Rainfall',
    icon: 'CloudRain',
    tracks: [
      {
        id: 'heavy_rain',
        label: 'Heavy Rain',
        url: `${BASE_URL}/rainfall/ambiance-heavy-rain-loop.ogg`,
        loop: true,
        defaultVolume: 0.7,
        kind: 'loop',
        icon: 'CloudDrizzle',
      },
      {
        id: 'umbrella',
        label: 'Umbrella',
        url: `${BASE_URL}/rainfall/rain-medium-umbrella.ogg`,
        loop: true,
        defaultVolume: 0.5,
        kind: 'loop',
        icon: 'Umbrella',
      },
    ],
  },
];

export function getSoundscape(id: string): Soundscape | undefined {
  return SOUNDSCAPES.find((s) => s.id === id);
}
