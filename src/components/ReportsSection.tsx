
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";

export const ReportsSection = () => {
  const reports = [
    { id: 1, name: "Weekly Security Assessment", date: "2024-01-15", type: "Executive Summary", status: "Ready" },
    { id: 2, name: "Network Vulnerability Report", date: "2024-01-14", type: "Technical Detail", status: "Ready" },
    { id: 3, name: "Compliance Report - SOC 2", date: "2024-01-13", type: "Compliance", status: "Ready" },
    { id: 4, name: "Trend Analysis Q1 2024", date: "2024-01-12", type: "Analytics", status: "Processing" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Ready for download</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Automated generation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend Analysis</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-23%</div>
            <p className="text-xs text-muted-foreground">Critical findings vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <Button>Generate New Report</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">{report.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{report.type}</Badge>
                      <span className="text-sm text-muted-foreground">{report.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={report.status === "Ready" ? "bg-green-500" : "bg-yellow-500"}>
                    {report.status}
                  </Badge>
                  {report.status === "Ready" && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
