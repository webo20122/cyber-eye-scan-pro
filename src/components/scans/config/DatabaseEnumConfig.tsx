
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Database } from "lucide-react";

interface DatabaseEnumConfigProps {
  databaseParams: {
    check_mysql: boolean;
    check_postgresql: boolean;
    check_mongodb: boolean;
    check_redis: boolean;
    custom_ports: string;
  };
  setDatabaseParams: (params: any) => void;
}

export const DatabaseEnumConfig = ({ databaseParams, setDatabaseParams }: DatabaseEnumConfigProps) => {
  return (
    <div>
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Database className="h-4 w-4" />
        Database Enumeration Parameters
      </h4>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkMySQL"
              checked={databaseParams.check_mysql}
              onCheckedChange={(checked) =>
                setDatabaseParams(prev => ({ ...prev, check_mysql: !!checked }))
              }
            />
            <Label htmlFor="checkMySQL">MySQL</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkPostgreSQL"
              checked={databaseParams.check_postgresql}
              onCheckedChange={(checked) =>
                setDatabaseParams(prev => ({ ...prev, check_postgresql: !!checked }))
              }
            />
            <Label htmlFor="checkPostgreSQL">PostgreSQL</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkMongoDB"
              checked={databaseParams.check_mongodb}
              onCheckedChange={(checked) =>
                setDatabaseParams(prev => ({ ...prev, check_mongodb: !!checked }))
              }
            />
            <Label htmlFor="checkMongoDB">MongoDB</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkRedis"
              checked={databaseParams.check_redis}
              onCheckedChange={(checked) =>
                setDatabaseParams(prev => ({ ...prev, check_redis: !!checked }))
              }
            />
            <Label htmlFor="checkRedis">Redis</Label>
          </div>
        </div>
        <div>
          <Label htmlFor="customDbPorts">Custom Database Ports</Label>
          <Input
            id="customDbPorts"
            value={databaseParams.custom_ports}
            onChange={(e) => setDatabaseParams(prev => ({ ...prev, custom_ports: e.target.value }))}
            placeholder="3306,5432,27017,6379"
          />
        </div>
      </div>
    </div>
  );
};
