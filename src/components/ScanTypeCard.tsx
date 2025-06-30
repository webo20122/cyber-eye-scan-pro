
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ScanType {
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

interface ScanTypeCardProps {
  scanType: ScanType;
}

export const ScanTypeCard = ({ scanType }: ScanTypeCardProps) => {
  const { name, icon: Icon, description, color } = scanType;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color} text-white`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <Badge variant="outline" className="mt-1">2.5 Pro Module</Badge>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Features: Auto-validation, PoC generation, threat correlation
          </div>
          <Button className="w-full">Start Scan</Button>
        </div>
      </CardContent>
    </Card>
  );
};
