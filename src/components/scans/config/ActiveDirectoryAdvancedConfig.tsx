
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";

interface ActiveDirectoryAdvancedConfigProps {
  adParams: {
    ldap_host: string;
    ldap_port?: number;
    ldap_use_tls?: boolean;
    ldap_username?: string;
    ldap_password?: string;
    ldap_base_dn: string;
    enable_user_enum?: boolean;
    enable_group_enum?: boolean;
    enable_computer_enum?: boolean;
    enable_password_policy_check?: boolean;
  };
  setAdParams: (params: any) => void;
}

export const ActiveDirectoryAdvancedConfig = ({ adParams, setAdParams }: ActiveDirectoryAdvancedConfigProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-purple-50">
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Users className="h-4 w-4 text-purple-600" />
        Active Directory Enumeration Configuration
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="ldapHost">LDAP Host *</Label>
          <Input
            id="ldapHost"
            value={adParams.ldap_host || ""}
            onChange={(e) => setAdParams({ ...adParams, ldap_host: e.target.value })}
            placeholder="dc.example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="ldapPort">LDAP Port</Label>
          <Input
            id="ldapPort"
            type="number"
            value={adParams.ldap_port || 636}
            onChange={(e) => setAdParams({ ...adParams, ldap_port: parseInt(e.target.value) || 636 })}
            placeholder="636"
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="ldapTls"
            checked={adParams.ldap_use_tls !== false}
            onCheckedChange={(checked) =>
              setAdParams({ ...adParams, ldap_use_tls: !!checked })
            }
          />
          <Label htmlFor="ldapTls">Use TLS</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="ldapBaseDn">Base DN *</Label>
        <Input
          id="ldapBaseDn"
          value={adParams.ldap_base_dn || ""}
          onChange={(e) => setAdParams({ ...adParams, ldap_base_dn: e.target.value })}
          placeholder="DC=example,DC=com"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ldapUsername">LDAP Username (Optional)</Label>
          <Input
            id="ldapUsername"
            value={adParams.ldap_username || ""}
            onChange={(e) => setAdParams({ ...adParams, ldap_username: e.target.value })}
            placeholder="admin@domain.com"
          />
        </div>
        <div>
          <Label htmlFor="ldapPassword">LDAP Password (Optional)</Label>
          <Input
            id="ldapPassword"
            type="password"
            value={adParams.ldap_password || ""}
            onChange={(e) => setAdParams({ ...adParams, ldap_password: e.target.value })}
            placeholder="password"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="userEnum"
            checked={adParams.enable_user_enum || false}
            onCheckedChange={(checked) =>
              setAdParams({ ...adParams, enable_user_enum: !!checked })
            }
          />
          <Label htmlFor="userEnum">User Enumeration</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="groupEnum"
            checked={adParams.enable_group_enum || false}
            onCheckedChange={(checked) =>
              setAdParams({ ...adParams, enable_group_enum: !!checked })
            }
          />
          <Label htmlFor="groupEnum">Group Enumeration</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="computerEnum"
            checked={adParams.enable_computer_enum || false}
            onCheckedChange={(checked) =>
              setAdParams({ ...adParams, enable_computer_enum: !!checked })
            }
          />
          <Label htmlFor="computerEnum">Computer Enumeration</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="passwordPolicy"
            checked={adParams.enable_password_policy_check || false}
            onCheckedChange={(checked) =>
              setAdParams({ ...adParams, enable_password_policy_check: !!checked })
            }
          />
          <Label htmlFor="passwordPolicy">Password Policy Check</Label>
        </div>
      </div>
    </div>
  );
};
