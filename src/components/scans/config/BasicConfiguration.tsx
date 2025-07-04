
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BasicConfigurationProps {
  scanName: string;
  setScanName: (value: string) => void;
  selectedAsset: string;
  setSelectedAsset: (value: string) => void;
  assets: any[];
}

export const BasicConfiguration = ({
  scanName,
  setScanName,
  selectedAsset,
  setSelectedAsset,
  assets
}: BasicConfigurationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="scanName">Scan Name *</Label>
          <Input
            id="scanName"
            value={scanName}
            onChange={(e) => setScanName(e.target.value)}
            placeholder="Enter scan name"
          />
        </div>
        <div>
          <Label htmlFor="asset">Target Asset *</Label>
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger>
              <SelectValue placeholder="Select target asset" />
            </SelectTrigger>
            <SelectContent>
              {assets.map((asset) => (
                <SelectItem key={asset.asset_id} value={asset.asset_id}>
                  {asset.name} ({asset.type}: {asset.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
