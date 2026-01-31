import { ArrowLeft } from 'lucide-react';

interface SoundscapeElement {
  name: string;
  audioFiles?: string[];
}

interface SoundscapeDetailProps {
  element: SoundscapeElement;
  onBack: () => void;
  volumes: number[];
  onVolumeChange: (index: number, value: number) => void;
}

export function SoundscapeDetail({
  element,
  onBack,
  volumes,
  onVolumeChange,
}: SoundscapeDetailProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-gray-900 font-medium rounded-md transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {element.name}
          </h2>

          {element.audioFiles && element.audioFiles.length > 0 ? (
            <div className="space-y-6">
              {element.audioFiles.map((url, idx) => {
                const trackNames = ['Ambiance', 'Medium Rain'];
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-300">
                        {trackNames[idx] || `Track ${idx + 1}`}
                      </label>
                      <span className="text-xs text-gray-500">
                        {Math.round(volumes[idx] * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative h-6 bg-gray-700 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
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
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-300 text-center">
              No audio files available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
