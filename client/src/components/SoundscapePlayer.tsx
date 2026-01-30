import { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface Sound {
  id: string;
  name: string;
  icon: string;
  url?: string;
}

const SOUNDSCAPES: Sound[] = [
  { id: 'rain', name: 'Rainfall', icon: '🌧️' },
  { id: 'thunder', name: 'Thunderstorm', icon: '⛈️' },
  { id: 'forest', name: 'Forest', icon: '🌲' },
  { id: 'ocean', name: 'Ocean', icon: '🌊' },
  { id: 'cafe', name: 'Café', icon: '☕' },
  { id: 'campfire', name: 'Campfire', icon: '🔥' },
  { id: 'creek', name: 'Creek', icon: '💧' },
  { id: 'birds', name: 'Birds', icon: '🐦' },
];

export function SoundscapePlayer() {
  const [activeTab, setActiveTab] = useState<
    'soundscapes' | 'spotify' | 'youtube'
  >('soundscapes');
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);

  const handlePlay = (soundId: string) => {
    if (playing === soundId) {
      setPlaying(null);
    } else {
      setPlaying(soundId);
      // TODO: Implement actual audio playback
    }
  };

  return (
    <div
      style={{
        width: '280px',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-outer)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'var(--space-3)',
          borderBottom: '1px solid var(--border-inner)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <Volume2 size={20} style={{ color: 'var(--neon-400)' }} />
        <span
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--gray-200)',
          }}
        >
          Sounds
        </span>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-1)',
          padding: 'var(--space-2)',
          borderBottom: '1px solid var(--border-inner)',
        }}
      >
        {(['soundscapes', 'spotify', 'youtube'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: 'var(--space-1) var(--space-2)',
              fontSize: 'var(--font-size-xs)',
              background:
                activeTab === tab ? 'var(--surface-2)' : 'transparent',
              color: activeTab === tab ? 'var(--gray-200)' : 'var(--gray-400)',
              border: 'none',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              transition: 'all 0.15s ease-out',
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          padding: 'var(--space-2)',
          maxHeight: '320px',
          overflowY: 'auto',
        }}
      >
        {activeTab === 'soundscapes' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-2)',
            }}
          >
            {SOUNDSCAPES.map((sound) => (
              <button
                key={sound.id}
                onClick={() => handlePlay(sound.id)}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-1)',
                  background:
                    playing === sound.id
                      ? 'var(--neon-400)/10'
                      : 'var(--surface-2)',
                  border:
                    playing === sound.id
                      ? '1px solid var(--neon-400)'
                      : '1px solid var(--border-outer)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-out',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (playing !== sound.id) {
                    e.currentTarget.style.background = 'var(--surface-3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (playing !== sound.id) {
                    e.currentTarget.style.background = 'var(--surface-2)';
                  }
                }}
              >
                <span style={{ fontSize: '32px' }}>{sound.icon}</span>
                <span
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color:
                      playing === sound.id
                        ? 'var(--neon-400)'
                        : 'var(--gray-300)',
                    fontWeight: 500,
                  }}
                >
                  {sound.name}
                </span>
                {playing === sound.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'var(--space-1)',
                      right: 'var(--space-1)',
                    }}
                  >
                    <Pause size={14} style={{ color: 'var(--neon-400)' }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'spotify' && (
          <div
            style={{
              padding: 'var(--space-4)',
              textAlign: 'center',
              color: 'var(--gray-400)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Spotify integration coming soon
          </div>
        )}

        {activeTab === 'youtube' && (
          <div
            style={{
              padding: 'var(--space-4)',
              textAlign: 'center',
              color: 'var(--gray-400)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            YouTube integration coming soon
          </div>
        )}
      </div>

      {/* Volume Control */}
      <div
        style={{
          padding: 'var(--space-2) var(--space-3)',
          borderTop: '1px solid var(--border-inner)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <Volume2 size={16} style={{ color: 'var(--gray-400)' }} />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{
            flex: 1,
            height: '4px',
            background: 'var(--surface-2)',
            borderRadius: '2px',
            outline: 'none',
            cursor: 'pointer',
          }}
        />
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--gray-400)',
            minWidth: '32px',
          }}
        >
          {volume}%
        </span>
      </div>
    </div>
  );
}
