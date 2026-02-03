import * as LucideIcons from 'lucide-react';
import { getSoundscape } from '../../audio/soundscapes';
import { useSoundscapeEngine } from '../../hooks/useSoundscapeEngine';
import { DraggablePanel } from '../DraggablePanel';

interface NowPlayingPanelProps {}

export function NowPlayingPanel({}: NowPlayingPanelProps) {
  const { currentSoundscapeId, tracks, toggleTrack, setTrackVolume } =
    useSoundscapeEngine();

  if (!currentSoundscapeId) return null;

  const soundscape = getSoundscape(currentSoundscapeId);
  if (!soundscape) return null;

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={16} strokeWidth={2} /> : null;
  };

  return (
    <DraggablePanel
      id="now-playing-panel"
      title={soundscape.name}
      initialPosition={{ x: 320, y: 140 }}
      className="max-w-xs"
    >
      <div className="w-full max-h-[300px] overflow-y-auto">
        {soundscape.tracks.map((track) => {
          const trackState = tracks.find((t) => t.id === track.id);
          if (!trackState) return null;

          return (
            <div
              key={track.id}
              className="flex items-center gap-3 p-3 border-b border-[var(--border-inner)] last:border-b-0"
            >
              {/* Toggle Button */}
              <button
                className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center transition-all border drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${
                  trackState.enabled
                    ? 'bg-white/15 border-[var(--neon-400)] text-white'
                    : 'bg-transparent border-white/10 text-white/50'
                }`}
                onClick={() => toggleTrack(track.id, !trackState.enabled)}
                title={trackState.enabled ? 'Disable' : 'Enable'}
              >
                <span className="flex items-center justify-center">
                  {getIconComponent(track.icon)}
                </span>
              </button>

              {/* Controls */}
              <div className="flex-1 flex flex-col gap-2 min-w-0">
                <label className="text-xs font-medium text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  {track.label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={trackState.volume * 100}
                    onChange={(e) =>
                      setTrackVolume(track.id, Number(e.target.value) / 100)
                    }
                    disabled={!trackState.enabled}
                    className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer transition-opacity ${
                      trackState.enabled ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      background: trackState.enabled
                        ? `linear-gradient(to right, rgb(255,255,255,0.1) 0%, var(--neon-400) ${trackState.volume * 100}%, rgb(255,255,255,0.1) ${trackState.volume * 100}%, rgb(255,255,255,0.1) 100%)`
                        : 'rgb(255,255,255,0.1)',
                    }}
                  />
                  <span className="text-xs text-white/60 w-8 text-right drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                    {Math.round(trackState.volume * 100)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DraggablePanel>
  );
}
