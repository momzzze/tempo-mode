import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type TimerStyle = 'classic' | 'halo';

const STYLE_OPTIONS: Array<{
  id: TimerStyle;
  label: string;
  note: string;
}> = [
  { id: 'classic', label: 'Minimal', note: 'Compact panel UI' },
  { id: 'halo', label: 'Halo', note: 'Full-screen ring display' },
];

interface PomodoroSettingsProps {
  onComplete: () => void;
  onRestart: () => void;
  onAddTime: () => void;
  focusDuration: number;
  breakDuration: number;
  onFocusChange: (mins: number) => void;
  onBreakChange: (mins: number) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  autoStart: boolean;
  onAutoStartToggle: () => void;
  hideSeconds: boolean;
  onHideSecondsToggle: () => void;
  notifications: boolean;
  onNotificationsToggle: () => void;
  timerStyle: TimerStyle;
  onStyleChange: (style: TimerStyle) => void;
}

export function PomodoroSettings({
  onComplete,
  onRestart,
  onAddTime,
  focusDuration,
  breakDuration,
  onFocusChange,
  onBreakChange,
  soundEnabled,
  onSoundToggle,
  autoStart,
  onAutoStartToggle,
  hideSeconds,
  onHideSecondsToggle,
  notifications,
  onNotificationsToggle,
  timerStyle,
  onStyleChange,
}: PomodoroSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 rounded-full bg-black/30 border border-white/20 text-white/90 hover:bg-black/50 hover:text-white shadow-sm backdrop-blur"
        title="Timer settings"
      >
        <MoreVertical size={18} />
      </Button>

      {isOpen && (
        <div className="absolute top-11 right-0 w-72 rounded-xl border border-white/15 bg-black/85 text-white shadow-2xl backdrop-blur-xl z-50 p-3 space-y-3">
          <div className="text-sm font-semibold px-1">Pomodoro</div>

          <div className="grid grid-cols-2 gap-2">
            {STYLE_OPTIONS.map((style) => {
              const active = timerStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() =>
                    timerStyle !== style.id && onStyleChange(style.id)
                  }
                  className={cn(
                    'rounded-md border border-white/15 bg-white/5 px-3 py-2 text-left transition-colors',
                    active &&
                      'border-emerald-400/60 bg-emerald-400/10 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]'
                  )}
                >
                  <div className="flex items-center justify-between text-sm font-semibold tracking-wide">
                    <span>{style.label}</span>
                    {active && <Check size={14} />}
                  </div>
                  <div className="mt-1 text-xs text-white/70 leading-tight">
                    {style.note}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="h-px bg-white/10" />

          <div className="space-y-1">
            <button
              className="w-full rounded-md px-3 py-2 text-left text-sm text-white/85 hover:bg-white/10 transition-colors"
              onClick={() => {
                onComplete();
                setIsOpen(false);
              }}
            >
              Complete timer
            </button>
            <button
              className="w-full rounded-md px-3 py-2 text-left text-sm text-white/85 hover:bg-white/10 transition-colors"
              onClick={() => {
                onRestart();
                setIsOpen(false);
              }}
            >
              Restart timer
            </button>
            <button
              className="w-full rounded-md px-3 py-2 text-left text-sm text-white/85 hover:bg-white/10 transition-colors"
              onClick={() => {
                onAddTime();
                setIsOpen(false);
              }}
            >
              + Add 10 minutes
            </button>
          </div>

          <div className="h-px bg-white/10" />

          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-white/90">
              <Label className="flex-1 text-white/90">Focus</Label>
              <Input
                type="number"
                min={1}
                max={120}
                value={focusDuration}
                onChange={(e) => onFocusChange(Number(e.target.value))}
                className="w-20 text-right bg-transparent border-white/40 text-white"
              />
              <span className="text-xs text-white/60">min</span>
            </div>

            <div className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-white/90">
              <Label className="flex-1 text-white/90">Break</Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={breakDuration}
                onChange={(e) => onBreakChange(Number(e.target.value))}
                className="w-20 text-right bg-transparent border-white/40 text-white"
              />
              <span className="text-xs text-white/60">min</span>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div className="space-y-1.5">
            {[
              {
                label: 'Timer sound effects',
                enabled: soundEnabled,
                onToggle: onSoundToggle,
              },
              {
                label: 'Auto-start timers',
                enabled: autoStart,
                onToggle: onAutoStartToggle,
              },
              {
                label: 'Hide seconds',
                enabled: hideSeconds,
                onToggle: onHideSecondsToggle,
              },
              {
                label: 'Browser notifications',
                enabled: notifications,
                onToggle: onNotificationsToggle,
              },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                onClick={() => {
                  item.onToggle();
                }}
                aria-pressed={item.enabled}
              >
                <span>{item.label}</span>
                <span
                  className={cn(
                    'h-5 w-10 rounded-full border border-white/30 bg-white/15 transition-all flex items-center px-1',
                    item.enabled &&
                      'border-emerald-400 bg-emerald-400/20 justify-end'
                  )}
                >
                  {item.enabled && <Check size={12} />}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
