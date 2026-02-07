export interface User {
  id: string;
  email: string;
  points: number;
  createdAt?: string;
  token: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface UserState {
  user: User | null;
  status: AuthStatus;
  error?: string;
}
