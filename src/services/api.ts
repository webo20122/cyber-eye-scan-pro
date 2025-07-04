
import axios, { AxiosResponse } from 'axios';

// API Configuration with environment variable support
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
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
    return true; // Setup is complete if we can get current user
  } catch (error: any) {
    if (error.response?.status === 404 || error.response?.status === 401) {
      return false; // Setup required
    }
    return true; // Assume setup is complete for other errors
  }
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

export interface Scan {
  scan_id: string;
  scan_name: string;
  asset_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  start_time?: string;
  end_time?: string;
  duration_seconds?: number;
  total_findings_count: number;
  total_attack_paths_count: number;
  progress_updates?: any[];
  raw_results_json?: any;
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

export interface ScanParameters {
  target_ip?: string;
  target_domain?: string;
  
  // Core modules
  enable_network_scan?: boolean;
  network_scan_params?: {
    nmap_args?: string;
    ports?: string;
    enable_os_detection?: boolean;
    enable_service_version_detection?: boolean;
    enable_script_scanning?: boolean;
    enable_cve_lookup?: boolean;
  };
  
  enable_web_application_scan?: boolean;
  web_application_scan_params?: {
    enable_zap_scan?: boolean;
    zap_address?: string;
    enable_zap_auth?: boolean;
    web_login_url?: string;
    web_username?: string;
    web_password?: string;
    enable_nikto_scan?: boolean;
    enable_gobuster_scan?: boolean;
    gobuster_wordlist_path?: string;
  };
  
  enable_vulnerability_check?: boolean;
  vulnerability_check_params?: {
    target_software_name?: string;
    target_cve_id?: string;
    enable_vulners_lookup?: boolean;
    enable_nvd_lookup?: boolean;
    enable_vendor_advisories?: boolean;
    enable_nessus_integration?: boolean;
    enable_qualys_integration?: boolean;
  };
  
  enable_active_directory_enumeration?: boolean;
  active_directory_enumeration_params?: {
    ldap_host: string;
    ldap_port?: number;
    ldap_use_tls?: boolean;
    ldap_username?: string;
    ldap_password?: string;
    ldap_base_dn: string;
    enable_user_enum?: boolean;
    enable_group_enum?: boolean;
    enable_computer_enum?: boolean;
    enable_password_policy_check?: boolean;
  };
  
  // Additional modules (with enable flags for future implementation)
  enable_credentials_leak?: boolean;
  enable_database_enum_check?: boolean;
  enable_desktop_pe_analysis?: boolean;
  enable_exploitation?: boolean;
  enable_internal_vuln_scan_gvm?: boolean;
  enable_mail_server_check?: boolean;
  enable_snmp_enum?: boolean;
  enable_shodan_lookup?: boolean;
  enable_ssh_security_check?: boolean;
  enable_bruteforce?: boolean;
  enable_passive_recon?: boolean;
  enable_wireless_scan?: boolean;
  enable_wireless_adv_scan?: boolean;
  enable_sast_scan?: boolean;
  enable_api_scan?: boolean;
  enable_adaptive_attack_path_mapping?: boolean;
  enable_automated_vulnerability_validation?: boolean;
}

export interface InitialSetupRequest {
  database_url: string;
  aes_key: string;
  admin_username: string;
  admin_email: string;
  admin_password: string;
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
    recent_scans: Scan[];
  }>> =>
    api.get('/dashboard/summary'),
};

export default api;
