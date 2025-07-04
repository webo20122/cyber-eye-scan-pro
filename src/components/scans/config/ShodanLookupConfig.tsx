
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ShodanLookupConfigProps {
  shodanParams: {
    api_key: string;
    search_query: string;
    max_results: string;
  };
  setShodanParams: (params: any) => void;
}

export const ShodanLookupConfig = ({ shodanParams, setShodanParams }: ShodanLookupConfigProps) => {
  return (
    <div>
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Search className="h-4 w-4" />
        Shodan Lookup Parameters
      </h4>
      <div className="space-y-3">
        <div>
          <Label htmlFor="shodanApiKey">Shodan API Key</Label>
          <Input
            id="shodanApiKey"
            type="password"
            value={shodanParams.api_key}
            onChange={(e) => setShodanParams(prev => ({ ...prev, api_key: e.target.value }))}
            placeholder="Enter your Shodan API key"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shodanQuery">Search Query</Label>
            <Input
              id="shodanQuery"
              value={shodanParams.search_query}
              onChange={(e) => setShodanParams(prev => ({ ...prev, search_query: e.target.value }))}
              placeholder="e.g., apache, nginx, port:80"
            />
          </div>
          <div>
            <Label htmlFor="maxResults">Max Results</Label>
            <Input
              id="maxResults"
              type="number"
              value={shodanParams.max_results}
              onChange={(e) => setShodanParams(prev => ({ ...prev, max_results: e.target.value }))}
              placeholder="100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
