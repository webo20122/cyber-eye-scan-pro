
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ApiScanConfigProps {
  config: any;
  onChange: (config: any) => void;
}

export const ApiScanConfig = ({ config, onChange }: ApiScanConfigProps) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">API Security Testing Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="api_spec_path">API Specification Path</Label>
            <Input
              id="api_spec_path"
              value={config.api_spec_path || ""}
              onChange={(e) => updateConfig('api_spec_path', e.target.value)}
              placeholder="/path/to/swagger.json or URL"
            />
          </div>
          <div>
            <Label htmlFor="api_base_url">API Base URL</Label>
            <Input
              id="api_base_url"
              value={config.api_base_url || ""}
              onChange={(e) => updateConfig('api_base_url', e.target.value)}
              placeholder="https://api.example.com/v1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_auth_bypass_check"
              checked={config.enable_auth_bypass_check ?? true}
              onCheckedChange={(checked) => updateConfig('enable_auth_bypass_check', !!checked)}
            />
            <Label htmlFor="enable_auth_bypass_check">Authentication Bypass</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_authorization_check"
              checked={config.enable_authorization_check ?? true}
              onCheckedChange={(checked) => updateConfig('enable_authorization_check', !!checked)}
            />
            <Label htmlFor="enable_authorization_check">Authorization Testing</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_advanced_fuzzing"
              checked={config.enable_advanced_fuzzing ?? false}
              onCheckedChange={(checked) => updateConfig('enable_advanced_fuzzing', !!checked)}
            />
            <Label htmlFor="enable_advanced_fuzzing">Advanced Fuzzing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_rate_limit_bypass"
              checked={config.enable_rate_limit_bypass ?? false}
              onCheckedChange={(checked) => updateConfig('enable_rate_limit_bypass', !!checked)}
            />
            <Label htmlFor="enable_rate_limit_bypass">Rate Limit Bypass</Label>
          </div>
        </div>

        <Collapsible open={isAuthOpen} onOpenChange={setIsAuthOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
            <ChevronDown className="h-4 w-4" />
            Authentication Configuration
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div>
              <Label htmlFor="authentication_type">Authentication Type</Label>
              <Select value={config.authentication_type || ""} onValueChange={(value) => updateConfig('authentication_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select authentication type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="api_key">API Key</SelectItem>
                  <SelectItem value="bearer_token">Bearer Token</SelectItem>
                  <SelectItem value="basic_auth">Basic Auth</SelectItem>
                  <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.authentication_type === 'api_key' && (
              <div>
                <Label htmlFor="api_key">API Key</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={config.api_key || ""}
                  onChange={(e) => updateConfig('api_key', e.target.value)}
                  placeholder="Your API key"
                />
              </div>
            )}

            {config.authentication_type === 'bearer_token' && (
              <div>
                <Label htmlFor="bearer_token">Bearer Token</Label>
                <Input
                  id="bearer_token"
                  type="password"
                  value={config.bearer_token || ""}
                  onChange={(e) => updateConfig('bearer_token', e.target.value)}
                  placeholder="Your bearer token"
                />
              </div>
            )}

            {config.authentication_type === 'basic_auth' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="basic_username">Username</Label>
                  <Input
                    id="basic_username"
                    value={config.basic_username || ""}
                    onChange={(e) => updateConfig('basic_username', e.target.value)}
                    placeholder="Username"
                  />
                </div>
                <div>
                  <Label htmlFor="basic_password">Password</Label>
                  <Input
                    id="basic_password"
                    type="password"
                    value={config.basic_password || ""}
                    onChange={(e) => updateConfig('basic_password', e.target.value)}
                    placeholder="Password"
                  />
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {config.enable_authorization_check && (
          <div>
            <Label htmlFor="authorization_test_cases">Authorization Test Cases</Label>
            <Textarea
              id="authorization_test_cases"
              value={config.authorization_test_cases || ""}
              onChange={(e) => updateConfig('authorization_test_cases', e.target.value)}
              placeholder="Describe authorization test scenarios (one per line)"
              rows={3}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
