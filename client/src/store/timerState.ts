import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TimerMode = 'focus' | 'break';

export interface TimerState {
  mode: TimerMode;
  secondsLeft: number;
  isRunning: boolean;
  task: string;
  completed: number;
  totalFocusSec: number;
  timestamp: number;
}

const STORAGE_KEY = 'tempo-mode-timer-state';

const loadInitialState = (): TimerState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return {
        mode: 'focus',
        secondsLeft: 25 * 60,
        isRunning: false,
        task: '',
        completed: 0,
        totalFocusSec: 0,
        timestamp: Date.now(),
      };
    }

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
    return {
      mode: 'focus',
      secondsLeft: 25 * 60,
      isRunning: false,
      task: '',
      completed: 0,
      totalFocusSec: 0,
      timestamp: Date.now(),
    };
  }
};

const initialState: TimerState = loadInitialState();

const timerStateSlice = createSlice({
  name: 'timerState',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<TimerMode>) => {
      state.mode = action.payload;
    },
    setSecondsLeft: (state, action: PayloadAction<number>) => {
      state.secondsLeft = action.payload;
      state.timestamp = Date.now();
    },
    decrementSecond: (state) => {
      if (state.secondsLeft > 0) {
        state.secondsLeft -= 1;
      }
      state.timestamp = Date.now();
    },
    startTimer: (state) => {
      state.isRunning = true;
      state.timestamp = Date.now();
    },
    pauseTimer: (state) => {
      state.isRunning = false;
      state.timestamp = Date.now();
    },
    setTask: (state, action: PayloadAction<string>) => {
      state.task = action.payload;
    },
    incrementCompleted: (state) => {
      state.completed += 1;
    },
    addFocusTime: (state, action: PayloadAction<number>) => {
      state.totalFocusSec += action.payload;
    },
    resetTimer: (state, action: PayloadAction<{ duration: number }>) => {
      state.secondsLeft = action.payload.duration;
      state.isRunning = false;
      state.timestamp = Date.now();
    },
  },
});

export const {
  setMode,
  setSecondsLeft,
  decrementSecond,
  startTimer,
  pauseTimer,
  setTask,
  incrementCompleted,
  addFocusTime,
  resetTimer,
} = timerStateSlice.actions;

export default timerStateSlice.reducer;
