
import { api } from './api';
import { AxiosResponse } from 'axios';

export interface LoginRequest {
  username: string;
  password: string;
  mfa_code?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface User {
  user_id: string;
  username: string;
  email: string;
  roles: string[];
  mfa_enabled: boolean;
}

export const authAPI = {
  login: (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/auth/login', data),
    
  logout: (): Promise<AxiosResponse> =>
    api.post('/auth/logout'),
    
  getCurrentUser: (): Promise<AxiosResponse<User>> =>
    api.get('/auth/current_user'),
    
  refreshToken: (refreshToken: string): Promise<AxiosResponse<{ access_token: string }>> =>
    api.post('/auth/refresh_token', { refresh_token: refreshToken }),

  setupMFA: (code?: string): Promise<AxiosResponse<{ secret?: string; qr_code?: string }>> =>
    code ? api.post('/auth/setup_mfa', { code }) : api.get('/auth/setup_mfa'),

  disableMFA: (password: string): Promise<AxiosResponse> =>
    api.post('/auth/disable_mfa', { password }),
};
