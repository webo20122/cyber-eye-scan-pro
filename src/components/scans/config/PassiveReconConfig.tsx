
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";

interface PassiveReconConfigProps {
  passiveReconParams: {
    check_dns_records: boolean;
    check_subdomains: boolean;
    check_certificates: boolean;
    check_whois: boolean;
  };
  setPassiveReconParams: (params: any) => void;
}

export const PassiveReconConfig = ({ passiveReconParams, setPassiveReconParams }: PassiveReconConfigProps) => {
  return (
    <div>
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Eye className="h-4 w-4" />
        Passive Reconnaissance Parameters
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="checkDNS"
            checked={passiveReconParams.check_dns_records}
            onCheckedChange={(checked) =>
              setPassiveReconParams(prev => ({ ...prev, check_dns_records: !!checked }))
            }
          />
          <Label htmlFor="checkDNS">DNS Records</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="checkSubdomains"
            checked={passiveReconParams.check_subdomains}
            onCheckedChange={(checked) =>
              setPassiveReconParams(prev => ({ ...prev, check_subdomains: !!checked }))
            }
          />
          <Label htmlFor="checkSubdomains">Subdomains</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="checkCertificates"
            checked={passiveReconParams.check_certificates}
            onCheckedChange={(checked) =>
              setPassiveReconParams(prev => ({ ...prev, check_certificates: !!checked }))
            }
          />
          <Label htmlFor="checkCertificates">SSL Certificates</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="checkWhois"
            checked={passiveReconParams.check_whois}
            onCheckedChange={(checked) =>
              setPassiveReconParams(prev => ({ ...prev, check_whois: !!checked }))
            }
          />
          <Label htmlFor="checkWhois">WHOIS Data</Label>
        </div>
      </div>
    </div>
  );
};
