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
  return (
    <Timer variant={variant}>
      <TimerHeader>{settingsSlot}</TimerHeader>

      <TimerModeSelector>
        <Tabs
          value={mode}
          onValueChange={(val) => onModeChange(val as 'focus' | 'break')}
          className="w-full max-w-md mx-auto"
        >
          <TabsList
            className={cn(
              'w-full grid grid-cols-2',
              variant === 'halo' &&
                'bg-transparent border-2 border-white/40 backdrop-blur-none',
              variant === 'minimal' &&
                'bg-white/15 border border-white/20 backdrop-blur-sm'
            )}
          >
            <TabsTrigger
              value="focus"
              className={cn(
                'uppercase tracking-wider font-semibold text-sm',
                variant === 'halo' &&
                  'data-[state=active]:bg-transparent data-[state=active]:border data-[state=active]:border-white/50 data-[state=active]:text-white/95 text-white/75 bg-transparent',
                variant === 'minimal' &&
                  'data-[state=active]:bg-white/25 data-[state=active]:text-white text-white/80'
              )}
            >
              Focus
            </TabsTrigger>
            <TabsTrigger
              value="break"
              className={cn(
                'uppercase tracking-wider font-semibold text-sm',
                variant === 'halo' &&
                  'data-[state=active]:bg-transparent data-[state=active]:border data-[state=active]:border-white/50 data-[state=active]:text-white/95 text-white/75 bg-transparent',
                variant === 'minimal' &&
                  'data-[state=active]:bg-white/25 data-[state=active]:text-white text-white/80'
              )}
            >
              Break
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </TimerModeSelector>

      <div className="relative">
        {variant === 'halo' && <TimerRing />}

        <TimerDigits variant={variant} isRunning={isRunning}>
          {timeDisplay}
        </TimerDigits>

        <TimerControls>
          {!isRunning ? (
            <Button
              onClick={onStart}
              size="lg"
              className={cn(
                variant === 'halo' &&
                  'bg-transparent border-2 border-green-400/70 text-green-400/95 hover:bg-green-400/10 hover:border-green-400/90 backdrop-blur-none',
                variant === 'minimal' &&
                  'bg-white/15 border border-white/25 text-white hover:bg-white/25 backdrop-blur-sm'
              )}
            >
              Start
            </Button>
          ) : (
            <Button
              onClick={onPause}
              size="lg"
              variant="outline"
              className={cn(
                variant === 'halo' &&
                  'bg-transparent border-2 border-white/50 text-white/95 hover:bg-white/10 hover:border-white/80 backdrop-blur-none',
                variant === 'minimal' &&
                  'bg-white/15 border border-white/25 text-white hover:bg-white/25 backdrop-blur-sm'
              )}
            >
              Pause
            </Button>
          )}
        </TimerControls>

        <TimerTaskInput variant={variant}>
          <Label
            htmlFor="task"
            className={cn(
              'block mb-2 text-sm uppercase tracking-wider',
              variant === 'halo' &&
                'text-white/70 text-base tracking-wide font-normal',
              variant === 'minimal' && 'text-white/60'
            )}
          >
            I will focus on...
          </Label>
          <Input
            id="task"
            value={task}
            onChange={(e) => onTaskChange(e.target.value)}
            placeholder="What are you focusing on?"
            className={cn(
              variant === 'halo' &&
                'bg-transparent border-none border-b border-white/35 rounded-none text-center text-lg text-white/92 placeholder:text-white/50 focus-visible:border-white/60 focus-visible:ring-0',
              variant === 'minimal' &&
                'bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30'
            )}
          />
        </TimerTaskInput>
      </div>
    </Timer>
  );
}
