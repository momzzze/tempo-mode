import './sounds.css';
import { Play, Pause } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface SoundscapeElement {
  name: string;
  audioFiles?: string[];
  icon?: string;
}

interface SoundscapeGridProps {
  elements?: SoundscapeElement[];
  onSelectElement?: (element: SoundscapeElement) => void;
  playingElement?: SoundscapeElement | null;
  onPlayToggle?: (element: SoundscapeElement) => void;
}

const getIconComponent = (iconName?: string) => {
  if (!iconName) return null;
  const Icon = (LucideIcons as any)[iconName];
  return Icon ? <Icon size={20} strokeWidth={1.5} /> : null;
};

export function SoundscapeGrid({
  elements,
  onSelectElement,
  playingElement,
  onPlayToggle,
}: SoundscapeGridProps) {
  if (!elements || elements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No items available
      </div>
    );
  }

  return (
    <div className="soundscape-grid">
      {elements.map((element) => {
        const isPlaying = playingElement?.name === element.name;
        return (
          <div
            key={element.name}
            className={`soundscape-grid__item ${
              isPlaying ? 'soundscape-grid__item--active' : ''
            }`}
            onClick={() => onSelectElement?.(element)}
            role="button"
            tabIndex={0}
          >
            {getIconComponent(element.icon) && (
              <div className="soundscape-grid__icon">
                {getIconComponent(element.icon)}
              </div>
            )}
            <div className="soundscape-grid__name">{element.name}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayToggle?.(element);
              }}
              className="soundscape-grid__play-button"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={16} fill="white" />
              ) : (
                <Play size={16} fill="white" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
