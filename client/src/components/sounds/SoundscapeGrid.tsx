import './sounds.css';
import { Play } from 'lucide-react';

interface SoundscapeElement {
  name: string;
  audioFiles?: string[];
}

interface SoundscapeGridProps {
  elements?: SoundscapeElement[];
  onSelectElement?: (element: SoundscapeElement) => void;
  playingElement?: SoundscapeElement | null;
  onPlayToggle?: (element: SoundscapeElement) => void;
}

export function SoundscapeGrid({
  elements,
  onSelectElement,
  playingElement,
  onPlayToggle,
}: SoundscapeGridProps) {
  if (!elements || elements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 ">
        No items available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 spacing">
      {elements.map((element) => {
        const isPlaying = playingElement?.name === element.name;
        return (
          <div
            key={element.name}
            className="aspect-square bg-gray-600 rounded-lg flex items-center justify-center text-center p-2 hover:bg-gray-500 cursor-pointer transition-colors relative group"
            onClick={() => onSelectElement?.(element)}
          >
            <span className="text-white font-medium">{element.name}</span>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayToggle?.(element);
                }}
                className={`p-3 rounded-full transition-colors ${
                  isPlaying
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                <Play size={24} fill="white" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
