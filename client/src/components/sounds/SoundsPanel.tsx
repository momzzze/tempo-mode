import { useState } from 'react';
import { Music2, Clock, ArrowRight, Play, Pause } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { SOUNDSCAPES } from '../../audio/soundscapes';
import { useSoundscapeEngine } from '../../hooks/useSoundscapeEngine';
import { DraggablePanel } from '../DraggablePanel';

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
          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {SOUNDSCAPES.map((soundscape) => {
              const isActive = currentSoundscapeId === soundscape.id;
              return (
                <div key={soundscape.id} className="aspect-square relative">
                  <button
                    className={`w-full h-full flex flex-col items-center justify-center gap-1 rounded-md cursor-pointer transition-all p-2 border ${
                      isActive
                        ? 'bg-white/15 border-[var(--neon-400)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => selectSoundscape(soundscape.id)}
                  >
                    <div className="text-white flex items-center justify-center">
                      {getIconComponent(soundscape.icon)}
                    </div>
                    <div
                      className={`text-xs font-medium text-center ${
                        isActive ? 'text-[var(--neon-400)]' : 'text-white/70'
                      }`}
                    >
                      {soundscape.name}
                    </div>
                    {isActive && (
                      <button
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[var(--neon-400)] flex items-center justify-center text-white cursor-pointer z-10 shadow-lg transition-all hover:scale-110 active:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          isPlaying ? pause() : play();
                        }}
                      >
                        {isPlaying ? (
                          <Pause size={18} fill="white" />
                        ) : (
                          <Play size={18} fill="white" />
                        )}
                      </button>
                    )}
                  </button>
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
