
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface CredentialsLeakConfigProps {
  config: any;
  onChange: (config: any) => void;
}

export const CredentialsLeakConfig = ({ config, onChange }: CredentialsLeakConfigProps) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Credentials Leak Check Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="check_type">Check Type</Label>
          <Select value={config.check_type || "email"} onValueChange={(value) => updateConfig('check_type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email Address</SelectItem>
              <SelectItem value="domain">Domain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="target_value">
            {config.check_type === 'domain' ? 'Domain' : 'Email Address'}
          </Label>
          <Input
            id="target_value"
            value={config.target_value || ""}
            onChange={(e) => updateConfig('target_value', e.target.value)}
            placeholder={config.check_type === 'domain' ? 'example.com' : 'user@example.com'}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="check_haveibeenpwned"
              checked={config.check_haveibeenpwned ?? true}
              onCheckedChange={(checked) => updateConfig('check_haveibeenpwned', !!checked)}
            />
            <Label htmlFor="check_haveibeenpwned">HaveIBeenPwned</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="check_dehashed"
              checked={config.check_dehashed ?? false}
              onCheckedChange={(checked) => updateConfig('check_dehashed', !!checked)}
            />
            <Label htmlFor="check_dehashed">DeHashed</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="check_breach_databases"
              checked={config.check_breach_databases ?? true}
              onCheckedChange={(checked) => updateConfig('check_breach_databases', !!checked)}
            />
            <Label htmlFor="check_breach_databases">Breach Databases</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_dark_web_monitoring"
              checked={config.enable_dark_web_monitoring ?? false}
              onCheckedChange={(checked) => updateConfig('enable_dark_web_monitoring', !!checked)}
            />
            <Label htmlFor="enable_dark_web_monitoring">Dark Web Monitoring</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
