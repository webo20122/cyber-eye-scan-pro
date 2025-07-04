
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkScanAdvancedConfig } from "./NetworkScanAdvancedConfig";
import { WebApplicationAdvancedConfig } from "./WebApplicationAdvancedConfig";
import { VulnerabilityCheckAdvancedConfig } from "./VulnerabilityCheckAdvancedConfig";
import { ActiveDirectoryAdvancedConfig } from "./ActiveDirectoryAdvancedConfig";

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

interface AdvancedConfigurationProps {
  scanModules: ScanModules;
  networkParams: any;
  setNetworkParams: (params: any) => void;
  webParams: any;
  setWebParams: (params: any) => void;
  vulnParams: any;
  setVulnParams: (params: any) => void;
  adParams: any;
  setAdParams: (params: any) => void;
}

export const AdvancedConfiguration = ({
  scanModules,
  networkParams,
  setNetworkParams,
  webParams,
  setWebParams,
  vulnParams,
  setVulnParams,
  adParams,
  setAdParams
}: AdvancedConfigurationProps) => {
  const hasMvpModules = scanModules.enable_network_scan || 
                       scanModules.enable_web_application_scan || 
                       scanModules.enable_vulnerability_check || 
                       scanModules.enable_active_directory_enumeration;

  if (!hasMvpModules) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Advanced Module Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {scanModules.enable_network_scan && (
          <NetworkScanAdvancedConfig 
            networkParams={networkParams}
            setNetworkParams={setNetworkParams}
          />
        )}

        {scanModules.enable_web_application_scan && (
          <WebApplicationAdvancedConfig 
            webParams={webParams}
            setWebParams={setWebParams}
          />
        )}

        {scanModules.enable_vulnerability_check && (
          <VulnerabilityCheckAdvancedConfig 
            vulnParams={vulnParams}
            setVulnParams={setVulnParams}
          />
        )}

        {scanModules.enable_active_directory_enumeration && (
          <ActiveDirectoryAdvancedConfig 
            adParams={adParams}
            setAdParams={setAdParams}
          />
        )}

        {/* Placeholder for non-MVP modules */}
        {(scanModules.enable_credentials_leak || 
          scanModules.enable_database_enum_check || 
          scanModules.enable_sast_scan) && (
          <div className="p-4 border rounded-lg bg-gray-50 border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">Additional Module Configuration</h4>
            <p className="text-sm text-gray-600">
              Configuration panels for additional modules will be available in the next update.
              These modules are enabled but will use default parameters.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
