import { useState } from 'react';
import { Music2, Clock, ArrowRight, Play, Pause } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { SOUNDSCAPES } from '../../audio/soundscapes';
import { useSoundscapeEngine } from '../../hooks/useSoundscapeEngine';
import { DraggablePanel } from '../DraggablePanel';
import './SoundsPanel.css';

type TabType = 'recent' | 'soundscapes' | 'spotify' | 'youtube' | 'custom';

export function SoundsPanel() {
  const { currentSoundscapeId, isPlaying, selectSoundscape, play, pause } =
    useSoundscapeEngine();
  const [activeTab, setActiveTab] = useState<TabType>('soundscapes');

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? (
      <Icon size={32} strokeWidth={1.5} />
    ) : (
      <Music2 size={32} strokeWidth={1.5} />
    );
  };

  return (
    <DraggablePanel
      id="sounds-panel"
      title="Sounds"
      initialPosition={{ x: 24, y: 140 }}
    >
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {/* Tabs */}
        <div className="flex gap-1 flex-wrap">
          <button
            className={`px-2 py-1 text-xs rounded transition-all flex items-center gap-1 ${
              activeTab === 'recent'
                ? 'bg-[var(--neon-400)] text-[var(--gray-900)] font-semibold'
                : 'bg-transparent text-[var(--gray-400)] hover:bg-white/10'
            }`}
            onClick={() => setActiveTab('recent')}
          >
            <Clock size={14} />
            <span>Recent</span>
          </button>
          <button
            className={`px-2 py-1 text-xs rounded transition-all ${
              activeTab === 'soundscapes'
                ? 'bg-[var(--neon-400)] text-[var(--gray-900)] font-semibold'
                : 'bg-transparent text-[var(--gray-400)] hover:bg-white/10'
            }`}
            onClick={() => setActiveTab('soundscapes')}
          >
            Soundscapes
          </button>
          <button
            className={`px-2 py-1 text-xs rounded transition-all ${
              activeTab === 'spotify'
                ? 'bg-[var(--neon-400)] text-[var(--gray-900)] font-semibold'
                : 'bg-transparent text-[var(--gray-400)] hover:bg-white/10'
            }`}
            onClick={() => setActiveTab('spotify')}
          >
            Spotify
          </button>
          <button
            className={`px-2 py-1 text-xs rounded transition-all ${
              activeTab === 'youtube'
                ? 'bg-[var(--neon-400)] text-[var(--gray-900)] font-semibold'
                : 'bg-transparent text-[var(--gray-400)] hover:bg-white/10'
            }`}
            onClick={() => setActiveTab('youtube')}
          >
            YouTube
          </button>
          <button
            className={`px-2 py-1 text-xs rounded transition-all ${
              activeTab === 'custom'
                ? 'bg-[var(--neon-400)] text-[var(--gray-900)] font-semibold'
                : 'bg-transparent text-[var(--gray-400)] hover:bg-white/10'
            }`}
            onClick={() => setActiveTab('custom')}
          >
            Custom
          </button>
          <button className="ml-auto px-2 py-1 text-xs rounded transition-all flex items-center gap-1 text-[var(--neon-400)] hover:bg-[rgba(var(--neon-400-rgb),0.1)]">
            <span>Now Playing</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Content */}
        {activeTab === 'soundscapes' && (
          <div className="sounds-panel__soundscapes">
            {SOUNDSCAPES.map((soundscape) => {
              const isActive = currentSoundscapeId === soundscape.id;
              return (
                <div
                  key={soundscape.id}
                  className={`sounds-panel__soundscape-item ${
                    isActive ? 'sounds-panel__soundscape-item--active' : ''
                  }`}
                  onClick={() => selectSoundscape(soundscape.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="sounds-panel__soundscape-icon">
                    {getIconComponent(soundscape.icon)}
                  </div>
                  <div className="sounds-panel__soundscape-name">
                    {soundscape.name}
                  </div>
                  {isActive && (
                    <button
                      className="sounds-panel__play-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        isPlaying ? pause() : play();
                      }}
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause size={16} fill="white" />
                      ) : (
                        <Play size={16} fill="white" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab !== 'soundscapes' && (
          <div className="p-4 text-center text-white/50 text-xs">
            Coming soon...
          </div>
        )}
      </div>
    </DraggablePanel>
  );
}
