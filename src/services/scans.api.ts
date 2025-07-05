
import { api } from './api';
import { AxiosResponse } from 'axios';

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
