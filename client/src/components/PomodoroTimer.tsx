import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Timer,
  TimerHeader,
  TimerModeSelector,
  TimerDigits,
  TimerControls,
  TimerRing,
  TimerTaskInput,
} from '@/components/ui/timer';
import { cn } from '@/lib/utils';
import './PomodoroTimer.css';

interface PomodoroTimerProps {
  mode: 'focus' | 'break';
  onModeChange: (mode: 'focus' | 'break') => void;
  timeDisplay: string;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  task: string;
  onTaskChange: (task: string) => void;
  variant: 'minimal' | 'halo';
  settingsSlot?: React.ReactNode;
  secondsLeft?: number;
  totalSeconds?: number;
}
export function PomodoroTimer({
  mode,
  onModeChange,
  timeDisplay,
  isRunning,
  onStart,
  onPause,
  task,
  onTaskChange,
  variant,
  settingsSlot,
  secondsLeft = 0,
  totalSeconds = 1,
}: PomodoroTimerProps) {
  const isHalo = variant === 'halo';
  const [isHovered, setIsHovered] = React.useState(false);
  const [isClockHovered, setIsClockHovered] = React.useState(false);
  const hideClockTimeoutRef = React.useRef<number | null>(null);

  const handleClockEnter = () => {
    if (hideClockTimeoutRef.current) {
      window.clearTimeout(hideClockTimeoutRef.current);
      hideClockTimeoutRef.current = null;
    }
    setIsClockHovered(true);
  };

  const handleClockLeave = () => {
    if (hideClockTimeoutRef.current) {
      window.clearTimeout(hideClockTimeoutRef.current);
    }
    hideClockTimeoutRef.current = window.setTimeout(() => {
      setIsClockHovered(false);
      hideClockTimeoutRef.current = null;
    }, 250);
  };

  return (
    <Timer
      variant={variant}
      className={cn(
        'w-full grid place-items-center py-10',
        '!bg-transparent !border-0 !shadow-none !p-0 !max-w-none',
        'overflow-visible',
        isHalo && 'text-white'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'relative w-[min(84vw,490px)] aspect-square grid place-items-center',
          isHalo && 'select-none'
        )}
      >
        {/* Ring */}
        {isHalo && <TimerRing className="absolute inset-0" />}

        {/* Content inside ring */}
        <div className="relative z-10 w-full h-full grid place-items-center">
          {/* Tabs near top inside ring */}
          <TimerModeSelector className="absolute top-[22%] left-1/2 -translate-x-1/2">
            <Tabs
              value={mode}
              onValueChange={(val) => onModeChange(val as 'focus' | 'break')}
              className="w-auto"
            >
              <TabsList className="pomodoro-timer__tabs-list bg-transparent p-0 h-auto gap-8">
                <div className="flex gap-10 relative">
                  <div>
                    <TabsTrigger
                      value="focus"
                      className={cn(
                        'p-0 h-auto bg-transparent shadow-none rounded-none',
                        'uppercase tracking-widest text-sm font-semibold',
                        'text-white/60 data-[state=active]:text-white',
                        'data-[state=active]:underline underline-offset-[10px] decoration-white/60',
                        'drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]'
                      )}
                    >
                      Focus
                    </TabsTrigger>
                  </div>
                  <div>
                    <TabsTrigger
                      value="break"
                      className={cn(
                        'p-0 h-auto bg-transparent shadow-none rounded-none',
                        'uppercase tracking-widest text-sm font-semibold',
                        'text-white/60 data-[state=active]:text-white',
                        'data-[state=active]:underline underline-offset-[10px] decoration-white/60',
                        'drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]'
                      )}
                    >
                      Break
                    </TabsTrigger>
                  </div>
                </div>
              </TabsList>
            </Tabs>
          </TimerModeSelector>

          {/* Big digits centered */}
          <div
            className="pomodoro-timer__clock"
            onMouseEnter={handleClockEnter}
            onMouseLeave={handleClockLeave}
          >
            <TimerDigits
              variant={variant}
              isRunning={isRunning}
              className={cn(
                'font-sans tabular-nums leading-none',
                'text-[clamp(64px,14vw,120px)]',
                'tracking-tight'
              )}
            >
              {timeDisplay}
            </TimerDigits>
            {settingsSlot && (
              <div className="pomodoro-timer__settings">{settingsSlot}</div>
            )}
          </div>

          {/* Task line under digits */}
          <TimerTaskInput variant={variant} className="pomodoro-timer__task">
            {/* Progress bar under digits */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100))}%`,
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
                }}
              />
            </div>

            <Label
              className={cn(
                'block text-center',
                'text-white/90',
                'font-mono text-[clamp(14px,2vw,18px)]',
                'tracking-wide',
                'drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]'
              )}
            >
              I will focus on…
            </Label>

            {/* Task display */}
            {task && (
              <div
                className={cn(
                  'mt-1',
                  'text-center',
                  'text-white/95 font-mono text-[clamp(13px,1.8vw,16px)]',
                  'tracking-wide',
                  'drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]'
                )}
              >
                {task}
              </div>
            )}
          </TimerTaskInput>

          {/* Round control button like screenshot */}
          <TimerControls className="absolute bottom-[10%] left-1/2 -translate-x-1/2">
            {!isRunning ? (
              <Button
                onClick={onStart}
                className={cn(
                  'h-14 w-14 rounded-full p-0',
                  'bg-black/30 hover:bg-black/40',
                  'border border-white/40 text-white font-semibold',
                  'backdrop-blur-md',
                  'drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]',
                  'hover:drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)]'
                )}
              >
                Start
              </Button>
            ) : (
              <Button
                onClick={onPause}
                className={cn(
                  'h-14 w-14 rounded-full p-0',
                  'bg-black/30 hover:bg-black/40',
                  'border border-white/40 text-white font-semibold',
                  'backdrop-blur-md',
                  'drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]',
                  'hover:drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)]'
                )}
              >
                {/* If you want icon-only: use lucide Pause */}
                Pause
              </Button>
            )}
          </TimerControls>
        </div>
      </div>
    </Timer>
  );
}
