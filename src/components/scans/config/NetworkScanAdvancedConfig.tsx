
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Wifi } from "lucide-react";

interface NetworkScanAdvancedConfigProps {
  networkParams: {
    nmap_args?: string;
    ports?: string;
    enable_os_detection?: boolean;
    enable_service_version_detection?: boolean;
    enable_script_scanning?: boolean;
    enable_cve_lookup?: boolean;
  };
  setNetworkParams: (params: any) => void;
}

export const NetworkScanAdvancedConfig = ({ networkParams, setNetworkParams }: NetworkScanAdvancedConfigProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Wifi className="h-4 w-4 text-blue-600" />
        Network Scan Configuration
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nmapArgs">Nmap Arguments</Label>
          <Input
            id="nmapArgs"
            value={networkParams.nmap_args || ""}
            onChange={(e) => setNetworkParams({ ...networkParams, nmap_args: e.target.value })}
            placeholder="-sS -sV -A"
          />
        </div>
        <div>
          <Label htmlFor="ports">Target Ports</Label>
          <Input
            id="ports"
            value={networkParams.ports || ""}
            onChange={(e) => setNetworkParams({ ...networkParams, ports: e.target.value })}
            placeholder="22,80,443,8080,8443"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="osDetection"
            checked={networkParams.enable_os_detection || false}
            onCheckedChange={(checked) =>
              setNetworkParams({ ...networkParams, enable_os_detection: !!checked })
            }
          />
          <Label htmlFor="osDetection">Enable OS Detection</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="serviceVersion"
            checked={networkParams.enable_service_version_detection || false}
            onCheckedChange={(checked) =>
              setNetworkParams({ ...networkParams, enable_service_version_detection: !!checked })
            }
          />
          <Label htmlFor="serviceVersion">Enable Service Version Detection</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="scriptScanning"
            checked={networkParams.enable_script_scanning || false}
            onCheckedChange={(checked) =>
              setNetworkParams({ ...networkParams, enable_script_scanning: !!checked })
            }
          />
          <Label htmlFor="scriptScanning">Enable Script Scanning</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="cveLookup"
            checked={networkParams.enable_cve_lookup || false}
            onCheckedChange={(checked) =>
              setNetworkParams({ ...networkParams, enable_cve_lookup: !!checked })
            }
          />
          <Label htmlFor="cveLookup">Enable CVE Lookup</Label>
        </div>
      </div>
    </div>
  );
};
