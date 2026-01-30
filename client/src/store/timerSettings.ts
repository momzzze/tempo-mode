import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface TimerSettingsState {
  focusDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
  autoStart: boolean;
  hideSeconds: boolean;
  notifications: boolean;
  triggerComplete: number; // Increment to trigger complete
  triggerRestart: number; // Increment to trigger restart
  triggerAddTime: number; // Increment to trigger add time
  timerStyle: 'classic' | 'halo';
}

const SETTINGS_KEY = 'tempo-mode-timer-settings';

const loadSettings = (): Partial<TimerSettingsState> => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return {};
    return JSON.parse(saved);
  } catch {
    return {};
  }
};

const savedSettings = loadSettings();

const initialState: TimerSettingsState = {
  focusDuration: savedSettings.focusDuration ?? 25,
  breakDuration: savedSettings.breakDuration ?? 5,
  soundEnabled: savedSettings.soundEnabled ?? false,
  autoStart: savedSettings.autoStart ?? false,
  hideSeconds: savedSettings.hideSeconds ?? false,
  notifications: savedSettings.notifications ?? false,
  triggerComplete: 0,
  triggerRestart: 0,
  triggerAddTime: 0,
  timerStyle: savedSettings.timerStyle ?? 'classic',
};

const timerSettingsSlice = createSlice({
  name: 'timerSettings',
  initialState,
  reducers: {
    setFocusDuration: (state, action: PayloadAction<number>) => {
      state.focusDuration = action.payload;
    },
    setBreakDuration: (state, action: PayloadAction<number>) => {
      state.breakDuration = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    toggleAutoStart: (state) => {
      state.autoStart = !state.autoStart;
    },
    toggleHideSeconds: (state) => {
      state.hideSeconds = !state.hideSeconds;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    completeTimer: (state) => {
      state.triggerComplete += 1;
    },
    restartTimer: (state) => {
      state.triggerRestart += 1;
    },
    addTimeToTimer: (state) => {
      state.triggerAddTime += 1;
    },
    setTimerStyle: (state, action: PayloadAction<'classic' | 'halo'>) => {
      state.timerStyle = action.payload;
    },
  },
});

export const {
  setFocusDuration,
  setBreakDuration,
  toggleSound,
  toggleAutoStart,
  toggleHideSeconds,
  toggleNotifications,
  completeTimer,
  restartTimer,
  addTimeToTimer,
  setTimerStyle,
} = timerSettingsSlice.actions;

export default timerSettingsSlice.reducer;
