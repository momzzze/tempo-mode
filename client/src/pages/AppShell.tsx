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
  toggleHideSeconds,
  toggleNotifications,
  setTimerStyle,
  setMode,
  setSecondsLeft,
  startTimer as startTimerAction,
  pauseTimer as pauseTimerAction,
  setTask as setTaskAction,
  incrementCompleted,
  addFocusTime,
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

export default function AppShell() {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const timerSettings = useAppSelector((state) => state.timerSettings);
  const timerState = useAppSelector((state) => state.timerState);

  // Timer settings from store
  const focusDuration = timerSettings.focusDuration;
  const breakDuration = timerSettings.breakDuration;
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
  const isInitialMount = useRef(true);
  const pendingCompletionRef = useRef(false);
  const [soundUnlocked, setSoundUnlocked] = useState(false);

  // Unlock sound on first user gesture (needed after page refresh for browser autoplay policy)
  const unlockSound = async (): Promise<boolean> => {
    try {
      const a = audioRef.current;
      if (!a) return false;

      // Prime the audio element with near-silent play/pause
      a.volume = 0.0001;
      await a.play();
      a.pause();
      a.currentTime = 0;
      a.volume = 1;

      setSoundUnlocked(true);
      console.log('🔊 Sound unlocked after user gesture');

      // If completion sound was queued while locked, play it now
      if (pendingCompletionRef.current && soundEnabled) {
        pendingCompletionRef.current = false;
        playCompletionSound(audioRef.current);
        console.log('🔔 Playing queued completion sound');
      }

      return true;
    } catch (err) {
      console.warn('Sound unlock failed (no user gesture yet):', err);
      setSoundUnlocked(false);
      return false;
    }
  };

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

  // Auto-unlock sound on first user interaction (after refresh)
  // This solves browser autoplay policy blocking sounds after page reload
  useEffect(() => {
    if (!soundEnabled || soundUnlocked) return;

    const onFirstGesture = () => {
      unlockSound();
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };

    window.addEventListener('pointerdown', onFirstGesture, { passive: true });
    window.addEventListener('keydown', onFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, [soundEnabled, soundUnlocked]);

  // Detect if timer was restored from localStorage in running state
  // In this case, sound needs to be unlocked with user gesture
  useEffect(() => {
    // Only run once on mount
    if (!isInitialMount.current) return;

    if (isRunning && soundEnabled) {
      setSoundUnlocked(false);
      console.log(
        '⏱️ Timer restored in running state - sound requires user gesture to unlock'
      );
    } else if (soundEnabled) {
      // If timer not running but sound enabled, assume first session - mark as unlocked
      setSoundUnlocked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

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
    timerSettings.hideSeconds,
    timerSettings.notifications,
    timerSettings.timerStyle,
  ]);

  // Update secondsLeft when duration settings or mode changes
  // BUT: Skip on initial mount to preserve state from localStorage
  // NOTE: Do NOT include isRunning in deps - we check its value but don't want to reset on pause!
  useEffect(() => {
    console.log(
      '⚙️ Duration/mode effect - isRunning:',
      isRunning,
      'mode:',
      mode,
      'isInitialMount:',
      isInitialMount.current
    );

    // Skip on initial mount to preserve localStorage state
    if (isInitialMount.current) {
      isInitialMount.current = false;
      console.log(
        '⚙️ Initial mount - skipping secondsLeft update to preserve localStorage'
      );
      return;
    }

    // Only update duration if timer is NOT running
    // We read isRunning but it's NOT in dependencies - this only triggers on focusDuration/breakDuration/mode changes
    if (!isRunning) {
      const newDuration =
        mode === 'focus' ? focusDuration * 60 : breakDuration * 60;
      console.log('⚙️ Timer not running, setting duration to:', newDuration);
      dispatch(setSecondsLeft(newDuration));
    } else {
      console.log(
        '⚙️ Timer is running, keeping current secondsLeft:',
        secondsLeft
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusDuration, breakDuration, mode, dispatch]);

  // Update favicon based on timer state
  useEffect(() => {
    updateFavicon({
      isRunning,
      secondsLeft,
      mode,
      soundPlaying: soundscapePlaying,
    });
  }, [isRunning, secondsLeft, mode, soundscapePlaying]);

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

  // Main timer loop driven by current state to avoid stale closures
  useEffect(() => {
    console.log(
      '🔄 Timer loop effect - isRunning:',
      isRunning,
      'secondsLeft:',
      secondsLeft
    );

    if (!isRunning) {
      if (intervalRef.current) {
        window.clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
      console.log('⏸️ Timer not running, clearing timeout');
      return;
    }

    if (secondsLeft <= 0) {
      // Save focus session if mode is focus and user is authenticated
      if (mode === 'focus' && auth.user && !sessionSavedRef.current) {
        sessionSavedRef.current = true;
        sessionApi
          .createSession(focusDuration, task || undefined, focusDuration)
          .then(() => {
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

      // Play sound if enabled and unlocked (browser autoplay policy)
      // If not unlocked, queue it to play when user unlocks
      if (soundEnabled && soundUnlocked) {
        playCompletionSound(audioRef.current);
      } else if (soundEnabled && !soundUnlocked) {
        console.log(
          '🔇 Completion sound blocked - queueing for when sound unlocks'
        );
        pendingCompletionRef.current = true;
      }

      // Show notification
      toast.success(`${mode === 'focus' ? 'Focus' : 'Break'} session complete`);
      if (notifications && 'Notification' in window) {
        new Notification('TempoMode', {
          body: `${mode === 'focus' ? 'Focus' : 'Break'} session complete!`,
        });
      }

      // Determine next mode
      const nextMode: TimerMode = mode === 'focus' ? 'break' : 'focus';
      const nextDuration =
        nextMode === 'focus' ? focusDuration * 60 : breakDuration * 60;

      // Reset session saved flag when switching to focus mode
      if (nextMode === 'focus') {
        sessionSavedRef.current = false;
      }

      // Transition to next mode
      dispatch(setMode(nextMode));
      dispatch(setSecondsLeft(nextDuration));

      // Continue running into the next session
      dispatch(startTimerAction());

      return;
    }

    intervalRef.current = window.setTimeout(() => {
      dispatch(setSecondsLeft(secondsLeft - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearTimeout(intervalRef.current);
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

  const handleStart = async () => {
    if (isRunning) return;
    console.log('▶️ handleStart called');

    // Unlock sound if needed (Fix 1: guaranteed unlock on Start click)
    if (soundEnabled && !soundUnlocked) {
      console.log('🔊 Unlocking sound on Start click...');
      await unlockSound();
    }

    // Now safe to play sound
    if (soundEnabled && soundUnlocked) {
      playStartSound();
    }

    // Reset session saved flag when starting a new session
    if (mode === 'focus') {
      sessionSavedRef.current = false;
    }
    dispatch(startTimerAction());
    console.log('▶️ startTimerAction dispatched');
  };

  const handlePause = async () => {
    console.log('⏸️ handlePause called');

    // Optionally unlock sound on Pause click (Fix 1 variant)
    if (soundEnabled && !soundUnlocked) {
      console.log('🔊 Unlocking sound on Pause click...');
      await unlockSound();
    }

    // Now safe to play sound
    if (soundEnabled && soundUnlocked) {
      playPauseSound();
    }

    dispatch(pauseTimerAction());
    console.log('⏸️ pauseTimerAction dispatched');
    if (intervalRef.current) {
      window.clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const switchMode = (next: TimerMode) => {
    console.log(
      '🔀 switchMode called - new mode:',
      next,
      'isRunning:',
      isRunning
    );

    // Only pause if timer is running - let the user manually switch modes while paused
    if (isRunning) {
      console.log('⏸️ Timer is running, pausing before mode switch');
      handlePause();
    }

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
      {/* Fix 2: Sound unlock overlay - shown when timer is running but sound is locked */}
      {isRunning && soundEnabled && !soundUnlocked && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="rounded-xl border border-white/10 bg-black/80 p-6 max-w-sm">
            <div className="text-sm mb-4 opacity-90">
              Sound is blocked after refresh. Tap once to enable alerts and
              soundscape.
            </div>
            <button
              onClick={unlockSound}
              className="w-full px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
            >
              Enable sound
            </button>
          </div>
        </div>
      )}

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
            soundUnlocked={soundUnlocked}
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
