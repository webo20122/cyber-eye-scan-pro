
import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scansAPI, assetsAPI } from "@/services/api";
import { InitiateScanDialog } from "./InitiateScanDialog";
import { ScanDetailsDialog } from "./ScanDetailsDialog";
import { ScanCard } from "./ScanCard";
import { Play, Plus, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const ScanManagement = () => {
  const [selectedScan, setSelectedScan] = useState<string | null>(null);
  const [showInitiateDialog, setShowInitiateDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: scansData, isLoading: scansLoading, error: scansError, refetch: refetchScans } = useQuery({
    queryKey: ['scans'],
    queryFn: async () => {
      try {
        return await scansAPI.list();
      } catch (error) {
        console.error('Failed to fetch scans:', error);
        throw error;
      }
    },
    refetchInterval: (query) => {
      if (query.state.error) return false;
      const hasRunningScans = query.state.data?.data?.some((scan: any) => scan.status === 'running');
      return hasRunningScans ? 15000 : false;
    },
    staleTime: 10000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const { data: assetsData, error: assetsError, refetch: refetchAssets } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      try {
        return await assetsAPI.list();
      } catch (error) {
        console.error('Failed to fetch assets:', error);
        throw error;
      }
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
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

  const scans = useMemo(() => scansData?.data || [], [scansData]);
  const assets = useMemo(() => assetsData?.data || [], [assetsData]);

  const handleNewScanClick = useCallback(() => {
    setShowInitiateDialog(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setShowInitiateDialog(false);
  }, []);

  const handleScanSuccess = useCallback(() => {
    setShowInitiateDialog(false);
    queryClient.invalidateQueries({ queryKey: ['scans'] });
  }, [queryClient]);

  const handleViewDetails = useCallback((scanId: string) => {
    setSelectedScan(scanId);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedScan(null);
  }, []);

  const handleCancelScan = useCallback((scanId: string) => {
    cancelScanMutation.mutate(scanId);
  }, [cancelScanMutation]);

  const handleRetry = useCallback(() => {
    refetchScans();
    refetchAssets();
  }, [refetchScans, refetchAssets]);

  if (scansError || assetsError) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 text-lg font-medium">Failed to load scan data</p>
          <p className="text-red-600 mt-2 mb-4">
            {scansError?.message || assetsError?.message || "Please check your connection and try again"}
          </p>
          <Button onClick={handleRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (scansLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
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
            <Button 
              onClick={handleNewScanClick} 
              className="bg-blue-600 hover:bg-blue-700"
              type="button"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Scan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scans.length === 0 ? (
              <div className="text-center py-12">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No scans found</p>
                <p className="text-gray-400">Start your first security scan to see results here</p>
              </div>
            ) : (
              scans.map((scan: any) => {
                const asset = assets.find((a: any) => a.asset_id === scan.asset_id);
                return (
                  <ScanCard
                    key={scan.scan_id}
                    scan={scan}
                    asset={asset}
                    onViewDetails={handleViewDetails}
                    onCancel={handleCancelScan}
                    isCancelling={cancelScanMutation.isPending}
                  />
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {showInitiateDialog && (
        <InitiateScanDialog
          open={showInitiateDialog}
          onOpenChange={handleDialogClose}
          assets={assets}
          onSuccess={handleScanSuccess}
        />
      )}

      {selectedScan && (
        <ScanDetailsDialog
          scanId={selectedScan}
          open={!!selectedScan}
          onOpenChange={handleCloseDetails}
        />
      )}
    </div>
  );
};
