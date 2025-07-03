
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Shield, 
  Zap, 
  Activity, 
  Calendar,
  AlertTriangle
} from "lucide-react";

interface DashboardData {
  total_scans: number;
  scans_by_status: Record<string, number>;
  total_findings: number;
  findings_by_severity: Record<string, number>;
  recent_scans: Array<{
    scan_id: string;
    name: string;
    status: string;
    created_at: string;
    asset_id: string;
  }>;
}

interface DashboardOverviewProps {
  data: DashboardData;
  isLoading: boolean;
}

export const DashboardOverview = ({ data, isLoading }: DashboardOverviewProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'cancelled': return 'text-gray-600 bg-gray-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Scan Status Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Scan Status Overview
          </CardTitle>
          <CardDescription>Current status of all security scans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(data.scans_by_status).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${getStatusColor(status)}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Findings by Severity */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Findings by Severity
          </CardTitle>
          <CardDescription>Distribution of vulnerabilities by severity level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(data.findings_by_severity).map(([severity, count]) => (
              <Card key={severity} className={`${getSeverityColor(severity)}`}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm font-medium">{severity}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Recent Scans
          </CardTitle>
          <CardDescription>Latest security assessments and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recent_scans.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent scans found</p>
            ) : (
              data.recent_scans.map((scan) => (
                <div key={scan.scan_id} className="flex items-center justify-between p-4 border rounded-lg bg-white/50">
                  <div>
                    <h3 className="font-semibold">{scan.name}</h3>
                    <p className="text-sm text-gray-600">
                      Started: {new Date(scan.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(scan.status)}>
                    {scan.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common security tasks and utilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col border-blue-200 hover:bg-blue-50 hover:border-blue-300">
              <Shield className="h-6 w-6 mb-2 text-blue-600" />
              New Security Scan
            </Button>
            <Button variant="outline" className="h-20 flex-col border-purple-200 hover:bg-purple-50 hover:border-purple-300">
              <Calendar className="h-6 w-6 mb-2 text-purple-600" />
              Schedule Assessment
            </Button>
            <Button variant="outline" className="h-20 flex-col border-green-200 hover:bg-green-50 hover:border-green-300">
              <TrendingUp className="h-6 w-6 mb-2 text-green-600" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
