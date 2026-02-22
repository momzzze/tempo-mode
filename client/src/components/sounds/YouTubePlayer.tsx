import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  isPlaying: boolean;
  soundUnlocked?: boolean;
  onReady?: () => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function YouTubePlayer({
  videoId,
  isPlaying,
  soundUnlocked = true,
  onReady,
  onError,
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const previousVideoIdRef = useRef<string>(videoId);

  // Store callbacks and values as refs to prevent dependency array issues
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const isPlayingRef = useRef(isPlaying);
  const volumeRef = useRef(volume);

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
    isPlayingRef.current = isPlaying;
    volumeRef.current = volume;
  }, [onReady, onError, isPlaying, volume]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // API will call this function when ready
    window.onYouTubeIframeAPIReady = () => {
      console.log('✅ YouTube API ready');
      setIsApiReady(true);
    };
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (!isApiReady || !containerRef.current) return;

    // If video ID changed, destroy old player
    if (playerRef.current && previousVideoIdRef.current !== videoId) {
      console.log('🔄 Video changed, destroying old player');
      playerRef.current.destroy();
      playerRef.current = null;
      setIsPlayerReady(false);
    }

    if (playerRef.current) return; // Player already exists for this video

    console.log('🎬 Creating YouTube player for:', videoId);
    previousVideoIdRef.current = videoId;

    playerRef.current = new window.YT.Player(containerRef.current, {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        autoplay: 1, // Enable autoplay
        controls: 1,
        modestbranding: 1,
        rel: 0,
        fs: 0,
        loop: 1,
        playlist: videoId, // Required for looping single video
      },
      events: {
        onReady: (event: any) => {
          console.log('✅ YouTube player ready for:', videoId);
          event.target.setVolume(volumeRef.current);
          setIsPlayerReady(true);

          // If we're supposed to be playing, start now
          if (isPlayingRef.current) {
            console.log('▶️ Auto-playing on ready');
            event.target.playVideo();
          } else {
            console.log('⏸️ Pausing on ready (isPlaying=false)');
            event.target.pauseVideo();
          }

          onReadyRef.current?.();
        },
        onError: (event: any) => {
          console.error('❌ YouTube player error:', event.data);
          onErrorRef.current?.(event.data);
        },
        onStateChange: (event: any) => {
          console.log('🎬 YouTube state:', event.data);
        },
      },
    });

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        console.log('🗑️ Destroying YouTube player');
        playerRef.current.destroy();
        playerRef.current = null;
        setIsPlayerReady(false);
      }
    };
  }, [isApiReady, videoId]); // Only recreate on API ready or video ID change

  // Control playback when isPlaying changes
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) {
      console.log('⏳ Waiting for player to be ready...');
      return;
    }

    const checkPlayerReady = () => {
      try {
        if (isPlaying) {
          console.log('▶️ Playing YouTube video');
          playerRef.current.playVideo();
        } else {
          console.log('⏸️ Pausing YouTube video');
          playerRef.current.pauseVideo();
        }
      } catch (error) {
        console.error('YouTube playback error:', error);
      }
    };

    // Small delay to ensure player methods are available
    const timeout = setTimeout(checkPlayerReady, 100);
    return () => clearTimeout(timeout);
  }, [isPlaying, isPlayerReady, soundUnlocked]);

  // Update volume when it changes
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return;
    try {
      playerRef.current.setVolume(volume);
    } catch (error) {
      console.error('Error setting YouTube volume:', error);
    }
  }, [volume, isPlayerReady]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;

    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <div
      className="youtube-player-container"
      style={{ width: '100%', height: '100%' }}
    >
      <div
        ref={containerRef}
        className="youtube-player-iframe"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '240px',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      />

      {/* Volume controls - hidden in compact view */}
      <div
        className="youtube-player-controls"
        style={{
          marginTop: '16px',
          display: 'none', // Hide controls when player is in card
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={toggleMute}
          className="youtube-volume-button"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div style={{ flex: 1, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              height: '4px',
              width: `${volume}%`,
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '2px',
              pointerEvents: 'none',
            }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            style={{
              width: '100%',
              cursor: 'pointer',
            }}
          />
        </div>

        <span
          style={{
            minWidth: '40px',
            textAlign: 'right',
            fontSize: '14px',
            opacity: 0.7,
          }}
        >
          {volume}%
        </span>
      </div>
    </div>
  );
}
