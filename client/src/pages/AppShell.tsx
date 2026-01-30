import { useEffect, useMemo, useState, useRef } from 'react';
import {
  useAuth,
  useAppSelector,
  useAppDispatch,
  completeTimer,
  restartTimer,
  addTimeToTimer,
  setFocusDuration,
  setBreakDuration,
  toggleSound,
  toggleAutoStart,
  toggleHideSeconds,
  toggleNotifications,
  setTimerStyle,
} from '../store';
import { useRouter } from '@tanstack/react-router';
import { toast } from '../components/toast';
import { PomodoroSettings } from '../components/PomodoroSettings';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { fetchRandomWorldImage } from '../services/pexelsService';
import { DraggablePanel } from '../components/DraggablePanel';
import { SoundscapePlayer } from '../components/SoundscapePlayer';
import { cn } from '@/lib/utils';
import {
  playStartSound,
  playPauseSound,
  playCompletionSound,
} from '../utils/soundUtils';

type TimerMode = 'focus' | 'break';

interface TimerState {
  mode: TimerMode;
  secondsLeft: number;
  isRunning: boolean;
  task: string;
  completed: number;
  totalFocusSec: number;
  timestamp: number;
}

const STORAGE_KEY = 'tempo-mode-timer-state';

const loadTimerState = (): Partial<TimerState> | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const state: TimerState = JSON.parse(saved);

    // If timer was running, calculate elapsed time
    if (state.isRunning && state.timestamp) {
      const elapsed = Math.floor((Date.now() - state.timestamp) / 1000);
      state.secondsLeft = Math.max(0, state.secondsLeft - elapsed);

      // If time ran out while page was closed, stop the timer
      if (state.secondsLeft === 0) {
        state.isRunning = false;
      }
    }

    return state;
  } catch (e) {
    console.error('Failed to load timer state:', e);
    return null;
  }
};

const saveTimerState = (state: TimerState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save timer state:', e);
  }
};

export default function AppShell() {
  const auth = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const timerSettings = useAppSelector((state) => state.timerSettings);

  // Load saved state or use defaults
  const savedState = loadTimerState();

  // Timer state (using settings from store)
  const focusDuration = timerSettings.focusDuration;
  const breakDuration = timerSettings.breakDuration;
  const autoStart = timerSettings.autoStart;
  const hideSeconds = timerSettings.hideSeconds;
  const notifications = timerSettings.notifications;
  const timerStyle = timerSettings.timerStyle;
  const soundEnabled = timerSettings.soundEnabled;

  const [mode, setMode] = useState<TimerMode>(savedState?.mode ?? 'focus');
  const [secondsLeft, setSecondsLeft] = useState<number>(
    savedState?.secondsLeft ?? focusDuration * 60
  );
  const [isRunning, setIsRunning] = useState(savedState?.isRunning ?? false);
  const [task, setTask] = useState(savedState?.task ?? '');
  const [completed, setCompleted] = useState(savedState?.completed ?? 0);
  const [totalFocusSec, setTotalFocusSec] = useState(
    savedState?.totalFocusSec ?? 0
  );
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/session-start-end.wav');
    audioRef.current.preload = 'auto';
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Background image state
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [layer, setLayer] = useState<'solid' | 'fog'>(() => {
    if (typeof document === 'undefined') return 'solid';
    return (
      (document.documentElement.dataset.layer as 'solid' | 'fog') || 'solid'
    );
  });

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    const state: TimerState = {
      mode,
      secondsLeft,
      isRunning,
      task,
      completed,
      totalFocusSec,
      timestamp: Date.now(),
    };
    saveTimerState(state);
  }, [mode, secondsLeft, isRunning, task, completed, totalFocusSec]);

  // Auto-continue timer on mode transition if autoStart is enabled
  useEffect(() => {
    if (autoStart && !isRunning && secondsLeft > 0) {
      // Small delay to ensure mode transition is complete
      const timer = setTimeout(() => {
        setIsRunning(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mode, autoStart]);

  // Handle timer actions from header menu
  useEffect(() => {
    if (timerSettings.triggerComplete > 0) {
      handlePause();
      setCompleted((c) => c + (mode === 'focus' ? 1 : 0));
      if (mode === 'focus') setTotalFocusSec((t) => t + focusDuration * 60);
      toast.success('Session completed manually');
      setSecondsLeft(getDuration(mode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerSettings.triggerComplete]);

  useEffect(() => {
    if (timerSettings.triggerRestart > 0) {
      handlePause();
      setSecondsLeft(getDuration(mode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerSettings.triggerRestart]);

  useEffect(() => {
    if (timerSettings.triggerAddTime > 0) {
      setSecondsLeft((prev) => prev + 10 * 60);
      toast.info('Added 10 minutes');
    }
  }, [timerSettings.triggerAddTime]);

  useEffect(() => {
    if (auth.status !== 'loading' && (!auth.user || !auth.user.token)) {
      router.navigate({ to: '/login' });
    }
  }, [auth.status, auth.user, router]);

  // Load background image when layer changes to fog or timerStyle is halo
  useEffect(() => {
    const currentLayer =
      (document.documentElement.dataset.layer as 'solid' | 'fog') || 'solid';

    if ((currentLayer === 'fog' || timerStyle === 'halo') && !backgroundUrl) {
      fetchRandomWorldImage().then(setBackgroundUrl);
    }

    // Listen for layer changes
    const observer = new MutationObserver(() => {
      const newLayer =
        (document.documentElement.dataset.layer as 'solid' | 'fog') || 'solid';
      setLayer(newLayer);
      if ((newLayer === 'fog' || timerStyle === 'halo') && !backgroundUrl) {
        fetchRandomWorldImage().then(setBackgroundUrl);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-layer'],
    });

    return () => observer.disconnect();
  }, [backgroundUrl, timerStyle]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Update stats before transition
            setCompleted((c) => c + (mode === 'focus' ? 1 : 0));
            if (mode === 'focus')
              setTotalFocusSec((t) => t + focusDuration * 60);

            // Play sound if enabled
            if (soundEnabled) {
              playCompletionSound(audioRef.current);
            }

            // Show notification
            toast.success(
              `${mode === 'focus' ? 'Focus' : 'Break'} session complete`
            );
            if (notifications && 'Notification' in window) {
              new Notification('TempoMode', {
                body: `${mode === 'focus' ? 'Focus' : 'Break'} session complete!`,
              });
            }

            // Auto-transition to next mode and set duration
            const nextMode: TimerMode = mode === 'focus' ? 'break' : 'focus';
            const nextDuration =
              nextMode === 'focus' ? focusDuration * 60 : breakDuration * 60;

            // Update mode (this will cause the effect to re-run with new dependencies)
            setMode(nextMode);

            // Set the next duration and continue if autoStart is true
            return nextDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isRunning,
    mode,
    focusDuration,
    breakDuration,
    notifications,
    soundEnabled,
  ]);

  const getDuration = (m: TimerMode) => {
    if (m === 'focus') return focusDuration * 60;
    return breakDuration * 60;
  };

  const formatted = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const s = (secondsLeft % 60).toString().padStart(2, '0');
    return hideSeconds ? `${m}` : `${m}:${s}`;
  }, [secondsLeft, hideSeconds]);

  const handleStart = () => {
    if (isRunning) return;
    console.log('Start clicked - soundEnabled:', soundEnabled);
    if (soundEnabled) {
      playStartSound();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    console.log('Pause clicked - soundEnabled:', soundEnabled);
    if (soundEnabled) {
      playPauseSound();
    }
    setIsRunning(false);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const switchMode = (next: TimerMode) => {
    handlePause();
    setMode(next);
    setSecondsLeft(getDuration(next));
  };

  if (auth.status === 'loading') {
    return <div style={{ padding: 'var(--space-6)' }}>Loading…</div>;
  }

  if (!auth.user) return null;

  const variant: 'minimal' | 'halo' =
    timerStyle === 'halo' ? 'halo' : 'minimal';
  const showBackground =
    (layer === 'fog' || variant === 'halo') && !!backgroundUrl;

  const statPanels = useMemo(
    () => [
      {
        id: 'soundscape',
        title: 'Soundscape',
        content: <SoundscapePlayer />,
        initial: { x: window.innerWidth - 320, y: 120 },
      },
      {
        id: 'mode',
        title: 'Mode',
        content: mode === 'focus' ? 'Focus' : 'Break',
        initial: { x: 24, y: 120 },
      },
      {
        id: 'completed',
        title: 'Completed',
        content: `${completed} sessions`,
        initial: { x: 220, y: 120 },
      },
      {
        id: 'focus-time',
        title: 'Focus Time',
        content: `${Math.floor(totalFocusSec / 60)} mins focused`,
        initial: { x: 416, y: 120 },
      },
      {
        id: 'task',
        title: 'Task',
        content: task || 'Not set',
        initial: { x: 612, y: 120 },
      },
      {
        id: 'session-log',
        title: 'Session Log',
        content: (
          <ul className="space-y-1 text-white/80 list-disc list-inside">
            <li>Stay focused. One session at a time.</li>
            <li>Hover over timer for settings (⋮).</li>
            <li>Switch modes for breaks.</li>
            <li>Set task to track your intent.</li>
          </ul>
        ),
        initial: { x: 24, y: 300 },
      },
    ],
    [mode, completed, totalFocusSec, task]
  );

  return (
    <div className={cn('relative text-white overflow-y-auto')}>
      {showBackground && (
        <div className="fixed inset-0 -z-10 opacity-100 transition-opacity duration-500">
          <img
            src={backgroundUrl ?? ''}
            alt="Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/75" />
        </div>
      )}

      <div
        className={
          variant === 'halo'
            ? 'flex flex-col items-center justify-center gap-8 px-6 py-10'
            : 'px-6 py-10'
        }
      >
        <div
          className={
            variant === 'minimal'
              ? 'grid gap-6 lg:grid-cols-[1fr,320px]'
              : 'w-full flex flex-col items-center'
          }
        >
          <div className="flex flex-col items-center overflow-visible">
            <PomodoroTimer
              mode={mode}
              onModeChange={(next) => switchMode(next)}
              timeDisplay={formatted}
              isRunning={isRunning}
              onStart={handleStart}
              onPause={handlePause}
              task={task}
              onTaskChange={setTask}
              variant={variant}
              settingsSlot={
                <PomodoroSettings
                  onComplete={() => dispatch(completeTimer())}
                  onRestart={() => dispatch(restartTimer())}
                  onAddTime={() => dispatch(addTimeToTimer())}
                  focusDuration={timerSettings.focusDuration}
                  breakDuration={timerSettings.breakDuration}
                  onFocusChange={(mins) => dispatch(setFocusDuration(mins))}
                  onBreakChange={(mins) => dispatch(setBreakDuration(mins))}
                  soundEnabled={timerSettings.soundEnabled}
                  onSoundToggle={() => dispatch(toggleSound())}
                  autoStart={timerSettings.autoStart}
                  onAutoStartToggle={() => dispatch(toggleAutoStart())}
                  hideSeconds={timerSettings.hideSeconds}
                  onHideSecondsToggle={() => dispatch(toggleHideSeconds())}
                  notifications={timerSettings.notifications}
                  onNotificationsToggle={() => {
                    if (
                      !timerSettings.notifications &&
                      'Notification' in window
                    ) {
                      Notification.requestPermission();
                    }
                    dispatch(toggleNotifications());
                  }}
                  timerStyle={timerStyle}
                  onStyleChange={(style) => dispatch(setTimerStyle(style))}
                  secondsLeft={secondsLeft}
                  totalSeconds={
                    mode === 'focus' ? focusDuration * 60 : breakDuration * 60
                  }
                />
              }
            />
          </div>
        </div>
      </div>

      {/* Floating draggable panels */}
      {statPanels.map((panel) => (
        <DraggablePanel
          key={panel.id}
          id={panel.id}
          title={panel.title}
          initialPosition={panel.initial}
        >
          {panel.content}
        </DraggablePanel>
      ))}
    </div>
  );
}
