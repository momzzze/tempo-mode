import type { User } from './types';

export const AUTH_REHYDRATE = 'auth/rehydrate' as const;
export const AUTH_LOGIN_REQUEST = 'auth/login_request' as const;
export const AUTH_LOGIN_SUCCESS = 'auth/login_success' as const;
export const AUTH_LOGIN_FAILURE = 'auth/login_failure' as const;
export const AUTH_REGISTER_SUCCESS = 'auth/register_success' as const;
export const AUTH_LOGOUT = 'auth/logout' as const;

export type AuthAction =
  | { type: typeof AUTH_REHYDRATE; payload: User | null }
  | { type: typeof AUTH_LOGIN_REQUEST }
  | { type: typeof AUTH_LOGIN_SUCCESS; payload: User }
  | { type: typeof AUTH_LOGIN_FAILURE; error: string }
  | { type: typeof AUTH_REGISTER_SUCCESS; payload: User }
  | { type: typeof AUTH_LOGOUT };

export const rehydrate = (user: User | null): AuthAction => ({
  type: AUTH_REHYDRATE,
  payload: user,
});

export const loginRequest = (): AuthAction => ({ type: AUTH_LOGIN_REQUEST });
export const loginSuccess = (user: User): AuthAction => ({
  type: AUTH_LOGIN_SUCCESS,
  payload: user,
});
export const loginFailure = (error: string): AuthAction => ({
  type: AUTH_LOGIN_FAILURE,
  error,
});
export const registerSuccess = (user: User): AuthAction => ({
  type: AUTH_REGISTER_SUCCESS,
  payload: user,
});
export const logout = (): AuthAction => ({ type: AUTH_LOGOUT });
