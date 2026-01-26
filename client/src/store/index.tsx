import { configureStore, createSelector } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import userReducer from './user';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
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
export { loginUser, registerUser, logout, clearError } from './user';
export type { User } from './user/types';
