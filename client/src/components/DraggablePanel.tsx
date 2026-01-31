import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DraggablePanelProps {
  id: string;
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  className?: string;
  hideHeader?: boolean;
}

const storageKey = (id: string) => `draggable-panel-${id}`;

export function DraggablePanel({
  id,
  title,
  children,
  initialPosition = { x: 24, y: 140 },
  className,
  hideHeader = false,
}: DraggablePanelProps) {
  const [pos, setPos] = useState<{ x: number; y: number }>(initialPosition);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const sizeRef = useRef({ width: 220, height: 140 });
  const frame = useRef<number | null>(null);

  const measure = () => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) sizeRef.current = { width: rect.width, height: rect.height };
  };

  // ensure we keep a small inset from the viewport edge
  const clampToViewport = (next: { x: number; y: number }) => {
    const inset = 16; // space from edges
    const { width, height } = sizeRef.current;
    const maxX = Math.max(inset, window.innerWidth - width - inset);
    const maxY = Math.max(inset, window.innerHeight - height - inset);
    return {
      x: Math.min(Math.max(next.x, inset), maxX),
      y: Math.min(Math.max(next.y, inset), maxY),
    };
  };

  // Load saved position and clamp once measured
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(id));
      if (saved) {
        const parsed = JSON.parse(saved) as { x: number; y: number };
        setPos(parsed);
      }
    } catch (e) {
      console.warn('Failed to load panel position', e);
    }
    measure();
    setPos((prev) => clampToViewport(prev));

    const onResize = () => {
      measure();
      setPos((prev) => clampToViewport(prev));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [id]);

  const savePosition = (next: { x: number; y: number }) => {
    try {
      localStorage.setItem(storageKey(id), JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save panel position', e);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const nextRaw = {
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    };

    // throttle to animation frame for smoother dragging (no clamp to avoid snap)
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      setPos(nextRaw);
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    const clamped = clampToViewport(pos);
    setPos(clamped);
    savePosition(clamped);
    if (frame.current) cancelAnimationFrame(frame.current);
  };

  return (
    <div className="fixed z-30" style={{ left: pos.x, top: pos.y }}>
      <div
        ref={panelRef}
        className={cn(
          'cursor-grab active:cursor-grabbing select-none pointer-events-auto',
          'rounded-xl bg-black/30 backdrop-blur-md shadow-lg',
          'min-w-[180px] max-w-[260px] text-white/90',
          !hideHeader && 'border border-white/10',
          className
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {!hideHeader && (
          <div className="px-4 py-2 border-b border-white/10 font-medium">
            {title}
          </div>
        )}
        <div className="flex justify-center-safe text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
