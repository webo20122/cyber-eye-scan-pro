
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

interface DatabaseEnumConfigProps {
  config: any;
  onChange: (config: any) => void;
}

export const DatabaseEnumConfig = ({ config, onChange }: DatabaseEnumConfigProps) => {
  const [newPort, setNewPort] = useState("");

  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const addPort = () => {
    if (newPort && !config.common_ports?.includes(newPort)) {
      const ports = [...(config.common_ports || []), newPort];
      updateConfig('common_ports', ports);
      setNewPort("");
    }
  };

  const removePort = (port: string) => {
    const ports = config.common_ports?.filter((p: string) => p !== port) || [];
    updateConfig('common_ports', ports);
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Database Enumeration Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Database Ports</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newPort}
              onChange={(e) => setNewPort(e.target.value)}
              placeholder="Add port (e.g., 3306, 5432)"
              onKeyPress={(e) => e.key === 'Enter' && addPort()}
            />
            <button
              onClick={addPort}
              className="px-3 py-2 bg-green-600 text-white rounded text-sm"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(config.common_ports || ['3306', '5432', '1433', '27017', '6379']).map((port: string) => (
              <Badge key={port} variant="secondary" className="flex items-center gap-1">
                {port}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removePort(port)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="enable_bruteforce"
            checked={config.enable_bruteforce ?? false}
            onCheckedChange={(checked) => updateConfig('enable_bruteforce', !!checked)}
          />
          <Label htmlFor="enable_bruteforce">Enable Brute Force Attack</Label>
        </div>

        {config.enable_bruteforce && (
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <Label htmlFor="username_file_path">Username File Path</Label>
              <Input
                id="username_file_path"
                value={config.username_file_path || ""}
                onChange={(e) => updateConfig('username_file_path', e.target.value)}
                placeholder="/usr/share/wordlists/usernames.txt"
              />
            </div>
            <div>
              <Label htmlFor="password_file_path">Password File Path</Label>
              <Input
                id="password_file_path"
                value={config.password_file_path || ""}
                onChange={(e) => updateConfig('password_file_path', e.target.value)}
                placeholder="/usr/share/wordlists/passwords.txt"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_mssql_enum"
              checked={config.enable_mssql_enum ?? true}
              onCheckedChange={(checked) => updateConfig('enable_mssql_enum', !!checked)}
            />
            <Label htmlFor="enable_mssql_enum">MSSQL Enumeration</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_mysql_enum"
              checked={config.enable_mysql_enum ?? true}
              onCheckedChange={(checked) => updateConfig('enable_mysql_enum', !!checked)}
            />
            <Label htmlFor="enable_mysql_enum">MySQL Enumeration</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_oracle_enum"
              checked={config.enable_oracle_enum ?? false}
              onCheckedChange={(checked) => updateConfig('enable_oracle_enum', !!checked)}
            />
            <Label htmlFor="enable_oracle_enum">Oracle Enumeration</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable_mongodb_enum"
              checked={config.enable_mongodb_enum ?? true}
              onCheckedChange={(checked) => updateConfig('enable_mongodb_enum', !!checked)}
            />
            <Label htmlFor="enable_mongodb_enum">MongoDB Enumeration</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
