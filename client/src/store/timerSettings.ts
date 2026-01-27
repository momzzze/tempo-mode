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

const initialState: TimerSettingsState = {
  focusDuration: 25,
  breakDuration: 5,
  soundEnabled: false,
  autoStart: false,
  hideSeconds: false,
  notifications: false,
  triggerComplete: 0,
  triggerRestart: 0,
  triggerAddTime: 0,
  timerStyle: 'classic',
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
