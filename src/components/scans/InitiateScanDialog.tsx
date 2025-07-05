
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { scansAPI } from "@/services/api";
import { toast } from "sonner";
import { Zap, Shield } from "lucide-react";
import { BasicConfiguration } from "./config/BasicConfiguration";
import { ScanModuleSelector } from "./config/ScanModuleSelector";
import { ComprehensiveAdvancedConfiguration } from "./config/ComprehensiveAdvancedConfiguration";

interface ScanModules {
  // Core Security Modules
  enable_network_scan: boolean;
  enable_web_application_scan: boolean;
  enable_vulnerability_check: boolean;
  enable_active_directory_enumeration: boolean;
  
  // Infrastructure & Network Security
  enable_credentials_leak: boolean;
  enable_database_enum_check: boolean;
  enable_snmp_enum: boolean;
  enable_ssh_security_check: boolean;
  enable_mail_server_check: boolean;
  enable_shodan_lookup: boolean;
  enable_dns_enumeration: boolean;
  enable_ssl_tls_analysis: boolean;
  
  // Wireless & RF Security
  enable_wireless_scan: boolean;
  enable_wireless_adv_scan: boolean;
  
  // Application Security
  enable_sast_scan: boolean;
  enable_api_scan: boolean;
  enable_desktop_pe_analysis: boolean;
  enable_mobile_app_scan: boolean;
  enable_web_crawling: boolean;
  
  // Cloud & Container Security
  enable_cloud_security_scan: boolean;
  enable_container_security: boolean;
  enable_iot_security_scan: boolean;
  enable_firmware_analysis: boolean;
  enable_scada_security: boolean;
  
  // Exploitation & Advanced
  enable_exploitation: boolean;
  enable_bruteforce: boolean;
  enable_internal_vuln_scan_gvm: boolean;
  enable_adaptive_attack_path_mapping: boolean;
  enable_automated_vulnerability_validation: boolean;
  
  // Intelligence & Reconnaissance
  enable_passive_recon: boolean;
  enable_osint_gathering: boolean;
  enable_threat_intelligence: boolean;
  enable_social_engineering: boolean;
  
  // Specialized Analysis
  enable_malware_analysis: boolean;
  enable_forensics_analysis: boolean;
  enable_physical_security: boolean;
  enable_compliance_check: boolean;
}

interface InitiateScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: any[];
  onSuccess: () => void;
}

export const InitiateScanDialog = ({ open, onOpenChange, assets, onSuccess }: InitiateScanDialogProps) => {
  const [scanName, setScanName] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [scanModules, setScanModules] = useState<ScanModules>({
    // Core modules enabled by default
    enable_network_scan: true,
    enable_web_application_scan: true,
    enable_vulnerability_check: true,
    enable_active_directory_enumeration: false,
    
    // All other modules disabled by default
    enable_credentials_leak: false,
    enable_database_enum_check: false,
    enable_snmp_enum: false,
    enable_ssh_security_check: false,
    enable_mail_server_check: false,
    enable_shodan_lookup: false,
    enable_dns_enumeration: false,
    enable_ssl_tls_analysis: false,
    enable_wireless_scan: false,
    enable_wireless_adv_scan: false,
    enable_sast_scan: false,
    enable_api_scan: false,
    enable_desktop_pe_analysis: false,
    enable_mobile_app_scan: false,
    enable_web_crawling: false,
    enable_cloud_security_scan: false,
    enable_container_security: false,
    enable_iot_security_scan: false,
    enable_firmware_analysis: false,
    enable_scada_security: false,
    enable_exploitation: false,
    enable_bruteforce: false,
    enable_internal_vuln_scan_gvm: false,
    enable_adaptive_attack_path_mapping: false,
    enable_automated_vulnerability_validation: false,
    enable_passive_recon: false,
    enable_osint_gathering: false,
    enable_threat_intelligence: false,
    enable_social_engineering: false,
    enable_malware_analysis: false,
    enable_forensics_analysis: false,
    enable_physical_security: false,
    enable_compliance_check: false
  });

  const [moduleConfigs, setModuleConfigs] = useState<Record<string, any>>({});

  const initiateScanMutation = useMutation({
    mutationFn: (data: any) => scansAPI.initiate(data),
    onSuccess: () => {
      toast.success("Comprehensive penetration test initiated successfully");
      onSuccess();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to initiate penetration test");
    }
  });

  const resetForm = () => {
    setScanName("");
    setSelectedAsset("");
    setScanModules({
      enable_network_scan: true,
      enable_web_application_scan: true,
      enable_vulnerability_check: true,
      enable_active_directory_enumeration: false,
      enable_credentials_leak: false,
      enable_database_enum_check: false,
      enable_snmp_enum: false,
      enable_ssh_security_check: false,
      enable_mail_server_check: false,
      enable_shodan_lookup: false,
      enable_dns_enumeration: false,
      enable_ssl_tls_analysis: false,
      enable_wireless_scan: false,
      enable_wireless_adv_scan: false,
      enable_sast_scan: false,
      enable_api_scan: false,
      enable_desktop_pe_analysis: false,
      enable_mobile_app_scan: false,
      enable_web_crawling: false,
      enable_cloud_security_scan: false,
      enable_container_security: false,
      enable_iot_security_scan: false,
      enable_firmware_analysis: false,
      enable_scada_security: false,
      enable_exploitation: false,
      enable_bruteforce: false,
      enable_internal_vuln_scan_gvm: false,
      enable_adaptive_attack_path_mapping: false,
      enable_automated_vulnerability_validation: false,
      enable_passive_recon: false,
      enable_osint_gathering: false,
      enable_threat_intelligence: false,
      enable_social_engineering: false,
      enable_malware_analysis: false,
      enable_forensics_analysis: false,
      enable_physical_security: false,
      enable_compliance_check: false
    });
    setModuleConfigs({});
  };

  const buildScanParameters = () => {
    const selectedAssetData = assets.find(a => a.asset_id === selectedAsset);
    const scanParameters: any = {};

    // Set target based on asset type
    if (selectedAssetData?.asset_type === 'IP') {
      scanParameters.target_ip = selectedAssetData.target_value;
    } else if (['Domain', 'WebApp'].includes(selectedAssetData?.asset_type)) {
      scanParameters.target_domain = selectedAssetData.target_value;
    }

    // Add all module enable flags
    Object.entries(scanModules).forEach(([key, enabled]) => {
      scanParameters[key] = enabled;
    });

    // Add module-specific configurations
    Object.entries(moduleConfigs).forEach(([moduleName, config]) => {
      if (Object.keys(config).length > 0) {
        scanParameters[`${moduleName}_params`] = config;
      }
    });

    return scanParameters;
  };

  const handleSubmit = () => {
    if (!scanName || !selectedAsset) {
      toast.error("Please fill in all required fields");
      return;
    }

    const scanParameters = buildScanParameters();
    const enabledModulesCount = Object.values(scanModules).filter(Boolean).length;

    initiateScanMutation.mutate({
      asset_id: selectedAsset,
      scan_name: scanName,
      scan_parameters: scanParameters
    });

    toast.success(`Initiating comprehensive pentest with ${enabledModulesCount} security modules`);
  };

  const presetConfigurations = [
    {
      name: "Quick Security Assessment",
      description: "Essential security checks for rapid assessment",
      modules: {
        enable_network_scan: true,
        enable_web_application_scan: true,
        enable_vulnerability_check: true,
        enable_passive_recon: true
      }
    },
    {
      name: "Full Enterprise Assessment",
      description: "Comprehensive enterprise security evaluation",
      modules: {
        enable_network_scan: true,
        enable_web_application_scan: true,
        enable_vulnerability_check: true,
        enable_active_directory_enumeration: true,
        enable_credentials_leak: true,
        enable_database_enum_check: true,
        enable_sast_scan: true,
        enable_api_scan: true,
        enable_passive_recon: true,
        enable_dns_enumeration: true,
        enable_ssl_tls_analysis: true
      }
    },
    {
      name: "Advanced Red Team Exercise",
      description: "Full-spectrum adversarial simulation",
      modules: {
        enable_network_scan: true,
        enable_web_application_scan: true,
        enable_vulnerability_check: true,
        enable_active_directory_enumeration: true,
        enable_credentials_leak: true,
        enable_database_enum_check: true,
        enable_exploitation: true,
        enable_bruteforce: true,
        enable_social_engineering: true,
        enable_physical_security: true,
        enable_adaptive_attack_path_mapping: true,
        enable_automated_vulnerability_validation: true,
        enable_osint_gathering: true,
        enable_threat_intelligence: true,
        enable_wireless_scan: true,
        enable_cloud_security_scan: true
      }
    }
  ];

  const applyPreset = (preset: any) => {
    const newModules = { ...scanModules };
    // Reset all modules
    Object.keys(newModules).forEach(key => {
      newModules[key as keyof ScanModules] = false;
    });
    // Apply preset modules
    Object.entries(preset.modules).forEach(([key, enabled]) => {
      if (key in newModules) {
        newModules[key as keyof ScanModules] = enabled as boolean;
      }
    });
    setScanModules(newModules);
    toast.success(`Applied ${preset.name} configuration`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Advanced Penetration Testing Suite
          </DialogTitle>
          <DialogDescription>
            Configure and initiate comprehensive cybersecurity assessment with enterprise-grade security modules
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preset Configurations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="col-span-full mb-2">
              <h3 className="font-semibold text-lg">Quick Start Presets</h3>
              <p className="text-sm text-gray-600">Select a preconfigured scan template</p>
            </div>
            {presetConfigurations.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left flex flex-col items-start gap-2"
                onClick={() => applyPreset(preset)}
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-gray-600">{preset.description}</div>
                <div className="text-xs text-blue-600">
                  {Object.values(preset.modules).filter(Boolean).length} modules
                </div>
              </Button>
            ))}
          </div>

          <BasicConfiguration
            scanName={scanName}
            setScanName={setScanName}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
            assets={assets}
          />

          <ScanModuleSelector
            scanModules={scanModules}
            setScanModules={setScanModules}
          />

          <ComprehensiveAdvancedConfiguration
            scanModules={scanModules}
            moduleConfigs={moduleConfigs}
            setModuleConfigs={setModuleConfigs}
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            <span className="font-medium">
              {Object.values(scanModules).filter(Boolean).length}
            </span> security modules selected
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={initiateScanMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {initiateScanMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Initiating Pentest...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Launch Penetration Test
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
