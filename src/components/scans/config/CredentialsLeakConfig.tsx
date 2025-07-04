
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Key } from "lucide-react";

interface CredentialsLeakConfigProps {
  credentialsParams: {
    check_common_passwords: boolean;
    check_leaked_databases: boolean;
    custom_wordlist: string;
  };
  setCredentialsParams: (params: any) => void;
}

export const CredentialsLeakConfig = ({ credentialsParams, setCredentialsParams }: CredentialsLeakConfigProps) => {
  return (
    <div>
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Key className="h-4 w-4" />
        Credentials Leak Check Parameters
      </h4>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="commonPasswords"
            checked={credentialsParams.check_common_passwords}
            onCheckedChange={(checked) =>
              setCredentialsParams(prev => ({ ...prev, check_common_passwords: !!checked }))
            }
          />
          <Label htmlFor="commonPasswords">Check Common Passwords</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="leakedDatabases"
            checked={credentialsParams.check_leaked_databases}
            onCheckedChange={(checked) =>
              setCredentialsParams(prev => ({ ...prev, check_leaked_databases: !!checked }))
            }
          />
          <Label htmlFor="leakedDatabases">Check Leaked Databases</Label>
        </div>
        <div>
          <Label htmlFor="customWordlist">Custom Wordlist</Label>
          <Textarea
            id="customWordlist"
            value={credentialsParams.custom_wordlist}
            onChange={(e) => setCredentialsParams(prev => ({ ...prev, custom_wordlist: e.target.value }))}
            placeholder="Enter custom passwords/usernames (one per line)"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
