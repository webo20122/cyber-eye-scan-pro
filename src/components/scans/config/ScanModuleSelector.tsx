
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wifi, Globe, Code, Database, Key, Shield, Search, Server, Mail, Eye, Users, Zap, Activity, Route,
  Terminal, Lock, Bug, Crosshair, FileSearch, Network, Cloud, Smartphone, HardDrive, Cpu,
  MessageSquare, Fingerprint, AlertOctagon, Radar, Layers, Settings, MonitorSpeaker
} from "lucide-react";

interface ScanModules {
  // Core Modules
  enable_network_scan: boolean;
  enable_web_application_scan: boolean;
  enable_vulnerability_check: boolean;
  enable_active_directory_enumeration: boolean;
  
  // Infrastructure & Network
  enable_credentials_leak: boolean;
  enable_database_enum_check: boolean;
  enable_snmp_enum: boolean;
  enable_ssh_security_check: boolean;
  enable_mail_server_check: boolean;
  enable_shodan_lookup: boolean;
  enable_wireless_scan: boolean;
  enable_wireless_adv_scan: boolean;
  
  // Application Security
  enable_sast_scan: boolean;
  enable_api_scan: boolean;
  enable_desktop_pe_analysis: boolean;
  
  // Exploitation & Advanced
  enable_exploitation: boolean;
  enable_bruteforce: boolean;
  enable_passive_recon: boolean;
  enable_internal_vuln_scan_gvm: boolean;
  enable_adaptive_attack_path_mapping: boolean;
  enable_automated_vulnerability_validation: boolean;
  
  // New Advanced Pentest Modules
  enable_social_engineering: boolean;
  enable_physical_security: boolean;
  enable_mobile_app_scan: boolean;
  enable_iot_security_scan: boolean;
  enable_cloud_security_scan: boolean;
  enable_container_security: boolean;
  enable_firmware_analysis: boolean;
  enable_scada_security: boolean;
  enable_dns_enumeration: boolean;
  enable_ssl_tls_analysis: boolean;
  enable_web_crawling: boolean;
  enable_osint_gathering: boolean;
  enable_threat_intelligence: boolean;
  enable_malware_analysis: boolean;
  enable_forensics_analysis: boolean;
  enable_compliance_check: boolean;
}

interface ScanModuleSelectorProps {
  scanModules: ScanModules;
  setScanModules: (modules: ScanModules | ((prev: ScanModules) => ScanModules)) => void;
}

export const ScanModuleSelector = ({ scanModules, setScanModules }: ScanModuleSelectorProps) => {
  const coreModules = [
    { key: 'enable_network_scan' as keyof ScanModules, label: 'Network Reconnaissance', icon: Wifi, description: 'Advanced port scanning, OS detection, service enumeration with Nmap', isMvp: true },
    { key: 'enable_web_application_scan' as keyof ScanModules, label: 'Web Application Security', icon: Globe, description: 'OWASP ZAP, Nikto, Gobuster, and custom web vulnerability testing', isMvp: true },
    { key: 'enable_vulnerability_check' as keyof ScanModules, label: 'Vulnerability Assessment', icon: Shield, description: 'CVE lookup, vulnerability databases, and exploit validation', isMvp: true },
    { key: 'enable_active_directory_enumeration' as keyof ScanModules, label: 'Active Directory Assessment', icon: Users, description: 'LDAP enumeration, AD security assessment, and privilege escalation', isMvp: true },
  ];

  const infrastructureModules = [
    { key: 'enable_credentials_leak' as keyof ScanModules, label: 'Credential Intelligence', icon: Key, description: 'Leaked credentials detection and breach monitoring', isMvp: false },
    { key: 'enable_database_enum_check' as keyof ScanModules, label: 'Database Security Assessment', icon: Database, description: 'Database service enumeration and security testing', isMvp: false },
    { key: 'enable_snmp_enum' as keyof ScanModules, label: 'SNMP Enumeration', icon: Server, description: 'Network device SNMP enumeration and configuration assessment', isMvp: false },
    { key: 'enable_ssh_security_check' as keyof ScanModules, label: 'SSH Security Analysis', icon: Terminal, description: 'SSH configuration assessment and key management audit', isMvp: false },
    { key: 'enable_mail_server_check' as keyof ScanModules, label: 'Email Security Assessment', icon: Mail, description: 'Mail server security testing and configuration analysis', isMvp: false },
    { key: 'enable_shodan_lookup' as keyof ScanModules, label: 'Internet-Wide Asset Discovery', icon: Search, description: 'Shodan integration for global asset reconnaissance', isMvp: false },
    { key: 'enable_dns_enumeration' as keyof ScanModules, label: 'DNS Security Analysis', icon: Network, description: 'DNS enumeration, zone transfers, and subdomain discovery', isMvp: false },
    { key: 'enable_ssl_tls_analysis' as keyof ScanModules, label: 'SSL/TLS Security Assessment', icon: Lock, description: 'Certificate analysis, cipher strength, and protocol security', isMvp: false },
  ];

  const wirelessModules = [
    { key: 'enable_wireless_scan' as keyof ScanModules, label: 'Wireless Security Assessment', icon: Wifi, description: 'WiFi security testing and access point analysis', isMvp: false },
    { key: 'enable_wireless_adv_scan' as keyof ScanModules, label: 'Advanced Wireless Attacks', icon: Radar, description: 'WPS attacks, evil twin detection, and advanced WiFi exploitation', isMvp: false },
  ];

  const applicationModules = [
    { key: 'enable_sast_scan' as keyof ScanModules, label: 'Static Code Analysis', icon: Code, description: 'Source code security analysis and vulnerability detection', isMvp: false },
    { key: 'enable_api_scan' as keyof ScanModules, label: 'API Security Testing', icon: Settings, description: 'REST/GraphQL API security assessment and OWASP API Top 10', isMvp: false },
    { key: 'enable_desktop_pe_analysis' as keyof ScanModules, label: 'Binary Analysis & Reverse Engineering', icon: FileSearch, description: 'PE file analysis, malware detection, and binary security assessment', isMvp: false },
    { key: 'enable_mobile_app_scan' as keyof ScanModules, label: 'Mobile Application Security', icon: Smartphone, description: 'Android/iOS app security testing and OWASP Mobile Top 10', isMvp: false },
    { key: 'enable_web_crawling' as keyof ScanModules, label: 'Advanced Web Crawling', icon: Bug, description: 'Deep web application discovery and content enumeration', isMvp: false },
  ];

  const cloudModules = [
    { key: 'enable_cloud_security_scan' as keyof ScanModules, label: 'Cloud Security Assessment', icon: Cloud, description: 'AWS/Azure/GCP security configuration review and compliance', isMvp: false },
    { key: 'enable_container_security' as keyof ScanModules, label: 'Container & Kubernetes Security', icon: Layers, description: 'Docker/K8s security assessment and container vulnerability scanning', isMvp: false },
    { key: 'enable_iot_security_scan' as keyof ScanModules, label: 'IoT Device Security', icon: Cpu, description: 'Internet of Things device security testing and firmware analysis', isMvp: false },
    { key: 'enable_firmware_analysis' as keyof ScanModules, label: 'Firmware Security Analysis', icon: HardDrive, description: 'Embedded system firmware reverse engineering and vulnerability analysis', isMvp: false },
    { key: 'enable_scada_security' as keyof ScanModules, label: 'Industrial Control Systems', icon: MonitorSpeaker, description: 'SCADA/ICS security assessment and industrial protocol testing', isMvp: false },
  ];

  const exploitationModules = [
    { key: 'enable_exploitation' as keyof ScanModules, label: 'Automated Exploitation', icon: Zap, description: 'Metasploit integration and automated exploit execution', isMvp: false },
    { key: 'enable_bruteforce' as keyof ScanModules, label: 'Credential Brute Force', icon: Crosshair, description: 'Multi-protocol brute force attacks and password spraying', isMvp: false },
    { key: 'enable_internal_vuln_scan_gvm' as keyof ScanModules, label: 'Enterprise Vulnerability Management', icon: AlertOctagon, description: 'OpenVAS/GVM integration for comprehensive vulnerability scanning', isMvp: false },
    { key: 'enable_adaptive_attack_path_mapping' as keyof ScanModules, label: 'Attack Path Analysis', icon: Route, description: 'Automated attack path discovery and lateral movement simulation', isMvp: false },
    { key: 'enable_automated_vulnerability_validation' as keyof ScanModules, label: 'Exploit Validation & PoC', icon: Activity, description: 'Automated vulnerability validation and proof-of-concept generation', isMvp: false },
  ];

  const intelligenceModules = [
    { key: 'enable_passive_recon' as keyof ScanModules, label: 'OSINT & Passive Reconnaissance', icon: Eye, description: 'Open source intelligence gathering and passive information collection', isMvp: false },
    { key: 'enable_osint_gathering' as keyof ScanModules, label: 'Advanced OSINT Collection', icon: Search, description: 'Social media, dark web, and deep web intelligence gathering', isMvp: false },
    { key: 'enable_threat_intelligence' as keyof ScanModules, label: 'Threat Intelligence Integration', icon: Fingerprint, description: 'IoC correlation, threat actor attribution, and campaign analysis', isMvp: false },
    { key: 'enable_social_engineering' as keyof ScanModules, label: 'Social Engineering Assessment', icon: MessageSquare, description: 'Phishing simulation, vishing campaigns, and human factor testing', isMvp: false },
  ];

  const analysisModules = [
    { key: 'enable_malware_analysis' as keyof ScanModules, label: 'Malware Analysis & Sandboxing', icon: Bug, description: 'Dynamic and static malware analysis with sandboxing capabilities', isMvp: false },
    { key: 'enable_forensics_analysis' as keyof ScanModules, label: 'Digital Forensics', icon: FileSearch, description: 'Incident response, evidence collection, and forensic analysis', isMvp: false },
    { key: 'enable_physical_security' as keyof ScanModules, label: 'Physical Security Assessment', icon: Lock, description: 'Physical penetration testing and facility security evaluation', isMvp: false },
    { key: 'enable_compliance_check' as keyof ScanModules, label: 'Compliance & Governance', icon: Shield, description: 'Regulatory compliance checking (PCI-DSS, HIPAA, SOX, GDPR)', isMvp: false },
  ];

  const moduleGroups = [
    { title: "Core Security Modules", subtitle: "Essential penetration testing capabilities", modules: coreModules, color: "green" },
    { title: "Infrastructure & Network Security", subtitle: "Network and system-level assessments", modules: infrastructureModules, color: "blue" },
    { title: "Wireless & Radio Frequency", subtitle: "Wireless security testing and RF analysis", modules: wirelessModules, color: "purple" },
    { title: "Application Security", subtitle: "Web, mobile, and desktop application testing", modules: applicationModules, color: "orange" },
    { title: "Cloud & Container Security", subtitle: "Modern infrastructure security assessment", modules: cloudModules, color: "cyan" },
    { title: "Exploitation & Post-Exploitation", subtitle: "Advanced attack techniques and validation", modules: exploitationModules, color: "red" },
    { title: "Intelligence & Reconnaissance", subtitle: "Information gathering and threat intelligence", modules: intelligenceModules, color: "indigo" },
    { title: "Specialized Analysis", subtitle: "Forensics, malware analysis, and compliance", modules: analysisModules, color: "pink" },
  ];

  const getColorClasses = (color: string, isMvp: boolean) => {
    if (isMvp) {
      return "bg-green-50 border-green-200 text-green-800";
    }
    
    const colorMap: Record<string, string> = {
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      purple: "bg-purple-50 border-purple-200 text-purple-800",
      orange: "bg-orange-50 border-orange-200 text-orange-800",
      cyan: "bg-cyan-50 border-cyan-200 text-cyan-800",
      red: "bg-red-50 border-red-200 text-red-800",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-800",
      pink: "bg-pink-50 border-pink-200 text-pink-800",
    };
    
    return colorMap[color] || "bg-gray-50 border-gray-200 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comprehensive Penetration Testing Suite</CardTitle>
        <CardDescription>Select advanced security modules for comprehensive cybersecurity assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {moduleGroups.map(({ title, subtitle, modules, color }) => (
          <div key={title}>
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map(({ key, label, icon: Icon, description, isMvp }) => (
                <div key={key} className={`flex items-start space-x-3 p-4 border rounded-lg ${getColorClasses(color, isMvp)}`}>
                  <Checkbox
                    id={key}
                    checked={scanModules[key]}
                    onCheckedChange={(checked) =>
                      setScanModules(prev => ({ ...prev, [key]: !!checked }))
                    }
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4" />
                      <Label htmlFor={key} className="font-medium cursor-pointer text-sm">
                        {label}
                      </Label>
                      {isMvp && (
                        <span className="px-2 py-0.5 text-xs bg-green-600 text-white rounded-full">
                          Ready
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-tight">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
