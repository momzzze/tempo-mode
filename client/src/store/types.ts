export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'error'
  | 'rehydrating';

export interface User {
  id: string;
  email: string;
  createdAt?: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  error?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}
