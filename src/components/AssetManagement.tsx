
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Globe, Code, Database, Target } from "lucide-react";

export const AssetManagement = () => {
  const [assets] = useState([
    { id: 1, name: "example.com", type: "Domain", lastScan: "2 hours ago", findings: 5 },
    { id: 2, name: "192.168.1.0/24", type: "Network", lastScan: "1 day ago", findings: 12 },
    { id: 3, name: "app.example.com", type: "Web App", lastScan: "3 hours ago", findings: 8 },
    { id: 4, name: "api-service", type: "Code Repo", lastScan: "5 hours ago", findings: 3 },
    { id: 5, name: "db.internal.com", type: "Database", lastScan: "1 day ago", findings: 2 },
  ]);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "Domain": return Globe;
      case "Network": return Target;
      case "Web App": return Globe;
      case "Code Repo": return Code;
      case "Database": return Database;
      default: return Target;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Domain": return "bg-blue-500";
      case "Network": return "bg-purple-500";
      case "Web App": return "bg-green-500";
      case "Code Repo": return "bg-orange-500";
      case "Database": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Asset Management</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input placeholder="Search assets..." className="flex-1" />
            <Button variant="outline">Filter</Button>
          </div>
          
          <div className="grid gap-4">
            {assets.map((asset) => {
              const Icon = getAssetIcon(asset.type);
              return (
                <div key={asset.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(asset.type)} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{asset.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{asset.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Last scan: {asset.lastScan}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold">{asset.findings}</div>
                        <div className="text-sm text-muted-foreground">Findings</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Scan Now</Button>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
