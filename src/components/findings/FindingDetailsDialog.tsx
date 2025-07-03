
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { findingsAPI } from "@/services/api";
import { 
  AlertTriangle, 
  Code, 
  MessageSquare, 
  Shield, 
  ExternalLink,
  Calendar,
  User,
  CheckCircle,
  Plus
} from "lucide-react";
import { toast } from "sonner";

interface FindingDetailsDialogProps {
  findingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FindingDetailsDialog = ({ findingId, open, onOpenChange }: FindingDetailsDialogProps) => {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

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

  const addCommentMutation = useMutation({
    mutationFn: (comment: string) => findingsAPI.addComment(findingId, comment),
    onSuccess: () => {
      toast.success("Comment added successfully");
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ['finding-comments', findingId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    addCommentMutation.mutate(newComment);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            {finding.name}
          </DialogTitle>
          <DialogDescription>
            Detailed vulnerability information and remediation guidance
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Finding Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Finding Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <div className="mt-1">
                    <Badge className={`${finding.status === 'remediated' ? 'bg-green-100 text-green-800' : 
                      finding.status === 'triaged' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                      {finding.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Found:</span>
                  <div className="text-sm text-gray-600">{new Date(finding.created_at).toLocaleString()}</div>
                </div>
                {finding.assigned_to && (
                  <div>
                    <span className="font-medium text-gray-700">Assigned to:</span>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {finding.assigned_to}
                    </div>
                  </div>
                )}
                {finding.due_date && (
                  <div>
                    <span className="font-medium text-gray-700">Due date:</span>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(finding.due_date).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={addCommentMutation.isPending}
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Comment
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {comments.map((comment: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">{comment.user || 'Anonymous'}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(comment.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-gray-500 text-center text-sm py-4">No comments yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
