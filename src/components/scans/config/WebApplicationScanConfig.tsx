
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface WebApplicationScanConfigProps {
  config: any;
  onChange: (config: any) => void;
}

export const WebApplicationScanConfig = ({ config, onChange }: WebApplicationScanConfigProps) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Web Application Scan Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_zap_scan"
              checked={config.enable_zap_scan ?? true}
              onCheckedChange={(checked) => updateConfig('enable_zap_scan', !!checked)}
            />
            <Label htmlFor="enable_zap_scan">OWASP ZAP Scan</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_nikto_scan"
              checked={config.enable_nikto_scan ?? true}
              onCheckedChange={(checked) => updateConfig('enable_nikto_scan', !!checked)}
            />
            <Label htmlFor="enable_nikto_scan">Nikto Scan</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_gobuster_scan"
              checked={config.enable_gobuster_scan ?? true}
              onCheckedChange={(checked) => updateConfig('enable_gobuster_scan', !!checked)}
            />
            <Label htmlFor="enable_gobuster_scan">Gobuster Directory Scan</Label>
          </div>
        </div>

        {config.enable_gobuster_scan && (
          <div>
            <Label htmlFor="gobuster_wordlist_path">Gobuster Wordlist Path</Label>
            <Input
              id="gobuster_wordlist_path"
              value={config.gobuster_wordlist_path || "/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt"}
              onChange={(e) => updateConfig('gobuster_wordlist_path', e.target.value)}
              placeholder="Path to wordlist file"
            />
          </div>
        )}

        {config.enable_zap_scan && (
          <Collapsible open={isAuthOpen} onOpenChange={setIsAuthOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
              <ChevronDown className="h-4 w-4" />
              ZAP Authentication Settings (Optional)
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable_zap_auth"
                  checked={config.enable_zap_auth ?? false}
                  onCheckedChange={(checked) => updateConfig('enable_zap_auth', !!checked)}
                />
                <Label htmlFor="enable_zap_auth">Enable Authentication</Label>
              </div>

              {config.enable_zap_auth && (
                <div className="grid grid-cols-1 gap-3 pl-6">
                  <div>
                    <Label htmlFor="web_login_url">Login URL</Label>
                    <Input
                      id="web_login_url"
                      value={config.web_login_url || ""}
                      onChange={(e) => updateConfig('web_login_url', e.target.value)}
                      placeholder="https://example.com/login"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="web_username">Username</Label>
                      <Input
                        id="web_username"
                        value={config.web_username || ""}
                        onChange={(e) => updateConfig('web_username', e.target.value)}
                        placeholder="Username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="web_password">Password</Label>
                      <Input
                        id="web_password"
                        type="password"
                        value={config.web_password || ""}
                        onChange={(e) => updateConfig('web_password', e.target.value)}
                        placeholder="Password"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_ajax_spider"
              checked={config.enable_ajax_spider ?? true}
              onCheckedChange={(checked) => updateConfig('enable_ajax_spider', !!checked)}
            />
            <Label htmlFor="enable_ajax_spider">AJAX Spider</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="passive_scan_only"
              checked={config.passive_scan_only ?? false}
              onCheckedChange={(checked) => updateConfig('passive_scan_only', !!checked)}
            />
            <Label htmlFor="passive_scan_only">Passive Scan Only</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="spider_depth">Spider Depth</Label>
          <Input
            id="spider_depth"
            type="number"
            value={config.spider_depth || 5}
            onChange={(e) => updateConfig('spider_depth', parseInt(e.target.value) || 5)}
            min="1"
            max="20"
          />
        </div>
      </CardContent>
    </Card>
  );
};
