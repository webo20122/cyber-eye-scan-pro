
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { findingsAPI } from "@/services/api";
import { toast } from "sonner";

interface FindingCommentsProps {
  findingId: string;
  comments: any[];
}

export const FindingComments = ({ findingId, comments }: FindingCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

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

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    addCommentMutation.mutate(newComment);
  };

  return (
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
  );
};
