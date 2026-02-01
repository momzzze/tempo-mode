import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Music } from 'lucide-react';
import { SoundscapeTabs } from './sounds/SoundscapeTabs';
import { SoundscapeGrid } from './sounds/SoundscapeGrid';
import { SoundscapeDetail } from './sounds/SoundscapeDetail';
import './SoundscrapePlayer.css';

const RAINFALL_URL =
  'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/rainfall/ambiance-heavy-rain-loop.ogg';
const RAINFALL_UMBRELLA_URL =
  'https://pub-f15639bb028e401aadde6f4e84b409ea.r2.dev/soundscapes/rainfall/rain-medium-umbrella.ogg';

const tagElements = [
  {
    name: 'Soundscapes',
    elements: [
      {
        name: 'Rainfall',
        audioFiles: [RAINFALL_URL, RAINFALL_UMBRELLA_URL],
      },
      { name: 'Thunderstorm', audioFiles: [] },
      { name: 'Garden', audioFiles: [] },
      { name: 'River', audioFiles: [] },
      { name: 'Forest', audioFiles: [] },
    ],
  },
  { name: 'Youtube' },
  { name: 'Spotify' },
];

export interface SoundscapePlayerProps {
  timerMode?: 'focus' | 'break';
  isRunning?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
}

export function SoundscapePlayer({
  timerMode = 'focus',
  isRunning = false,
  onPlayingChange,
}: SoundscapePlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Soundscapes');
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [playingElement, setPlayingElement] = useState<any | null>(null);
  const [alignRight, setAlignRight] = useState(false);
  const [rainfallVolumes, setRainfallVolumes] = useState([0.5, 0.5]);

  // Direct ref for audio
  const rainfallAudio = useRef<HTMLAudioElement>(null);
  const rainfallUmbrellaAudio = useRef<HTMLAudioElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Load last played soundscape from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lastPlayedSoundscape');
    if (saved) {
      const element = tagElements
        .flatMap((tab) => tab.elements || [])
        .find((el) => el.name === saved);
      if (element) {
        console.log('📝 Loaded last soundscape:', saved);
        setSelectedElement(element);
      }
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
      setPlayingElement(null);
      return;
    }

    // Auto-play when in focus mode and running
    if (timerMode === 'focus' && isRunning) {
      // Get last played soundscape, or default to Rainfall
      let saved = localStorage.getItem('lastPlayedSoundscape');
      console.log('💾 Saved soundscape from localStorage:', saved);

      // Default to Rainfall if nothing saved
      if (!saved) {
        saved = 'Rainfall';
        console.log('📢 No saved soundscape, defaulting to Rainfall');
      }

      const element = tagElements
        .flatMap((tab) => tab.elements || [])
        .find((el) => el.name === saved);

      console.log('🎵 Found element:', element?.name);

      if (element) {
        console.log('▶️ Setting playingElement to:', element.name);
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
    } else {
      setPlayingElement(element);
    }
  };

  const handleVolumeChange = (index: number, value: number) => {
    console.log('🔊 Volume changed:', index, value);
    const newVolumes = [...rainfallVolumes];
    newVolumes[index] = value;
    setRainfallVolumes(newVolumes);

    // Apply volume to audio element
    if (index === 0 && rainfallAudio.current) {
      rainfallAudio.current.volume = value;
    } else if (index === 1 && rainfallUmbrellaAudio.current) {
      rainfallUmbrellaAudio.current.volume = value;
    }
  };

  // Simple play/pause effect
  useEffect(() => {
    console.log('🎵 playingElement:', playingElement?.name);
    if (!rainfallAudio.current) {
      console.log('❌ Audio element not found');
      return;
    }

    console.log('📍 Audio src:', rainfallAudio.current.src);
    console.log('📍 Audio readyState:', rainfallAudio.current.readyState);

    if (playingElement?.name === 'Rainfall') {
      console.log('▶️ Playing rainfall');
      rainfallAudio.current.currentTime = 0;
      rainfallUmbrellaAudio.current.currentTime = 0;
      rainfallAudio.current
        .play()
        .then(() => {
          console.log('✅ Ambiance playing');
          onPlayingChange?.(true);
        })
        .catch((err) => console.error('❌ Error:', err));
      rainfallUmbrellaAudio.current
        .play()
        .then(() => console.log('✅ Umbrella playing'))
        .catch((err) => console.error('❌ Error:', err));
    } else {
      console.log('⏸️ Pausing');
      rainfallAudio.current.pause();
      rainfallUmbrellaAudio.current.pause();
      onPlayingChange?.(false);
    }
  }, [playingElement, onPlayingChange]);

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
  return (
    <div className="relative inline-block pointer-events-auto">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-label="Toggle soundscape modal"
        className="pointer-events-auto z-50 relative flex items-center justify-center"
        ref={triggerRef}
      >
        <Music size={20} />
      </button>

      {/* Single rainfall audio element */}
      <audio
        ref={rainfallAudio}
        src={RAINFALL_URL}
        loop
        preload="auto"
        onCanPlay={() => console.log('✅ Ambiance can play')}
        onLoadStart={() => console.log('📥 Loading ambiance')}
        onError={(e) =>
          console.error(
            '❌ Ambiance error:',
            (e.target as HTMLAudioElement).error
          )
        }
      />
      <audio
        ref={rainfallUmbrellaAudio}
        src={RAINFALL_UMBRELLA_URL}
        loop
        preload="auto"
        onCanPlay={() => console.log('✅ Umbrella can play')}
        onLoadStart={() => console.log('📥 Loading umbrella')}
        onError={(e) =>
          console.error(
            '❌ Umbrella error:',
            (e.target as HTMLAudioElement).error
          )
        }
      />

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
                <SoundscapeDetail
                  element={selectedElement}
                  onBack={() => setSelectedElement(null)}
                  volumes={
                    selectedElement.name === 'Rainfall' ? rainfallVolumes : []
                  }
                  onVolumeChange={handleVolumeChange}
                />
              ) : (
                <>
                  <SoundscapeTabs
                    tabs={tagElements}
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
    </div>
  );
}
