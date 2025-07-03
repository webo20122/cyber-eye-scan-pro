
import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenManager = {
  getAccessToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh_token`, {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          tokenManager.setTokens(access_token, refreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          tokenManager.clearTokens();
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API Service Types
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

export interface Asset {
  asset_id: string;
  name: string;
  type: 'IP' | 'Domain' | 'WebApp' | 'CodeRepo' | 'CloudAccount' | 'NetworkSegment';
  value: string;
  description?: string;
  owner_id: string;
  team_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Scan {
  scan_id: string;
  name: string;
  asset_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  total_findings_count: number;
  total_attack_paths_count: number;
  created_at: string;
  completed_at?: string;
  celery_task_id?: string;
}

export interface Finding {
  finding_id: string;
  scan_id: string;
  asset_id: string;
  name: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  description: string;
  recommendation: string;
  cvss_score?: number;
  cve_id?: string;
  owasp_top_10?: string;
  status: 'new' | 'triaged' | 'remediated' | 'false_positive';
  validated_status: boolean;
  poc_details?: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
}

export interface ScanParameters {
  target_ip?: string;
  target_domain?: string;
  enable_network_scan: boolean;
  network_scan_params?: {
    nmap_args?: string;
    ports?: string;
  };
  enable_web_application_scan: boolean;
  web_application_scan_params?: {
    enable_zap_scan?: boolean;
    zap_address?: string;
  };
  enable_credentials_leak: boolean;
  enable_database_enum_check: boolean;
  enable_sast_scan: boolean;
  sast_scan_params?: {
    code_repo_url?: string;
  };
}

// Auth API
export const authAPI = {
  login: (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/auth/login', data),
    
  logout: (): Promise<AxiosResponse> =>
    api.post('/auth/logout'),
    
  getCurrentUser: (): Promise<AxiosResponse<User>> =>
    api.get('/auth/current_user'),
    
  refreshToken: (refreshToken: string): Promise<AxiosResponse<{ access_token: string }>> =>
    api.post('/auth/refresh_token', { refresh_token: refreshToken }),
};

// Assets API
export const assetsAPI = {
  list: (): Promise<AxiosResponse<Asset[]>> =>
    api.get('/assets'),
    
  create: (data: Partial<Asset>): Promise<AxiosResponse<Asset>> =>
    api.post('/assets', data),
    
  get: (assetId: string): Promise<AxiosResponse<Asset>> =>
    api.get(`/assets/${assetId}`),
    
  update: (assetId: string, data: Partial<Asset>): Promise<AxiosResponse<Asset>> =>
    api.put(`/assets/${assetId}`, data),
    
  delete: (assetId: string): Promise<AxiosResponse> =>
    api.delete(`/assets/${assetId}`),
};

// Scans API
export const scansAPI = {
  list: (): Promise<AxiosResponse<Scan[]>> =>
    api.get('/scans'),
    
  initiate: (data: { asset_id: string; scan_name: string; scan_parameters: ScanParameters }): Promise<AxiosResponse<{ scan_id: string; celery_task_id: string }>> =>
    api.post('/scans/initiate', data),
    
  get: (scanId: string): Promise<AxiosResponse<Scan>> =>
    api.get(`/scans/${scanId}`),
    
  cancel: (scanId: string): Promise<AxiosResponse> =>
    api.post(`/scans/${scanId}/cancel`),
};

// Findings API
export const findingsAPI = {
  list: (params?: { status?: string; severity?: string; scan_id?: string }): Promise<AxiosResponse<Finding[]>> =>
    api.get('/findings', { params }),
    
  get: (findingId: string): Promise<AxiosResponse<Finding>> =>
    api.get(`/findings/${findingId}`),
    
  update: (findingId: string, data: Partial<Finding>): Promise<AxiosResponse<Finding>> =>
    api.put(`/findings/${findingId}`, data),
    
  addComment: (findingId: string, comment: string): Promise<AxiosResponse> =>
    api.post(`/findings/${findingId}/comments`, { comment }),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: (): Promise<AxiosResponse<{
    total_scans: number;
    scans_by_status: Record<string, number>;
    total_findings: number;
    findings_by_severity: Record<string, number>;
    recent_scans: Scan[];
  }>> =>
    api.get('/dashboard/summary'),
};

export default api;
