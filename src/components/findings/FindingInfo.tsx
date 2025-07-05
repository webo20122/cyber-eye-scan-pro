
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";

interface FindingInfoProps {
  finding: any;
}

export const FindingInfo = ({ finding }: FindingInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Finding Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <span className="font-medium text-gray-700">Status:</span>
          <div className="mt-1">
            <Badge className={`${finding.status === 'remediated' ? 'bg-green-100 text-green-800' : 
              finding.status === 'triaged' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-blue-100 text-blue-800'}`}>
              {finding.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <div>
          <span className="font-medium text-gray-700">Found:</span>
          <div className="text-sm text-gray-600">{new Date(finding.created_at).toLocaleString()}</div>
        </div>
        {finding.assigned_to && (
          <div>
            <span className="font-medium text-gray-700">Assigned to:</span>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <User className="h-3 w-3" />
              {finding.assigned_to}
            </div>
          </div>
        )}
        {finding.due_date && (
          <div>
            <span className="font-medium text-gray-700">Due date:</span>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(finding.due_date).toLocaleDateString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
