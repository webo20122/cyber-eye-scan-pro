import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe } from "lucide-react";

interface WebApplicationAdvancedConfigProps {
  webParams: {
    enable_zap_scan?: boolean;
    zap_address?: string;
    enable_zap_auth?: boolean;
    web_login_url?: string;
    web_username?: string;
    web_password?: string;
    enable_nikto_scan?: boolean;
    enable_gobuster_scan?: boolean;
    gobuster_wordlist_path?: string;
  };
  setWebParams: (params: any) => void;
}

export const WebApplicationAdvancedConfig = ({ webParams, setWebParams }: WebApplicationAdvancedConfigProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-green-50">
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Globe className="h-4 w-4 text-green-600" />
        Web Application Scan Configuration
      </h4>
      
      {/* ZAP Configuration */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="zapScan"
            checked={webParams.enable_zap_scan || false}
            onCheckedChange={(checked) =>
              setWebParams({ ...webParams, enable_zap_scan: !!checked })
            }
          />
          <Label htmlFor="zapScan">Enable ZAP Scan</Label>
        </div>
        
        {webParams.enable_zap_scan && (
          <div className="ml-6 space-y-3">
            <div>
              <Label htmlFor="zapAddress">ZAP Proxy Address</Label>
              <Input
                id="zapAddress"
                value={webParams.zap_address || ""}
                onChange={(e) => setWebParams({ ...webParams, zap_address: e.target.value })}
                placeholder="http://localhost:8080"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="zapAuth"
                checked={webParams.enable_zap_auth || false}
                onCheckedChange={(checked) =>
                  setWebParams({ ...webParams, enable_zap_auth: !!checked })
                }
              />
              <Label htmlFor="zapAuth">Enable ZAP Authentication</Label>
            </div>
            
            {webParams.enable_zap_auth && (
              <div className="ml-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="webLoginUrl">Login URL</Label>
                  <Input
                    id="webLoginUrl"
                    value={webParams.web_login_url || ""}
                    onChange={(e) => setWebParams({ ...webParams, web_login_url: e.target.value })}
                    placeholder="https://example.com/login"
                  />
                </div>
                <div>
                  <Label htmlFor="webUsername">Username</Label>
                  <Input
                    id="webUsername"
                    value={webParams.web_username || ""}
                    onChange={(e) => setWebParams({ ...webParams, web_username: e.target.value })}
                    placeholder="username"
                  />
                </div>
                <div>
                  <Label htmlFor="webPassword">Password</Label>
                  <Input
                    id="webPassword"
                    type="password"
                    value={webParams.web_password || ""}
                    onChange={(e) => setWebParams({ ...webParams, web_password: e.target.value })}
                    placeholder="password"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Other Web Tools */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="niktoScan"
            checked={webParams.enable_nikto_scan || false}
            onCheckedChange={(checked) =>
              setWebParams({ ...webParams, enable_nikto_scan: !!checked })
            }
          />
          <Label htmlFor="niktoScan">Enable Nikto Scan</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="gobusterScan"
            checked={webParams.enable_gobuster_scan || false}
            onCheckedChange={(checked) =>
              setWebParams({ ...webParams, enable_gobuster_scan: !!checked })
            }
          />
          <Label htmlFor="gobusterScan">Enable Gobuster Directory Scan</Label>
        </div>
        
        {webParams.enable_gobuster_scan && (
          <div className="ml-6">
            <Label htmlFor="gobusterWordlist">Gobuster Wordlist Path</Label>
            <Input
              id="gobusterWordlist"
              value={webParams.gobuster_wordlist_path || ""}
              onChange={(e) => setWebParams({ ...webParams, gobuster_wordlist_path: e.target.value })}
              placeholder="/path/to/wordlist.txt"
            />
          </div>
        )}
      </div>
    </div>
  );
};
