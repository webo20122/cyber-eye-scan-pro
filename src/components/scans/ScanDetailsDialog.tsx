
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { scansAPI } from "@/services/api";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Activity,
  Target,
  Bug,
  Route,
  Code,
  Timer,
  Calendar
} from "lucide-react";

interface ScanDetailsDialogProps {
  scanId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScanDetailsDialog = ({ scanId, open, onOpenChange }: ScanDetailsDialogProps) => {
  const { data: scanData, isLoading } = useQuery({
    queryKey: ['scan', scanId],
    queryFn: () => scansAPI.get(scanId),
    enabled: open && !!scanId,
    refetchInterval: (query) => query.state.data?.data?.status === 'running' ? 5000 : false
  });

  if (isLoading || !scanData?.data) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const scan = scanData.data;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(scan.status)}
            {scan.scan_name}
          </DialogTitle>
          <DialogDescription>
            Comprehensive security scan details and progress information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scan Overview */}
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

          {/* Progress Updates - Real-time for running scans */}
          {scan.progress_updates && scan.progress_updates.length > 0 && (
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
                  {scan.progress_updates.map((update: any, index: number) => (
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
          )}

          {/* Raw Results JSON - Structured scan output */}
          {scan.raw_results_json && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Raw Scan Results
                </CardTitle>
                <CardDescription>
                  Complete structured output from all scan modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
                  <pre className="text-sm whitespace-pre-wrap max-h-96 overflow-auto">
                    {JSON.stringify(scan.raw_results_json, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Information */}
          {scan.status === 'failed' && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Scan Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">
                  The comprehensive security scan encountered an error and could not complete successfully. 
                  Please review the scan configuration and target accessibility, then try again.
                </p>
                {scan.raw_results_json?.error && (
                  <div className="mt-3 p-3 bg-red-100 rounded-lg">
                    <pre className="text-sm text-red-800 whitespace-pre-wrap">
                      {JSON.stringify(scan.raw_results_json.error, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
