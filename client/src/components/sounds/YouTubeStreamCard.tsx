import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { YouTubePlayer } from './YouTubePlayer';

interface YouTubeStream {
  name: string;
  id: string;
  icon: string;
}

interface YouTubeStreamCardProps {
  stream: YouTubeStream;
  isSelected: boolean;
  isPlaying: boolean;
  soundUnlocked: boolean;
  onSelect: (streamId: string) => void;
}

const getIconComponent = (iconName?: string, size: number = 24) => {
  if (!iconName) return null;
  const Icon = (LucideIcons as any)[iconName];
  return Icon ? <Icon size={size} strokeWidth={1.5} /> : null;
};

export function YouTubeStreamCard({
  stream,
  isSelected,
  isPlaying,
  soundUnlocked,
  onSelect,
}: YouTubeStreamCardProps) {
  const [cardIsPlaying, setCardIsPlaying] = useState(isSelected && isPlaying);

  const handlePlayToggle = () => {
    onSelect(stream.id);
    setCardIsPlaying(true);
  };

  return (
    <div
      className={`youtube-stream-card ${isSelected ? 'selected' : ''}`}
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
          : 'rgba(255, 255, 255, 0.05)',
        border: isSelected
          ? '1px solid rgba(74, 222, 128, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
      }}
    >
      {/* Header with icon and stream name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ opacity: 0.8 }}>{getIconComponent(stream.icon, 20)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {stream.name}
          </div>
        </div>
      </div>

      {/* Mini player display */}
      <div
        style={{
          width: '100%',
          height: '240px',
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Hidden YouTube Player - only renders when selected */}
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              borderRadius: '8px',
            }}
          >
            <YouTubePlayer
              videoId={stream.id}
              isPlaying={cardIsPlaying}
              soundUnlocked={soundUnlocked}
              onReady={() =>
                console.log(`✅ Card player ready: ${stream.name}`)
              }
              onError={(error) =>
                console.error(`Card player error for ${stream.name}:`, error)
              }
            />
          </div>
        )}

        {/* Play button overlay when not selected */}
        {!isSelected && (
          <button
            onClick={handlePlayToggle}
            style={{
              background: 'rgba(74, 222, 128, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(74, 222, 128, 1)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(74, 222, 128, 0.9)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={`Play ${stream.name}`}
          >
            <Play size={28} color="#000" fill="#000" />
          </button>
        )}

        {/* Status indicator for selected card */}
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0, 0, 0, 0.6)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {cardIsPlaying ? (
              <>
                <Pause size={14} style={{ color: '#4ade80' }} />
                <span style={{ color: '#4ade80' }}>Playing</span>
              </>
            ) : (
              <>
                <Play size={14} style={{ opacity: 0.6 }} />
                <span style={{ opacity: 0.6 }}>Paused</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Selected indicator badge */}
      {isSelected && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#4ade80',
            fontWeight: 500,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#4ade80',
            }}
          />
          Selected
        </div>
      )}
    </div>
  );
}
