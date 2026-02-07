import { configureStore, createSelector } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import userReducer from './user';
import timerSettingsReducer from './timerSettings';
import timerStateReducer from './timerState';

const PERSIST_KEY = 'tempo-mode-auth';
const SETTINGS_KEY = 'tempo-mode-timer-settings';
const TIMER_STATE_KEY = 'tempo-mode-timer-state';

export const store = configureStore({
  reducer: {
    user: userReducer,
    timerSettings: timerSettingsReducer,
    timerState: timerStateReducer,
  },
});

// Persist middleware
store.subscribe(() => {
  const state = store.getState();
  try {
    // Persist full user object (includes token, id, email)
    if (state.user.user?.token) {
      localStorage.setItem(PERSIST_KEY, JSON.stringify(state.user.user));
    } else {
      localStorage.removeItem(PERSIST_KEY);
    }

    // Persist timer settings
    const {
      triggerComplete,
      triggerRestart,
      triggerAddTime,
      ...settingsToPersist
    } = state.timerSettings;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsToPersist));

    // Persist timer state
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state.timerState));
  } catch {}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Base selectors
export const selectAuthState = (state: RootState) => state.user;

export const selectIsAuthed = createSelector(
  selectAuthState,
  (auth) => auth.status === 'authenticated' && !!auth.user?.token
);

export const selectUser = createSelector(selectAuthState, (auth) => auth.user);

export const selectUserEmail = createSelector(
  selectAuthState,
  (auth) => auth.user?.email ?? null
);

export const selectAuthStatus = createSelector(
  selectAuthState,
  (auth) => auth.status
);

export const selectAuthError = createSelector(
  selectAuthState,
  (auth) => auth.error
);

// Convenience hooks
export const useAuth = () => useAppSelector(selectAuthState);

// Export actions
export {
  loginUser,
  registerUser,
  refreshUser,
  logout,
  clearError,
  rehydrate,
} from './user';
export type { User } from './user/types';
export {
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
} from './timerSettings';
export {
  setMode,
  setSecondsLeft,
  decrementSecond,
  startTimer,
  pauseTimer,
  setTask,
  incrementCompleted,
  addFocusTime,
  resetTimer,
} from './timerState';
export type { TimerMode } from './timerState';
