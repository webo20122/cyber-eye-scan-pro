
// This interface defines the structure for a single scan module configuration field
export interface ScanModuleConfigField {
  field_name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array_string' | 'array_enum' | 'json_object' | 'json_array';
  description: string;
  optional: boolean;
  default?: any;
  placeholder?: string;
  options?: string[]; // For 'enum' and 'array_enum' types
  input_type?: 'text' | 'password' | 'textarea'; // For 'string' type
  condition?: { field: string; value: any }; // For conditional rendering based on another field's value
}

// This interface defines the structure for a single scan module
export interface ScanModuleDefinition {
  key: string; // Corresponds to the module name (e.g., 'network_scan' for 'enable_network_scan')
  name: string;
  description: string;
  category: string;
  icon: string; // Emoji or icon component name
  parameters: ScanModuleConfigField[];
}

export const SCAN_MODULE_DEFINITIONS: ScanModuleDefinition[] = [
  {
    key: 'network_scan',
    name: 'Network Scan',
    description: 'Nmap-based port scanning, OS/service detection, and vulnerability checks.',
    category: 'Network',
    icon: '🌐',
    parameters: [
      {
        field_name: 'scan_type',
        label: 'Scan Type',
        type: 'enum',
        description: 'Select the type of network scan to perform.',
        optional: false,
        options: ['SYN', 'TCP Connect', 'UDP', 'Comprehensive'],
        default: 'Comprehensive'
      },
      {
        field_name: 'specific_ports',
        label: 'Specific Ports (comma-separated)',
        type: 'string',
        description: 'A comma-separated list of ports to scan (e.g., "22,80,443"). Leave empty for common ports or full scan.',
        optional: true,
        default: ''
      },
      {
        field_name: 'timing_template',
        label: 'Timing Template',
        type: 'enum',
        description: 'Set the aggressiveness of the scan timing (T0-T5).',
        optional: true,
        options: ['T0 (Paranoid)', 'T1 (Sneaky)', 'T2 (Polite)', 'T3 (Normal)', 'T4 (Aggressive)', 'T5 (Insane)'],
        default: 'T3 (Normal)'
      },
      {
        field_name: 'enable_os_detection',
        label: 'Enable OS Detection',
        type: 'boolean',
        description: 'Attempt to detect the operating system of the target.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_service_version_detection',
        label: 'Enable Service Version Detection',
        type: 'boolean',
        description: 'Attempt to determine service versions running on open ports.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_script_scanning',
        label: 'Enable Script Scanning (NSE)',
        type: 'boolean',
        description: 'Run Nmap Scripting Engine (NSE) scripts for vulnerability detection and enumeration.',
        optional: true,
        default: false
      },
      {
        field_name: 'script_categories',
        label: 'NSE Script Categories (comma-separated)',
        type: 'array_enum',
        description: 'Select categories of Nmap scripts to run (e.g., "vuln,auth,default").',
        optional: true,
        options: ['all', 'auth', 'broadcast', 'brute', 'default', 'discovery', 'dos', 'exploit', 'external', 'fuzzer', 'intrusive', 'malware', 'safe', 'version', 'vuln'],
        default: ['default'],
        condition: { field: 'enable_script_scanning', value: true }
      },
      {
        field_name: 'enable_firewall_evasion',
        label: 'Enable Firewall Evasion',
        type: 'boolean',
        description: 'Attempt to evade firewall detection (e.g., fragment packets, decoy scans).',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_decoy_scan',
        label: 'Enable Decoy Scan',
        type: 'boolean',
        description: 'Use decoy IP addresses to make the scan harder to trace.',
        optional: true,
        default: false,
        condition: { field: 'enable_firewall_evasion', value: true }
      },
      {
        field_name: 'nmap_custom_args',
        label: 'Custom Nmap Arguments',
        type: 'string',
        description: 'Any additional custom Nmap arguments not covered by other options.',
        optional: true,
        default: ''
      }
    ]
  },
  {
    key: 'credentials_leak',
    name: 'Credentials Leak Check',
    description: 'Comprehensive check for compromised credentials using various breach databases and dark web sources.',
    category: 'OSINT',
    icon: '🔍',
    parameters: [
      {
        field_name: 'check_type',
        label: 'Check Type',
        type: 'enum',
        description: 'Select whether to check by Email, Domain, or Username.',
        optional: false,
        options: ['email', 'domain', 'username'],
        default: 'email'
      },
      {
        field_name: 'value',
        label: 'Value to Check',
        type: 'string',
        description: 'The email address, domain, or username to check for leaks.',
        optional: false,
        placeholder: 'example@domain.com or example.com or jdoe'
      },
      {
        field_name: 'enable_dark_web_monitoring',
        label: 'Enable Dark Web Monitoring',
        type: 'boolean',
        description: 'Actively monitor dark web forums and markets for new mentions of the target.',
        optional: true,
        default: false
      },
      {
        field_name: 'monitor_frequency_days',
        label: 'Monitoring Frequency (Days)',
        type: 'number',
        description: 'How often to re-check for new leaks (in days).',
        optional: true,
        default: 7,
        condition: { field: 'enable_dark_web_monitoring', value: true }
      }
    ]
  },
  {
    key: 'database_enum_check',
    name: 'Database Enumeration & Weak Credential Check',
    description: 'Comprehensive database service discovery, version enumeration, misconfiguration checks, and weak credential testing.',
    category: 'Database',
    icon: '🗄️',
    parameters: [
      {
        field_name: 'database_type',
        label: 'Database Type (Optional)',
        type: 'enum',
        description: 'Specify a database type to focus on (e.g., MySQL, PostgreSQL, MSSQL).',
        optional: true,
        options: ['any', 'mysql', 'postgresql', 'mssql', 'oracle', 'mongodb', 'redis'],
        default: 'any'
      },
      {
        field_name: 'specific_ports',
        label: 'Specific Ports (comma-separated)',
        type: 'string',
        description: 'Specific database ports to check (e.g., "3306,5432,1433"). Leave empty for common ports.',
        optional: true,
        default: ''
      },
      {
        field_name: 'enable_bruteforce',
        label: 'Enable Credential Bruteforce',
        type: 'boolean',
        description: 'Attempt to bruteforce database credentials.',
        optional: true,
        default: false
      },
      {
        field_name: 'username_wordlist_path',
        label: 'Username Wordlist Path (Server-Side)',
        type: 'string',
        description: 'Path to a file on the server containing usernames for bruteforce.',
        optional: true,
        placeholder: '/opt/wordlists/db_usernames.txt',
        condition: { field: 'enable_bruteforce', value: true }
      },
      {
        field_name: 'password_wordlist_path',
        label: 'Password Wordlist Path (Server-Side)',
        type: 'string',
        description: 'Path to a file on the server containing passwords for bruteforce.',
        optional: true,
        placeholder: '/opt/wordlists/db_passwords.txt',
        condition: { field: 'enable_bruteforce', value: true }
      },
      {
        field_name: 'enable_misconfiguration_check',
        label: 'Enable Misconfiguration Check',
        type: 'boolean',
        description: 'Check for common database misconfigurations (e.g., default passwords, insecure network access).',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_sql_injection_test',
        label: 'Enable SQL Injection Test (Basic)',
        type: 'boolean',
        description: 'Perform basic SQL Injection tests (more advanced covered in Web/API Scan).',
        optional: true,
        default: false
      }
    ]
  },
  {
    key: 'desktop_pe_analysis',
    name: 'Desktop PE Analysis',
    description: 'In-depth Windows PE (Portable Executable) file analysis, including static, dynamic (sandbox), and behavioral analysis for malware detection.',
    category: 'Malware',
    icon: '💻',
    parameters: [
      {
        field_name: 'file_path',
        label: 'PE File Path (Server-Side)',
        type: 'string',
        description: 'The absolute path to the PE file on the CyberScan server.',
        optional: false,
        placeholder: '/data/malware_samples/sample.exe'
      },
      {
        field_name: 'enable_dynamic_analysis',
        label: 'Enable Dynamic Analysis (Sandbox)',
        type: 'boolean',
        description: 'Execute the PE file in a controlled sandbox environment for behavioral analysis.',
        optional: true,
        default: false
      },
      {
        field_name: 'sandbox_timeout',
        label: 'Sandbox Timeout (seconds)',
        type: 'number',
        description: 'Duration to run the PE file in the sandbox.',
        optional: true,
        default: 300,
        condition: { field: 'enable_dynamic_analysis', value: true }
      },
      {
        field_name: 'enable_virustotal_lookup',
        label: 'Enable VirusTotal Lookup',
        type: 'boolean',
        description: 'Submit file hash to VirusTotal for known malware signatures.',
        optional: true,
        default: false
      },
      {
        field_name: 'extract_strings',
        label: 'Extract Strings',
        type: 'boolean',
        description: 'Extract readable strings from the binary for analysis.',
        optional: true,
        default: true
      }
    ]
  },
  {
    key: 'exploitation',
    name: 'Exploitation Framework',
    description: 'Advanced exploitation capabilities, including Metasploit integration, custom exploit execution, and post-exploitation modules.',
    category: 'Exploitation',
    icon: '⚡',
    parameters: [
      {
        field_name: 'exploit_target_type',
        label: 'Exploit Target Type',
        type: 'enum',
        description: 'Select the type of target for exploitation.',
        optional: false,
        options: ['vulnerability_id', 'service_banner', 'custom_script'],
        default: 'vulnerability_id'
      },
      {
        field_name: 'vulnerability_id',
        label: 'Target Vulnerability ID',
        type: 'string',
        description: 'ID of a known vulnerability from findings (e.g., CVE-2023-12345) to attempt exploitation.',
        optional: true,
        placeholder: 'CVE-YYYY-XXXXX',
        condition: { field: 'exploit_target_type', value: 'vulnerability_id' }
      },
      {
        field_name: 'service_banner',
        label: 'Target Service Banner',
        type: 'string',
        description: 'Specific service banner/version to target (e.g., "Apache 2.4.52").',
        optional: true,
        placeholder: 'OpenSSH 8.2p1',
        condition: { field: 'exploit_target_type', value: 'service_banner' }
      },
      {
        field_name: 'script_path',
        label: 'Custom Exploit Script Path (Server-Side)',
        type: 'string',
        description: 'Path to a custom exploit script (e.g., Metasploit RC file or Python script) on the server.',
        optional: true,
        placeholder: '/opt/metasploit/my_exploit.rc',
        condition: { field: 'exploit_target_type', value: 'custom_script' }
      },
      {
        field_name: 'exploit_args',
        label: 'Exploit Arguments',
        type: 'string',
        description: 'Additional arguments to pass to the exploit script or module.',
        optional: true,
        default: ''
      },
      {
        field_name: 'enable_post_exploitation',
        label: 'Enable Post-Exploitation Modules',
        type: 'boolean',
        description: 'Run post-exploitation modules (e.g., privilege escalation, data exfiltration) after successful exploitation.',
        optional: true,
        default: false
      },
      {
        field_name: 'post_exploitation_modules',
        label: 'Post-Exploitation Modules (comma-separated)',
        type: 'array_string',
        description: 'Specific post-exploitation modules to run (e.g., "mimikatz,hashdump").',
        optional: true,
        default: [],
        condition: { field: 'enable_post_exploitation', value: true }
      }
    ]
  },
  {
    key: 'internal_vuln_scan_gvm',
    name: 'Internal Vulnerability Scan',
    description: 'GVM/OpenVAS vulnerability assessment for internal networks, with advanced reporting and target management.',
    category: 'Vulnerability',
    icon: '🛡️',
    parameters: [
      {
        field_name: 'gvm_scan_config_name',
        label: 'GVM Scan Configuration Name',
        type: 'string',
        description: 'The name of the GVM scan configuration to use (e.g., "Full and fast ultimate", "Discovery").',
        optional: false,
        placeholder: 'Full and fast ultimate'
      },
      {
        field_name: 'gvm_target_group',
        label: 'GVM Target Group (Optional)',
        type: 'string',
        description: 'Existing GVM target group name to use for the scan.',
        optional: true
      },
      {
        field_name: 'enable_automatic_target_creation',
        label: 'Auto-Create GVM Target',
        type: 'boolean',
        description: 'Automatically create a new GVM target if it does not exist.',
        optional: true,
        default: true
      },
      {
        field_name: 'report_format',
        label: 'Report Format',
        type: 'enum',
        description: 'Select the desired report format from GVM.',
        optional: true,
        options: ['PDF', 'XML', 'CSV', 'HTML'],
        default: 'PDF'
      }
    ]
  },
  {
    key: 'mail_server_check',
    name: 'Mail Server Security',
    description: 'In-depth analysis of mail server configurations, including SPF, DKIM, DMARC, open relay tests, and email header analysis.',
    category: 'Email',
    icon: '📧',
    parameters: [
      {
        field_name: 'domain_name',
        label: 'Domain Name',
        type: 'string',
        description: 'The domain name of the mail server to check (e.g., "example.com").',
        optional: false,
        placeholder: 'example.com'
      },
      {
        field_name: 'enable_open_relay_test',
        label: 'Enable Open Relay Test',
        type: 'boolean',
        description: 'Attempt to test if the mail server is an open relay.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_email_header_analysis',
        label: 'Enable Email Header Analysis',
        type: 'boolean',
        description: 'Analyze common email headers for security flaws (e.g., missing security headers).',
        optional: true,
        default: true
      },
      {
        field_name: 'test_email_address',
        label: 'Test Email Address (Optional)',
        type: 'string',
        description: 'An email address to send a test email to for header analysis.',
        optional: true,
        placeholder: 'test@example.com',
        condition: { field: 'enable_email_header_analysis', value: true }
      }
    ]
  },
  {
    key: 'snmp_enum',
    name: 'SNMP Enumeration',
    description: 'Comprehensive network device SNMP enumeration, including community string testing, MIB walks, and default credential checks.',
    category: 'Network',
    icon: '🔧',
    parameters: [
      {
        field_name: 'snmp_community_strings',
        label: 'SNMP Community Strings (comma-separated)',
        type: 'array_string',
        description: 'List of SNMP community strings to test (e.g., "public,private,cisco").',
        optional: true,
        default: ['public', 'private']
      },
      {
        field_name: 'enable_mib_walk',
        label: 'Enable MIB Walk',
        type: 'boolean',
        description: 'Perform a full MIB walk to enumerate all available OIDs.',
        optional: true,
        default: true
      },
      {
        field_name: 'specific_oids',
        label: 'Specific OIDs (comma-separated)',
        type: 'array_string',
        description: 'Comma-separated list of specific OIDs to query (e.g., "1.3.6.1.2.1.1.1.0,1.3.6.1.2.1.25.1.1.0").',
        optional: true,
        default: []
      },
      {
        field_name: 'enable_default_credential_check',
        label: 'Enable Default Credential Check',
        type: 'boolean',
        description: 'Check for common default SNMP credentials.',
        optional: true,
        default: true
      }
    ]
  },
  {
    key: 'vulnerability_check',
    name: 'Vulnerability Lookup',
    description: 'Advanced vulnerability lookup and risk assessment using multiple sources, including NVD, Vulners, vendor advisories, and commercial scanner integrations.',
    category: 'Vulnerability',
    icon: '🔎',
    parameters: [
      {
        field_name: 'lookup_target_type',
        label: 'Lookup Target Type',
        type: 'enum',
        description: 'Select the type of target for vulnerability lookup.',
        optional: false,
        options: ['software_name', 'cve_id', 'ip_address', 'domain_name'],
        default: 'software_name'
      },
      {
        field_name: 'target_value',
        label: 'Target Value',
        type: 'string',
        description: 'The specific value to look up (e.g., "nginx 1.20.1", "CVE-2021-44228", "192.168.1.1").',
        optional: false,
        placeholder: 'Value based on selected type'
      },
      {
        field_name: 'enable_vulners_lookup',
        label: 'Enable Vulners Lookup',
        type: 'boolean',
        description: 'Integrate with Vulners.com for vulnerability data.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_nvd_lookup',
        label: 'Enable NVD Lookup',
        type: 'boolean',
        description: 'Integrate with NIST National Vulnerability Database (NVD).',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_vendor_advisories',
        label: 'Enable Vendor Advisories Lookup',
        type: 'boolean',
        description: 'Include lookups in vendor-specific security advisories.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_exploitdb_lookup',
        label: 'Enable Exploit-DB Lookup',
        type: 'boolean',
        description: 'Search Exploit-DB for public exploits related to findings.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_nessus_integration',
        label: 'Enable Nessus Integration',
        type: 'boolean',
        description: 'Leverage Nessus for vulnerability data if configured.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_qualys_integration',
        label: 'Enable Qualys Integration',
        type: 'boolean',
        description: 'Leverage Qualys for vulnerability data if configured.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_epss_scoring',
        label: 'Enable EPSS Scoring',
        type: 'boolean',
        description: 'Fetch Exploit Prediction Scoring System (EPSS) scores for CVEs.',
        optional: true,
        default: false
      }
    ]
  },
  {
    key: 'shodan_lookup',
    name: 'Shodan OSINT',
    description: 'In-depth passive reconnaissance using Shodan.io, including advanced query options and data extraction.',
    category: 'OSINT',
    icon: '🌍',
    parameters: [
      {
        field_name: 'shodan_query',
        label: 'Shodan Query (Optional)',
        type: 'string',
        description: 'A specific Shodan query string (e.g., "port:80 country:US"). If empty, uses target IP/Domain.',
        optional: true,
        default: ''
      },
      {
        field_name: 'enable_vulnerability_data',
        label: 'Include Vulnerability Data',
        type: 'boolean',
        description: 'Fetch vulnerability information associated with Shodan results.',
        optional: true,
        default: false
      },
      {
        field_name: 'limit_results',
        label: 'Limit Results',
        type: 'number',
        description: 'Maximum number of Shodan results to retrieve.',
        optional: true,
        default: 100
      }
    ]
  },
  {
    key: 'web_application_scan',
    name: 'Web Application Scan',
    description: 'Comprehensive web application security testing using ZAP, Nikto, Gobuster, and advanced vulnerability detection techniques.',
    category: 'Web',
    icon: '🌐',
    parameters: [
      {
        field_name: 'enable_zap_scan',
        label: 'Enable ZAP Scan',
        type: 'boolean',
        description: 'Run a comprehensive scan using OWASP ZAP.',
        optional: true,
        default: false
      },
      {
        field_name: 'zap_proxy_address',
        label: 'ZAP Proxy Address (Optional)',
        type: 'string',
        description: 'The address of the ZAP proxy if not default (e.g., "http://localhost:8080").',
        optional: true,
        placeholder: 'http://localhost:8080',
        condition: { field: 'enable_zap_scan', value: true }
      },
      {
        field_name: 'enable_zap_authentication',
        label: 'Enable ZAP Authentication',
        type: 'boolean',
        description: 'Configure ZAP to authenticate to the web application.',
        optional: true,
        default: false,
        condition: { field: 'enable_zap_scan', value: true }
      },
      {
        field_name: 'web_login_url',
        label: 'Login URL',
        type: 'string',
        description: 'The URL for the web application\'s login page (required if authentication is enabled).',
        optional: true,
        placeholder: 'https://example.com/login',
        condition: { field: 'enable_zap_authentication', value: true }
      },
      {
        field_name: 'web_username',
        label: 'Web Username',
        type: 'string',
        description: 'Username for web application authentication.',
        optional: true,
        condition: { field: 'enable_zap_authentication', value: true }
      },
      {
        field_name: 'web_password',
        label: 'Web Password',
        type: 'string',
        description: 'Password for web application authentication.',
        optional: true,
        input_type: 'password',
        condition: { field: 'enable_zap_authentication', value: true }
      },
      {
        field_name: 'zap_scan_policy',
        label: 'ZAP Scan Policy (Optional)',
        type: 'string',
        description: 'Name of a specific ZAP scan policy to use (e.g., "SQL Injection", "XSS").',
        optional: true,
        condition: { field: 'enable_zap_scan', value: true }
      },
      {
        field_name: 'enable_nikto_scan',
        label: 'Enable Nikto Scan',
        type: 'boolean',
        description: 'Run a basic web server scanner using Nikto.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_gobuster_scan',
        label: 'Enable Gobuster Scan',
        type: 'boolean',
        description: 'Run directory/file brute-forcing using Gobuster.',
        optional: true,
        default: false
      },
      {
        field_name: 'gobuster_wordlist_path',
        label: 'Gobuster Wordlist Path (Server-Side)',
        type: 'string',
        description: 'Path to the wordlist file on the server for Gobuster.',
        optional: true,
        placeholder: '/usr/share/wordlists/dirb/common.txt',
        condition: { field: 'enable_gobuster_scan', value: true }
      },
      {
        field_name: 'enable_business_logic_tests',
        label: 'Enable Business Logic Tests',
        type: 'boolean',
        description: 'Include tests for common business logic flaws (e.g., insecure direct object references, parameter tampering).',
        optional: true,
        default: false
      }
    ]
  },
  {
    key: 'ssh_security_check',
    name: 'SSH Security Check',
    description: 'Analyzes SSH server configuration for common security weaknesses, including supported ciphers, weak algorithms, and user enumeration.',
    category: 'Network',
    icon: '🔐',
    parameters: [
      {
        field_name: 'ssh_port',
        label: 'SSH Port',
        type: 'number',
        description: 'The port the SSH service is running on. Default is 22.',
        optional: true,
        default: 22
      },
      {
        field_name: 'enable_cipher_check',
        label: 'Check Supported Ciphers',
        type: 'boolean',
        description: 'Analyze supported encryption ciphers for weaknesses.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_weak_algorithm_check',
        label: 'Check Weak Algorithms',
        type: 'boolean',
        description: 'Check for the use of weak key exchange or MAC algorithms.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_user_enumeration',
        label: 'Enable User Enumeration',
        type: 'boolean',
        description: 'Attempt to enumerate valid SSH usernames.',
        optional: true,
        default: false
      }
    ]
  },
  {
    key: 'bruteforce',
    name: 'Credential Bruteforce',
    description: 'Hydra-based credential bruteforce attacks against various protocols, with advanced options for rate limiting and custom forms.',
    category: 'Attack',
    icon: '🔨',
    parameters: [
      {
        field_name: 'protocol',
        label: 'Protocol',
        type: 'enum',
        description: 'The protocol to bruteforce.',
        optional: false,
        options: ['ssh', 'ftp', 'telnet', 'http-get', 'http-post-form', 'smb', 'rdp', 'vnc', 'pop3', 'imap', 'smtp'],
        default: 'ssh'
      },
      {
        field_name: 'port',
        label: 'Port',
        type: 'number',
        description: 'The port of the service to bruteforce. Leave empty for default protocol port.',
        optional: true
      },
      {
        field_name: 'username',
        label: 'Single Username',
        type: 'string',
        description: 'A single username to test. Use with "Username Wordlist Path" for more options.',
        optional: true
      },
      {
        field_name: 'username_wordlist_path',
        label: 'Username Wordlist Path (Server-Side)',
        type: 'string',
        description: 'Path to a file on the server containing usernames for bruteforce.',
        optional: true,
        placeholder: '/usr/share/wordlists/usernames.txt'
      },
      {
        field_name: 'password_wordlist_path',
        label: 'Password Wordlist Path (Server-Side)',
        type: 'string',
        description: 'Path to a file on the server containing passwords for bruteforce.',
        optional: true,
        placeholder: '/usr/share/wordlists/passwords.txt'
      },
      {
        field_name: 'use_hydra',
        label: 'Use Hydra Tool',
        type: 'boolean',
        description: 'Utilize the Hydra tool for bruteforce attacks.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_rate_limit_bypass',
        label: 'Enable Rate Limit Bypass',
        type: 'boolean',
        description: 'Attempt to bypass rate limiting mechanisms during bruteforce.',
        optional: true,
        default: false
      },
      {
        field_name: 'custom_form_params',
        label: 'Custom Form Parameters (JSON)',
        type: 'json_object',
        description: 'JSON object for custom form parameters (e.g., for HTTP-POST-FORM).',
        optional: true,
        default: {},
        condition: { field: 'protocol', value: 'http-post-form' }
      }
    ]
  },
  {
    key: 'passive_recon',
    name: 'Passive Reconnaissance',
    description: 'Comprehensive information gathering about the target without direct interaction, including WHOIS, DNS, Certificate Transparency, and advanced subdomain enumeration.',
    category: 'OSINT',
    icon: '🕵️',
    parameters: [
      {
        field_name: 'enable_whois_lookup',
        label: 'Enable WHOIS Lookup',
        type: 'boolean',
        description: 'Perform WHOIS lookup for domain registration information.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_dns_enumeration',
        label: 'Enable DNS Enumeration',
        type: 'boolean',
        description: 'Perform DNS record enumeration (e.g., A, MX, NS, TXT).',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_subdomain_bruteforce',
        label: 'Enable Subdomain Bruteforce',
        type: 'boolean',
        description: 'Attempt to discover subdomains using a wordlist.',
        optional: true,
        default: false,
        condition: { field: 'enable_dns_enumeration', value: true }
      },
      {
        field_name: 'subdomain_wordlist_path',
        label: 'Subdomain Wordlist Path (Server-Side)',
        type: 'string',
        description: 'Path to a wordlist file on the server for subdomain bruteforce.',
        optional: true,
        placeholder: '/usr/share/wordlists/subdomains-top1M.txt',
        condition: { field: 'enable_subdomain_bruteforce', value: true }
      },
      {
        field_name: 'enable_certificate_transparency',
        label: 'Enable Certificate Transparency',
        type: 'boolean',
        description: 'Search Certificate Transparency logs for related domains/subdomains.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_email_harvesting',
        label: 'Enable Email Harvesting',
        type: 'boolean',
        description: 'Attempt to find publicly available email addresses related to the target.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_code_repo_discovery',
        label: 'Enable Code Repository Discovery',
        type: 'boolean',
        description: 'Search for exposed code repositories (e.g., GitHub dorks).',
        optional: true,
        default: false
      }
    ]
  },
  {
    key: 'wireless_scan',
    name: 'Wireless Network Scan',
    description: 'Comprehensive wireless network discovery, handshake capture, and WEP/WPA/WPA2 cracking.',
    category: 'Wireless',
    icon: '📡',
    parameters: [
      {
        field_name: 'wireless_interface',
        label: 'Wireless Interface',
        type: 'string',
        description: 'The wireless interface in monitor mode (e.g., "wlan0mon").',
        optional: false,
        placeholder: 'wlan0mon'
      },
      {
        field_name: 'wordlist_path',
        label: 'Wordlist Path (Server-Side)',
        type: 'string',
        description: 'Path to a wordlist file for WPA/WPA2 cracking.',
        optional: true,
        placeholder: '/usr/share/wordlists/rockyou.txt'
      },
      {
        field_name: 'handshake_timeout',
        label: 'Handshake Capture Timeout (seconds)',
        type: 'number',
        description: 'Time limit for capturing handshakes.',
        optional: true,
        default: 600
      },
      {
        field_name: 'cracking_timeout',
        label: 'Cracking Timeout (seconds)',
        type: 'number',
        description: 'Time limit for attempting to crack captured handshakes.',
        optional: true,
        default: 1800
      },
      {
        field_name: 'target_bssid',
        label: 'Target BSSID (Optional)',
        type: 'string',
        description: 'Specific BSSID (MAC address) of the access point to target (e.g., "AA:BB:CC:DD:EE:FF").',
        optional: true
      },
      {
        field_name: 'channel',
        label: 'Channel (Optional)',
        type: 'number',
        description: 'Specific channel to scan on.',
        optional: true
      },
      {
        field_name: 'enable_wep_cracking',
        label: 'Enable WEP Cracking',
        type: 'boolean',
        description: 'Attempt to crack WEP encrypted networks.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_eap_cracking',
        label: 'Enable EAP Cracking (Enterprise Wi-Fi)',
        type: 'boolean',
        description: 'Attempt to crack EAP credentials for enterprise Wi-Fi networks.',
        optional: true,
        default: false
      }
    ]
  },
  {
    key: 'wireless_adv_scan',
    name: 'Advanced Wireless Attacks',
    description: 'Execute advanced wireless attacks like deauthentication, rogue AP detection, and Evil Twin attacks.',
    category: 'Wireless',
    icon: '📶',
    parameters: [
      {
        field_name: 'wireless_interface',
        label: 'Wireless Interface',
        type: 'string',
        description: 'The wireless interface in monitor mode (e.g., "wlan0mon").',
        optional: false,
        placeholder: 'wlan0mon'
      },
      {
        field_name: 'attack_type',
        label: 'Attack Type',
        type: 'enum',
        description: 'Select the type of advanced wireless attack to perform.',
        optional: false,
        options: ['deauthentication', 'rogue_ap_detection', 'evil_twin'],
        default: 'deauthentication'
      },
      {
        field_name: 'deauth_target_bssid',
        label: 'Deauth Target BSSID',
        type: 'string',
        description: 'BSSID of the access point to deauthenticate clients from (required for deauth).',
        optional: true,
        placeholder: 'AA:BB:CC:DD:EE:FF',
        condition: { field: 'attack_type', value: 'deauthentication' }
      },
      {
        field_name: 'deauth_client_mac',
        label: 'Deauth Client MAC (Optional)',
        type: 'string',
        description: 'Specific client MAC to deauthenticate. Leave empty to deauth all clients.',
        optional: true,
        placeholder: '11:22:33:44:55:66',
        condition: { field: 'attack_type', value: 'deauthentication' }
      },
      {
        field_name: 'deauth_packets',
        label: 'Deauth Packets',
        type: 'number',
        description: 'Number of deauthentication packets to send.',
        optional: true,
        default: 100,
        condition: { field: 'attack_type', value: 'deauthentication' }
      },
      {
        field_name: 'rogue_ap_known_ssids_file',
        label: 'Known SSIDs File (Server-Side)',
        type: 'string',
        description: 'Path to a file on the server listing legitimate SSIDs to compare against.',
        optional: true,
        placeholder: '/etc/known_ssids.txt',
        condition: { field: 'attack_type', value: 'rogue_ap_detection' }
      },
      {
        field_name: 'rogue_ap_alert_on_new_ap',
        label: 'Alert on New AP',
        type: 'boolean',
        description: 'Generate an alert if a new, unknown access point is detected.',
        optional: true,
        default: true,
        condition: { field: 'attack_type', value: 'rogue_ap_detection' }
      },
      {
        field_name: 'evil_twin_ssid',
        label: 'Evil Twin SSID',
        type: 'string',
        description: 'The SSID to broadcast for the Evil Twin attack.',
        optional: true,
        placeholder: 'FreeWiFi',
        condition: { field: 'attack_type', value: 'evil_twin' }
      },
      {
        field_name: 'evil_twin_channel',
        label: 'Evil Twin Channel',
        type: 'number',
        description: 'The channel for the Evil Twin AP.',
        optional: true,
        condition: { field: 'attack_type', value: 'evil_twin' }
      }
    ]
  },
  {
    key: 'active_directory_enumeration',
    name: 'Active Directory Enumeration',
    description: 'Comprehensive enumeration of Active Directory objects and policies, including advanced credential attacks like Kerberoasting and AS-REPRoasting.',
    category: 'Directory',
    icon: '🏢',
    parameters: [
      {
        field_name: 'ldap_host',
        label: 'LDAP Host',
        type: 'string',
        description: 'The IP address or hostname of the Active Directory domain controller.',
        optional: false,
        placeholder: '192.168.1.10'
      },
      {
        field_name: 'ldap_port',
        label: 'LDAP Port',
        type: 'number',
        description: 'The port for LDAP communication (e.g., 389 for unencrypted, 636 for LDAPS).',
        optional: true,
        default: 389
      },
      {
        field_name: 'use_tls',
        label: 'Use TLS/SSL (LDAPS)',
        type: 'boolean',
        description: 'Enable TLS encryption for LDAP communication (uses port 636 if true).',
        optional: true,
        default: false
      },
      {
        field_name: 'ldap_username',
        label: 'LDAP Username',
        type: 'string',
        description: 'Username for LDAP binding (e.g., "admin@example.com" or "EXAMPLE\\admin").',
        optional: true
      },
      {
        field_name: 'ldap_password',
        label: 'LDAP Password',
        type: 'string',
        description: 'Password for LDAP binding.',
        optional: true,
        input_type: 'password'
      },
      {
        field_name: 'base_dn',
        label: 'Base DN',
        type: 'string',
        description: 'The Base DN for the LDAP search (e.g., "DC=example,DC=com").',
        optional: false,
        placeholder: 'DC=example,DC=com'
      },
      {
        field_name: 'enable_user_enumeration',
        label: 'Enable User Enumeration',
        type: 'boolean',
        description: 'Enumerate Active Directory users.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_group_enumeration',
        label: 'Enable Group Enumeration',
        type: 'boolean',
        description: 'Enumerate Active Directory groups.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_computer_enumeration',
        label: 'Enable Computer Enumeration',
        type: 'boolean',
        description: 'Enumerate Active Directory computers.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_password_policy_check',
        label: 'Enable Password Policy Check',
        type: 'boolean',
        description: 'Check the Active Directory password policy.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_kerberoasting',
        label: 'Enable Kerberoasting',
        type: 'boolean',
        description: 'Attempt to extract service principal name (SPN) hashes for offline cracking.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_as_rep_roasting',
        label: 'Enable AS-REPRoasting',
        type: 'boolean',
        description: 'Attempt to extract hashes from users with "Do not require Kerberos preauthentication" enabled.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_gpo_analysis',
        label: 'Enable GPO Analysis',
        type: 'boolean',
        description: 'Analyze Group Policy Objects for security misconfigurations.',
        optional: true,
        default: false
      }
    ]
  },
  {
    key: 'sast_scan',
    name: 'Static Code Analysis',
    description: 'In-depth SAST scanning of source code for security vulnerabilities using Semgrep, with custom rule support and language-specific analysis.',
    category: 'Code',
    icon: '📝',
    parameters: [
      {
        field_name: 'scan_source',
        label: 'Code Source',
        type: 'enum',
        description: 'Select where the code to be scanned is located.',
        optional: false,
        options: ['repository', 'local_path'],
        default: 'repository'
      },
      {
        field_name: 'code_repo_url',
        label: 'Code Repository URL',
        type: 'string',
        description: 'URL of the Git repository (e.g., "https://github.com/org/repo.git").',
        optional: true,
        placeholder: 'https://github.com/my-org/my-app.git',
        condition: { field: 'scan_source', value: 'repository' }
      },
      {
        field_name: 'local_code_path',
        label: 'Local Code Path (Server-Side)',
        type: 'string',
        description: 'Path to local code directory on the CyberScan server.',
        optional: true,
        placeholder: '/data/my-app-source',
        condition: { field: 'scan_source', value: 'local_path' }
      },
      {
        field_name: 'git_branch',
        label: 'Git Branch (Optional)',
        type: 'string',
        description: 'Specific Git branch to clone and scan (e.g., "main" or "develop").',
        optional: true,
        default: 'main',
        condition: { field: 'scan_source', value: 'repository' }
      },
      {
        field_name: 'semgrep_config_path',
        label: 'Semgrep Config Path (Server-Side)',
        type: 'string',
        description: 'Path to a custom Semgrep rules file or directory on the server.',
        optional: true,
        placeholder: '/opt/semgrep_rules/custom.yaml'
      },
      {
        field_name: 'semgrep_timeout',
        label: 'Semgrep Timeout (seconds)',
        type: 'number',
        description: 'Maximum time for Semgrep analysis to run.',
        optional: true,
        default: 300
      },
      {
        field_name: 'semgrep_rules',
        label: 'Semgrep Rules (comma-separated)',
        type: 'array_string',
        description: 'A comma-separated list of Semgrep rule identifiers to use (e.g., "r/javascript.react.security.react-dom-dangerouslysetinnerhtml").',
        optional: true,
        default: ['p/ci-oss']
      },
      {
        field_name: 'enable_incremental_scan',
        label: 'Enable Incremental Scan',
        type: 'boolean',
        description: 'Only scan code changes since the last successful SAST scan.',
        optional: true,
        default: false
      },
      {
        field_name: 'target_languages',
        label: 'Target Languages (comma-separated)',
        type: 'array_enum',
        description: 'Specific programming languages to focus the scan on.',
        optional: true,
        options: ['python', 'javascript', 'typescript', 'java', 'go', 'csharp', 'php', 'ruby'],
        default: []
      }
    ]
  },
  {
    key: 'api_scan',
    name: 'API Security Testing',
    description: 'Automated security testing for RESTful and GraphQL APIs using OpenAPI/Swagger specifications, including advanced fuzzing, authorization, and rate limit bypass tests.',
    category: 'API',
    icon: '🔌',
    parameters: [
      {
        field_name: 'api_spec_path',
        label: 'API Spec Path (URL or Server-Side File)',
        type: 'string',
        description: 'URL or server-side file path to the OpenAPI/Swagger specification (JSON/YAML).',
        optional: false,
        placeholder: 'http://localhost:8080/swagger.json or /data/api_spec.yaml'
      },
      {
        field_name: 'api_base_url',
        label: 'API Base URL',
        type: 'string',
        description: 'The base URL of the API endpoints to test (e.g., "http://localhost:8080/api/v1").',
        optional: false,
        placeholder: 'http://localhost:8080/api/v1'
      },
      {
        field_name: 'enable_auth_bypass_check',
        label: 'Enable Authentication Bypass Check',
        type: 'boolean',
        description: 'Test for unauthenticated access to protected endpoints.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_authorization_check',
        label: 'Enable Authorization Check',
        type: 'boolean',
        description: 'Test for horizontal/vertical privilege escalation (BOLA/BFLA).',
        optional: true,
        default: false
      },
      {
        field_name: 'auth_config',
        label: 'Authentication Configuration (JSON)',
        type: 'json_object',
        description: 'JSON object defining how to authenticate to the API (e.g., {"type": "bearer", "token": "YOUR_TOKEN"}).',
        optional: true,
        default: {},
        placeholder: '{"type": "bearer", "token": "YOUR_TOKEN"}'
      },
      {
        field_name: 'authorization_test_cases',
        label: 'Authorization Test Cases (JSON Array)',
        type: 'json_array',
        description: 'JSON array of objects defining different user roles/tokens for authorization tests (e.g., [{"role": "admin", "token": "..."}, {"role": "user", "token": "..."}]).',
        optional: true,
        default: []
      },
      {
        field_name: 'enable_advanced_fuzzing',
        label: 'Enable Advanced Fuzzing',
        type: 'boolean',
        description: 'Perform more extensive and intelligent fuzzing of API parameters.',
        optional: true,
        default: false
      },
      {
        field_name: 'fuzzing_payload_types',
        label: 'Fuzzing Payload Types',
        type: 'array_enum',
        description: 'Select types of payloads for fuzzing (e.g., SQL Injection, XSS, Command Injection).',
        optional: true,
        options: ['sqli', 'xss', 'cmd_injection', 'path_traversal', 'ssrf', 'nosqli', 'ldap_injection', 'json_injection'],
        default: ['sqli', 'xss'],
        condition: { field: 'enable_advanced_fuzzing', value: true }
      },
      {
        field_name: 'enable_rate_limit_bypass',
        label: 'Enable Rate Limit Bypass Test',
        type: 'boolean',
        description: 'Test for vulnerabilities in API rate limiting mechanisms.',
        optional: true,
        default: false
      },
      {
        field_name: 'rate_limit_test_endpoint',
        label: 'Rate Limit Test Endpoint',
        type: 'string',
        description: 'Specific API endpoint to test for rate limiting vulnerabilities.',
        optional: true,
        placeholder: '/api/v1/login',
        condition: { field: 'enable_rate_limit_bypass', value: true }
      },
      {
        field_name: 'requests_per_second',
        label: 'Requests Per Second',
        type: 'number',
        description: 'Number of requests to send per second during rate limit testing.',
        optional: true,
        default: 100,
        condition: { field: 'enable_rate_limit_bypass', value: true }
      },
      {
        field_name: 'enable_graphql_tests',
        label: 'Enable GraphQL Specific Tests',
        type: 'boolean',
        description: 'Perform tests specific to GraphQL APIs (e.g., introspection, batching attacks).',
        optional: true,
        default: false
      }
    ]
  },
  {
    key: 'adaptive_attack_path_mapping',
    name: 'Adaptive Attack Path Mapping',
    description: 'Advanced analysis of existing findings and asset relationships to map potential attack paths, integrating with MITRE ATT&CK framework.',
    category: 'Analysis',
    icon: '🗺️',
    parameters: [
      {
        field_name: 'attack_goals',
        label: 'Attack Goals (comma-separated)',
        type: 'array_enum',
        description: 'High-level goals for attack path analysis (e.g., "initial_access", "lateral_movement", "privilege_escalation", "data_exfiltration").',
        optional: true,
        options: ['initial_access', 'lateral_movement', 'privilege_escalation', 'data_exfiltration', 'service_disruption'],
        default: ['data_exfiltration', 'privilege_escalation']
      },
      {
        field_name: 'known_entry_points',
        label: 'Known Entry Points (comma-separated)',
        type: 'array_string',
        description: 'Specific IPs, domains, or asset IDs to consider as starting points for attack paths.',
        optional: true,
        placeholder: '192.168.1.1, webapp.example.com'
      },
      {
        field_name: 'enable_lateral_movement_analysis',
        label: 'Enable Lateral Movement Analysis',
        type: 'boolean',
        description: 'Include analysis of lateral movement techniques in attack path generation.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_privilege_escalation_analysis',
        label: 'Enable Privilege Escalation Analysis',
        type: 'boolean',
        description: 'Include analysis of privilege escalation techniques in attack path generation.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_data_exfiltration_analysis',
        label: 'Enable Data Exfiltration Analysis',
        type: 'boolean',
        description: 'Include analysis of data exfiltration techniques in attack path generation.',
        optional: true,
        default: true
      },
      {
        field_name: 'mitre_attck_tactics',
        label: 'MITRE ATT&CK Tactics (comma-separated)',
        type: 'array_enum',
        description: 'Focus attack path generation on specific MITRE ATT&CK tactics.',
        optional: true,
        options: ['reconnaissance', 'resource_development', 'initial_access', 'execution', 'persistence', 'privilege_escalation', 'defense_evasion', 'credential_access', 'discovery', 'lateral_movement', 'collection', 'command_and_control', 'exfiltration', 'impact'],
        default: []
      }
    ]
  },
  {
    key: 'automated_vulnerability_validation',
    name: 'Automated Vulnerability Validation',
    description: 'Automatically attempts to confirm or disprove discovered vulnerabilities using a variety of safe and potentially intrusive methods.',
    category: 'Validation',
    icon: '✅',
    parameters: [
      {
        field_name: 'validation_scope',
        label: 'Validation Scope',
        type: 'array_enum',
        description: 'Select the types of vulnerabilities to attempt to validate.',
        optional: false,
        options: ['network', 'web', 'credentials', 'configuration', 'code', 'cloud'],
        default: ['network', 'web']
      },
      {
        field_name: 'enable_safe_validation',
        label: 'Enable Safe Validation Only',
        type: 'boolean',
        description: 'Only perform non-disruptive validation checks.',
        optional: true,
        default: true
      },
      {
        field_name: 'validation_timeout_per_finding',
        label: 'Timeout Per Finding (seconds)',
        type: 'number',
        description: 'Maximum time to spend validating each individual finding.',
        optional: true,
        default: 60
      },
      {
        field_name: 'enable_intrusive_validation',
        label: 'Enable Intrusive Validation',
        type: 'boolean',
        description: 'Allow validation methods that may be disruptive or leave traces (e.g., limited exploitation attempts).',
        optional: true,
        default: false,
        condition: { field: 'enable_safe_validation', value: false }
      }
    ]
  },
  {
    key: 'dns_enumeration',
    name: 'DNS Enumeration',
    description: 'Perform advanced DNS record enumeration and subdomain discovery, including zone transfer checks.',
    category: 'OSINT',
    icon: '🔍',
    parameters: [
      {
        field_name: 'target_domain',
        label: 'Target Domain',
        type: 'string',
        description: 'The domain name for DNS enumeration (e.g., "example.com").',
        optional: false,
        placeholder: 'example.com'
      },
      {
        field_name: 'enable_bruteforce_subdomains',
        label: 'Enable Subdomain Bruteforce',
        type: 'boolean',
        description: 'Attempt to discover subdomains using a wordlist.',
        optional: true,
        default: false
      },
      {
        field_name: 'subdomain_wordlist_path',
        label: 'Subdomain Wordlist Path (Server-Side)',
        type: 'string',
        description: 'Path to a wordlist file on the server for subdomain bruteforce.',
        optional: true,
        placeholder: '/usr/share/wordlists/subdomains-top1M.txt',
        condition: { field: 'enable_bruteforce_subdomains', value: true }
      },
      {
        field_name: 'enable_zone_transfer_check',
        label: 'Enable Zone Transfer Check',
        type: 'boolean',
        description: 'Attempt to perform a DNS zone transfer.',
        optional: true,
        default: false
      }
    ]
  },
  {
    key: 'ssl_tls_analysis',
    name: 'SSL/TLS Analysis',
    description: 'Analyze SSL/TLS configurations for weaknesses, vulnerabilities (e.g., Heartbleed, POODLE), and compliance with best practices.',
    category: 'Network',
    icon: '🔒',
    parameters: [
      {
        field_name: 'target_host',
        label: 'Target Host (IP or Domain)',
        type: 'string',
        description: 'The IP address or domain name of the host to perform SSL/TLS analysis on.',
        optional: false,
        placeholder: 'example.com or 192.168.1.1'
      },
      {
        field_name: 'target_port',
        label: 'Target Port',
        type: 'number',
        description: 'The port number for SSL/TLS service (e.g., 443 for HTTPS).',
        optional: true,
        default: 443
      },
      {
        field_name: 'enable_cipher_suite_check',
        label: 'Check Cipher Suites',
        type: 'boolean',
        description: 'Analyze supported encryption cipher suites for strength and known vulnerabilities.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_protocol_version_check',
        label: 'Check Protocol Versions',
        type: 'boolean',
        description: 'Analyze supported SSL/TLS protocol versions (e.g., TLS 1.0, 1.1, 1.2, 1.3).',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_heartbleed_check',
        label: 'Check for Heartbleed (CVE-2014-0160)',
        type: 'boolean',
        description: 'Test for the Heartbleed vulnerability.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_poodle_check',
        label: 'Check for POODLE (CVE-2014-3566)',
        type: 'boolean',
        description: 'Test for the POODLE vulnerability.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_certificate_validation',
        label: 'Validate Certificate Chain',
        type: 'boolean',
        description: 'Verify the SSL/TLS certificate chain and expiry.',
        optional: true,
        default: true
      }
    ]
  },
  {
    key: 'threat_intelligence',
    name: 'Threat Intelligence Lookup',
    description: 'Integrate with threat intelligence platforms (e.g., VirusTotal, AbuseIPDB) to identify known threats and indicators of compromise (IOCs) and enrich findings.',
    category: 'Intelligence',
    icon: '🧠',
    parameters: [
      {
        field_name: 'ioc_type',
        label: 'IOC Type',
        type: 'enum',
        description: 'Type of Indicator of Compromise to lookup.',
        optional: false,
        options: ['ip', 'domain', 'hash', 'url', 'email'],
        default: 'ip'
      },
      {
        field_name: 'ioc_value',
        label: 'IOC Value',
        type: 'string',
        description: 'The value of the IOC to lookup (e.g., IP address, domain name, file hash).',
        optional: false
      },
      {
        field_name: 'enable_virustotal_lookup',
        label: 'Enable VirusTotal Lookup',
        type: 'boolean',
        description: 'Query VirusTotal for threat intelligence.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_abuseipdb_lookup',
        label: 'Enable AbuseIPDB Lookup',
        type: 'boolean',
        description: 'Query AbuseIPDB for IP reputation.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_alienvault_otx_lookup',
        label: 'Enable AlienVault OTX Lookup',
        type: 'boolean',
        description: 'Query AlienVault Open Threat Exchange for threat intelligence.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_misp_integration',
        label: 'Enable MISP Integration',
        type: 'boolean',
        description: 'Query a configured MISP instance for threat intelligence.',
        optional: true,
        default: false
      }
    ]
  },
  {
    key: 'social_engineering',
    name: 'Social Engineering Simulation',
    description: 'Simulate social engineering attacks (e.g., phishing, smishing) to test human vulnerability.',
    category: 'Intelligence',
    icon: '🎣',
    parameters: [
      {
        field_name: 'attack_type',
        label: 'Attack Type',
        type: 'enum',
        description: 'Select the type of social engineering attack to simulate.',
        optional: false,
        options: ['phishing', 'smishing', 'vishing'],
        default: 'phishing'
      },
      {
        field_name: 'target_emails_file_path',
        label: 'Target Emails File Path (Server-Side)',
        type: 'string',
        description: 'Path to a file on the server containing target email addresses for phishing.',
        optional: true,
        placeholder: '/data/targets/emails.txt',
        condition: { field: 'attack_type', value: 'phishing' }
      },
      {
        field_name: 'phishing_template_path',
        label: 'Phishing Template Path (Server-Side)',
        type: 'string',
        description: 'Path to the HTML phishing email template on the server.',
        optional: true,
        placeholder: '/data/phishing_templates/invoice.html',
        condition: { field: 'attack_type', value: 'phishing' }
      },
      {
        field_name: 'enable_awareness_training',
        label: 'Enable Awareness Training Redirect',
        type: 'boolean',
        description: 'Redirect users who click on the simulated attack to a security awareness training page.',
        optional: true,
        default: true
      }
    ]
  },
  {
    key: 'cloud_security_scan',
    name: 'Cloud Security Posture Management (CSPM)',
    description: 'Scan cloud environments (AWS, Azure, GCP) for misconfigurations, compliance violations, and insecure deployments.',
    category: 'Cloud & Container Security',
    icon: '☁️',
    parameters: [
      {
        field_name: 'cloud_provider',
        label: 'Cloud Provider',
        type: 'enum',
        description: 'Select the cloud provider to scan.',
        optional: false,
        options: ['aws', 'azure', 'gcp'],
        default: 'aws'
      },
      {
        field_name: 'account_id',
        label: 'Account ID',
        type: 'string',
        description: 'The cloud account ID to scan.',
        optional: false
      },
      {
        field_name: 'scan_regions',
        label: 'Regions (comma-separated)',
        type: 'array_string',
        description: 'Comma-separated list of regions to scan (e.g., "us-east-1,eu-west-2"). Leave empty for all regions.',
        optional: true,
        default: []
      },
      {
        field_name: 'enable_iam_check',
        label: 'Enable IAM Check',
        type: 'boolean',
        description: 'Check Identity and Access Management configurations for overly permissive policies.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_storage_check',
        label: 'Enable Storage Check',
        type: 'boolean',
        description: 'Check storage services (e.g., S3 buckets, Azure Blobs) for public access, encryption, and logging.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_network_config_check',
        label: 'Enable Network Config Check',
        type: 'boolean',
        description: 'Check network configurations (e.g., Security Groups, VPCs, network ACLs) for insecure rules.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_compliance_framework',
        label: 'Enable Compliance Framework Check',
        type: 'boolean',
        description: 'Assess cloud configuration against a specific compliance framework.',
        optional: true,
        default: false
      },
      {
        field_name: 'compliance_framework_name',
        label: 'Compliance Framework',
        type: 'enum',
        description: 'Select the compliance framework (e.g., CIS Benchmarks, PCI DSS).',
        optional: true,
        options: ['CIS_AWS_Foundations', 'PCI_DSS_3.2.1', 'NIST_CSF'],
        condition: { field: 'enable_compliance_framework', value: true }
      }
    ]
  },
  {
    key: 'forensics_analysis',
    name: 'Forensics Analysis',
    description: 'Perform digital forensics on disk images or memory dumps to identify malicious activity, data breaches, and system compromise indicators.',
    category: 'Analysis',
    icon: '🔬',
    parameters: [
      {
        field_name: 'image_file_path',
        label: 'Disk/Memory Image Path (Server-Side)',
        type: 'string',
        description: 'Path to the disk image (e.g., .E01, .dd) or memory dump file on the CyberScan server.',
        optional: false,
        placeholder: '/data/forensics/disk_image.e01'
      },
      {
        field_name: 'analysis_type',
        label: 'Analysis Type',
        type: 'enum',
        description: 'Select the type of forensic analysis to perform.',
        optional: false,
        options: ['disk', 'memory'],
        default: 'disk'
      },
      {
        field_name: 'enable_malware_signature_scan',
        label: 'Enable Malware Signature Scan',
        type: 'boolean',
        description: 'Scan for known malware signatures within the image.',
        optional: true,
        default: true
      },
      {
        field_name: 'enable_timeline_analysis',
        label: 'Enable Timeline Analysis',
        type: 'boolean',
        description: 'Generate a timeline of events from the image.',
        optional: true,
        default: false
      },
      {
        field_name: 'enable_data_carving',
        label: 'Enable Data Carving',
        type: 'boolean',
        description: 'Attempt to recover deleted files or fragments.',
        optional: true,
        default: false
      }
    ]
  },
  {
    key: 'malware_analysis',
    name: 'Malware Analysis (Advanced)',
    description: 'Deep static and dynamic analysis of malware samples, including sandbox execution, network traffic capture, and behavioral reporting.',
    category: 'Malware',
    icon: '🦠',
    parameters: [
      {
        field_name: 'malware_file_path',
        label: 'Malware File Path (Server-Side)',
        type: 'string',
        description: 'Absolute path to the malware sample file on the CyberScan server.',
        optional: false,
        placeholder: '/data/malware_samples/virus.exe'
      },
      {
        field_name: 'analysis_mode',
        label: 'Analysis Mode',
        type: 'enum',
        description: 'Select the mode of analysis.',
        optional: false,
        options: ['static', 'dynamic', 'both'],
        default: 'both'
      },
      {
        field_name: 'sandbox_timeout',
        label: 'Sandbox Timeout (seconds)',
        type: 'number',
        description: 'Duration to run the malware in the sandbox (for dynamic analysis).',
        optional: true,
        default: 300,
        condition: { field: 'analysis_mode', value: 'dynamic' }
      },
      {
        field_name: 'enable_network_traffic_capture',
        label: 'Capture Network Traffic',
        type: 'boolean',
        description: 'Capture network traffic generated by the malware during dynamic analysis.',
        optional: true,
        default: true,
        condition: { field: 'analysis_mode', value: 'dynamic' }
      },
      {
        field_name: 'enable_memory_dump',
        label: 'Capture Memory Dump',
        type: 'boolean',
        description: 'Capture a memory dump of the process during dynamic analysis.',
        optional: true,
        default: false,
        condition: { field: 'analysis_mode', value: 'dynamic' }
      }
    ]
  },
  {
    key: 'compliance_check',
    name: 'Compliance Check',
    description: 'Assess system configurations and policies against various regulatory compliance standards (e.g., PCI DSS, ISO 27001, HIPAA, GDPR, NIST).',
    category: 'Compliance',
    icon: '📋',
    parameters: [
      {
        field_name: 'compliance_standard',
        label: 'Compliance Standard',
        type: 'enum',
        description: 'Select the compliance standard to check against.',
        optional: false,
        options: ['pci_dss', 'iso_27001', 'hipaa', 'gdpr', 'nist_800_53', 'soc2'],
        default: 'iso_27001'
      },
      {
        field_name: 'scope_assets_tags',
        label: 'Scope by Asset Tags (comma-separated)',
        type: 'array_string',
        description: 'Only include assets with these tags in the compliance check. Leave empty for all relevant assets.',
        optional: true,
        placeholder: 'PCI-Scope,Prod-Env'
      },
      {
        field_name: 'enable_automated_reporting',
        label: 'Enable Automated Reporting',
        type: 'boolean',
        description: 'Generate a compliance report automatically after the check.',
        optional: true,
        default: true
      },
      {
        field_name: 'report_format',
        label: 'Report Format',
        type: 'enum',
        description: 'Select the desired report format for compliance reports.',
        optional: true,
        options: ['PDF', 'CSV', 'JSON'],
        default: 'PDF',
        condition: { field: 'enable_automated_reporting', value: true }
      }
    ]
  }
];

// Export helper functions for working with scan modules
export const getScanModuleByKey = (key: string): ScanModuleDefinition | undefined => {
  return SCAN_MODULE_DEFINITIONS.find(module => module.key === key);
};

export const getScanModulesByCategory = (category: string): ScanModuleDefinition[] => {
  return SCAN_MODULE_DEFINITIONS.filter(module => module.category === category);
};

export const getAllCategories = (): string[] => {
  const categories = SCAN_MODULE_DEFINITIONS.map(module => module.category);
  return [...new Set(categories)];
};
