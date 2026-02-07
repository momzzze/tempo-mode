/**
 * Dynamic Favicon Utility
 * Uses tempo-mode-icon.png as base and overlays:
 * - Timer countdown when running
 * - Sound indicator badge when audio is playing
 */

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let link: HTMLLinkElement | null = null;
let baseImage: HTMLImageElement | null = null;
let imageLoaded = false;

function initCanvas() {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
  }

  if (!link) {
    link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
  }

  // Load base icon image
  if (!baseImage) {
    baseImage = new Image();
    baseImage.src = '/tempo-mode-icon.png';
    baseImage.crossOrigin = 'anonymous';
    baseImage.onload = () => {
      imageLoaded = true;
    };
  }
}

export function updateFavicon(options: {
  isRunning: boolean;
  secondsLeft?: number;
  mode?: 'focus' | 'break';
  soundPlaying?: boolean;
}) {
  initCanvas();

  if (!ctx || !canvas || !link || !imageLoaded) {
    // Use base icon until loaded
    if (link && !imageLoaded) {
      link.href = '/tempo-mode-icon.png';
    }
    return;
  }

  const {
    isRunning,
    secondsLeft = 0,
    // mode = 'focus',
    soundPlaying = false,
  } = options;

  // Update page title with timer
  if (isRunning && secondsLeft > 0) {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    document.title = `${timeStr} | TempoMode`;
  } else {
    document.title = 'TempoMode';
  }

  // Clear canvas
  ctx.clearRect(0, 0, 64, 64);

  // Draw base icon with black background removed - make T bigger by scaling up
  if (baseImage) {
    // Create temporary canvas to process image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 64;
    tempCanvas.height = 64;
    const tempCtx = tempCanvas.getContext('2d');

    if (tempCtx) {
      // Draw original image scaled up to fill more space
      // Scale from center and make it 1.5x larger
      const scale = 1.5;
      const size = 64 * scale;
      const offset = (64 - size) / 2;

      tempCtx.drawImage(baseImage, offset, offset, size, size);

      // Get image data to remove black pixels
      const imageData = tempCtx.getImageData(0, 0, 64, 64);
      const data = imageData.data;

      // Make black (and near-black) pixels transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // If pixel is very dark (black or near-black), make it transparent
        if (r < 30 && g < 30 && b < 30) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }

      tempCtx.putImageData(imageData, 0, 0);

      // Draw processed image to main canvas
      ctx.drawImage(tempCanvas, 0, 0);
    }
  }

  // Overlay timer countdown when running
  if (isRunning && secondsLeft > 0) {
    const mins = Math.floor(secondsLeft / 60);

    // Semi-transparent overlay at bottom
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.roundRect(8, 42, 48, 18, 4);
    ctx.fill();

    // Timer text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${mins}m`, 32, 51);
  }

  // Sound indicator badge (top right corner)
  if (soundPlaying) {
    // Badge background
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(52, 12, 8, 0, Math.PI * 2);
    ctx.fill();

    // Music note
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♪', 52, 12);
  }

  // Update favicon
  link.href = canvas.toDataURL('image/png');
}

export function resetFavicon() {
  const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
  if (link) {
    link.href = '/tempo-mode-icon.png';
  }
}
