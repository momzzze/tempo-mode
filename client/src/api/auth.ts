import { api } from './client';
import type { User } from '../store';

export async function register(email: string, password: string): Promise<User> {
  const res = await api.post<{ user: Omit<User, 'token'> } & { token: string }>(
    '/api/auth/register',
    { email, password }
  );
  return { ...res.user, token: res.token };
}

export async function login(email: string, password: string): Promise<User> {
  const res = await api.post<{ user: Omit<User, 'token'> } & { token: string }>(
    '/api/auth/login',
    { email, password }
  );
  return { ...res.user, token: res.token };
}

export async function getCurrentUser(): Promise<Omit<User, 'token'>> {
  const res = await api.get<{ user: Omit<User, 'token'> }>('/api/auth/me');
  return res.user;
}
