import { apiClient } from './utils/apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    createdAt?: string;
  };
  token: string;
}

export interface User {
  id: string;
  email: string;
  createdAt?: string;
  token: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      '/api/auth/login',
      credentials
    );
    return {
      ...response.user,
      token: response.token,
    };
  },

  async register(credentials: RegisterRequest): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      '/api/auth/register',
      credentials
    );
    return {
      ...response.user,
      token: response.token,
    };
  },

  async logout(): Promise<void> {
    // Clear local storage will be handled by Redux action
  },
};
