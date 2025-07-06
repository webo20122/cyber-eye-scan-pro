import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ComplianceCheckConfigProps {
  config: any;
  onChange: (config: any) => void;
}

export const ComplianceCheckConfig = ({ config, onChange }: ComplianceCheckConfigProps) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Compliance Check Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="compliance_standard">Compliance Standard</Label>
          <Select value={config.compliance_standard || "iso_27001"} onValueChange={(value) => updateConfig('compliance_standard', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pci_dss">PCI DSS</SelectItem>
              <SelectItem value="iso_27001">ISO 27001</SelectItem>
              <SelectItem value="hipaa">HIPAA</SelectItem>
              <SelectItem value="gdpr">GDPR</SelectItem>
              <SelectItem value="nist_800_53">NIST 800-53</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-600 mt-1">Select the compliance standard to check against</p>
        </div>
      </CardContent>
    </Card>
  );
};