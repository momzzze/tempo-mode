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
}: PomodoroTimerProps) {
  const isHalo = variant === 'halo';

  return (
    <Timer
      variant={variant}
      className={cn(
        'w-full grid place-items-center py-10',
        '!bg-transparent !border-0 !shadow-none !p-0 !max-w-none',
        'overflow-visible',
        isHalo && 'text-white'
      )}
    >
      <TimerHeader
        className={cn(isHalo && 'absolute top-6 right-6', 'z-[150]')}
      >
        {settingsSlot}
      </TimerHeader>

      <div
        className={cn(
          'relative w-[min(84vw,520px)] aspect-square grid place-items-center',
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
              <TabsList className={cn('bg-transparent p-0 h-auto gap-8')}>
                <TabsTrigger
                  value="focus"
                  className={cn(
                    'p-0 h-auto bg-transparent shadow-none rounded-none',
                    'uppercase tracking-widest text-sm font-semibold',
                    'text-white/60 data-[state=active]:text-white',
                    'data-[state=active]:underline underline-offset-[10px] decoration-white/60'
                  )}
                >
                  Focus
                </TabsTrigger>
                <TabsTrigger
                  value="break"
                  className={cn(
                    'p-0 h-auto bg-transparent shadow-none rounded-none',
                    'uppercase tracking-widest text-sm font-semibold',
                    'text-white/60 data-[state=active]:text-white',
                    'data-[state=active]:underline underline-offset-[10px] decoration-white/60'
                  )}
                >
                  Break
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </TimerModeSelector>

          {/* Big digits centered */}
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

          {/* Task line under digits */}
          <TimerTaskInput
            variant={variant}
            className="absolute bottom-[24%] left-1/2 -translate-x-1/2 w-[86%]"
          >
            <Label
              htmlFor="task"
              className={cn(
                'block text-center',
                'text-white/85',
                'font-mono text-[clamp(18px,3.2vw,28px)]',
                'tracking-wide'
              )}
            >
              I will focus on…
            </Label>

            {/* Optional: keep input but make it invisible/clean like the screenshot */}
            <Input
              id="task"
              value={task}
              onChange={(e) => onTaskChange(e.target.value)}
              placeholder=""
              className={cn(
                'mt-3',
                'bg-transparent border-0 border-b border-white/25 rounded-none',
                'text-center text-white/90 font-mono',
                'focus-visible:ring-0 focus-visible:border-white/45',
                'placeholder:text-white/40'
              )}
            />
          </TimerTaskInput>

          {/* Round control button like screenshot */}
          <TimerControls className="absolute bottom-[10%] left-1/2 -translate-x-1/2">
            {!isRunning ? (
              <Button
                onClick={onStart}
                className={cn(
                  'h-14 w-14 rounded-full p-0',
                  'bg-white/15 hover:bg-white/20',
                  'border border-white/20 text-white',
                  'backdrop-blur-sm'
                )}
              >
                Start
              </Button>
            ) : (
              <Button
                onClick={onPause}
                className={cn(
                  'h-14 w-14 rounded-full p-0',
                  'bg-white/15 hover:bg-white/20',
                  'border border-white/20 text-white',
                  'backdrop-blur-sm'
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
