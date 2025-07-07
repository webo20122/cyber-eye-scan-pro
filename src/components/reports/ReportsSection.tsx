
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { scansAPI, reportsAPI } from "@/services/api";
import { ReportDetailsDialog } from "./ReportDetailsDialog";
import { 
  FileText, 
  Download, 
  Eye, 
  Search,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

export const ReportsSection = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: scansData, isLoading } = useQuery({
    queryKey: ['scans'],
    queryFn: () => scansAPI.list(),
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  const handleDownloadReport = async (scanId: string, scanName: string) => {
    try {
      const response = await reportsAPI.downloadPDF(scanId);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${scanName}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report");
    }
  };

  const scans = scansData?.data || [];
  const completedScans = scans.filter((scan: any) => scan.status === 'completed');
  const filteredScans = completedScans.filter((scan: any) =>
    scan.scan_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reports Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-700">{completedScans.length}</div>
                <div className="text-sm text-blue-600">Available Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-700">
                  {completedScans.reduce((sum: number, scan: any) => sum + (scan.total_findings_count || 0), 0)}
                </div>
                <div className="text-sm text-green-600">Total Findings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-700">
                  {completedScans.filter((scan: any) => (scan.total_findings_count || 0) > 0).length}
                </div>
                <div className="text-sm text-red-600">Scans with Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-700">
                  {completedScans.reduce((sum: number, scan: any) => sum + (scan.total_attack_paths_count || 0), 0)}
                </div>
                <div className="text-sm text-purple-600">Attack Paths</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Security Reports
              </CardTitle>
              <CardDescription>Download and view detailed security assessment reports</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-gray-600">
                {filteredScans.length} of {completedScans.length} reports
              </div>
            </div>

            {/* Reports Grid */}
            {filteredScans.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm ? "No reports found matching your search" : "No reports available"}
                </p>
                <p className="text-gray-400">
                  {searchTerm ? "Try adjusting your search terms" : "Complete some scans to generate reports"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScans.map((scan: any) => (
                  <Card key={scan.scan_id} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{scan.scan_name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>Completed: {new Date(scan.end_time || scan.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-lg font-bold text-red-700">{scan.total_findings_count || 0}</div>
                            <div className="text-red-600">Findings</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-700">{scan.total_attack_paths_count || 0}</div>
                            <div className="text-purple-600">Attack Paths</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReport(scan.scan_id)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReport(scan.scan_id, scan.scan_name)}
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedReport && (
        <ReportDetailsDialog
          scanId={selectedReport}
          open={!!selectedReport}
          onOpenChange={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};
