import { ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface SoundscapeElement {
  name: string;
  audioFiles?: string[];
  icon?: string;
}

interface SoundscapeDetailProps {
  element: SoundscapeElement;
  onBack: () => void;
  volumes: number[];
  onVolumeChange: (index: number, value: number) => void;
}

const getIconComponent = (iconName?: string) => {
  if (!iconName) return null;
  const Icon = (LucideIcons as any)[iconName];
  return Icon ? <Icon size={28} strokeWidth={1.5} /> : null;
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
                const trackNames = ['Ambiance', 'Medium Rain'];
                return (
                  <div key={idx} className="soundscape-detail__track">
                    <div className="soundscape-detail__track-header">
                      <label className="soundscape-detail__track-label">
                        {trackNames[idx] || `Track ${idx + 1}`}
                      </label>
                      <span className="soundscape-detail__track-percent">
                        {Math.round(volumes[idx] * 100)}%
                      </span>
                    </div>
                    <div className="soundscape-detail__slider-container">
                      <div
                        className="soundscape-detail__slider-fill"
                        style={{ width: `${volumes[idx] * 100}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volumes[idx]}
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
