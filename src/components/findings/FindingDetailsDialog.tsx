
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { findingsAPI } from "@/services/api";
import { AlertTriangle } from "lucide-react";
import { FindingOverview } from "./FindingOverview";
import { FindingInfo } from "./FindingInfo";
import { FindingComments } from "./FindingComments";

interface FindingDetailsDialogProps {
  findingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FindingDetailsDialog = ({ findingId, open, onOpenChange }: FindingDetailsDialogProps) => {
  const { data: findingData, isLoading } = useQuery({
    queryKey: ['finding', findingId],
    queryFn: () => findingsAPI.get(findingId),
    enabled: open && !!findingId
  });

  const { data: commentsData } = useQuery({
    queryKey: ['finding-comments', findingId],
    queryFn: () => findingsAPI.getComments(findingId),
    enabled: open && !!findingId
  });

  if (isLoading || !findingData?.data) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const finding = findingData.data;
  const comments = commentsData?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            {finding.finding_name}
          </DialogTitle>
          <DialogDescription>
            Detailed vulnerability information and remediation guidance
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FindingOverview finding={finding} />
          </div>

          <div className="space-y-6">
            <FindingInfo finding={finding} />
            <FindingComments findingId={findingId} comments={comments} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
