import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Music } from 'lucide-react';
import { SoundscapeTabs } from './sounds/SoundscapeTabs';
import { SoundscapeGrid } from './sounds/SoundscapeGrid';
import { SoundscapeDetail } from './sounds/SoundscapeDetail';
import { YouTubeDetail } from './sounds/YouTubeDetail';
import { YouTubePlayer } from './sounds/YouTubePlayer';
import './SoundscrapePlayer.css';
import {
  RAINFALL_URLS,
  FOREST_URLS,
  GARDEN_URLS,
  RIVER_URLS,
  THUNDERSTORM_URLS,
  YOUTUBE_CATEGORIES,
} from '../utils/soundscapeConstants';

const tagElements = [
  {
    name: 'Soundscapes',
    elements: [
      {
        name: 'Rainfall',
        audioFiles: [RAINFALL_URLS.AMBIANCE, RAINFALL_URLS.UMBRELLA],
        icon: 'CloudRain',
        tracks: [
          { name: 'Ambiance', url: RAINFALL_URLS.AMBIANCE, icon: 'CloudRain' },
          { name: 'Umbrella', url: RAINFALL_URLS.UMBRELLA, icon: 'Umbrella' },
        ],
      },
      {
        name: 'Thunderstorm',
        audioFiles: [
          THUNDERSTORM_URLS.RAIN,
          THUNDERSTORM_URLS.THUNDER,
          THUNDERSTORM_URLS.WIND,
        ],
        icon: 'Cloud',
        tracks: [
          { name: 'Rain', url: THUNDERSTORM_URLS.RAIN, icon: 'CloudRain' },
          { name: 'Thunder', url: THUNDERSTORM_URLS.THUNDER, icon: 'Zap' },
          { name: 'Wind', url: THUNDERSTORM_URLS.WIND, icon: 'Wind' },
        ],
      },
      {
        name: 'Garden',
        audioFiles: [GARDEN_URLS.CHIMES, GARDEN_URLS.INSECTS, GARDEN_URLS.WIND],
        icon: 'Leaf',
        tracks: [
          { name: 'Chimes', url: GARDEN_URLS.CHIMES, icon: 'Bell' },
          { name: 'Insects', url: GARDEN_URLS.INSECTS, icon: 'Bug' },
          { name: 'Wind', url: GARDEN_URLS.WIND, icon: 'Wind' },
        ],
      },
      {
        name: 'River',
        audioFiles: [
          RIVER_URLS.BIRDS,
          RIVER_URLS.BUBBLES,
          RIVER_URLS.RIVER,
          RIVER_URLS.WIND,
        ],
        icon: 'Waves',
        tracks: [
          { name: 'Birds', url: RIVER_URLS.BIRDS, icon: 'Bird' },
          { name: 'Bubbles', url: RIVER_URLS.BUBBLES, icon: 'Droplet' },
          { name: 'River', url: RIVER_URLS.RIVER, icon: 'Waves' },
          { name: 'Wind', url: RIVER_URLS.WIND, icon: 'Wind' },
        ],
      },
      {
        name: 'Forest',
        audioFiles: [FOREST_URLS.BIRDS, FOREST_URLS.INSECTS, FOREST_URLS.WIND],
        icon: 'Trees',
        tracks: [
          { name: 'Birds', url: FOREST_URLS.BIRDS, icon: 'Bird' },
          { name: 'Insects', url: FOREST_URLS.INSECTS, icon: 'Bug' },
          { name: 'Wind', url: FOREST_URLS.WIND, icon: 'Wind' },
        ],
      },
    ],
  },
  {
    name: 'Youtube',
    elements: Object.values(YOUTUBE_CATEGORIES).map((category) => ({
      name: category.name,
      icon: category.icon,
      streams: category.streams,
      isYouTube: true, // Flag to identify YouTube elements
    })),
  },
  { name: 'Spotify' },
];

export interface SoundscapePlayerProps {
  timerMode?: 'focus' | 'break';
  isRunning?: boolean;
  soundUnlocked?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

export function SoundscapePlayer({
  timerMode = 'focus',
  isRunning = false,
  soundUnlocked = true,
  onPlayingChange,
  onOpenChange,
}: SoundscapePlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Soundscapes');
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [playingElement, setPlayingElement] = useState<any | null>(null);
  const [alignRight, setAlignRight] = useState(false);

  // Store volumes for all soundscapes: { Rainfall: [0.5, 0.5], Thunderstorm: [0.5, 0.5, 0.5], ... }
  const [soundscapeVolumes, setSoundscapeVolumes] = useState<
    Record<string, number[]>
  >({});

  // YouTube state - track current video and whether it should be playing
  const [currentYouTubeId, setCurrentYouTubeId] = useState<string | null>(null);
  const [isYouTubePlaying, setIsYouTubePlaying] = useState(false);

  // Use refs to track previous values and avoid unnecessary updates
  const prevPlayingElementRef = useRef<any>(null);
  const currentYouTubeIdRef = useRef<string | null>(null);
  const isPlayingRef = useRef(false);

  // Store audio element refs for each soundscape track
  const audioRefs = useRef<Map<string, HTMLAudioElement[]>>(new Map());

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Initialize default volumes (0.5 for each track) for all soundscapes
  const initializeDefaultVolumes = () => {
    const defaultVolumes: Record<string, number[]> = {};
    const soundscapeElements = tagElements[0].elements;
    if (soundscapeElements) {
      soundscapeElements.forEach((element: any) => {
        if (element.audioFiles) {
          const trackCount = element.audioFiles.length || 0;
          defaultVolumes[element.name] = Array(trackCount).fill(0.5);
        }
      });
    }
    setSoundscapeVolumes(defaultVolumes);
  };

  // Load last played soundscape and volumes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lastPlayedSoundscape');
    if (saved) {
      const element = tagElements
        .flatMap((tab: any) => tab.elements || [])
        .find((el: any) => el.name === saved);
      if (element) {
        console.log('📝 Loaded last soundscape:', saved);
        setSelectedElement(element);
      }
    }

    // Load or initialize volumes for all soundscapes
    const savedVolumes = localStorage.getItem('soundscapeVolumes');
    if (savedVolumes) {
      try {
        setSoundscapeVolumes(JSON.parse(savedVolumes));
      } catch (e) {
        console.error('Failed to load volumes:', e);
        initializeDefaultVolumes();
      }
    } else {
      initializeDefaultVolumes();
    }
  }, []);

  // Auto-play soundscape when focus timer starts, stop on pause or break
  useEffect(() => {
    console.log(
      '🔔 Timer effect triggered - mode:',
      timerMode,
      'isRunning:',
      isRunning
    );

    // Stop music when paused or in break mode
    if (!isRunning || timerMode === 'break') {
      console.log('⏹️ Stopping audio - paused or break mode');
      if (isPlayingRef.current) {
        setPlayingElement(null);
        isPlayingRef.current = false;
      }
      return;
    }

    // Auto-play when in focus mode and running
    // Only set if not already playing (avoid re-setting on every timer tick)
    if (timerMode === 'focus' && isRunning && !isPlayingRef.current) {
      console.log('▶️ Auto-starting soundscape on timer start');

      // Get last played soundscape, or default to Rainfall
      let saved = localStorage.getItem('lastPlayedSoundscape');
      console.log('💾 Saved soundscape from localStorage:', saved);

      // Default to Rainfall if nothing saved
      if (!saved) {
        saved = 'Rainfall';
        console.log('📢 No saved soundscape, defaulting to Rainfall');
      }

      const element = tagElements
        .flatMap((tab: any) => tab.elements || [])
        .find((el: any) => el.name === saved);

      console.log('🎵 Found element:', element?.name);

      if (element) {
        console.log('▶️ Setting playingElement to:', element.name);
        isPlayingRef.current = true;
        setPlayingElement(element);
      }
    }
  }, [timerMode, isRunning]);

  const handlePlayToggle = (element: any) => {
    console.log('▶️ handlePlayToggle clicked:', element.name);
    // Save to localStorage
    localStorage.setItem('lastPlayedSoundscape', element.name);

    if (playingElement?.name === element.name) {
      setPlayingElement(null);
      isPlayingRef.current = false;
    } else {
      setPlayingElement(element);
      isPlayingRef.current = true;
    }
  };

  // Handle YouTube stream selection change
  const handleYouTubeStreamChange = (streamId: string) => {
    console.log('🎬 YouTube stream changed to:', streamId);
    currentYouTubeIdRef.current = streamId;
    setCurrentYouTubeId(streamId);
  };

  const handleVolumeChange = (index: number, value: number) => {
    if (!selectedElement) return;

    console.log('🔊 Volume changed:', selectedElement.name, index, value);

    // Update volumes for the selected soundscape
    const currentVolumes = soundscapeVolumes[selectedElement.name] || [];
    const updatedVolumes = [...currentVolumes];
    updatedVolumes[index] = value;

    const newVolumes = {
      ...soundscapeVolumes,
      [selectedElement.name]: updatedVolumes,
    };
    setSoundscapeVolumes(newVolumes);

    // Save to localStorage
    localStorage.setItem('soundscapeVolumes', JSON.stringify(newVolumes));

    // Apply volume to audio element
    const audioElements = audioRefs.current.get(selectedElement.name);
    if (audioElements && audioElements[index]) {
      audioElements[index].volume = value;
    }
  };

  // Dynamic audio playback effect for any soundscape
  useEffect(() => {
    console.log(
      '🎵 playingElement:',
      playingElement?.name,
      'soundUnlocked:',
      soundUnlocked
    );

    if (!playingElement) {
      // Reset tracking refs
      prevPlayingElementRef.current = null;
      isPlayingRef.current = false;
      // Stop all audio soundscapes
      audioRefs.current.forEach((audioElements) => {
        audioElements.forEach((audio) => audio.pause());
      });
      // Stop YouTube
      setIsYouTubePlaying(false);
      setCurrentYouTubeId(null);
      currentYouTubeIdRef.current = null;
      onPlayingChange?.(false);
      return;
    }

    // Check if it's a YouTube element
    if (playingElement.isYouTube && playingElement.streams) {
      // Only update if playingElement changed (not just a re-render)
      if (prevPlayingElementRef.current !== playingElement) {
        console.log('🎬 Playing YouTube element:', playingElement.name);
        console.log('🎬 Streams available:', playingElement.streams.length);

        prevPlayingElementRef.current = playingElement;

        // Stop any soundscape audio
        audioRefs.current.forEach((audioElements) => {
          audioElements.forEach((audio) => audio.pause());
        });

        // Play first stream by default (or previously selected stream)
        const firstStream = playingElement.streams[0];
        if (firstStream) {
          console.log('🎬 Setting video ID to:', firstStream.id);
          console.log('🎬 Setting isYouTubePlaying to: true');

          // Only update state if value actually changed
          if (currentYouTubeIdRef.current !== firstStream.id) {
            currentYouTubeIdRef.current = firstStream.id;
            setCurrentYouTubeId(firstStream.id);
          }
          setIsYouTubePlaying(true);
          onPlayingChange?.(true);
        } else {
          console.error('❌ No streams found in YouTube element');
        }
      } else if (soundUnlocked && !isYouTubePlaying) {
        // If YouTube element didn't change but sound just unlocked, resume playback
        console.log('🔊 Sound unlocked, resuming YouTube playback');
        setIsYouTubePlaying(true);
        onPlayingChange?.(true);
      }
      return;
    }

    // Check if sound is unlocked (browser autoplay policy)
    if (!soundUnlocked) {
      console.log('🔇 Playback blocked - waiting for sound unlock');
      return;
    }

    // Stop YouTube if switching to soundscape
    setIsYouTubePlaying(false);
    setCurrentYouTubeId(null);

    // Get or create audio elements for this soundscape
    let audioElements = audioRefs.current.get(playingElement.name);
    if (!audioElements && playingElement.audioFiles) {
      console.log('🎵 Creating audio elements for:', playingElement.name);
      audioElements = playingElement.audioFiles.map(
        (url: string, idx: number) => {
          const audio = new Audio(url);
          audio.loop = true;
          audio.preload = 'auto';

          // Set volume from state
          const volumes = soundscapeVolumes[playingElement.name] || [];
          audio.volume = volumes[idx] !== undefined ? volumes[idx] : 0.5;

          audio.addEventListener('canplay', () =>
            console.log(`✅ ${playingElement.name} track ${idx + 1} can play`)
          );
          audio.addEventListener('error', (e) =>
            console.error(
              `❌ ${playingElement.name} track ${idx + 1} error:`,
              e
            )
          );

          return audio;
        }
      );
      if (audioElements) {
        audioRefs.current.set(playingElement.name, audioElements);
      }
    }

    // Play all tracks for this soundscape
    if (audioElements) {
      console.log('▶️ Playing:', playingElement.name);
      audioElements.forEach((audio, idx) => {
        audio.currentTime = 0;
        audio
          .play()
          .then(() =>
            console.log(`✅ ${playingElement.name} track ${idx + 1} playing`)
          )
          .catch((err) =>
            console.error(
              `❌ ${playingElement.name} track ${idx + 1} error:`,
              err
            )
          );
      });
      onPlayingChange?.(true);
    }

    // Cleanup: pause audio when component unmounts or playing element changes
    return () => {
      if (audioElements) {
        audioElements.forEach((audio) => audio.pause());
      }
    };
  }, [playingElement, soundUnlocked, onPlayingChange]);
  // Note: soundscapeVolumes removed from dependencies - volume changes are handled by handleVolumeChange

  useLayoutEffect(() => {
    if (!isOpen) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const panelWidth = 560;
    const spaceRight = window.innerWidth - rect.left;
    const spaceLeft = rect.right;
    const shouldAlignRight = spaceRight < panelWidth && spaceLeft >= panelWidth;
    setAlignRight(shouldAlignRight);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);
  return (
    <div className="relative inline-block pointer-events-auto">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-label="Toggle soundscape modal"
        className="stats-item__button"
        ref={triggerRef}
      >
        <Music size={24} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to capture clicks and close settings menu */}
          <div
            className="fixed inset-0 z-[9999]"
            onClick={() => setIsOpen(false)}
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'rgba(0, 0, 0, 0)',
            }}
          />
          <div
            className={`absolute top-full mt-2 z-[10000] max-w-[calc(100vw-16px)] ${
              alignRight ? 'right-0' : 'left-0'
            }`}
          >
            <div
              ref={modalRef}
              className="w-[560px] h-[500px] max-w-[calc(100vw-16px)] max-h-[calc(100vh-16px)] overflow-auto rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="menu-tabs flex items-center px-4 py-3">
                <Music size={24} />
              </div>
              {selectedElement ? (
                // Check if it's a YouTube element or regular soundscape
                selectedElement.isYouTube ? (
                  <YouTubeDetail
                    element={selectedElement}
                    onBack={() => setSelectedElement(null)}
                    isPlaying={isYouTubePlaying}
                    soundUnlocked={soundUnlocked}
                    onStreamChange={handleYouTubeStreamChange}
                    currentStreamId={currentYouTubeId || undefined}
                  />
                ) : (
                  <SoundscapeDetail
                    element={selectedElement}
                    onBack={() => setSelectedElement(null)}
                    volumes={
                      soundscapeVolumes[selectedElement.name] ||
                      Array(selectedElement.audioFiles?.length || 0).fill(0.5)
                    }
                    onVolumeChange={handleVolumeChange}
                  />
                )
              ) : (
                <>
                  <SoundscapeTabs
                    tabs={tagElements as any}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                  <div className="flex-1 overflow-auto p-6">
                    <SoundscapeGrid
                      elements={
                        tagElements.find((tag) => tag.name === activeTab)
                          ?.elements
                      }
                      onSelectElement={setSelectedElement}
                      playingElement={playingElement}
                      onPlayToggle={handlePlayToggle}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Hidden YouTube Player - always present for background playback */}
      {currentYouTubeId && (
        <div
          style={{
            position: 'fixed',
            bottom: '0',
            right: '0',
            width: '1px',
            height: '1px',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        >
          <YouTubePlayer
            videoId={currentYouTubeId}
            isPlaying={isYouTubePlaying}
            soundUnlocked={soundUnlocked}
            onReady={() => console.log('Background YouTube player ready')}
            onError={(error) =>
              console.error('Background YouTube error:', error)
            }
          />
        </div>
      )}
    </div>
  );
}
