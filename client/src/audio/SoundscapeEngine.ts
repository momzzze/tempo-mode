/**
 * Main soundscape engine managing all tracks
 */

import type { TrackKind } from './soundscapes';
import { getSoundscape } from './soundscapes';
import { AudioBufferCache } from './AudioBufferCache';
import { TrackPlayer } from './TrackPlayer';
import { ThunderScheduler } from './ThunderScheduler';

export interface TrackState {
  id: string;
  enabled: boolean;
  volume: number;
  kind: TrackKind;
}

export class SoundscapeEngine {
  private audioContext: AudioContext;
  private cache: AudioBufferCache;
  private currentSoundscapeId: string | null;
  private players: Map<string, TrackPlayer>;
  private schedulers: Map<string, ThunderScheduler>;
  private trackStates: Map<string, TrackState>;
  private isPlaying: boolean;

  constructor() {
    this.audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    this.cache = new AudioBufferCache(this.audioContext);
    this.currentSoundscapeId = null;
    this.players = new Map<string, TrackPlayer>();
    this.schedulers = new Map<string, ThunderScheduler>();
    this.trackStates = new Map<string, TrackState>();
    this.isPlaying = false;
  }

  async selectSoundscape(soundscapeId: string): Promise<void> {
    // Stop current soundscape
    if (this.isPlaying) {
      this.pause();
    }

    // Clear old players
    this.players.forEach((p) => p.dispose());
    this.schedulers.forEach((s) => s.dispose());
    this.players.clear();
    this.schedulers.clear();
    this.trackStates.clear();

    // Load new soundscape
    const soundscape = getSoundscape(soundscapeId);
    if (!soundscape) {
      throw new Error(`Soundscape ${soundscapeId} not found`);
    }

    this.currentSoundscapeId = soundscapeId;

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Create players for all tracks
    for (const track of soundscape.tracks) {
      const state: TrackState = {
        id: track.id,
        enabled: true,
        volume: track.defaultVolume,
        kind: track.kind,
      };
      this.trackStates.set(track.id, state);

      if (track.kind === 'loop') {
        const player = new TrackPlayer(
          this.audioContext,
          this.cache,
          track.url as string,
          track.loop
        );
        player.setVolume(track.defaultVolume, 0);
        this.players.set(track.id, player);
      } else if (track.kind === 'thunder') {
        const scheduler = new ThunderScheduler(
          this.audioContext,
          this.cache,
          track.url as string
        );
        scheduler.setVolume(track.defaultVolume, 0);
        this.schedulers.set(track.id, scheduler);
      }
    }
  }

  async play(): Promise<void> {
    if (this.isPlaying || !this.currentSoundscapeId) return;

    // Resume context if needed
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Start all enabled players
    for (const [trackId, player] of this.players.entries()) {
      const state = this.trackStates.get(trackId);
      if (state?.enabled) {
        try {
          await player.play();
        } catch (err) {
          console.error(`Failed to play track ${trackId}:`, err);
        }
      }
    }

    // Start all enabled schedulers
    for (const [trackId, scheduler] of this.schedulers.entries()) {
      const state = this.trackStates.get(trackId);
      if (state?.enabled) {
        scheduler.start();
      }
    }

    this.isPlaying = true;
  }

  pause(): void {
    if (!this.isPlaying) return;

    // Stop all players
    for (const player of this.players.values()) {
      player.stop();
    }

    // Stop all schedulers
    for (const scheduler of this.schedulers.values()) {
      scheduler.stop();
    }

    this.isPlaying = false;
  }

  async toggleTrack(trackId: string, enabled: boolean): Promise<void> {
    const state = this.trackStates.get(trackId);
    if (!state) return;

    state.enabled = enabled;

    if (enabled && this.isPlaying) {
      // Start playing
      if (state.kind === 'loop') {
        const player = this.players.get(trackId);
        if (player) {
          try {
            await player.play();
          } catch (err) {
            console.error(`Failed to play track ${trackId}:`, err);
          }
        }
      } else if (state.kind === 'thunder') {
        const scheduler = this.schedulers.get(trackId);
        if (scheduler) {
          scheduler.start();
        }
      }
    } else if (!enabled && this.isPlaying) {
      // Stop playing with volume ramp
      if (state.kind === 'loop') {
        const player = this.players.get(trackId);
        if (player) {
          player.setVolume(0, 0.2);
          setTimeout(() => {
            player.stop();
          }, 200);
        }
      } else if (state.kind === 'thunder') {
        const scheduler = this.schedulers.get(trackId);
        if (scheduler) {
          scheduler.setVolume(0, 0.2);
          setTimeout(() => {
            scheduler.stop();
          }, 200);
        }
      }
    }
  }

  setTrackVolume(trackId: string, volume: number): void {
    const state = this.trackStates.get(trackId);
    if (!state) return;

    state.volume = volume;

    if (state.kind === 'loop') {
      const player = this.players.get(trackId);
      if (player) {
        player.setVolume(volume);
      }
    } else if (state.kind === 'thunder') {
      const scheduler = this.schedulers.get(trackId);
      if (scheduler) {
        scheduler.setVolume(volume);
      }
    }
  }

  getTrackStates(): TrackState[] {
    return Array.from(this.trackStates.values());
  }

  getCurrentSoundscapeId(): string | null {
    return this.currentSoundscapeId;
  }

  isPlayingNow(): boolean {
    return this.isPlaying;
  }

  dispose(): void {
    this.pause();
    this.players.forEach((p) => p.dispose());
    this.schedulers.forEach((s) => s.dispose());
    this.players.clear();
    this.schedulers.clear();
    this.trackStates.clear();
    this.cache.clear();
  }
}

// Singleton instance
let engineInstance: SoundscapeEngine | null = null;

export function getAudioEngine(): SoundscapeEngine {
  if (!engineInstance) {
    engineInstance = new SoundscapeEngine();
  }
  return engineInstance;
}

export function disposeAudioEngine(): void {
  if (engineInstance) {
    engineInstance.dispose();
    engineInstance = null;
  }
}
