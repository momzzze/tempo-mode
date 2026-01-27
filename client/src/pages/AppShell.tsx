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
            window.clearInterval(intervalRef.current ?? undefined);
            intervalRef.current = null;

            // Update stats before transition
            setCompleted((c) => c + (mode === 'focus' ? 1 : 0));
            if (mode === 'focus')
              setTotalFocusSec((t) => t + focusDuration * 60);

            // Show notification
            toast.success(
              `${mode === 'focus' ? 'Focus' : 'Break'} session complete`
            );
            if (notifications && 'Notification' in window) {
              new Notification('TempoMode', {
                body: `${mode === 'focus' ? 'Focus' : 'Break'} session complete!`,
              });
            }

            // Auto-transition to next mode
            const nextMode: TimerMode = mode === 'focus' ? 'break' : 'focus';
            setMode(nextMode);
            const nextDuration =
              nextMode === 'focus' ? focusDuration * 60 : breakDuration * 60;

            // Auto-start if enabled, otherwise just set duration
            if (autoStart) {
              setIsRunning(true);
              return nextDuration;
            } else {
              setIsRunning(false);
              return nextDuration;
            }
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
  }, [isRunning, mode, focusDuration, breakDuration, notifications, autoStart]);

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
    setIsRunning(true);
  };

  const handlePause = () => {
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

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white overflow-hidden">
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
          <div className="flex flex-col items-center">
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
                />
              }
            />

            {variant === 'minimal' && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                {[
                  {
                    label: 'Mode',
                    value: mode === 'focus' ? 'Focus' : 'Break',
                  },
                  { label: 'Completed', value: completed },
                  {
                    label: 'Focus time',
                    value: `${Math.floor(totalFocusSec / 60)} mins`,
                  },
                  { label: 'Task', value: task || 'Not set' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-center"
                  >
                    <div className="text-xs uppercase tracking-wide text-white/60">
                      {item.label}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white/90">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {variant === 'minimal' && (
            <div className="grid gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-wide text-white/60 mb-2">
                  Session Log
                </div>
                <div className="space-y-1 text-sm text-white/80">
                  <div>► Stay focused. One session at a time.</div>
                  <div>► Hover over timer for settings (⋮)</div>
                  <div>► Switch modes for breaks</div>
                  <div>► Set task to track your intent</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
