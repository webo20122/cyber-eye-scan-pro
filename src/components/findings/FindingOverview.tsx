
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Code, CheckCircle, ExternalLink } from "lucide-react";

interface FindingOverviewProps {
  finding: any;
}

export const FindingOverview = ({ finding }: FindingOverviewProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={getSeverityColor(finding.severity)}>
              {finding.severity}
            </Badge>
            {finding.validated_status && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Validated
              </Badge>
            )}
            {finding.cvss_score && (
              <Badge variant="outline">
                CVSS: {finding.cvss_score}
              </Badge>
            )}
            {finding.cve_id && (
              <Badge variant="outline">
                <ExternalLink className="h-3 w-3 mr-1" />
                {finding.cve_id}
              </Badge>
            )}
            {finding.owasp_top_10 && (
              <Badge variant="outline">
                OWASP: {finding.owasp_top_10}
              </Badge>
            )}
          </div>
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{finding.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Remediation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{finding.recommendation}</p>
        </CardContent>
      </Card>

      {/* Proof of Concept */}
      {finding.poc_details && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-600" />
              Proof of Concept
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-auto whitespace-pre-wrap">
                {finding.poc_details}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raw Finding Details */}
      {finding.raw_finding_details && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Technical Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-auto max-h-64">
                {JSON.stringify(finding.raw_finding_details, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
