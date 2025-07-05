
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { scansAPI } from "@/services/api";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Activity,
  Code
} from "lucide-react";
import { ScanOverview } from "./ScanOverview";
import { ScanProgress } from "./ScanProgress";

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
          <ScanOverview scan={scan} />
          <ScanProgress progressUpdates={scan.progress_updates} />

          {/* Raw Results JSON */}
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
