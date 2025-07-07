
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scansAPI, assetsAPI } from "@/services/api";
import { InitiateScanDialog } from "./InitiateScanDialog";
import { ScanDetailsDialog } from "./ScanDetailsDialog";
import { ScanCard } from "./ScanCard";
import { Play, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const ScanManagement = () => {
  const [selectedScan, setSelectedScan] = useState<string | null>(null);
  const [showInitiateDialog, setShowInitiateDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: scansData, isLoading: scansLoading } = useQuery({
    queryKey: ['scans'],
    queryFn: () => scansAPI.list(),
    refetchInterval: 5000,
    staleTime: 1000,
    refetchOnWindowFocus: false
  });

  const { data: assetsData } = useQuery({
    queryKey: ['assets'],
    queryFn: () => assetsAPI.list(),
    staleTime: 30000,
    refetchOnWindowFocus: false
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

  const scans = scansData?.data || [];
  const assets = assetsData?.data || [];

  const handleNewScanClick = () => {
    console.log("Opening scan dialog");
    setShowInitiateDialog(true);
  };

  const handleDialogClose = () => {
    console.log("Closing scan dialog");
    setShowInitiateDialog(false);
  };

  const handleScanSuccess = () => {
    console.log("Scan initiated successfully");
    setShowInitiateDialog(false);
    queryClient.invalidateQueries({ queryKey: ['scans'] });
  };

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
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                    onViewDetails={setSelectedScan}
                    onCancel={cancelScanMutation.mutate}
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
          onOpenChange={() => setSelectedScan(null)}
        />
      )}
    </div>
  );
};
