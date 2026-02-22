import { ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useState, useEffect } from 'react';
import { YouTubeStreamCard } from './YouTubeStreamCard';

interface YouTubeStream {
  name: string;
  id: string;
  icon: string;
}

interface YouTubeElement {
  name: string;
  icon?: string;
  streams?: YouTubeStream[];
}

interface YouTubeDetailProps {
  element: YouTubeElement;
  onBack: () => void;
  isPlaying: boolean;
  soundUnlocked?: boolean;
  onStreamChange?: (streamId: string) => void;
  currentStreamId?: string;
}

const getIconComponent = (iconName?: string, size: number = 28) => {
  if (!iconName) return null;
  const Icon = (LucideIcons as any)[iconName];
  return Icon ? <Icon size={size} strokeWidth={1.5} /> : null;
};

export function YouTubeDetail({
  element,
  onBack,
  isPlaying,
  soundUnlocked = true,
  onStreamChange,
  currentStreamId,
}: YouTubeDetailProps) {
  const streams = element.streams || [];

  // Find current stream or default to first
  const [selectedStreamId, setSelectedStreamId] = useState<string>(
    currentStreamId || streams[0]?.id || ''
  );

  // Update parent component when stream changes
  useEffect(() => {
    if (selectedStreamId && onStreamChange) {
      onStreamChange(selectedStreamId);
    }
  }, [selectedStreamId, onStreamChange]);

  const handleStreamSelect = (streamId: string) => {
    setSelectedStreamId(streamId);
  };

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

          {streams.length > 0 ? (
            <>
              {/* Info text */}
              <div
                style={{
                  marginTop: '16px',
                  fontSize: '13px',
                  opacity: 0.6,
                  lineHeight: '1.5',
                }}
              >
                Click any stream card to play. Select a card to see its player.
                The stream runs in the background - you can close this panel and
                it will keep playing.
              </div>

              {/* Scrollable Stream Cards Grid */}
              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    opacity: 0.7,
                    fontWeight: 500,
                  }}
                >
                  Available Streams:
                </div>
                <div
                  className="hidden-scrollbar"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '12px',
                    maxHeight: 'calc(100vh - 300px)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingRight: '8px',
                  }}
                >
                  {streams.map((stream) => (
                    <YouTubeStreamCard
                      key={stream.id}
                      stream={stream}
                      isSelected={selectedStreamId === stream.id}
                      isPlaying={isPlaying}
                      soundUnlocked={soundUnlocked}
                      onSelect={handleStreamSelect}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p style={{ marginTop: '20px', opacity: 0.6 }}>
              No streams available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
