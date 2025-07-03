
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { scansAPI } from "@/services/api";
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  Route, 
  Clock,
  CheckCircle,
  Target
} from "lucide-react";
import { toast } from "sonner";

interface ReportDetailsDialogProps {
  scanId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportDetailsDialog = ({ scanId, open, onOpenChange }: ReportDetailsDialogProps) => {
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['report', scanId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/reports/${scanId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch report');
      return response.json();
    },
    enabled: open && !!scanId
  });

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/v1/reports/${scanId}/download_pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security_report_${scanId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Report downloaded successfully");
      } else {
        throw new Error("Failed to download report");
      }
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  if (isLoading || !reportData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const report = reportData;
  const findings = report.findings || [];
  const attackPaths = report.attack_paths || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const groupedFindings = findings.reduce((acc: any, finding: any) => {
    const severity = finding.severity;
    if (!acc[severity]) acc[severity] = [];
    acc[severity].push(finding);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Security Assessment Report
          </DialogTitle>
          <DialogDescription>
            Comprehensive security analysis and findings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Executive Summary</CardTitle>
                  <CardDescription>
                    Report generated on {new Date().toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-700">{findings.length}</div>
                  <div className="text-sm text-red-600">Total Findings</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Route className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700">{attackPaths.length}</div>
                  <div className="text-sm text-purple-600">Attack Paths</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">1</div>
                  <div className="text-sm text-blue-600">Assets Scanned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Findings by Severity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Security Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['Critical', 'High', 'Medium', 'Low', 'Informational'].map(severity => {
                  const severityFindings = groupedFindings[severity] || [];
                  if (severityFindings.length === 0) return null;

                  return (
                    <div key={severity}>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={getSeverityColor(severity)}>
                          {severity} ({severityFindings.length})
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {severityFindings.map((finding: any, index: number) => (
                          <Card key={index} className="border-l-4 border-l-red-500">
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <h4 className="font-semibold">{finding.name}</h4>
                                <p className="text-sm text-gray-600">{finding.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  {finding.cvss_score && (
                                    <span>CVSS: {finding.cvss_score}</span>
                                  )}
                                  {finding.cve_id && (
                                    <span>CVE: {finding.cve_id}</span>
                                  )}
                                  {finding.owasp_top_10 && (
                                    <span>OWASP: {finding.owasp_top_10}</span>
                                  )}
                                </div>
                                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                  <h5 className="font-medium text-green-800 mb-1">Recommendation:</h5>
                                  <p className="text-sm text-green-700">{finding.recommendation}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Attack Paths */}
          {attackPaths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-purple-600" />
                  Attack Paths ({attackPaths.length})
                </CardTitle>
                <CardDescription>
                  Identified attack vectors and exploitation chains
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attackPaths.map((path: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-purple-600 border-purple-600">
                              Attack Path {index + 1}
                            </Badge>
                            <Badge className={getSeverityColor(path.severity || 'Medium')}>
                              {path.severity || 'Medium'}
                            </Badge>
                          </div>
                          <h4 className="font-semibold">{path.name || `Attack Path ${index + 1}`}</h4>
                          <p className="text-sm text-gray-600">{path.description}</p>
                          {path.steps && path.steps.length > 0 && (
                            <div className="mt-3">
                              <h5 className="font-medium mb-2">Attack Steps:</h5>
                              <ol className="list-decimal list-inside space-y-1 text-sm">
                                {path.steps.map((step: any, stepIndex: number) => (
                                  <li key={stepIndex} className="text-gray-700">
                                    {step.description || step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Issues Found */}
          {findings.length === 0 && attackPaths.length === 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">No Security Issues Found</h3>
                <p className="text-green-700">
                  The security scan completed successfully without identifying any vulnerabilities or attack paths.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
