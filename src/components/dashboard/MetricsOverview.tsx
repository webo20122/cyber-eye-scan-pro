
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, AlertTriangle, CheckCircle, Activity } from "lucide-react";

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

interface MetricsOverviewProps {
  stats: DashboardData;
}

export const MetricsOverview = ({ stats }: MetricsOverviewProps) => {
  return (
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
  );
};
