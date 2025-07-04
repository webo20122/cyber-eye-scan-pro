
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Server } from "lucide-react";

interface SshSecurityConfigProps {
  sshParams: {
    check_weak_ciphers: boolean;
    check_key_exchange: boolean;
    check_authentication: boolean;
    custom_port: string;
  };
  setSshParams: (params: any) => void;
}

export const SshSecurityConfig = ({ sshParams, setSshParams }: SshSecurityConfigProps) => {
  return (
    <div>
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Server className="h-4 w-4" />
        SSH Security Check Parameters
      </h4>
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkWeakCiphers"
              checked={sshParams.check_weak_ciphers}
              onCheckedChange={(checked) =>
                setSshParams(prev => ({ ...prev, check_weak_ciphers: !!checked }))
              }
            />
            <Label htmlFor="checkWeakCiphers">Weak Ciphers</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkKeyExchange"
              checked={sshParams.check_key_exchange}
              onCheckedChange={(checked) =>
                setSshParams(prev => ({ ...prev, check_key_exchange: !!checked }))
              }
            />
            <Label htmlFor="checkKeyExchange">Key Exchange</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkAuthentication"
              checked={sshParams.check_authentication}
              onCheckedChange={(checked) =>
                setSshParams(prev => ({ ...prev, check_authentication: !!checked }))
              }
            />
            <Label htmlFor="checkAuthentication">Authentication</Label>
          </div>
        </div>
        <div>
          <Label htmlFor="sshPort">SSH Port</Label>
          <Input
            id="sshPort"
            value={sshParams.custom_port}
            onChange={(e) => setSshParams(prev => ({ ...prev, custom_port: e.target.value }))}
            placeholder="22"
          />
        </div>
      </div>
    </div>
  );
};
