/**
 * Thunder scheduler for random interval playback
 */

import { AudioBufferCache } from './AudioBufferCache';

export class ThunderScheduler {
  private gainNode: GainNode;
  private currentVolume: number;
  private timeoutId: number | null;
  private source: AudioBufferSourceNode | null;
  private isScheduling: boolean;
  private audioContext: AudioContext;
  private cache: AudioBufferCache;
  private url: string;

  constructor(
    audioContext: AudioContext,
    cache: AudioBufferCache,
    url: string
  ) {
    this.audioContext = audioContext;
    this.cache = cache;
    this.url = url;
    this.currentVolume = 0;
    this.timeoutId = null;
    this.source = null;
    this.isScheduling = false;
    this.gainNode = audioContext.createGain();
    this.gainNode.connect(audioContext.destination);
  }

  getGainNode(): GainNode {
    return this.gainNode;
  }

  start(): void {
    if (this.isScheduling) return;
    this.isScheduling = true;
    this.scheduleNext();
  }

  stop(): void {
    this.isScheduling = false;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.source) {
      try {
        this.source.stop();
      } catch {
        // Already stopped
      }
      this.source = null;
    }
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

  private scheduleNext(): void {
    if (!this.isScheduling) return;

    // Random interval between 8-25 seconds
    const interval = 8000 + Math.random() * 17000;

    this.timeoutId = window.setTimeout(async () => {
      try {
        const buffer = await this.cache.get(this.url);
        this.playThunder(buffer);
        this.scheduleNext();
      } catch (err) {
        console.error('Failed to play thunder:', err);
        // Try again
        this.scheduleNext();
      }
    }, interval);
  }

  private playThunder(buffer: AudioBuffer): void {
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
    this.source.loop = false;
    this.source.connect(this.gainNode);

    this.source.onended = () => {
      this.source = null;
    };

    this.source.start(0);
  }

  dispose(): void {
    this.stop();
    this.gainNode.disconnect();
  }
}
