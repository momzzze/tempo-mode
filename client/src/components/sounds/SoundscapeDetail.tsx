import { ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Track {
  name: string;
  url: string;
  icon: string;
}

interface SoundscapeElement {
  name: string;
  audioFiles?: string[];
  icon?: string;
  tracks?: Track[];
}

interface SoundscapeDetailProps {
  element: SoundscapeElement;
  onBack: () => void;
  volumes: number[];
  onVolumeChange: (index: number, value: number) => void;
}

const getIconComponent = (iconName?: string, size: number = 28) => {
  if (!iconName) return null;
  const Icon = (LucideIcons as any)[iconName];
  return Icon ? <Icon size={size} strokeWidth={1.5} /> : null;
};

export function SoundscapeDetail({
  element,
  onBack,
  volumes,
  onVolumeChange,
}: SoundscapeDetailProps) {
  return (
    <div className="soundscape-detail">
      <div className="soundscape-detail__header">
        <button
          onClick={onBack}
          className="soundscape-detail__back"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className="soundscape-detail__content">
        <div className="soundscape-detail__inner">
          {/* Header with icon and title */}
          <div className="soundscape-detail__title-section">
            {getIconComponent(element.icon) && (
              <div className="soundscape-detail__icon">
                {getIconComponent(element.icon)}
              </div>
            )}
            <h2 className="soundscape-detail__title">{element.name}</h2>
          </div>

          {element.audioFiles && element.audioFiles.length > 0 ? (
            <div className="soundscape-detail__tracks">
              {element.audioFiles.map((_, idx) => {
                // Get track info from tracks array if available
                const track = element.tracks?.[idx];
                const trackName = track?.name || `Track ${idx + 1}`;
                const trackIcon = track?.icon;

                return (
                  <div key={idx} className="soundscape-detail__track">
                    <div className="soundscape-detail__track-header">
                      <div className="flex items-center gap-2">
                        {trackIcon && (
                          <div className="opacity-70">
                            {getIconComponent(trackIcon, 18)}
                          </div>
                        )}
                        <label className="soundscape-detail__track-label">
                          {trackName}
                        </label>
                      </div>
                      <span className="soundscape-detail__track-percent">
                        {Math.round((volumes[idx] || 0) * 100)}%
                      </span>
                    </div>
                    <div className="soundscape-detail__slider-container">
                      <div
                        className="soundscape-detail__slider-fill"
                        style={{ width: `${(volumes[idx] || 0) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volumes[idx] || 0}
                        onChange={(e) =>
                          onVolumeChange(idx, parseFloat(e.target.value))
                        }
                        className="soundscape-detail__slider-input"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="soundscape-detail__empty">No audio files available</p>
          )}
        </div>
      </div>
    </div>
  );
}
