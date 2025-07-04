
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Code } from "lucide-react";

interface SastScanConfigProps {
  sastParams: {
    code_repo_url: string;
  };
  setSastParams: (params: any) => void;
}

export const SastScanConfig = ({ sastParams, setSastParams }: SastScanConfigProps) => {
  return (
    <div>
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Code className="h-4 w-4" />
        SAST Scan Parameters
      </h4>
      <div>
        <Label htmlFor="repoUrl">Code Repository URL</Label>
        <Input
          id="repoUrl"
          value={sastParams.code_repo_url}
          onChange={(e) => setSastParams(prev => ({ ...prev, code_repo_url: e.target.value }))}
          placeholder="https://github.com/username/repository.git"
        />
      </div>
    </div>
  );
};
