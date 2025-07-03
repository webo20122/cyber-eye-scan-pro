
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { findingsAPI } from "@/services/api";
import { FindingDetailsDialog } from "./FindingDetailsDialog";
import { 
  AlertTriangle, 
  Bug, 
  Search, 
  Filter,
  Eye,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

export const FindingsManagement = () => {
  const [selectedFinding, setSelectedFinding] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    severity: "",
    status: "",
    search: ""
  });

  const queryClient = useQueryClient();

  const { data: findingsData, isLoading } = useQuery({
    queryKey: ['findings', filters],
    queryFn: () => findingsAPI.list(filters)
  });

  const updateFindingMutation = useMutation({
    mutationFn: ({ findingId, data }: { findingId: string; data: any }) => 
      findingsAPI.update(findingId, data),
    onSuccess: () => {
      toast.success("Finding updated successfully");
      queryClient.invalidateQueries({ queryKey: ['findings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update finding");
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'triaged': return 'bg-yellow-100 text-yellow-800';
      case 'remediated': return 'bg-green-100 text-green-800';
      case 'false_positive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'remediated': return <CheckCircle2 className="h-4 w-4" />;
      case 'false_positive': return <XCircle className="h-4 w-4" />;
      case 'triaged': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const findings = findingsData?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
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
      {/* Filters and Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filter Findings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search findings..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full"
              />
            </div>
            <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Severities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Informational">Informational</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="triaged">Triaged</SelectItem>
                <SelectItem value="remediated">Remediated</SelectItem>
                <SelectItem value="false_positive">False Positive</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => setFilters({ severity: "", status: "", search: "" })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Findings List */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-red-600" />
            Security Findings ({findings.length})
          </CardTitle>
          <CardDescription>
            Identified vulnerabilities and security issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {findings.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No findings found</p>
                <p className="text-gray-400">Try adjusting your filters or run a new scan</p>
              </div>
            ) : (
              findings.map((finding: any) => (
                <Card key={finding.finding_id} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={getSeverityColor(finding.severity)}>
                            {finding.severity}
                          </Badge>
                          <Badge className={getStatusColor(finding.status)}>
                            {getStatusIcon(finding.status)}
                            {finding.status.replace('_', ' ')}
                          </Badge>
                          {finding.validated_status && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Validated
                            </Badge>
                          )}
                          {finding.cvss_score && (
                            <Badge variant="outline">
                              CVSS: {finding.cvss_score}
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{finding.name}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{finding.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Asset:</span>
                            <span className="ml-1 text-gray-600">{finding.asset_id}</span>
                          </div>
                          {finding.cve_id && (
                            <div>
                              <span className="font-medium text-gray-700">CVE:</span>
                              <span className="ml-1 text-gray-600">{finding.cve_id}</span>
                            </div>
                          )}
                          {finding.owasp_top_10 && (
                            <div>
                              <span className="font-medium text-gray-700">OWASP:</span>
                              <span className="ml-1 text-gray-600">{finding.owasp_top_10}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700">Found:</span>
                            <span className="ml-1 text-gray-600">{new Date(finding.created_at).toLocaleDateString()}</span>
                          </div>
                          {finding.assigned_to && (
                            <div>
                              <span className="font-medium text-gray-700">Assigned:</span>
                              <span className="ml-1 text-gray-600">{finding.assigned_to}</span>
                            </div>
                          )}
                          {finding.due_date && (
                            <div>
                              <span className="font-medium text-gray-700">Due:</span>
                              <span className="ml-1 text-gray-600">{new Date(finding.due_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFinding(finding.finding_id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        
                        <Select
                          value={finding.status}
                          onValueChange={(value) => 
                            updateFindingMutation.mutate({
                              findingId: finding.finding_id,
                              data: { status: value }
                            })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="triaged">Triaged</SelectItem>
                            <SelectItem value="remediated">Remediated</SelectItem>
                            <SelectItem value="false_positive">False Positive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedFinding && (
        <FindingDetailsDialog
          findingId={selectedFinding}
          open={!!selectedFinding}
          onOpenChange={() => setSelectedFinding(null)}
        />
      )}
    </div>
  );
};
