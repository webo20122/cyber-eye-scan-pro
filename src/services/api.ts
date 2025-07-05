
import axios, { AxiosResponse } from 'axios';

// API Configuration with environment variable support
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
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

// Response interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh_token`, {
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

// Check if initial setup is required
export const checkInitialSetup = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/auth/current_user`);
    return true;
  } catch (error: any) {
    if (error.response?.status === 404 || error.response?.status === 401) {
      return false;
    }
    return true;
  }
};

// Import and export API services
export { authAPI } from './auth.api';
export { scansAPI } from './scans.api';

// Remaining API services
export interface Asset {
  asset_id: string;
  asset_name: string;
  asset_type: 'IP' | 'Domain' | 'WebApp' | 'CodeRepo' | 'CloudAccount' | 'NetworkSegment';
  target_value: string;
  description?: string;
  is_active: boolean;
  owner_id: string;
  team_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Finding {
  finding_id: string;
  scan_id: string;
  asset_id: string;
  finding_name: string;
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
  updated_at: string;
  raw_finding_details?: any;
}

export interface InitialSetupRequest {
  database_url: string;
  aes_key: string;
  admin_username: string;
  admin_email: string;
  admin_password: string;
}

// Initial Setup API
export const initialSetupAPI = {
  setup: (data: InitialSetupRequest): Promise<AxiosResponse> =>
    axios.post(`${API_BASE_URL}/initial_setup`, data),
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

// Findings API
export const findingsAPI = {
  list: (params?: { status?: string; severity?: string; scan_id?: string; search?: string }): Promise<AxiosResponse<Finding[]>> =>
    api.get('/findings', { params }),
    
  get: (findingId: string): Promise<AxiosResponse<Finding>> =>
    api.get(`/findings/${findingId}`),
    
  update: (findingId: string, data: Partial<Finding>): Promise<AxiosResponse<Finding>> =>
    api.put(`/findings/${findingId}`, data),
    
  addComment: (findingId: string, comment: string): Promise<AxiosResponse> =>
    api.post(`/findings/${findingId}/comments`, { comment }),

  getComments: (findingId: string): Promise<AxiosResponse<any[]>> =>
    api.get(`/findings/${findingId}/comments`),
};

// Reports API
export const reportsAPI = {
  get: (scanId: string): Promise<AxiosResponse<{ findings: Finding[]; attack_paths: any[] }>> =>
    api.get(`/reports/${scanId}`),
    
  downloadPDF: (scanId: string): Promise<AxiosResponse<Blob>> =>
    api.get(`/reports/${scanId}/download_pdf`, { responseType: 'blob' }),
};

// Settings API
export const settingsAPI = {
  get: (): Promise<AxiosResponse<Record<string, any>>> =>
    api.get('/settings'),
    
  update: (data: Record<string, any>): Promise<AxiosResponse> =>
    api.put('/settings', data),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: (): Promise<AxiosResponse<{
    total_scans: number;
    scans_by_status: Record<string, number>;
    total_findings: number;
    findings_by_severity: Record<string, number>;
    recent_scans: any[];
  }>> =>
    api.get('/dashboard/summary'),
};

export default api;
