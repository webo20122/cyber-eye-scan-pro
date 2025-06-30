
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Activity, AlertTriangle, CheckCircle, Clock, Target, Zap, Globe, Code, Database, Mail } from "lucide-react";
import { ScanTypeCard } from "@/components/ScanTypeCard";
import { FindingsTable } from "@/components/FindingsTable";
import { AssetManagement } from "@/components/AssetManagement";
import { ReportsSection } from "@/components/ReportsSection";

const Index = () => {
  const [activeScans, setActiveScans] = useState([
    { id: 1, target: "example.com", type: "Web App Scan", progress: 75, status: "running" },
    { id: 2, target: "192.168.1.0/24", type: "Network Scan", progress: 45, status: "running" },
  ]);

  const [recentFindings] = useState([
    { id: 1, severity: "Critical", title: "SQL Injection in Login Form", target: "app.example.com", status: "New", validated: true },
    { id: 2, severity: "High", title: "Unpatched Apache Server", target: "192.168.1.10", status: "In Progress", validated: true },
    { id: 3, severity: "Medium", title: "Missing Security Headers", target: "api.example.com", status: "New", validated: false },
    { id: 4, severity: "Low", title: "Directory Listing Enabled", target: "files.example.com", status: "Resolved", validated: true },
  ]);

  const scanTypes = [
    { name: "Network Scan", icon: Globe, description: "Nmap-based host discovery and port scanning", color: "bg-blue-500" },
    { name: "Web App Scan", icon: Zap, description: "OWASP ZAP automated vulnerability scanning", color: "bg-purple-500" },
    { name: "SAST", icon: Code, description: "Static code analysis with Semgrep", color: "bg-green-500" },
    { name: "Database Scan", icon: Database, description: "Database security assessment", color: "bg-orange-500" },
    { name: "Mail Server", icon: Mail, description: "Email security configuration check", color: "bg-red-500" },
    { name: "LDAP Enum", icon: Target, description: "Active Directory enumeration", color: "bg-indigo-500" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CyberScan</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                System Healthy
              </Badge>
              <Button variant="outline" size="sm">Settings</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeScans.length}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Findings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validated Findings</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-xs text-muted-foreground">AI-validated vulnerabilities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assets Monitored</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Total targets</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="scans">Scans</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Active Scans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Active Scans
                </CardTitle>
                <CardDescription>Currently running security assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeScans.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">{scan.type}</Badge>
                          <span className="font-medium">{scan.target}</span>
                        </div>
                        <Progress value={scan.progress} className="w-full" />
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-sm font-medium">{scan.progress}%</div>
                        <Badge className="mt-1 bg-green-500">Running</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Findings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Findings
                </CardTitle>
                <CardDescription>Latest security vulnerabilities discovered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentFindings.slice(0, 5).map((finding) => (
                    <div key={finding.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={getSeverityColor(finding.severity)}>
                          {finding.severity}
                        </Badge>
                        <div>
                          <div className="font-medium">{finding.title}</div>
                          <div className="text-sm text-muted-foreground">{finding.target}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {finding.validated && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Validated
                          </Badge>
                        )}
                        <Badge variant="outline">{finding.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scanTypes.map((scanType) => (
                <ScanTypeCard key={scanType.name} scanType={scanType} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="findings">
            <FindingsTable findings={recentFindings} />
          </TabsContent>

          <TabsContent value="assets">
            <AssetManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
