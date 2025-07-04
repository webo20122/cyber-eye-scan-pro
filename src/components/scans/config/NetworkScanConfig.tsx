
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Wifi } from "lucide-react";

interface NetworkScanConfigProps {
  networkParams: {
    nmap_args: string;
    ports: string;
  };
  setNetworkParams: (params: any) => void;
}

export const NetworkScanConfig = ({ networkParams, setNetworkParams }: NetworkScanConfigProps) => {
  return (
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
  );
};
