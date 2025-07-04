
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
  Eye
} from "lucide-react";

interface ScanModuleSelectorProps {
  scanModules: Record<string, boolean>;
  setScanModules: (modules: Record<string, boolean>) => void;
}

export const ScanModuleSelector = ({ scanModules, setScanModules }: ScanModuleSelectorProps) => {
  const scanModuleConfigs = [
    { key: 'enable_network_scan', label: 'Network Scan', icon: Wifi, description: 'Port scanning and service enumeration' },
    { key: 'enable_web_application_scan', label: 'Web Application Scan', icon: Globe, description: 'Web vulnerability assessment' },
    { key: 'enable_vulnerability_check', label: 'Vulnerability Check', icon: Shield, description: 'CVE and vulnerability database lookup' },
    { key: 'enable_credentials_leak', label: 'Credentials Leak Check', icon: Key, description: 'Check for leaked credentials' },
    { key: 'enable_database_enum_check', label: 'Database Enumeration', icon: Database, description: 'Database service enumeration' },
    { key: 'enable_sast_scan', label: 'SAST Scan', icon: Code, description: 'Static application security testing' },
    { key: 'enable_passive_recon', label: 'Passive Reconnaissance', icon: Eye, description: 'Passive information gathering' },
    { key: 'enable_ssh_security_check', label: 'SSH Security Check', icon: Server, description: 'SSH configuration assessment' },
    { key: 'enable_mail_server_check', label: 'Mail Server Check', icon: Mail, description: 'Email server security assessment' },
    { key: 'enable_shodan_lookup', label: 'Shodan Lookup', icon: Search, description: 'Internet-wide asset discovery' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Scan Modules</CardTitle>
        <CardDescription>Select which security modules to include in the scan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scanModuleConfigs.map(({ key, label, icon: Icon, description }) => (
            <div key={key} className="flex items-start space-x-3 p-3 border rounded-lg">
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
      </CardContent>
    </Card>
  );
};
