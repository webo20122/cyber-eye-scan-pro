
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsAPI } from "@/services/api";
import { CreateAssetDialog } from "./CreateAssetDialog";
import { EditAssetDialog } from "./EditAssetDialog";
import { 
  Plus, 
  Search, 
  Globe, 
  Server, 
  Code, 
  Cloud, 
  Network,
  Edit,
  Trash2,
  Eye,
  Tag
} from "lucide-react";
import { toast } from "sonner";

export const AssetManagement = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: assetsData, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => assetsAPI.list()
  });

  const deleteAssetMutation = useMutation({
    mutationFn: (assetId: string) => assetsAPI.delete(assetId),
    onSuccess: () => {
      toast.success("Asset deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete asset");
    }
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'IP': return <Server className="h-5 w-5 text-blue-600" />;
      case 'Domain': return <Globe className="h-5 w-5 text-green-600" />;
      case 'WebApp': return <Globe className="h-5 w-5 text-purple-600" />;
      case 'CodeRepo': return <Code className="h-5 w-5 text-orange-600" />;
      case 'CloudAccount': return <Cloud className="h-5 w-5 text-cyan-600" />;
      case 'NetworkSegment': return <Network className="h-5 w-5 text-indigo-600" />;
      default: return <Server className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'IP': return 'bg-blue-100 text-blue-800';
      case 'Domain': return 'bg-green-100 text-green-800';
      case 'WebApp': return 'bg-purple-100 text-purple-800';
      case 'CodeRepo': return 'bg-orange-100 text-orange-800';
      case 'CloudAccount': return 'bg-cyan-100 text-cyan-800';
      case 'NetworkSegment': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const assets = assetsData?.data || [];
  const filteredAssets = assets.filter((asset: any) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-600" />
                Asset Management
              </CardTitle>
              <CardDescription>Manage your security assessment targets</CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredAssets.length} of {assets.length} assets
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardContent className="text-center py-12">
                <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm ? "No assets found matching your search" : "No assets found"}
                </p>
                <p className="text-gray-400">
                  {searchTerm ? "Try adjusting your search terms" : "Add your first asset to get started"}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredAssets.map((asset: any) => (
            <Card key={asset.asset_id} className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getAssetIcon(asset.type)}
                    <div>
                      <h3 className="font-semibold text-lg">{asset.name}</h3>
                      <Badge className={getAssetTypeColor(asset.type)}>
                        {asset.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAsset(asset.asset_id)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAssetMutation.mutate(asset.asset_id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      disabled={deleteAssetMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Target:</span>
                    <div className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                      {asset.value}
                    </div>
                  </div>

                  {asset.description && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Description:</span>
                      <p className="text-sm text-gray-600 mt-1">{asset.description}</p>
                    </div>
                  )}

                  {asset.tags && asset.tags.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {asset.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Added: {new Date(asset.created_at).toLocaleDateString()}
                    </div>
                    {asset.updated_at !== asset.created_at && (
                      <div className="text-xs text-gray-500">
                        Updated: {new Date(asset.updated_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CreateAssetDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          queryClient.invalidateQueries({ queryKey: ['assets'] });
        }}
      />

      {editingAsset && (
        <EditAssetDialog
          assetId={editingAsset}
          open={!!editingAsset}
          onOpenChange={() => setEditingAsset(null)}
          onSuccess={() => {
            setEditingAsset(null);
            queryClient.invalidateQueries({ queryKey: ['assets'] });
          }}
        />
      )}
    </div>
  );
};
