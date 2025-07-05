
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface NetworkScanConfigProps {
  config: any;
  onChange: (config: any) => void;
}

export const NetworkScanConfig = ({ config, onChange }: NetworkScanConfigProps) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Network Scan Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nmap_args">Nmap Arguments</Label>
            <Input
              id="nmap_args"
              value={config.nmap_args || "-sS -sV -O --script=default,vuln"}
              onChange={(e) => updateConfig('nmap_args', e.target.value)}
              placeholder="-sS -sV -O --script=default,vuln"
            />
          </div>
          <div>
            <Label htmlFor="ports">Port Range</Label>
            <Input
              id="ports"
              value={config.ports || "1-65535"}
              onChange={(e) => updateConfig('ports', e.target.value)}
              placeholder="22,80,443 or 1-1000"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="timing_template">Timing Template</Label>
            <Select value={config.timing_template || "T4"} onValueChange={(value) => updateConfig('timing_template', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="T0">T0 - Paranoid</SelectItem>
                <SelectItem value="T1">T1 - Sneaky</SelectItem>
                <SelectItem value="T2">T2 - Polite</SelectItem>
                <SelectItem value="T3">T3 - Normal</SelectItem>
                <SelectItem value="T4">T4 - Aggressive</SelectItem>
                <SelectItem value="T5">T5 - Insane</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_os_detection"
              checked={config.enable_os_detection ?? true}
              onCheckedChange={(checked) => updateConfig('enable_os_detection', !!checked)}
            />
            <Label htmlFor="enable_os_detection">OS Detection</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_service_version_detection"
              checked={config.enable_service_version_detection ?? true}
              onCheckedChange={(checked) => updateConfig('enable_service_version_detection', !!checked)}
            />
            <Label htmlFor="enable_service_version_detection">Service Version Detection</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_script_scanning"
              checked={config.enable_script_scanning ?? true}
              onCheckedChange={(checked) => updateConfig('enable_script_scanning', !!checked)}
            />
            <Label htmlFor="enable_script_scanning">Script Scanning</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="stealth_mode"
              checked={config.stealth_mode ?? false}
              onCheckedChange={(checked) => updateConfig('stealth_mode', !!checked)}
            />
            <Label htmlFor="stealth_mode">Stealth Mode</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
