
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scansAPI, assetsAPI } from "@/services/api";
import { InitiateScanDialog } from "./InitiateScanDialog";
import { ScanDetailsDialog } from "./ScanDetailsDialog";
import { 
  Play, 
  Square, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Eye,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export const ScanManagement = () => {
  const [selectedScan, setSelectedScan] = useState<string | null>(null);
  const [showInitiateDialog, setShowInitiateDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: scansData, isLoading: scansLoading } = useQuery({
    queryKey: ['scans'],
    queryFn: () => scansAPI.list(),
    refetchInterval: 5000 // Refresh every 5 seconds for real-time updates
  });

  const { data: assetsData } = useQuery({
    queryKey: ['assets'],
    queryFn: () => assetsAPI.list()
  });

  const cancelScanMutation = useMutation({
    mutationFn: (scanId: string) => scansAPI.cancel(scanId),
    onSuccess: () => {
      toast.success("Scan cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ['scans'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel scan");
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
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

  const scans = scansData?.data || [];
  const assets = assetsData?.data || [];

  if (scansLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                Scan Management
              </CardTitle>
              <CardDescription>Initiate and monitor security scans</CardDescription>
            </div>
            <Button onClick={() => setShowInitiateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Scan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scans.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No scans found</p>
                <p className="text-gray-400">Start your first security scan to see results here</p>
              </div>
            ) : (
              scans.map((scan: any) => {
                const asset = assets.find((a: any) => a.asset_id === scan.asset_id);
                return (
                  <Card key={scan.scan_id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(scan.status)}
                            <h3 className="font-semibold text-lg">{scan.name}</h3>
                            <Badge className={getStatusColor(scan.status)}>
                              {scan.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Target:</span> {asset?.name || 'Unknown Asset'}
                            </div>
                            <div>
                              <span className="font-medium">Started:</span> {new Date(scan.created_at).toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Progress:</span> {scan.progress}%
                            </div>
                          </div>
                          {scan.status === 'running' && (
                            <div className="mt-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${scan.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          {scan.status === 'completed' && (
                            <div className="mt-3 flex gap-4 text-sm">
                              <span className="text-red-600 font-medium">
                                {scan.total_findings_count} Findings
                              </span>
                              <span className="text-purple-600 font-medium">
                                {scan.total_attack_paths_count} Attack Paths
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedScan(scan.scan_id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          {scan.status === 'running' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelScanMutation.mutate(scan.scan_id)}
                              disabled={cancelScanMutation.isPending}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Square className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <InitiateScanDialog
        open={showInitiateDialog}
        onOpenChange={setShowInitiateDialog}
        assets={assets}
        onSuccess={() => {
          setShowInitiateDialog(false);
          queryClient.invalidateQueries({ queryKey: ['scans'] });
        }}
      />

      {selectedScan && (
        <ScanDetailsDialog
          scanId={selectedScan}
          open={!!selectedScan}
          onOpenChange={() => setSelectedScan(null)}
        />
      )}
    </div>
  );
};
