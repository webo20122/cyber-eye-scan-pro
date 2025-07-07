
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { assetsAPI } from "@/services/api";
import { toast } from "sonner";
import { Plus, Server } from "lucide-react";

interface CreateAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateAssetDialog = ({ open, onOpenChange, onSuccess }: CreateAssetDialogProps) => {
  const [formData, setFormData] = useState({
    asset_name: "",
    asset_type: "",
    target_value: "",
    description: "",
    tags: ""
  });

  const createAssetMutation = useMutation({
    mutationFn: (data: any) => assetsAPI.create(data),
    onSuccess: () => {
      toast.success("Asset created successfully");
      onSuccess();
      resetForm();
    },
    onError: (error: any) => {
      console.error("Asset creation error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create asset";
      toast.error(errorMessage);
    }
  });

  const resetForm = () => {
    setFormData({
      asset_name: "",
      asset_type: "",
      target_value: "",
      description: "",
      tags: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.asset_name || !formData.asset_type || !formData.target_value) {
      toast.error("Please fill in all required fields");
      return;
    }

    const assetData = {
      asset_name: formData.asset_name,
      asset_type: formData.asset_type,
      target_value: formData.target_value,
      description: formData.description || "",
      is_active: true,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
    };

    console.log("Creating asset with data:", assetData);
    createAssetMutation.mutate(assetData);
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

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Add New Asset
          </DialogTitle>
          <DialogDescription>
            Create a new asset for security assessment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="asset_name">Asset Name *</Label>
            <Input
              id="asset_name"
              value={formData.asset_name}
              onChange={(e) => setFormData(prev => ({ ...prev, asset_name: e.target.value }))}
              placeholder="Enter a descriptive name"
            />
          </div>

          <div>
            <Label htmlFor="asset_type">Asset Type *</Label>
            <Select 
              value={formData.asset_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, asset_type: value, target_value: "" }))}
            >
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
            <Label htmlFor="target_value">Target Value *</Label>
            <Input
              id="target_value"
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

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createAssetMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createAssetMutation.isPending ? "Creating..." : "Create Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
