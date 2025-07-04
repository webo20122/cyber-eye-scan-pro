
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

interface InitiateScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: any[];
  onSuccess: () => void;
}

export const InitiateScanDialog = ({ open, onOpenChange, assets, onSuccess }: InitiateScanDialogProps) => {
  const [scanName, setScanName] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [scanModules, setScanModules] = useState({
    enable_network_scan: true,
    enable_web_application_scan: true,
    enable_credentials_leak: false,
    enable_database_enum_check: false,
    enable_sast_scan: false,
    enable_vulnerability_check: true,
    enable_passive_recon: false,
    enable_ssh_security_check: false,
    enable_mail_server_check: false,
    enable_shodan_lookup: false
  });

  const [networkParams, setNetworkParams] = useState({
    nmap_args: "-sS -sV",
    ports: "22,80,443,8080,8443"
  });

  const [webParams, setWebParams] = useState({
    enable_zap_scan: true,
    zap_address: "http://localhost:8080"
  });

  const [sastParams, setSastParams] = useState({
    code_repo_url: ""
  });

  const [credentialsParams, setCredentialsParams] = useState({
    check_common_passwords: true,
    check_leaked_databases: true,
    custom_wordlist: ""
  });

  const [databaseParams, setDatabaseParams] = useState({
    check_mysql: true,
    check_postgresql: true,
    check_mongodb: true,
    check_redis: true,
    custom_ports: "3306,5432,27017,6379"
  });

  const [passiveReconParams, setPassiveReconParams] = useState({
    check_dns_records: true,
    check_subdomains: true,
    check_certificates: true,
    check_whois: true
  });

  const [sshParams, setSshParams] = useState({
    check_weak_ciphers: true,
    check_key_exchange: true,
    check_authentication: true,
    custom_port: "22"
  });

  const [mailParams, setMailParams] = useState({
    check_smtp: true,
    check_pop3: true,
    check_imap: true,
    smtp_port: "25,587",
    pop3_port: "110,995",
    imap_port: "143,993"
  });

  const [shodanParams, setShodanParams] = useState({
    api_key: "",
    search_query: "",
    max_results: "100"
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
      enable_credentials_leak: false,
      enable_database_enum_check: false,
      enable_sast_scan: false,
      enable_vulnerability_check: true,
      enable_passive_recon: false,
      enable_ssh_security_check: false,
      enable_mail_server_check: false,
      enable_shodan_lookup: false
    });
    setNetworkParams({
      nmap_args: "-sS -sV",
      ports: "22,80,443,8080,8443"
    });
    setWebParams({
      enable_zap_scan: true,
      zap_address: "http://localhost:8080"
    });
    setSastParams({
      code_repo_url: ""
    });
    setCredentialsParams({
      check_common_passwords: true,
      check_leaked_databases: true,
      custom_wordlist: ""
    });
    setDatabaseParams({
      check_mysql: true,
      check_postgresql: true,
      check_mongodb: true,
      check_redis: true,
      custom_ports: "3306,5432,27017,6379"
    });
    setPassiveReconParams({
      check_dns_records: true,
      check_subdomains: true,
      check_certificates: true,
      check_whois: true
    });
    setSshParams({
      check_weak_ciphers: true,
      check_key_exchange: true,
      check_authentication: true,
      custom_port: "22"
    });
    setMailParams({
      check_smtp: true,
      check_pop3: true,
      check_imap: true,
      smtp_port: "25,587",
      pop3_port: "110,995",
      imap_port: "143,993"
    });
    setShodanParams({
      api_key: "",
      search_query: "",
      max_results: "100"
    });
  };

  const handleSubmit = () => {
    if (!scanName || !selectedAsset) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedAssetData = assets.find(a => a.asset_id === selectedAsset);
    const scanParameters: any = {};

    // Set target based on asset type
    if (selectedAssetData?.type === 'IP') {
      scanParameters.target_ip = selectedAssetData.value;
    } else if (selectedAssetData?.type === 'Domain' || selectedAssetData?.type === 'WebApp') {
      scanParameters.target_domain = selectedAssetData.value;
    }

    // Add module configurations
    Object.entries(scanModules).forEach(([key, enabled]) => {
      scanParameters[key] = enabled;
    });

    // Add specific module parameters
    if (scanModules.enable_network_scan) {
      scanParameters.network_scan_params = networkParams;
    }

    if (scanModules.enable_web_application_scan) {
      scanParameters.web_application_scan_params = webParams;
    }

    if (scanModules.enable_sast_scan && sastParams.code_repo_url) {
      scanParameters.sast_scan_params = sastParams;
    }

    if (scanModules.enable_credentials_leak) {
      scanParameters.credentials_leak_params = credentialsParams;
    }

    if (scanModules.enable_database_enum_check) {
      scanParameters.database_enum_params = databaseParams;
    }

    if (scanModules.enable_passive_recon) {
      scanParameters.passive_recon_params = passiveReconParams;
    }

    if (scanModules.enable_ssh_security_check) {
      scanParameters.ssh_security_params = sshParams;
    }

    if (scanModules.enable_mail_server_check) {
      scanParameters.mail_server_params = mailParams;
    }

    if (scanModules.enable_shodan_lookup) {
      scanParameters.shodan_lookup_params = shodanParams;
    }

    initiateScanMutation.mutate({
      asset_id: selectedAsset,
      scan_name: scanName,
      scan_parameters: scanParameters
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Initiate Security Scan
          </DialogTitle>
          <DialogDescription>
            Configure and start a comprehensive security assessment
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
            sastParams={sastParams}
            setSastParams={setSastParams}
            credentialsParams={credentialsParams}
            setCredentialsParams={setCredentialsParams}
            databaseParams={databaseParams}
            setDatabaseParams={setDatabaseParams}
            passiveReconParams={passiveReconParams}
            setPassiveReconParams={setPassiveReconParams}
            sshParams={sshParams}
            setSshParams={setSshParams}
            mailParams={mailParams}
            setMailParams={setMailParams}
            shodanParams={shodanParams}
            setShodanParams={setShodanParams}
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
            {initiateScanMutation.isPending ? "Starting..." : "Start Scan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
