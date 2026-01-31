/**
 * React hook for soundscape engine
 */

import { useState, useEffect, useCallback } from 'react';
import { getAudioEngine } from '../audio/SoundscapeEngine';
import type { TrackState } from '../audio/SoundscapeEngine';

interface UseSoundscapeEngineState {
  currentSoundscapeId: string | null;
  isPlaying: boolean;
  tracks: TrackState[];
  error: string | null;
}

interface UseSoundscapeEngineActions {
  selectSoundscape: (id: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  toggleTrack: (trackId: string, enabled: boolean) => Promise<void>;
  setTrackVolume: (trackId: string, volume: number) => void;
}

export function useSoundscapeEngine(): UseSoundscapeEngineState &
  UseSoundscapeEngineActions {
  const [state, setState] = useState<UseSoundscapeEngineState>({
    currentSoundscapeId: null,
    isPlaying: false,
    tracks: [],
    error: null,
  });

  const engine = getAudioEngine();

  useEffect(() => {
    // Update state on engine changes
    const updateState = () => {
      setState((prev) => ({
        ...prev,
        currentSoundscapeId: engine.getCurrentSoundscapeId(),
        isPlaying: engine.isPlayingNow(),
        tracks: engine.getTrackStates(),
      }));
    };

    // Poll for state changes (rough approach, ideally engine would have events)
    const interval = setInterval(updateState, 100);

    return () => clearInterval(interval);
  }, [engine]);

  const selectSoundscape = useCallback(
    async (id: string) => {
      try {
        setState((prev) => ({ ...prev, error: null }));
        await engine.selectSoundscape(id);
        setState((prev) => ({
          ...prev,
          currentSoundscapeId: engine.getCurrentSoundscapeId(),
          tracks: engine.getTrackStates(),
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setState((prev) => ({ ...prev, error: message }));
        console.error('Failed to select soundscape:', err);
      }
    },
    [engine]
  );

  const play = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      await engine.play();
      setState((prev) => ({
        ...prev,
        isPlaying: engine.isPlayingNow(),
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setState((prev) => ({ ...prev, error: message }));
      console.error('Failed to play:', err);
    }
  }, [engine]);

  const pause = useCallback(() => {
    engine.pause();
    setState((prev) => ({
      ...prev,
      isPlaying: engine.isPlayingNow(),
    }));
  }, [engine]);

  const toggleTrack = useCallback(
    async (trackId: string, enabled: boolean) => {
      try {
        setState((prev) => ({ ...prev, error: null }));
        await engine.toggleTrack(trackId, enabled);
        setState((prev) => ({
          ...prev,
          tracks: engine.getTrackStates(),
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setState((prev) => ({ ...prev, error: message }));
        console.error('Failed to toggle track:', err);
      }
    },
    [engine]
  );

  const setTrackVolume = useCallback(
    (trackId: string, volume: number) => {
      engine.setTrackVolume(trackId, volume);
      setState((prev) => ({
        ...prev,
        tracks: engine.getTrackStates(),
      }));
    },
    [engine]
  );

  return {
    currentSoundscapeId: state.currentSoundscapeId,
    isPlaying: state.isPlaying,
    tracks: state.tracks,
    error: state.error,
    selectSoundscape,
    play,
    pause,
    toggleTrack,
    setTrackVolume,
  };
}
