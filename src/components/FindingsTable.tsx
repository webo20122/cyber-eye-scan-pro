
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, AlertTriangle } from "lucide-react";

interface Finding {
  id: number;
  severity: string;
  title: string;
  target: string;
  status: string;
  validated: boolean;
}

interface FindingsTableProps {
  findings: Finding[];
}

export const FindingsTable = ({ findings }: FindingsTableProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-red-100 text-red-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Security Findings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {findings.map((finding) => (
            <div key={finding.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getSeverityColor(finding.severity)}>
                      {finding.severity}
                    </Badge>
                    {finding.validated && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        AI Validated
                      </Badge>
                    )}
                    <Badge className={getStatusColor(finding.status)}>
                      {finding.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{finding.title}</h3>
                  <p className="text-muted-foreground mb-3">Target: {finding.target}</p>
                  
                  {finding.validated && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                        <CheckCircle className="h-4 w-4" />
                        Vulnerability Confirmed
                      </div>
                      <p className="text-sm text-green-700">
                        Our AI validation engine has confirmed this vulnerability with a non-destructive proof of concept.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Generate PoC
                  </Button>
                  <Button variant="outline" size="sm">
                    Create Ticket
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
