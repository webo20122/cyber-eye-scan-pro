
import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { findingsAPI } from "@/services/api";
import { FindingDetailsDialog } from "./FindingDetailsDialog";
import { AlertTriangle, Search, Filter, Eye } from "lucide-react";

export const FindingsManagement = () => {
  const [selectedFinding, setSelectedFinding] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    severity: "",
    search: ""
  });

  const { data: findingsData, isLoading, error } = useQuery({
    queryKey: ['findings', filters],
    queryFn: () => findingsAPI.list(filters),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    retry: 2
  });

  const findings = useMemo(() => findingsData?.data || [], [findingsData]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleViewDetails = useCallback((findingId: string) => {
    setSelectedFinding(findingId);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedFinding(null);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'triaged': return 'bg-yellow-100 text-yellow-800';
      case 'remediated': return 'bg-green-100 text-green-800';
      case 'false_positive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 text-lg font-medium">Failed to load findings</p>
          <p className="text-red-600 mt-2">Please check your connection and try again</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Security Findings
          </CardTitle>
          <CardDescription>Review and manage discovered security vulnerabilities</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search findings..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filters.severity} onValueChange={(value) => handleFilterChange('severity', value)}>
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
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
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
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Findings List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : findings.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No findings found</p>
              <p className="text-gray-400">Run some scans to discover security issues</p>
            </div>
          ) : (
            <div className="space-y-4">
              {findings.map((finding: any) => (
                <div key={finding.finding_id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{finding.finding_name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(finding.severity)}>
                        {finding.severity}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(finding.status)}>
                        {finding.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{finding.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {finding.cvss_score && (
                        <span className="mr-4">CVSS: {finding.cvss_score}</span>
                      )}
                      {finding.cve_id && (
                        <span className="mr-4">CVE: {finding.cve_id}</span>
                      )}
                      <span>Found: {new Date(finding.created_at).toLocaleDateString()}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(finding.finding_id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFinding && (
        <FindingDetailsDialog
          findingId={selectedFinding}
          open={!!selectedFinding}
          onOpenChange={handleCloseDetails}
        />
      )}
    </div>
  );
};
