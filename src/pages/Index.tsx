
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanTypeCard } from "@/components/ScanTypeCard";
import { FindingsTable } from "@/components/FindingsTable";
import { AssetManagement } from "@/components/AssetManagement";
import { ReportsSection } from "@/components/ReportsSection";
import { 
  Shield, 
  Wifi, 
  Globe, 
  Code, 
  LogOut, 
  Settings, 
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  FileText,
  Calendar,
  TrendingDown,
  TrendingUp,
  Database,
  Search,
  BarChart3,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [systemStatus, setSystemStatus] = useState("Healthy");

  const scanTypes = [
    {
      name: "Network Scan",
      icon: Wifi,
      description: "Discover devices and services on your network",
      color: "bg-blue-500"
    },
    {
      name: "Web Application Scan",
      icon: Globe,
      description: "Identify web vulnerabilities and security issues",
      color: "bg-green-500"
    },
    {
      name: "API Security Scan",
      icon: Code,
      description: "Test REST APIs for security vulnerabilities",
      color: "bg-purple-500"
    }
  ];

  const mockFindings = [
    {
      id: 1,
      severity: "Critical",
      title: "SQL Injection in Login Form",
      target: "https://example.com/login",
      status: "New",
      validated: true
    },
    {
      id: 2,
      severity: "High",
      title: "Cross-Site Scripting (XSS)",
      target: "https://example.com/search",
      status: "In Progress",
      validated: true
    },
    {
      id: 3,
      severity: "Medium",
      title: "Weak SSL/TLS Configuration",
      target: "https://api.example.com",
      status: "New",
      validated: false
    }
  ];

  const dashboardStats = {
    activeScans: 2,
    criticalFindings: 3,
    validatedFindings: 12,
    assetsMonitored: 24,
    availableReports: 12,
    scheduledReports: 5,
    trendAnalysis: -23
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;

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
                  CyberScan Pro
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">System {systemStatus}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                  {user.role}
                </Badge>
              </div>
              {user.role === "admin" && (
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
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600 text-lg">
            Monitor your security posture and manage vulnerability scans from your comprehensive dashboard.
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Active Scans</CardTitle>
              <Clock className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{dashboardStats.activeScans}</div>
              <p className="text-xs text-blue-600 font-medium">Currently running</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-900">Critical Findings</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">{dashboardStats.criticalFindings}</div>
              <p className="text-xs text-red-600 font-medium">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Validated Findings</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{dashboardStats.validatedFindings}</div>
              <p className="text-xs text-green-600 font-medium">AI-validated vulnerabilities</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Assets Monitored</CardTitle>
              <Target className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{dashboardStats.assetsMonitored}</div>
              <p className="text-xs text-purple-600 font-medium">Total targets</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
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
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Reports Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.availableReports}</div>
                  <p className="text-xs text-muted-foreground">Ready for download</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.scheduledReports}</div>
                  <p className="text-xs text-muted-foreground">Automated generation</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Trend Analysis</CardTitle>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{dashboardStats.trendAnalysis}%</div>
                  <p className="text-xs text-muted-foreground">Critical findings vs last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common security tasks and utilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                    <Shield className="h-6 w-6 mb-2 text-blue-600" />
                    Security Reports
                  </Button>
                  <Button variant="outline" className="h-20 flex-col border-purple-200 hover:bg-purple-50 hover:border-purple-300">
                    <Settings className="h-6 w-6 mb-2 text-purple-600" />
                    Scan Configuration
                  </Button>
                  <Button variant="outline" className="h-20 flex-col border-green-200 hover:bg-green-50 hover:border-green-300">
                    <Activity className="h-6 w-6 mb-2 text-green-600" />
                    View Scan History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scans Tab */}
          <TabsContent value="scans" className="space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Available Scan Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {scanTypes.map((scanType, index) => (
                  <ScanTypeCard key={index} scanType={scanType} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Findings Tab */}
          <TabsContent value="findings" className="space-y-6">
            <FindingsTable findings={mockFindings} />
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            <AssetManagement />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <ReportsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
