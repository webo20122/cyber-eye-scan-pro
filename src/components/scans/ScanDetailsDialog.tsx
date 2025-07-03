
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
  Code
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
    refetchInterval: 5000
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

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const diff = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(scan.status)}
            {scan.name}
          </DialogTitle>
          <DialogDescription>
            Detailed information about the security scan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scan Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Status:</span>
                    <Badge className={getStatusColor(scan.status)}>
                      {scan.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Started:</span> {new Date(scan.created_at).toLocaleString()}
                  </div>
                  {scan.completed_at && (
                    <div>
                      <span className="font-medium">Completed:</span> {new Date(scan.completed_at).toLocaleString()}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Duration:</span> {formatDuration(scan.created_at, scan.completed_at)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Progress:</span> {scan.progress}%
                  </div>
                  {scan.status === 'running' && (
                    <Progress value={scan.progress} className="w-full" />
                  )}
                  {scan.celery_task_id && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Task ID:</span> {scan.celery_task_id}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          {scan.status === 'completed' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Bug className="h-8 w-8 text-red-600" />
                    <div>
                      <div className="text-2xl font-bold text-red-700">{scan.total_findings_count}</div>
                      <div className="text-sm text-gray-600">Security Findings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Route className="h-8 w-8 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-purple-700">{scan.total_attack_paths_count}</div>
                      <div className="text-sm text-gray-600">Attack Paths</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Raw Results */}
          {scan.raw_results_json && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Raw Scan Results
                </CardTitle>
                <CardDescription>
                  Complete structured output from the scan modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto max-h-96">
                    {JSON.stringify(scan.raw_results_json, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scan Progress Details */}
          {scan.status === 'running' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-time Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Overall Progress</span>
                    <span className="font-medium">{scan.progress}%</span>
                  </div>
                  <Progress value={scan.progress} className="w-full" />
                  <div className="text-sm text-gray-600">
                    {scan.progress < 100 ? "Scan in progress..." : "Finalizing results..."}
                  </div>
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
                  The scan encountered an error and could not complete successfully. 
                  Please check the scan configuration and try again.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
