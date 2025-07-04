
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { scansAPI } from "@/services/api";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import { BasicConfiguration } from "./config/BasicConfiguration";
import { ScanModuleSelector } from "./config/ScanModuleSelector";
import { AdvancedConfiguration } from "./config/AdvancedConfiguration";

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
    enable_network_scan: true,
    enable_web_application_scan: true,
    enable_vulnerability_check: true,
    enable_active_directory_enumeration: false,
    enable_credentials_leak: false,
    enable_database_enum_check: false,
    enable_desktop_pe_analysis: false,
    enable_exploitation: false,
    enable_internal_vuln_scan_gvm: false,
    enable_mail_server_check: false,
    enable_snmp_enum: false,
    enable_shodan_lookup: false,
    enable_ssh_security_check: false,
    enable_bruteforce: false,
    enable_passive_recon: false,
    enable_wireless_scan: false,
    enable_wireless_adv_scan: false,
    enable_sast_scan: false,
    enable_api_scan: false,
    enable_adaptive_attack_path_mapping: false,
    enable_automated_vulnerability_validation: false
  });

  // MVP Module Parameters
  const [networkParams, setNetworkParams] = useState({
    nmap_args: "-sS -sV",
    ports: "22,80,443,8080,8443",
    enable_os_detection: false,
    enable_service_version_detection: false,
    enable_script_scanning: false,
    enable_cve_lookup: false
  });

  const [webParams, setWebParams] = useState({
    enable_zap_scan: true,
    zap_address: "http://localhost:8080",
    enable_zap_auth: false,
    web_login_url: "",
    web_username: "",
    web_password: "",
    enable_nikto_scan: false,
    enable_gobuster_scan: false,
    gobuster_wordlist_path: ""
  });

  const [vulnParams, setVulnParams] = useState({
    target_software_name: "",
    target_cve_id: "",
    enable_vulners_lookup: false,
    enable_nvd_lookup: false,
    enable_vendor_advisories: false,
    enable_nessus_integration: false,
    enable_qualys_integration: false
  });

  const [adParams, setAdParams] = useState({
    ldap_host: "",
    ldap_port: 636,
    ldap_use_tls: true,
    ldap_username: "",
    ldap_password: "",
    ldap_base_dn: "",
    enable_user_enum: false,
    enable_group_enum: false,
    enable_computer_enum: false,
    enable_password_policy_check: false
  });

  const initiateScanMutation = useMutation({
    mutationFn: (data: any) => scansAPI.initiate(data),
    onSuccess: () => {
      toast.success("Scan initiated successfully");
      onSuccess();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to initiate scan");
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
      enable_desktop_pe_analysis: false,
      enable_exploitation: false,
      enable_internal_vuln_scan_gvm: false,
      enable_mail_server_check: false,
      enable_snmp_enum: false,
      enable_shodan_lookup: false,
      enable_ssh_security_check: false,
      enable_bruteforce: false,
      enable_passive_recon: false,
      enable_wireless_scan: false,
      enable_wireless_adv_scan: false,
      enable_sast_scan: false,
      enable_api_scan: false,
      enable_adaptive_attack_path_mapping: false,
      enable_automated_vulnerability_validation: false
    });
    // Reset all parameter states to defaults
    setNetworkParams({
      nmap_args: "-sS -sV",
      ports: "22,80,443,8080,8443",
      enable_os_detection: false,
      enable_service_version_detection: false,
      enable_script_scanning: false,
      enable_cve_lookup: false
    });
    setWebParams({
      enable_zap_scan: true,
      zap_address: "http://localhost:8080",
      enable_zap_auth: false,
      web_login_url: "",
      web_username: "",
      web_password: "",
      enable_nikto_scan: false,
      enable_gobuster_scan: false,
      gobuster_wordlist_path: ""
    });
    setVulnParams({
      target_software_name: "",
      target_cve_id: "",
      enable_vulners_lookup: false,
      enable_nvd_lookup: false,
      enable_vendor_advisories: false,
      enable_nessus_integration: false,
      enable_qualys_integration: false
    });
    setAdParams({
      ldap_host: "",
      ldap_port: 636,
      ldap_use_tls: true,
      ldap_username: "",
      ldap_password: "",
      ldap_base_dn: "",
      enable_user_enum: false,
      enable_group_enum: false,
      enable_computer_enum: false,
      enable_password_policy_check: false
    });
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

    // Add MVP module parameters only if modules are enabled
    if (scanModules.enable_network_scan) {
      // Only include non-empty parameters
      const cleanNetworkParams: any = {};
      if (networkParams.nmap_args) cleanNetworkParams.nmap_args = networkParams.nmap_args;
      if (networkParams.ports) cleanNetworkParams.ports = networkParams.ports;
      if (networkParams.enable_os_detection) cleanNetworkParams.enable_os_detection = true;
      if (networkParams.enable_service_version_detection) cleanNetworkParams.enable_service_version_detection = true;
      if (networkParams.enable_script_scanning) cleanNetworkParams.enable_script_scanning = true;
      if (networkParams.enable_cve_lookup) cleanNetworkParams.enable_cve_lookup = true;
      
      if (Object.keys(cleanNetworkParams).length > 0) {
        scanParameters.network_scan_params = cleanNetworkParams;
      }
    }

    if (scanModules.enable_web_application_scan) {
      const cleanWebParams: any = {};
      if (webParams.enable_zap_scan) cleanWebParams.enable_zap_scan = true;
      if (webParams.zap_address) cleanWebParams.zap_address = webParams.zap_address;
      if (webParams.enable_zap_auth) {
        cleanWebParams.enable_zap_auth = true;
        if (webParams.web_login_url) cleanWebParams.web_login_url = webParams.web_login_url;
        if (webParams.web_username) cleanWebParams.web_username = webParams.web_username;
        if (webParams.web_password) cleanWebParams.web_password = webParams.web_password;
      }
      if (webParams.enable_nikto_scan) cleanWebParams.enable_nikto_scan = true;
      if (webParams.enable_gobuster_scan) {
        cleanWebParams.enable_gobuster_scan = true;
        if (webParams.gobuster_wordlist_path) cleanWebParams.gobuster_wordlist_path = webParams.gobuster_wordlist_path;
      }
      
      if (Object.keys(cleanWebParams).length > 0) {
        scanParameters.web_application_scan_params = cleanWebParams;
      }
    }

    if (scanModules.enable_vulnerability_check) {
      const cleanVulnParams: any = {};
      if (vulnParams.target_software_name) cleanVulnParams.target_software_name = vulnParams.target_software_name;
      if (vulnParams.target_cve_id) cleanVulnParams.target_cve_id = vulnParams.target_cve_id;
      if (vulnParams.enable_vulners_lookup) cleanVulnParams.enable_vulners_lookup = true;
      if (vulnParams.enable_nvd_lookup) cleanVulnParams.enable_nvd_lookup = true;
      if (vulnParams.enable_vendor_advisories) cleanVulnParams.enable_vendor_advisories = true;
      if (vulnParams.enable_nessus_integration) cleanVulnParams.enable_nessus_integration = true;
      if (vulnParams.enable_qualys_integration) cleanVulnParams.enable_qualys_integration = true;
      
      if (Object.keys(cleanVulnParams).length > 0) {
        scanParameters.vulnerability_check_params = cleanVulnParams;
      }
    }

    if (scanModules.enable_active_directory_enumeration && adParams.ldap_host && adParams.ldap_base_dn) {
      const cleanAdParams: any = {
        ldap_host: adParams.ldap_host,
        ldap_base_dn: adParams.ldap_base_dn
      };
      if (adParams.ldap_port !== 636) cleanAdParams.ldap_port = adParams.ldap_port;
      if (!adParams.ldap_use_tls) cleanAdParams.ldap_use_tls = false;
      if (adParams.ldap_username) cleanAdParams.ldap_username = adParams.ldap_username;
      if (adParams.ldap_password) cleanAdParams.ldap_password = adParams.ldap_password;
      if (adParams.enable_user_enum) cleanAdParams.enable_user_enum = true;
      if (adParams.enable_group_enum) cleanAdParams.enable_group_enum = true;
      if (adParams.enable_computer_enum) cleanAdParams.enable_computer_enum = true;
      if (adParams.enable_password_policy_check) cleanAdParams.enable_password_policy_check = true;
      
      scanParameters.active_directory_enumeration_params = cleanAdParams;
    }

    return scanParameters;
  };

  const handleSubmit = () => {
    if (!scanName || !selectedAsset) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate Active Directory parameters if enabled
    if (scanModules.enable_active_directory_enumeration) {
      if (!adParams.ldap_host || !adParams.ldap_base_dn) {
        toast.error("LDAP Host and Base DN are required for Active Directory enumeration");
        return;
      }
    }

    const scanParameters = buildScanParameters();

    initiateScanMutation.mutate({
      asset_id: selectedAsset,
      scan_name: scanName,
      scan_parameters: scanParameters
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Initiate Comprehensive Security Scan
          </DialogTitle>
          <DialogDescription>
            Configure and start a comprehensive cybersecurity assessment with dynamic module selection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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

          <AdvancedConfiguration
            scanModules={scanModules}
            networkParams={networkParams}
            setNetworkParams={setNetworkParams}
            webParams={webParams}
            setWebParams={setWebParams}
            vulnParams={vulnParams}
            setVulnParams={setVulnParams}
            adParams={adParams}
            setAdParams={setAdParams}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={initiateScanMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {initiateScanMutation.isPending ? "Initiating..." : "Start Comprehensive Scan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
