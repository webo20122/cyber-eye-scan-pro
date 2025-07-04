
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wifi, 
  Globe, 
  Code, 
  Database, 
  Key, 
  Shield,
  Search,
  Server,
  Mail,
  Eye,
  Users,
  Zap,
  Activity,
  Route
} from "lucide-react";

interface ScanModules {
  enable_network_scan: boolean;
  enable_web_application_scan: boolean;
  enable_vulnerability_check: boolean;
  enable_active_directory_enumeration: boolean;
  enable_credentials_leak: boolean;
  enable_database_enum_check: boolean;
  enable_desktop_pe_analysis: boolean;
  enable_exploitation: boolean;
  enable_internal_vuln_scan_gvm: boolean;
  enable_mail_server_check: boolean;
  enable_snmp_enum: boolean;
  enable_shodan_lookup: boolean;
  enable_ssh_security_check: boolean;
  enable_bruteforce: boolean;
  enable_passive_recon: boolean;
  enable_wireless_scan: boolean;
  enable_wireless_adv_scan: boolean;
  enable_sast_scan: boolean;
  enable_api_scan: boolean;
  enable_adaptive_attack_path_mapping: boolean;
  enable_automated_vulnerability_validation: boolean;
}

interface ScanModuleSelectorProps {
  scanModules: ScanModules;
  setScanModules: (modules: ScanModules | ((prev: ScanModules) => ScanModules)) => void;
}

export const ScanModuleSelector = ({ scanModules, setScanModules }: ScanModuleSelectorProps) => {
  const mvpModules = [
    { key: 'enable_network_scan' as keyof ScanModules, label: 'Network Scan', icon: Wifi, description: 'Port scanning, OS detection, and service enumeration', isMvp: true },
    { key: 'enable_web_application_scan' as keyof ScanModules, label: 'Web Application Scan', icon: Globe, description: 'ZAP, Nikto, and directory enumeration', isMvp: true },
    { key: 'enable_vulnerability_check' as keyof ScanModules, label: 'Vulnerability Check', icon: Shield, description: 'CVE lookup and vulnerability database search', isMvp: true },
    { key: 'enable_active_directory_enumeration' as keyof ScanModules, label: 'Active Directory Enumeration', icon: Users, description: 'LDAP enumeration and AD security assessment', isMvp: true },
  ];

  const additionalModules = [
    { key: 'enable_credentials_leak' as keyof ScanModules, label: 'Credentials Leak Check', icon: Key, description: 'Check for leaked credentials', isMvp: false },
    { key: 'enable_database_enum_check' as keyof ScanModules, label: 'Database Enumeration', icon: Database, description: 'Database service enumeration', isMvp: false },
    { key: 'enable_desktop_pe_analysis' as keyof ScanModules, label: 'PE Analysis', icon: Code, description: 'Windows PE file analysis', isMvp: false },
    { key: 'enable_exploitation' as keyof ScanModules, label: 'Exploitation', icon: Zap, description: 'Automated exploitation attempts', isMvp: false },
    { key: 'enable_internal_vuln_scan_gvm' as keyof ScanModules, label: 'GVM Vulnerability Scan', icon: Search, description: 'OpenVAS/GVM integration', isMvp: false },
    { key: 'enable_mail_server_check' as keyof ScanModules, label: 'Mail Server Check', icon: Mail, description: 'Email server security assessment', isMvp: false },
    { key: 'enable_snmp_enum' as keyof ScanModules, label: 'SNMP Enumeration', icon: Server, description: 'Network device SNMP enumeration', isMvp: false },
    { key: 'enable_shodan_lookup' as keyof ScanModules, label: 'Shodan Lookup', icon: Eye, description: 'Internet-wide asset discovery', isMvp: false },
    { key: 'enable_ssh_security_check' as keyof ScanModules, label: 'SSH Security Check', icon: Server, description: 'SSH configuration assessment', isMvp: false },
    { key: 'enable_bruteforce' as keyof ScanModules, label: 'Bruteforce', icon: Key, description: 'Service bruteforce attacks', isMvp: false },
    { key: 'enable_passive_recon' as keyof ScanModules, label: 'Passive Reconnaissance', icon: Eye, description: 'OSINT and passive information gathering', isMvp: false },
    { key: 'enable_wireless_scan' as keyof ScanModules, label: 'Wireless Scan', icon: Wifi, description: 'WiFi security assessment', isMvp: false },
    { key: 'enable_wireless_adv_scan' as keyof ScanModules, label: 'Advanced Wireless Scan', icon: Wifi, description: 'Advanced WiFi attacks and rogue AP detection', isMvp: false },
    { key: 'enable_sast_scan' as keyof ScanModules, label: 'SAST Scan', icon: Code, description: 'Static application security testing', isMvp: false },
    { key: 'enable_api_scan' as keyof ScanModules, label: 'API Security Scan', icon: Globe, description: 'REST API security testing', isMvp: false },
    { key: 'enable_adaptive_attack_path_mapping' as keyof ScanModules, label: 'Attack Path Mapping', icon: Route, description: 'Automated attack path analysis', isMvp: false },
    { key: 'enable_automated_vulnerability_validation' as keyof ScanModules, label: 'Vulnerability Validation', icon: Activity, description: 'Automated vulnerability validation', isMvp: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Scan Modules</CardTitle>
        <CardDescription>Select which security modules to include in the comprehensive scan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* MVP Modules */}
        <div>
          <h3 className="font-semibold text-green-700 mb-3">Core Modules (Fully Configured)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mvpModules.map(({ key, label, icon: Icon, description }) => (
              <div key={key} className="flex items-start space-x-3 p-3 border rounded-lg bg-green-50 border-green-200">
                <Checkbox
                  id={key}
                  checked={scanModules[key]}
                  onCheckedChange={(checked) =>
                    setScanModules(prev => ({ ...prev, [key]: !!checked }))
                  }
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-green-600" />
                    <Label htmlFor={key} className="font-medium cursor-pointer">
                      {label}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Modules */}
        <div>
          <h3 className="font-semibold text-blue-700 mb-3">Additional Modules (Coming Soon)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalModules.map(({ key, label, icon: Icon, description }) => (
              <div key={key} className="flex items-start space-x-3 p-3 border rounded-lg bg-blue-50 border-blue-200 opacity-75">
                <Checkbox
                  id={key}
                  checked={scanModules[key]}
                  onCheckedChange={(checked) =>
                    setScanModules(prev => ({ ...prev, [key]: !!checked }))
                  }
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <Label htmlFor={key} className="font-medium cursor-pointer">
                      {label}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
