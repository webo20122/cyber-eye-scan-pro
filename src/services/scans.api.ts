
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
  
  // Core Security Modules
  enable_network_scan?: boolean;
  network_scan_params?: {
    nmap_args?: string;
    ports?: string;
    enable_os_detection?: boolean;
    enable_service_version_detection?: boolean;
    enable_script_scanning?: boolean;
    enable_cve_lookup?: boolean;
    scan_techniques?: string[];
    timing_template?: string;
    host_discovery?: boolean;
    stealth_mode?: boolean;
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
    enable_custom_payloads?: boolean;
    spider_depth?: number;
    passive_scan_only?: boolean;
    enable_ajax_spider?: boolean;
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
    enable_exploit_db_lookup?: boolean;
    severity_threshold?: string;
    enable_zero_day_detection?: boolean;
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
    enable_privilege_escalation_check?: boolean;
    enable_bloodhound_analysis?: boolean;
  };
  
  // Infrastructure & Network Security
  enable_credentials_leak?: boolean;
  credentials_leak_params?: {
    check_haveibeenpwned?: boolean;
    check_dehashed?: boolean;
    check_breach_databases?: boolean;
    enable_dark_web_monitoring?: boolean;
    custom_wordlists?: string[];
  };
  
  enable_database_enum_check?: boolean;
  database_enum_params?: {
    target_databases?: string[];
    enable_mssql_enum?: boolean;
    enable_mysql_enum?: boolean;
    enable_oracle_enum?: boolean;
    enable_mongodb_enum?: boolean;
    enable_redis_enum?: boolean;
    enable_privilege_escalation?: boolean;
  };
  
  enable_snmp_enum?: boolean;
  snmp_enum_params?: {
    community_strings?: string[];
    snmp_version?: string;
    enable_snmp_walk?: boolean;
    custom_oids?: string[];
  };
  
  enable_ssh_security_check?: boolean;
  ssh_security_params?: {
    check_weak_ciphers?: boolean;
    check_key_exchange?: boolean;
    check_authentication?: boolean;
    custom_port?: number;
    enable_user_enum?: boolean;
    check_host_keys?: boolean;
  };
  
  enable_mail_server_check?: boolean;
  mail_server_params?: {
    check_smtp?: boolean;
    check_pop3?: boolean;
    check_imap?: boolean;
    enable_user_enum?: boolean;
    check_relay?: boolean;
    check_spoofing?: boolean;
  };
  
  enable_shodan_lookup?: boolean;
  shodan_params?: {
    api_key?: string;
    search_query?: string;
    max_results?: number;
    enable_historical_data?: boolean;
  };
  
  enable_dns_enumeration?: boolean;
  dns_enum_params?: {
    enable_zone_transfer?: boolean;
    enable_subdomain_enum?: boolean;
    wordlist_path?: string;
    recursive_lookup?: boolean;
    check_dns_security?: boolean;
  };
  
  enable_ssl_tls_analysis?: boolean;
  ssl_tls_params?: {
    check_cipher_suites?: boolean;
    check_certificate_chain?: boolean;
    check_protocol_versions?: boolean;
    enable_heartbleed_check?: boolean;
    check_hsts?: boolean;
  };
  
  // Wireless & RF Security
  enable_wireless_scan?: boolean;
  wireless_params?: {
    interface_name?: string;
    enable_monitor_mode?: boolean;
    scan_duration?: number;
    target_bssid?: string;
    enable_deauth_attack?: boolean;
  };
  
  enable_wireless_adv_scan?: boolean;
  wireless_adv_params?: {
    enable_wps_attack?: boolean;
    enable_evil_twin?: boolean;
    enable_rogue_ap_detection?: boolean;
    enable_packet_capture?: boolean;
    capture_duration?: number;
  };
  
  // Application Security
  enable_sast_scan?: boolean;
  sast_params?: {
    code_repo_url?: string;
    programming_languages?: string[];
    enable_secrets_detection?: boolean;
    enable_dependency_check?: boolean;
    severity_threshold?: string;
  };
  
  enable_api_scan?: boolean;
  api_scan_params?: {
    api_specification_url?: string;
    api_base_url?: string;
    authentication_type?: string;
    api_key?: string;
    enable_fuzzing?: boolean;
    enable_injection_tests?: boolean;
  };
  
  enable_desktop_pe_analysis?: boolean;
  pe_analysis_params?: {
    target_binary_path?: string;
    enable_static_analysis?: boolean;
    enable_dynamic_analysis?: boolean;
    sandbox_timeout?: number;
    enable_packer_detection?: boolean;
  };
  
  enable_mobile_app_scan?: boolean;
  mobile_app_params?: {
    app_platform?: string;
    app_package_path?: string;
    enable_static_analysis?: boolean;
    enable_dynamic_analysis?: boolean;
    device_id?: string;
  };
  
  enable_web_crawling?: boolean;
  web_crawling_params?: {
    max_depth?: number;
    max_pages?: number;
    enable_form_analysis?: boolean;
    enable_javascript_execution?: boolean;
    custom_headers?: Record<string, string>;
  };
  
  // Cloud & Container Security
  enable_cloud_security_scan?: boolean;
  cloud_security_params?: {
    cloud_provider?: string;
    access_key?: string;
    secret_key?: string;
    region?: string;
    enable_compliance_check?: boolean;
    enable_misconfiguration_check?: boolean;
  };
  
  enable_container_security?: boolean;
  container_params?: {
    container_runtime?: string;
    image_names?: string[];
    enable_vulnerability_scan?: boolean;
    enable_secrets_scan?: boolean;
    enable_compliance_check?: boolean;
  };
  
  enable_iot_security_scan?: boolean;
  iot_params?: {
    device_ip_range?: string;
    device_types?: string[];
    enable_firmware_extraction?: boolean;
    enable_protocol_analysis?: boolean;
    enable_default_credentials_check?: boolean;
  };
  
  enable_firmware_analysis?: boolean;
  firmware_params?: {
    firmware_file_path?: string;
    architecture?: string;
    enable_binary_analysis?: boolean;
    enable_crypto_analysis?: boolean;
    enable_backdoor_detection?: boolean;
  };
  
  enable_scada_security?: boolean;
  scada_params?: {
    protocol_type?: string;
    target_ip_range?: string;
    enable_protocol_fuzzing?: boolean;
    enable_device_fingerprinting?: boolean;
    enable_historian_analysis?: boolean;
  };
  
  // Exploitation & Advanced
  enable_exploitation?: boolean;
  exploitation_params?: {
    metasploit_path?: string;
    enable_auto_exploit?: boolean;
    payload_type?: string;
    enable_post_exploitation?: boolean;
    target_os?: string;
  };
  
  enable_bruteforce?: boolean;
  bruteforce_params?: {
    target_services?: string[];
    username_list?: string;
    password_list?: string;
    threads?: number;
    enable_password_spraying?: boolean;
  };
  
  enable_internal_vuln_scan_gvm?: boolean;
  gvm_params?: {
    gvm_host?: string;
    gvm_port?: number;
    username?: string;
    password?: string;
    scan_config?: string;
    target_list?: string;
  };
  
  enable_adaptive_attack_path_mapping?: boolean;
  attack_path_params?: {
    enable_lateral_movement?: boolean;
    enable_privilege_escalation?: boolean;
    max_hop_count?: number;
    enable_ml_analysis?: boolean;
  };
  
  enable_automated_vulnerability_validation?: boolean;
  vuln_validation_params?: {
    enable_poc_generation?: boolean;
    enable_exploit_verification?: boolean;
    risk_threshold?: string;
    enable_ai_analysis?: boolean;
  };
  
  // Intelligence & Reconnaissance
  enable_passive_recon?: boolean;
  passive_recon_params?: {
    check_dns_records?: boolean;
    check_subdomains?: boolean;
    check_certificates?: boolean;
    check_whois?: boolean;
    enable_search_engine_recon?: boolean;
  };
  
  enable_osint_gathering?: boolean;
  osint_params?: {
    target_organization?: string;
    enable_social_media_recon?: boolean;
    enable_dark_web_monitoring?: boolean;
    enable_breach_monitoring?: boolean;
    custom_keywords?: string[];
  };
  
  enable_threat_intelligence?: boolean;
  threat_intel_params?: {
    enable_ioc_correlation?: boolean;
    enable_threat_actor_attribution?: boolean;
    enable_campaign_analysis?: boolean;
    threat_feeds?: string[];
  };
  
  enable_social_engineering?: boolean;
  social_eng_params?: {
    enable_phishing_simulation?: boolean;
    enable_vishing?: boolean;
    enable_sms_phishing?: boolean;
    target_employees?: string[];
    campaign_duration?: number;
  };
  
  // Specialized Analysis
  enable_malware_analysis?: boolean;
  malware_params?: {
    sample_file_path?: string;
    enable_static_analysis?: boolean;
    enable_dynamic_analysis?: boolean;
    sandbox_type?: string;
    analysis_timeout?: number;
  };
  
  enable_forensics_analysis?: boolean;
  forensics_params?: {
    evidence_path?: string;
    enable_file_carving?: boolean;
    enable_timeline_analysis?: boolean;
    enable_network_forensics?: boolean;
    case_number?: string;
  };
  
  enable_physical_security?: boolean;
  physical_params?: {
    facility_address?: string;
    enable_lock_picking?: boolean;
    enable_badge_cloning?: boolean;
    enable_tailgating_test?: boolean;
    enable_camera_analysis?: boolean;
  };
  
  enable_compliance_check?: boolean;
  compliance_params?: {
    compliance_frameworks?: string[];
    enable_pci_dss?: boolean;
    enable_hipaa?: boolean;
    enable_sox?: boolean;
    enable_gdpr?: boolean;
    enable_iso27001?: boolean;
  };
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
