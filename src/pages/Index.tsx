
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "@/components/layout/AppHeader";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { ScanManagement } from "@/components/scans/ScanManagement";
import { FindingsManagement } from "@/components/findings/FindingsManagement";
import { AssetManagement } from "@/components/assets/AssetManagement";
import { ReportsSection } from "@/components/reports/ReportsSection";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { 
  BarChart3,
  Search,
  AlertTriangle,
  Database,
  FileText,
  UserCog
} from "lucide-react";
import { useMemo } from "react";

interface DashboardData {
  total_scans: number;
  scans_by_status: Record<string, number>;
  total_findings: number;
  findings_by_severity: Record<string, number>;
  recent_scans: {
    scan_id: string;
    name: string;
    status: string;
    created_at: string;
    asset_id: string;
  }[];
}

const Index = () => {
  const { user, hasPermission } = useAuth();

  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      try {
        return await dashboardAPI.getSummary();
      } catch (error) {
        console.error('Dashboard API error:', error);
        // Return default data instead of throwing
        return {
          data: {
            total_scans: 0,
            scans_by_status: {},
            total_findings: 0,
            findings_by_severity: {},
            recent_scans: []
          }
        };
      }
    },
    enabled: !!user && hasPermission?.('dashboard:view'),
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const stats: DashboardData = useMemo(() => {
    if (dashboardData?.data) {
      return {
        total_scans: dashboardData.data.total_scans || 0,
        scans_by_status: dashboardData.data.scans_by_status || {},
        total_findings: dashboardData.data.total_findings || 0,
        findings_by_severity: dashboardData.data.findings_by_severity || {},
        recent_scans: (dashboardData.data.recent_scans || []).map((scan: any) => ({
          scan_id: scan.scan_id,
          name: scan.scan_name || scan.name,
          status: scan.status,
          created_at: scan.created_at,
          asset_id: scan.asset_id
        }))
      };
    }
    return {
      total_scans: 0,
      scans_by_status: {},
      total_findings: 0,
      findings_by_severity: {},
      recent_scans: []
    };
  }, [dashboardData]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Welcome back, {user.username}!
          </h2>
          <p className="text-gray-600 text-lg">
            Comprehensive cybersecurity platform for vulnerability management and penetration testing.
          </p>
        </div>

        {/* Only show metrics if no dashboard error */}
        {!dashboardError && <MetricsOverview stats={stats} />}

        {/* Main Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="scans" className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              <Search className="h-4 w-4" />
              Scans
            </TabsTrigger>
            <TabsTrigger value="findings" className="flex items-center gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Findings
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <Database className="h-4 w-4" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
              <UserCog className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview data={stats} isLoading={dashboardLoading} />
          </TabsContent>

          <TabsContent value="scans" className="space-y-6">
            <ScanManagement />
          </TabsContent>

          <TabsContent value="findings" className="space-y-6">
            <FindingsManagement />
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <AssetManagement />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsSection />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
