
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { scansAPI } from "@/services/api";
import { toast } from "sonner";
import { 
  Wifi, 
  Globe, 
  Code, 
  Database, 
  Key, 
  Shield,
  Search,
  Zap,
  Server,
  Mail,
  Router,
  Eye
} from "lucide-react";

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

    initiateScanMutation.mutate({
      asset_id: selectedAsset,
      scan_name: scanName,
      scan_parameters: scanParameters
    });
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
          {/* Basic Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="scanName">Scan Name *</Label>
                <Input
                  id="scanName"
                  value={scanName}
                  onChange={(e) => setScanName(e.target.value)}
                  placeholder="Enter scan name"
                />
              </div>
              <div>
                <Label htmlFor="asset">Target Asset *</Label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.asset_id} value={asset.asset_id}>
                        {asset.name} ({asset.type}: {asset.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Scan Modules */}
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
                      checked={scanModules[key as keyof typeof scanModules]}
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

          {/* Advanced Configuration */}
          {(scanModules.enable_network_scan || scanModules.enable_web_application_scan || scanModules.enable_sast_scan) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {scanModules.enable_network_scan && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      Network Scan Parameters
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nmapArgs">Nmap Arguments</Label>
                        <Input
                          id="nmapArgs"
                          value={networkParams.nmap_args}
                          onChange={(e) => setNetworkParams(prev => ({ ...prev, nmap_args: e.target.value }))}
                          placeholder="-sS -sV"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ports">Target Ports</Label>
                        <Input
                          id="ports"
                          value={networkParams.ports}
                          onChange={(e) => setNetworkParams(prev => ({ ...prev, ports: e.target.value }))}
                          placeholder="22,80,443,8080,8443"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {scanModules.enable_web_application_scan && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Web Application Scan Parameters
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="zapScan"
                          checked={webParams.enable_zap_scan}
                          onCheckedChange={(checked) =>
                            setWebParams(prev => ({ ...prev, enable_zap_scan: !!checked }))
                          }
                        />
                        <Label htmlFor="zapScan">Enable ZAP Scan</Label>
                      </div>
                      {webParams.enable_zap_scan && (
                        <div>
                          <Label htmlFor="zapAddress">ZAP Proxy Address</Label>
                          <Input
                            id="zapAddress"
                            value={webParams.zap_address}
                            onChange={(e) => setWebParams(prev => ({ ...prev, zap_address: e.target.value }))}
                            placeholder="http://localhost:8080"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {scanModules.enable_sast_scan && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      SAST Scan Parameters
                    </h4>
                    <div>
                      <Label htmlFor="repoUrl">Code Repository URL</Label>
                      <Input
                        id="repoUrl"
                        value={sastParams.code_repo_url}
                        onChange={(e) => setSastParams(prev => ({ ...prev, code_repo_url: e.target.value }))}
                        placeholder="https://github.com/username/repository.git"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
