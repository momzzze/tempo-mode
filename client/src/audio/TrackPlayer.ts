/**
 * Track player for looped audio tracks
 */

import { AudioBufferCache } from './AudioBufferCache';

export class TrackPlayer {
  private source: AudioBufferSourceNode | null;
  private gainNode: GainNode;
  private isPlaying: boolean;
  private currentVolume: number;
  private audioContext: AudioContext;
  private cache: AudioBufferCache;
  private url: string;
  private loop: boolean;

  constructor(
    audioContext: AudioContext,
    cache: AudioBufferCache,
    url: string,
    loop: boolean
  ) {
    this.audioContext = audioContext;
    this.cache = cache;
    this.url = url;
    this.loop = loop;
    this.source = null;
    this.isPlaying = false;
    this.currentVolume = 0;
    this.gainNode = audioContext.createGain();
    this.gainNode.connect(audioContext.destination);
  }

  getGainNode(): GainNode {
    return this.gainNode;
  }

  async play(): Promise<void> {
    if (this.isPlaying) return;

    try {
      const buffer = await this.cache.get(this.url);
      this.createAndStartSource(buffer);
      this.isPlaying = true;
    } catch (err) {
      console.error(`Failed to play track ${this.url}:`, err);
      throw err;
    }
  }

  stop(): void {
    if (this.source) {
      try {
        this.source.stop();
      } catch {
        // Already stopped
      }
      this.source = null;
    }
    this.isPlaying = false;
  }

  setVolume(volume: number, rampTime: number = 0.2): void {
    const targetVolume = Math.max(0, Math.min(1, volume));
    this.currentVolume = targetVolume;

    if (rampTime > 0) {
      this.gainNode.gain.linearRampToValueAtTime(
        targetVolume,
        this.audioContext.currentTime + rampTime
      );
    } else {
      this.gainNode.gain.setValueAtTime(
        targetVolume,
        this.audioContext.currentTime
      );
    }
  }

  getVolume(): number {
    return this.currentVolume;
  }

  isPlayingNow(): boolean {
    return this.isPlaying;
  }

  private createAndStartSource(buffer: AudioBuffer): void {
    // Stop previous source if any
    if (this.source) {
      try {
        this.source.stop();
      } catch {
        // Already stopped
      }
    }

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = buffer;
    this.source.loop = this.loop;
    this.source.connect(this.gainNode);

    // Handle source end
    this.source.onended = () => {
      if (this.source === this.source) {
        this.isPlaying = false;
      }
    };

    this.source.start(0);
  }

  dispose(): void {
    this.stop();
    this.gainNode.disconnect();
  }
}
