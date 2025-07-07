
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsAPI } from "@/services/api";
import { toast } from "sonner";
import { X } from "lucide-react";

interface CreateAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAssetDialog = ({ open, onOpenChange }: CreateAssetDialogProps) => {
  const [formData, setFormData] = useState({
    asset_name: "",
    asset_type: "IP" as const,
    target_value: "",
    description: "",
    tags: [] as string[],
    is_active: true
  });
  const [currentTag, setCurrentTag] = useState("");
  const queryClient = useQueryClient();

  const createAssetMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        asset_name: data.asset_name,
        asset_type: data.asset_type,
        target_value: data.target_value,
        description: data.description || "",
        tags: data.tags,
        is_active: data.is_active
      };
      console.log('Creating asset with payload:', payload);
      return await assetsAPI.create(payload);
    },
    onSuccess: () => {
      toast.success("Asset created successfully");
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      onOpenChange(false);
      // Reset form
      setFormData({
        asset_name: "",
        asset_type: "IP",
        target_value: "",
        description: "",
        tags: [],
        is_active: true
      });
      setCurrentTag("");
    },
    onError: (error: any) => {
      console.error('Asset creation error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create asset";
      toast.error(errorMessage);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.asset_name || !formData.target_value) {
      toast.error("Asset name and target value are required");
      return;
    }

    createAssetMutation.mutate(formData);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Asset</DialogTitle>
          <DialogDescription>
            Add a new asset to your inventory for scanning and monitoring.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset_name">Asset Name*</Label>
            <Input
              id="asset_name"
              placeholder="e.g., Production Web Server"
              value={formData.asset_name}
              onChange={(e) => setFormData(prev => ({ ...prev, asset_name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset_type">Asset Type*</Label>
            <Select 
              value={formData.asset_type} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, asset_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IP">IP Address</SelectItem>
                <SelectItem value="Domain">Domain</SelectItem>
                <SelectItem value="WebApp">Web Application</SelectItem>
                <SelectItem value="CodeRepo">Code Repository</SelectItem>
                <SelectItem value="CloudAccount">Cloud Account</SelectItem>
                <SelectItem value="NetworkSegment">Network Segment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_value">Target Value*</Label>
            <Input
              id="target_value"
              placeholder="e.g., 192.168.1.100 or example.com"
              value={formData.target_value}
              onChange={(e) => setFormData(prev => ({ ...prev, target_value: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description of the asset"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAssetMutation.isPending}>
              {createAssetMutation.isPending ? "Creating..." : "Create Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
