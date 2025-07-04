
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
          {Object.values(scanModules).some(Boolean) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
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

                {scanModules.enable_credentials_leak && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Credentials Leak Check Parameters
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="commonPasswords"
                          checked={credentialsParams.check_common_passwords}
                          onCheckedChange={(checked) =>
                            setCredentialsParams(prev => ({ ...prev, check_common_passwords: !!checked }))
                          }
                        />
                        <Label htmlFor="commonPasswords">Check Common Passwords</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="leakedDatabases"
                          checked={credentialsParams.check_leaked_databases}
                          onCheckedChange={(checked) =>
                            setCredentialsParams(prev => ({ ...prev, check_leaked_databases: !!checked }))
                          }
                        />
                        <Label htmlFor="leakedDatabases">Check Leaked Databases</Label>
                      </div>
                      <div>
                        <Label htmlFor="customWordlist">Custom Wordlist</Label>
                        <Textarea
                          id="customWordlist"
                          value={credentialsParams.custom_wordlist}
                          onChange={(e) => setCredentialsParams(prev => ({ ...prev, custom_wordlist: e.target.value }))}
                          placeholder="Enter custom passwords/usernames (one per line)"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {scanModules.enable_database_enum_check && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Database Enumeration Parameters
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="checkMySQL"
                            checked={databaseParams.check_mysql}
                            onCheckedChange={(checked) =>
                              setDatabaseParams(prev => ({ ...prev, check_mysql: !!checked }))
                            }
                          />
                          <Label htmlFor="checkMySQL">MySQL</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="checkPostgreSQL"
                            checked={databaseParams.check_postgresql}
                            onCheckedChange={(checked) =>
                              setDatabaseParams(prev => ({ ...prev, check_postgresql: !!checked }))
                            }
                          />
                          <Label htmlFor="checkPostgreSQL">PostgreSQL</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="checkMongoDB"
                            checked={databaseParams.check_mongodb}
                            onCheckedChange={(checked) =>
                              setDatabaseParams(prev => ({ ...prev, check_mongodb: !!checked }))
                            }
                          />
                          <Label htmlFor="checkMongoDB">MongoDB</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="checkRedis"
                            checked={databaseParams.check_redis}
                            onCheckedChange={(checked) =>
                              setDatabaseParams(prev => ({ ...prev, check_redis: !!checked }))
                            }
                          />
                          <Label htmlFor="checkRedis">Redis</Label>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="customDbPorts">Custom Database Ports</Label>
                        <Input
                          id="customDbPorts"
                          value={databaseParams.custom_ports}
                          onChange={(e) => setDatabaseParams(prev => ({ ...prev, custom_ports: e.target.value }))}
                          placeholder="3306,5432,27017,6379"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {scanModules.enable_passive_recon && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Passive Reconnaissance Parameters
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="checkDNS"
                          checked={passiveReconParams.check_dns_records}
                          onCheckedChange={(checked) =>
                            setPassiveReconParams(prev => ({ ...prev, check_dns_records: !!checked }))
                          }
                        />
                        <Label htmlFor="checkDNS">DNS Records</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="checkSubdomains"
                          checked={passiveReconParams.check_subdomains}
                          onCheckedChange={(checked) =>
                            setPassiveReconParams(prev => ({ ...prev, check_subdomains: !!checked }))
                          }
                        />
                        <Label htmlFor="checkSubdomains">Subdomains</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="checkCertificates"
                          checked={passiveReconParams.check_certificates}
                          onCheckedChange={(checked) =>
                            setPassiveReconParams(prev => ({ ...prev, check_certificates: !!checked }))
                          }
                        />
                        <Label htmlFor="checkCertificates">SSL Certificates</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="checkWhois"
                          checked={passiveReconParams.check_whois}
                          onCheckedChange={(checked) =>
                            setPassiveReconParams(prev => ({ ...prev, check_whois: !!checked }))
                          }
                        />
                        <Label htmlFor="checkWhois">WHOIS Data</Label>
                      </div>
                    </div>
                  </div>
                )}

                {scanModules.enable_ssh_security_check && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      SSH Security Check Parameters
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="checkWeakCiphers"
                            checked={sshParams.check_weak_ciphers}
                            onCheckedChange={(checked) =>
                              setSshParams(prev => ({ ...prev, check_weak_ciphers: !!checked }))
                            }
                          />
                          <Label htmlFor="checkWeakCiphers">Weak Ciphers</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="checkKeyExchange"
                            checked={sshParams.check_key_exchange}
                            onCheckedChange={(checked) =>
                              setSshParams(prev => ({ ...prev, check_key_exchange: !!checked }))
                            }
                          />
                          <Label htmlFor="checkKeyExchange">Key Exchange</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="checkAuthentication"
                            checked={sshParams.check_authentication}
                            onCheckedChange={(checked) =>
                              setSshParams(prev => ({ ...prev, check_authentication: !!checked }))
                            }
                          />
                          <Label htmlFor="checkAuthentication">Authentication</Label>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="sshPort">SSH Port</Label>
                        <Input
                          id="sshPort"
                          value={sshParams.custom_port}
                          onChange={(e) => setSshParams(prev => ({ ...prev, custom_port: e.target.value }))}
                          placeholder="22"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {scanModules.enable_mail_server_check && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Mail Server Check Parameters
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="checkSMTP"
                            checked={mailParams.check_smtp}
                            onCheckedChange={(checked) =>
                              setMailParams(prev => ({ ...prev, check_smtp: !!checked }))
                            }
                          />
                          <Label htmlFor="checkSMTP">SMTP</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="checkPOP3"
                            checked={mailParams.check_pop3}
                            onCheckedChange={(checked) =>
                              setMailParams(prev => ({ ...prev, check_pop3: !!checked }))
                            }
                          />
                          <Label htmlFor="checkPOP3">POP3</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="checkIMAP"
                            checked={mailParams.check_imap}
                            onCheckedChange={(checked) =>
                              setMailParams(prev => ({ ...prev, check_imap: !!checked }))
                            }
                          />
                          <Label htmlFor="checkIMAP">IMAP</Label>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="smtpPorts">SMTP Ports</Label>
                          <Input
                            id="smtpPorts"
                            value={mailParams.smtp_port}
                            onChange={(e) => setMailParams(prev => ({ ...prev, smtp_port: e.target.value }))}
                            placeholder="25,587"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pop3Ports">POP3 Ports</Label>
                          <Input
                            id="pop3Ports"
                            value={mailParams.pop3_port}
                            onChange={(e) => setMailParams(prev => ({ ...prev, pop3_port: e.target.value }))}
                            placeholder="110,995"
                          />
                        </div>
                        <div>
                          <Label htmlFor="imapPorts">IMAP Ports</Label>
                          <Input
                            id="imapPorts"
                            value={mailParams.imap_port}
                            onChange={(e) => setMailParams(prev => ({ ...prev, imap_port: e.target.value }))}
                            placeholder="143,993"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {scanModules.enable_shodan_lookup && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Shodan Lookup Parameters
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="shodanApiKey">Shodan API Key</Label>
                        <Input
                          id="shodanApiKey"
                          type="password"
                          value={shodanParams.api_key}
                          onChange={(e) => setShodanParams(prev => ({ ...prev, api_key: e.target.value }))}
                          placeholder="Enter your Shodan API key"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shodanQuery">Search Query</Label>
                          <Input
                            id="shodanQuery"
                            value={shodanParams.search_query}
                            onChange={(e) => setShodanParams(prev => ({ ...prev, search_query: e.target.value }))}
                            placeholder="e.g., apache, nginx, port:80"
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxResults">Max Results</Label>
                          <Input
                            id="maxResults"
                            type="number"
                            value={shodanParams.max_results}
                            onChange={(e) => setShodanParams(prev => ({ ...prev, max_results: e.target.value }))}
                            placeholder="100"
                          />
                        </div>
                      </div>
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
