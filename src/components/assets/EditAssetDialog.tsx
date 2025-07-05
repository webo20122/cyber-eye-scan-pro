import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { assetsAPI } from "@/services/api";
import { toast } from "sonner";
import { Edit, Server } from "lucide-react";

interface EditAssetDialogProps {
  assetId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditAssetDialog = ({ assetId, open, onOpenChange, onSuccess }: EditAssetDialogProps) => {
  const [formData, setFormData] = useState({
    asset_name: "",
    asset_type: "",
    target_value: "",
    description: "",
    tags: ""
  });

  const { data: assetData, isLoading } = useQuery({
    queryKey: ['asset', assetId],
    queryFn: () => assetsAPI.get(assetId),
    enabled: open && !!assetId
  });

  const updateAssetMutation = useMutation({
    mutationFn: (data: any) => assetsAPI.update(assetId, data),
    onSuccess: () => {
      toast.success("Asset updated successfully");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update asset");
    }
  });

  useEffect(() => {
    if (assetData?.data) {
      const asset = assetData.data;
      setFormData({
        asset_name: asset.asset_name || "",
        asset_type: asset.asset_type || "",
        target_value: asset.target_value || "",
        description: asset.description || "",
        tags: asset.tags ? asset.tags.join(', ') : ""
      });
    }
  }, [assetData]);

  const handleSubmit = () => {
    if (!formData.asset_name || !formData.asset_type || !formData.target_value) {
      toast.error("Please fill in all required fields");
      return;
    }

    const assetDataToUpdate = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
    };

    updateAssetMutation.mutate(assetDataToUpdate);
  };

  const assetTypes = [
    { value: 'IP', label: 'IP Address', placeholder: '192.168.1.1' },
    { value: 'Domain', label: 'Domain', placeholder: 'example.com' },
    { value: 'WebApp', label: 'Web Application', placeholder: 'https://app.example.com' },
    { value: 'CodeRepo', label: 'Code Repository', placeholder: 'https://github.com/user/repo.git' },
    { value: 'CloudAccount', label: 'Cloud Account', placeholder: 'AWS Account ID or Azure Subscription' },
    { value: 'NetworkSegment', label: 'Network Segment', placeholder: '192.168.1.0/24' }
  ];

  const selectedType = assetTypes.find(type => type.value === formData.asset_type);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Edit Asset
          </DialogTitle>
          <DialogDescription>
            Update asset information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Asset Name *</Label>
            <Input
              id="name"
              value={formData.asset_name}
              onChange={(e) => setFormData(prev => ({ ...prev, asset_name: e.target.value }))}
              placeholder="Enter a descriptive name"
            />
          </div>

          <div>
            <Label htmlFor="type">Asset Type *</Label>
            <Select value={formData.asset_type} onValueChange={(value) => setFormData(prev => ({ ...prev, asset_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value">Target Value *</Label>
            <Input
              id="value"
              value={formData.target_value}
              onChange={(e) => setFormData(prev => ({ ...prev, target_value: e.target.value }))}
              placeholder={selectedType?.placeholder || "Enter target value"}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description of the asset"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={updateAssetMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updateAssetMutation.isPending ? "Updating..." : "Update Asset"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
