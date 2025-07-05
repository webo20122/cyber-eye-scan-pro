
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, Timer, Target, Bug, Route } from "lucide-react";

interface ScanOverviewProps {
  scan: any;
}

export const ScanOverview = ({ scan }: ScanOverviewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Scan Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-medium">Status:</span>
              <Badge className={getStatusColor(scan.status)}>
                {scan.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Created:</span> 
              <span className="text-sm">{formatDateTime(scan.created_at)}</span>
            </div>
            {scan.start_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="font-medium">Started:</span> 
                <span className="text-sm">{formatDateTime(scan.start_time)}</span>
              </div>
            )}
            {scan.end_time && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Completed:</span> 
                <span className="text-sm">{formatDateTime(scan.end_time)}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {scan.duration_seconds !== undefined && (
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Duration:</span> 
                <span className="text-sm">{formatDuration(scan.duration_seconds)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Asset ID:</span> 
              <span className="text-sm font-mono">{scan.asset_id}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700">{scan.total_findings_count}</div>
              <div className="text-sm text-red-600 flex items-center justify-center gap-1">
                <Bug className="h-3 w-3" />
                Security Findings
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{scan.total_attack_paths_count}</div>
              <div className="text-sm text-purple-600 flex items-center justify-center gap-1">
                <Route className="h-3 w-3" />
                Attack Paths
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
