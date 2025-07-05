
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface ScanProgressProps {
  progressUpdates: any[];
}

export const ScanProgress = ({ progressUpdates }: ScanProgressProps) => {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!progressUpdates || progressUpdates.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Progress Updates
        </CardTitle>
        <CardDescription>
          Real-time scan progress and module execution status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {progressUpdates.map((update: any, index: number) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-700">{update.message || update}</div>
                {update.timestamp && (
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDateTime(update.timestamp)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
