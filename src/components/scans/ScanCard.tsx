
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2,
  CheckCircle, 
  XCircle, 
  Square, 
  Clock,
  Eye
} from "lucide-react";

interface ScanCardProps {
  scan: any;
  asset?: any;
  onViewDetails: (scanId: string) => void;
  onCancel: (scanId: string) => void;
  isCancelling: boolean;
}

export const ScanCard = ({ scan, asset, onViewDetails, onCancel, isCancelling }: ScanCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(scan.status)}
              <h3 className="font-semibold text-lg">{scan.scan_name}</h3>
              <Badge className={getStatusColor(scan.status)}>
                {scan.status}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Target:</span> {asset?.asset_name || 'Unknown Asset'}
              </div>
              <div>
                <span className="font-medium">Started:</span> {new Date(scan.created_at).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Progress:</span> {scan.progress || 0}%
              </div>
            </div>
            {scan.status === 'running' && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${scan.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            )}
            {scan.status === 'completed' && (
              <div className="mt-3 flex gap-4 text-sm">
                <span className="text-red-600 font-medium">
                  {scan.total_findings_count} Findings
                </span>
                <span className="text-purple-600 font-medium">
                  {scan.total_attack_paths_count} Attack Paths
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(scan.scan_id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
            {scan.status === 'running' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(scan.scan_id)}
                disabled={isCancelling}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Square className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
