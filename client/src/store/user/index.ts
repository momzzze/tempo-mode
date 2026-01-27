import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthStatus } from './types';
import { authService } from '../../services/authService';

export interface UserState {
  user: User | null;
  status: AuthStatus;
  error?: string;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
};

// Async thunks
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    return await authService.login({ email, password });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>('user/register', async ({ email, password }, { rejectWithValue }) => {
  try {
    return await authService.register({ email, password });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return rejectWithValue(message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    rehydrate: (state, action: PayloadAction<User | null>) => {
      if (action.payload && action.payload.token) {
        state.user = action.payload;
        state.status = 'authenticated';
      } else {
        state.status = 'idle';
      }
    },
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = undefined;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'authenticated';
        state.user = action.payload;
        state.error = undefined;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload || action.error.message || 'Login failed';
        state.user = null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'authenticated';
        state.user = action.payload;
        state.error = undefined;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'error';
        state.error =
          action.payload || action.error.message || 'Registration failed';
        state.user = null;
      });
  },
});

export const { rehydrate, logout, clearError } = userSlice.actions;
export default userSlice.reducer;
export type { User } from './types';
