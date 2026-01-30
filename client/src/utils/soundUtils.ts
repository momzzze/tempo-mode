// Sound utility using Web Audio API for timer controls

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  }
  // Resume context if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

/**
 * Play a start sound - two quick ascending beeps (like Discord mic on)
 */
export const playStartSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // First beep (lower tone)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.frequency.value = 600;
    osc1.type = 'sine';

    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc1.start(now);
    osc1.stop(now + 0.08);

    // Second beep (higher tone) - slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.frequency.value = 800;
    osc2.type = 'sine';

    gain2.gain.setValueAtTime(0.25, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

    osc2.start(now + 0.05);
    osc2.stop(now + 0.13);
  } catch (err) {
    console.error('Failed to play start sound:', err);
  }
};

/**
 * Play a pause sound - two quick descending beeps (like Discord mic off)
 */
export const playPauseSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // First beep (higher tone)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.frequency.value = 800;
    osc1.type = 'sine';

    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc1.start(now);
    osc1.stop(now + 0.08);

    // Second beep (lower tone) - slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.frequency.value = 600;
    osc2.type = 'sine';

    gain2.gain.setValueAtTime(0.25, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

    osc2.start(now + 0.05);
    osc2.stop(now + 0.13);
  } catch (err) {
    console.error('Failed to play pause sound:', err);
  }
};

/**
 * Play a completion sound (the existing wav file)
 */
export const playCompletionSound = (audioRef: HTMLAudioElement | null) => {
  try {
    if (audioRef) {
      audioRef.currentTime = 0;
      audioRef
        .play()
        .catch((err) => console.error('Failed to play completion sound:', err));
    }
  } catch (err) {
    console.error('Failed to play completion sound:', err);
  }
};
