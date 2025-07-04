
import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Check if we're in demo mode
const isDemoMode = () => {
  return localStorage.getItem('demo_user') !== null;
};

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
    // Skip token refresh logic in demo mode
    if (isDemoMode()) {
      return Promise.reject(error);
    }

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

// Mock data for demo mode
const mockData = {
  dashboard: {
    total_scans: 12,
    scans_by_status: { completed: 8, running: 2, failed: 1, pending: 1 },
    total_findings: 47,
    findings_by_severity: { Critical: 3, High: 8, Medium: 15, Low: 18, Informational: 3 },
    recent_scans: [
      {
        scan_id: 'scan-001',
        name: 'Production Network Scan',
        asset_id: 'asset-001',
        status: 'completed' as const,
        progress: 100,
        total_findings_count: 12,
        total_attack_paths_count: 3,
        created_at: '2024-01-15T10:00:00Z',
        completed_at: '2024-01-15T11:30:00Z'
      }
    ]
  },
  scans: [
    {
      scan_id: 'scan-001',
      name: 'Production Network Scan',
      asset_id: 'asset-001',
      status: 'completed' as const,
      progress: 100,
      total_findings_count: 12,
      total_attack_paths_count: 3,
      created_at: '2024-01-15T10:00:00Z',
      completed_at: '2024-01-15T11:30:00Z',
      celery_task_id: 'task-001',
      raw_results_json: { scan_type: 'network', tools_used: ['nmap', 'zap'] }
    }
  ],
  assets: [
    {
      asset_id: 'asset-001',
      name: 'Production Server',
      type: 'IP' as const,
      value: '192.168.1.100',
      description: 'Main production server',
      owner_id: 'user-001',
      team_id: 'team-001',
      tags: ['production', 'critical'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    }
  ],
  findings: [
    {
      finding_id: 'finding-001',
      scan_id: 'scan-001',
      asset_id: 'asset-001',
      name: 'SQL Injection Vulnerability',
      severity: 'Critical' as const,
      description: 'SQL injection vulnerability found in login form',
      recommendation: 'Use parameterized queries and input validation',
      cvss_score: 9.8,
      cve_id: 'CVE-2024-0001',
      owasp_top_10: 'A03:2021 – Injection',
      status: 'new' as const,
      validated_status: true,
      poc_details: 'Payload: \' OR 1=1 --',
      created_at: '2024-01-15T11:00:00Z',
      raw_finding_details: { scanner: 'custom', confidence: 'high' }
    }
  ]
};

// Helper function to create mock API response
const createMockResponse = <T>(data: T): Promise<AxiosResponse<T>> => {
  return Promise.resolve({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any
  });
};

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
  raw_results_json?: any;
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
  raw_finding_details?: any;
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

  setupMFA: (code?: string): Promise<AxiosResponse<{ secret?: string; qr_code?: string }>> =>
    code ? api.post('/auth/setup_mfa', { code }) : api.get('/auth/setup_mfa'),

  disableMFA: (password: string): Promise<AxiosResponse> =>
    api.post('/auth/disable_mfa', { password }),
};

// Assets API
export const assetsAPI = {
  list: (): Promise<AxiosResponse<Asset[]>> =>
    isDemoMode() ? createMockResponse(mockData.assets) : api.get('/assets'),
    
  create: (data: Partial<Asset>): Promise<AxiosResponse<Asset>> =>
    isDemoMode() ? createMockResponse({ ...mockData.assets[0], ...data } as Asset) : api.post('/assets', data),
    
  get: (assetId: string): Promise<AxiosResponse<Asset>> =>
    isDemoMode() ? createMockResponse(mockData.assets[0]) : api.get(`/assets/${assetId}`),
    
  update: (assetId: string, data: Partial<Asset>): Promise<AxiosResponse<Asset>> =>
    isDemoMode() ? createMockResponse({ ...mockData.assets[0], ...data } as Asset) : api.put(`/assets/${assetId}`, data),
    
  delete: (assetId: string): Promise<AxiosResponse> =>
    isDemoMode() ? createMockResponse({}) : api.delete(`/assets/${assetId}`),
};

// Scans API
export const scansAPI = {
  list: (): Promise<AxiosResponse<Scan[]>> =>
    isDemoMode() ? createMockResponse(mockData.scans) : api.get('/scans'),
    
  initiate: (data: { asset_id: string; scan_name: string; scan_parameters: ScanParameters }): Promise<AxiosResponse<{ scan_id: string; celery_task_id: string }>> =>
    isDemoMode() ? createMockResponse({ scan_id: 'scan-new', celery_task_id: 'task-new' }) : api.post('/scans/initiate', data),
    
  get: (scanId: string): Promise<AxiosResponse<Scan>> =>
    isDemoMode() ? createMockResponse(mockData.scans[0]) : api.get(`/scans/${scanId}`),
    
  cancel: (scanId: string): Promise<AxiosResponse> =>
    isDemoMode() ? createMockResponse({}) : api.post(`/scans/${scanId}/cancel`),
};

// Findings API
export const findingsAPI = {
  list: (params?: { status?: string; severity?: string; scan_id?: string; search?: string }): Promise<AxiosResponse<Finding[]>> =>
    isDemoMode() ? createMockResponse(mockData.findings) : api.get('/findings', { params }),
    
  get: (findingId: string): Promise<AxiosResponse<Finding>> =>
    isDemoMode() ? createMockResponse(mockData.findings[0]) : api.get(`/findings/${findingId}`),
    
  update: (findingId: string, data: Partial<Finding>): Promise<AxiosResponse<Finding>> =>
    isDemoMode() ? createMockResponse({ ...mockData.findings[0], ...data } as Finding) : api.put(`/findings/${findingId}`, data),
    
  addComment: (findingId: string, comment: string): Promise<AxiosResponse> =>
    isDemoMode() ? createMockResponse({}) : api.post(`/findings/${findingId}/comments`, { comment }),

  getComments: (findingId: string): Promise<AxiosResponse<any[]>> =>
    isDemoMode() ? createMockResponse([]) : api.get(`/findings/${findingId}/comments`),
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
    isDemoMode() ? createMockResponse(mockData.dashboard) : api.get('/dashboard/summary'),
};

export default api;
