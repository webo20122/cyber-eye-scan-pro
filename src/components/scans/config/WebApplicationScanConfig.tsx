
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe } from "lucide-react";

interface WebApplicationScanConfigProps {
  webParams: {
    enable_zap_scan: boolean;
    zap_address: string;
  };
  setWebParams: (params: any) => void;
}

export const WebApplicationScanConfig = ({ webParams, setWebParams }: WebApplicationScanConfigProps) => {
  return (
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
  );
};
