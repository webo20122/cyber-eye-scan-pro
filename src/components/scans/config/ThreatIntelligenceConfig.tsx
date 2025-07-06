import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ThreatIntelligenceConfigProps {
  config: any;
  onChange: (config: any) => void;
}

export const ThreatIntelligenceConfig = ({ config, onChange }: ThreatIntelligenceConfigProps) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Card className="border-indigo-200 bg-indigo-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Threat Intelligence Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="ioc_value">IOC Value</Label>
          <Input
            id="ioc_value"
            value={config.ioc_value || ""}
            onChange={(e) => updateConfig('ioc_value', e.target.value)}
            placeholder="IP address, domain name, file hash"
          />
          <p className="text-xs text-gray-600 mt-1">The value of the IOC to lookup (e.g., IP address, domain name, file hash)</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_virustotal_lookup"
              checked={config.enable_virustotal_lookup ?? false}
              onCheckedChange={(checked) => updateConfig('enable_virustotal_lookup', !!checked)}
            />
            <Label htmlFor="enable_virustotal_lookup">Enable VirusTotal Lookup</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_abuseipdb_lookup"
              checked={config.enable_abuseipdb_lookup ?? false}
              onCheckedChange={(checked) => updateConfig('enable_abuseipdb_lookup', !!checked)}
            />
            <Label htmlFor="enable_abuseipdb_lookup">Enable AbuseIPDB Lookup</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};