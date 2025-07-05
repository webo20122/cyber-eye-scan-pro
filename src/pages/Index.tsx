
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { dashboardAPI, scansAPI, findingsAPI, assetsAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { ScanManagement } from "@/components/scans/ScanManagement";
import { FindingsManagement } from "@/components/findings/FindingsManagement";
import { AssetManagement } from "@/components/assets/AssetManagement";
import { ReportsSection } from "@/components/reports/ReportsSection";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { 
  Shield, 
  LogOut, 
  Settings, 
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Target,
  FileText,
  BarChart3,
  Search,
  Database,
  UserCog
} from "lucide-react";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getSummary(),
    enabled: !!user && hasPermission('dashboard:view')
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  const stats: DashboardData = dashboardData?.data ? {
    total_scans: dashboardData.data.total_scans,
    scans_by_status: dashboardData.data.scans_by_status,
    total_findings: dashboardData.data.total_findings,
    findings_by_severity: dashboardData.data.findings_by_severity,
    recent_scans: dashboardData.data.recent_scans.map((scan: any) => ({
      scan_id: scan.scan_id,
      name: scan.scan_name,
      status: scan.status,
      created_at: scan.created_at,
      asset_id: scan.asset_id
    }))
  } : {
    total_scans: 0,
    scans_by_status: {},
    total_findings: 0,
    findings_by_severity: {},
    recent_scans: []
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                  CyberScan
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">System Healthy</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 font-medium">{user.username}</span>
                <Badge variant={user.roles?.includes("admin") ? "default" : "secondary"} className="capitalize">
                  {user.roles?.[0] || "User"}
                </Badge>
              </div>
              {hasPermission('config:manage') && (
                <Button variant="outline" onClick={() => navigate("/admin")} className="border-blue-200 hover:bg-blue-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout} className="border-red-200 hover:bg-red-50 hover:text-red-700">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

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

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Total Scans</CardTitle>
              <Search className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{stats.total_scans}</div>
              <p className="text-xs text-blue-600 font-medium">Security assessments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-900">Critical Findings</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">{stats.findings_by_severity?.Critical || 0}</div>
              <p className="text-xs text-red-600 font-medium">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Total Findings</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{stats.total_findings}</div>
              <p className="text-xs text-green-600 font-medium">Identified vulnerabilities</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Running Scans</CardTitle>
              <Activity className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{stats.scans_by_status?.running || 0}</div>
              <p className="text-xs text-purple-600 font-medium">Currently active</p>
            </CardContent>
          </Card>
        </div>

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
