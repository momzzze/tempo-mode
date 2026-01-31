/**
 * Audio buffer caching system
 */

export class AudioBufferCache {
  private cache: Map<string, AudioBuffer>;
  private pending: Map<string, Promise<AudioBuffer>>;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.cache = new Map<string, AudioBuffer>();
    this.pending = new Map<string, Promise<AudioBuffer>>();
  }

  async get(url: string): Promise<AudioBuffer> {
    // Return cached buffer if available
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // Return pending promise if already loading
    if (this.pending.has(url)) {
      return this.pending.get(url)!;
    }

    // Load and cache
    const promise = this.load(url);
    this.pending.set(url, promise);

    try {
      const buffer = await promise;
      this.cache.set(url, buffer);
      this.pending.delete(url);
      return buffer;
    } catch (err) {
      this.pending.delete(url);
      throw err;
    }
  }

  private async load(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return this.audioContext.decodeAudioData(arrayBuffer);
  }

  clear(): void {
    this.cache.clear();
    this.pending.clear();
  }

  size(): number {
    return this.cache.size;
  }
}
