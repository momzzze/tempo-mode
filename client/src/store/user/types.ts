export interface User {
  id: string;
  email: string;
  createdAt?: string;
  token: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface UserState {
  user: User | null;
  status: AuthStatus;
  error?: string;
}
