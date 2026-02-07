import { useEffect, useMemo, useState, useRef } from 'react';
import {
  useAuth,
  useAppSelector,
  useAppDispatch,
  refreshUser,
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
  setMode,
  setSecondsLeft,
  decrementSecond,
  startTimer as startTimerAction,
  pauseTimer as pauseTimerAction,
  setTask as setTaskAction,
  incrementCompleted,
  addFocusTime,
  resetTimer,
} from '../store';
import type { TimerMode } from '../store';
// import { useRouter } from '@tanstack/react-router';
import { toast } from '../components/toast';
import { PomodoroSettings } from '../components/PomodoroSettings';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { fetchRandomWorldImage } from '../services/pexelsService';
import { SoundscapePlayer } from '../components/SoundscapePlayer';
import { TaskPanel } from '../components/TaskPanel';
import { cn } from '@/lib/utils';
import {
  playStartSound,
  playPauseSound,
  playCompletionSound,
} from '../utils/soundUtils';
import { updateFavicon } from '../utils/dynamicFavicon';
import { sessionApi } from '../api/client';
import { Coffee, CheckCircle, Clock, Zap } from 'lucide-react';
import './AppShell.css';
import type { TimerState } from '@/store/timerState';

export default function AppShell() {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const timerSettings = useAppSelector((state) => state.timerSettings);
  const timerState = useAppSelector((state) => state.timerState);

  // Timer settings from store
  const focusDuration = timerSettings.focusDuration;
  const breakDuration = timerSettings.breakDuration;
  const autoStart = timerSettings.autoStart;
  const hideSeconds = timerSettings.hideSeconds;
  const notifications = timerSettings.notifications;
  const timerStyle = timerSettings.timerStyle;
  const soundEnabled = timerSettings.soundEnabled;

  // Timer state from Redux
  const mode = timerState.mode;
  const secondsLeft = timerState.secondsLeft;
  const isRunning = timerState.isRunning;
  const task = timerState.task;
  const completed = timerState.completed;
  const totalFocusSec = timerState.totalFocusSec;

  const [soundscapePlaying, setSoundscapePlaying] = useState(false);
  const [soundscapeOpen, setSoundscapeOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionSavedRef = useRef<boolean>(false);

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

  // Save timer settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        'tempo-mode-timer-settings',
        JSON.stringify({
          focusDuration: timerSettings.focusDuration,
          breakDuration: timerSettings.breakDuration,
          soundEnabled: timerSettings.soundEnabled,
          autoStart: timerSettings.autoStart,
          hideSeconds: timerSettings.hideSeconds,
          notifications: timerSettings.notifications,
          timerStyle: timerSettings.timerStyle,
        })
      );
    } catch (e) {
      console.error('Failed to save timer settings:', e);
    }
  }, [
    timerSettings.focusDuration,
    timerSettings.breakDuration,
    timerSettings.soundEnabled,
    timerSettings.autoStart,
    timerSettings.hideSeconds,
    timerSettings.notifications,
    timerSettings.timerStyle,
  ]);

  // Update secondsLeft when duration changes for the current mode
  useEffect(() => {
    if (!isRunning) {
      // Only update if timer is not running
      const newDuration =
        mode === 'focus' ? focusDuration * 60 : breakDuration * 60;
      setSecondsLeft(newDuration);
    }
  }, [focusDuration, breakDuration, mode]);

  // Update favicon based on timer state
  useEffect(() => {
    updateFavicon({
      isRunning,
      secondsLeft,
      mode,
      soundPlaying: soundscapePlaying,
    });
  }, [isRunning, secondsLeft, mode, soundscapePlaying]);

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
      if (mode === 'focus') {
        dispatch(incrementCompleted());
        dispatch(addFocusTime(focusDuration * 60));
      }
      toast.success('Session completed manually');
      dispatch(setSecondsLeft(getDuration(mode)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerSettings.triggerComplete]);

  useEffect(() => {
    if (timerSettings.triggerRestart > 0) {
      handlePause();
      dispatch(setSecondsLeft(getDuration(mode)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerSettings.triggerRestart]);

  useEffect(() => {
    if (timerSettings.triggerAddTime > 0) {
      dispatch(setSecondsLeft(secondsLeft + 10 * 60));
      toast.info('Added 10 minutes');
    }
  }, [timerSettings.triggerAddTime, secondsLeft, dispatch]);

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
        dispatch(decrementSecond());

        if (secondsLeft <= 1) {
          // Save focus session if mode is focus and user is authenticated
          // Use ref to prevent duplicate saves during mode transition
          if (mode === 'focus' && auth.user && !sessionSavedRef.current) {
            sessionSavedRef.current = true;
            sessionApi
              .createSession(focusDuration, task || undefined, focusDuration)
              .then(() => {
                // Refresh user data to get updated points
                dispatch(refreshUser());
              })
              .catch((err) => {
                console.error('Failed to save focus session:', err);
                toast.error('Failed to save session');
              });
          }

          // Update stats before transition
          if (mode === 'focus') {
            dispatch(incrementCompleted());
            dispatch(addFocusTime(focusDuration * 60));
          }

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

          // Update mode and duration
          dispatch(setMode(nextMode));
          dispatch(setSecondsLeft(nextDuration));

          // Auto-start if enabled
          if (!autoStart) {
            dispatch(pauseTimerAction());
          }
        }
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
    secondsLeft,
    mode,
    focusDuration,
    breakDuration,
    notifications,
    soundEnabled,
    autoStart,
    auth.user,
    task,
    dispatch,
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
    // Reset session saved flag when starting a new session
    if (mode === 'focus') {
      sessionSavedRef.current = false;
    }
    dispatch(startTimerAction());
  };

  const handlePause = () => {
    console.log('Pause clicked - soundEnabled:', soundEnabled);
    if (soundEnabled) {
      playPauseSound();
    }
    dispatch(pauseTimerAction());
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const switchMode = (next: TimerMode) => {
    handlePause();
    dispatch(setMode(next));
    dispatch(setSecondsLeft(getDuration(next)));
    // Reset session saved flag when switching to focus mode
    if (next === 'focus') {
      sessionSavedRef.current = false;
    }
  };

  const variant: 'minimal' | 'halo' =
    timerStyle === 'halo' ? 'halo' : 'minimal';
  const showBackground =
    (layer === 'fog' || variant === 'halo') && !!backgroundUrl;

  return (
    <div className="flex flex-col">
      {/* Stats bar */}
      <div className="absolute top-16 left-0 right-0 z-30 stats-bar">
        {/* Completed */}
        <div className="stats-item">
          <div className="stats-item__icon">
            <CheckCircle size={24} />
          </div>
          <div className="stats-item__label">{completed}</div>
        </div>

        {/* Total Time */}
        <div className="stats-item">
          <div className="stats-item__icon">
            <Clock size={24} />
          </div>
          <div className="stats-item__label">
            {Math.floor(totalFocusSec / 60)}m
          </div>
        </div>

        {/* User Points */}
        {auth.user && (
          <div className="stats-item">
            <div className="stats-item__icon">
              <Zap size={24} className="text-yellow-400" />
            </div>
            <div className="stats-item__label">{auth.user.points || 0}</div>
          </div>
        )}

        {/* Task Panel */}
        <div className="stats-item">
          <TaskPanel
            onTaskComplete={(task) => {
              toast.success(
                `Task completed: ${task.title}! +${task.rewardPoints} pts`
              );
            }}
          />
          <div className="stats-item__label">Tasks</div>
        </div>

        {/* Music Player */}
        <div className="stats-item">
          <SoundscapePlayer
            timerMode={mode}
            isRunning={isRunning}
            onPlayingChange={setSoundscapePlaying}
            onOpenChange={setSoundscapeOpen}
          />
          <div className="stats-item__label">Sounds</div>
        </div>
      </div>
      <div className={cn('relative text-white overflow-hidden')}>
        {showBackground && (
          <div className="fixed inset-0 -z-10 opacity-100 transition-opacity duration-500">
            <img
              src={backgroundUrl}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-start justify-center min-h-screen pt-[19vh]">
          <PomodoroTimer
            mode={mode}
            onModeChange={switchMode}
            timeDisplay={formatted}
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            task={task}
            onTaskChange={(newTask) => dispatch(setTaskAction(newTask))}
            variant={variant}
            secondsLeft={secondsLeft}
            totalSeconds={
              mode === 'focus' ? focusDuration * 60 : breakDuration * 60
            }
            settingsSlot={
              soundscapeOpen ? null : (
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
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
