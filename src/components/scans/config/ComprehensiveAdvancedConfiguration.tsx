import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkScanConfig } from "./NetworkScanConfig";
import { WebApplicationScanConfig } from "./WebApplicationScanConfig";
import { CredentialsLeakConfig } from "./CredentialsLeakConfig";
import { DatabaseEnumConfig } from "./DatabaseEnumConfig";
import { ApiScanConfig } from "./ApiScanConfig";
import { VulnerabilityCheckAdvancedConfig } from "./VulnerabilityCheckAdvancedConfig";
import { ActiveDirectoryAdvancedConfig } from "./ActiveDirectoryAdvancedConfig";
import { SastScanConfig } from "./SastScanConfig";
import { PassiveReconConfig } from "./PassiveReconConfig";
import { useState } from "react";

interface ScanModules {
  enable_network_scan: boolean;
  enable_web_application_scan: boolean;
  enable_vulnerability_check: boolean;
  enable_active_directory_enumeration: boolean;
  enable_credentials_leak: boolean;
  enable_database_enum_check: boolean;
  enable_sast_scan: boolean;
  enable_api_scan: boolean;
  enable_passive_recon: boolean;
  enable_exploitation: boolean;
  enable_bruteforce: boolean;
  enable_shodan_lookup: boolean;
  enable_mail_server_check: boolean;
  enable_ssh_security_check: boolean;
  enable_wireless_scan: boolean;
  enable_wireless_adv_scan: boolean;
  enable_desktop_pe_analysis: boolean;
  enable_mobile_app_scan: boolean;
  enable_web_crawling: boolean;
  enable_cloud_security_scan: boolean;
  enable_container_security: boolean;
  enable_iot_security_scan: boolean;
  enable_firmware_analysis: boolean;
  enable_scada_security: boolean;
  enable_dns_enumeration: boolean;
  enable_ssl_tls_analysis: boolean;
  enable_osint_gathering: boolean;
  enable_threat_intelligence: boolean;
  enable_social_engineering: boolean;
  enable_malware_analysis: boolean;
  enable_forensics_analysis: boolean;
  enable_physical_security: boolean;
  enable_compliance_check: boolean;
}

interface ComprehensiveAdvancedConfigurationProps {
  scanModules: ScanModules;
  moduleConfigs: Record<string, any>;
  setModuleConfigs: (configs: Record<string, any>) => void;
}

export const ComprehensiveAdvancedConfiguration = ({
  scanModules,
  moduleConfigs,
  setModuleConfigs
}: ComprehensiveAdvancedConfigurationProps) => {
  const updateModuleConfig = (moduleName: string, config: any) => {
    setModuleConfigs({
      ...moduleConfigs,
      [moduleName]: config
    });
  };

  const hasEnabledModules = Object.values(scanModules).some(Boolean);

  if (!hasEnabledModules) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Advanced Module Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {scanModules.enable_network_scan && (
          <NetworkScanConfig 
            config={moduleConfigs.network_scan || {}}
            onChange={(config) => updateModuleConfig('network_scan', config)}
          />
        )}

        {scanModules.enable_web_application_scan && (
          <WebApplicationScanConfig 
            config={moduleConfigs.web_application_scan || {}}
            onChange={(config) => updateModuleConfig('web_application_scan', config)}
          />
        )}

        {scanModules.enable_credentials_leak && (
          <CredentialsLeakConfig 
            config={moduleConfigs.credentials_leak || {}}
            onChange={(config) => updateModuleConfig('credentials_leak', config)}
          />
        )}

        {scanModules.enable_database_enum_check && (
          <DatabaseEnumConfig 
            config={moduleConfigs.database_enum_check || {}}
            onChange={(config) => updateModuleConfig('database_enum_check', config)}
          />
        )}

        {scanModules.enable_api_scan && (
          <ApiScanConfig 
            config={moduleConfigs.api_scan || {}}
            onChange={(config) => updateModuleConfig('api_scan', config)}
          />
        )}

        {scanModules.enable_vulnerability_check && (
          <VulnerabilityCheckAdvancedConfig 
            vulnParams={moduleConfigs.vulnerability_check || {}}
            setVulnParams={(config) => updateModuleConfig('vulnerability_check', config)}
          />
        )}

        {scanModules.enable_active_directory_enumeration && (
          <ActiveDirectoryAdvancedConfig 
            adParams={moduleConfigs.active_directory_enumeration || {}}
            setAdParams={(config) => updateModuleConfig('active_directory_enumeration', config)}
          />
        )}

        {scanModules.enable_sast_scan && (
          <SastScanConfig 
            config={moduleConfigs.sast_scan || {}}
            onChange={(config) => updateModuleConfig('sast_scan', config)}
          />
        )}

        {scanModules.enable_passive_recon && (
          <PassiveReconConfig 
            config={moduleConfigs.passive_recon || {}}
            onChange={(config) => updateModuleConfig('passive_recon', config)}
          />
        )}

        {(scanModules.enable_exploitation || 
          scanModules.enable_bruteforce || 
          scanModules.enable_shodan_lookup ||
          scanModules.enable_mail_server_check ||
          scanModules.enable_ssh_security_check) && (
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <h4 className="font-medium text-blue-700 mb-2">Additional Enabled Modules</h4>
            <p className="text-sm text-blue-600">
              Configuration panels for additional modules are available. These modules will use optimized default parameters for comprehensive security testing.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
