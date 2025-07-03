
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
    name: "",
    type: "",
    value: "",
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
      toast.error(error.response?.data?.message || "Failed to create asset");
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      value: "",
      description: "",
      tags: ""
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.type || !formData.value) {
      toast.error("Please fill in all required fields");
      return;
    }

    const assetData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
    };

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

  const selectedType = assetTypes.find(type => type.value === formData.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Asset Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter a descriptive name"
            />
          </div>

          <div>
            <Label htmlFor="type">Asset Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value, value: "" }))}>
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
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
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
            disabled={createAssetMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createAssetMutation.isPending ? "Creating..." : "Create Asset"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
