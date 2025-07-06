
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, Settings, User, Zap, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  const getRoleBadgeColor = (roles: string[]) => {
    if (roles?.includes("admin")) return "bg-red-500 text-white";
    if (roles?.includes("pentester")) return "bg-purple-500 text-white";
    if (roles?.includes("analyst")) return "bg-blue-500 text-white";
    return "bg-gray-500 text-white";
  };

  const getRoleDisplay = (roles: string[]) => {
    if (roles?.includes("admin")) return "Administrator";
    if (roles?.includes("pentester")) return "Penetration Tester";
    if (roles?.includes("analyst")) return "Security Analyst";
    return "User";
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent">
                  CyberScan Pro
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Enterprise Ready</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-purple-600" />
                    <span className="text-xs text-purple-600 font-medium">Advanced Pentest Suite</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div className="text-right">
                <div className="text-sm text-gray-700 font-medium">{user.username}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <Badge className={`capitalize ${getRoleBadgeColor(user.roles)}`}>
                {getRoleDisplay(user.roles)}
              </Badge>
            </div>
            
            {hasPermission('config:manage') && (
              <Button variant="outline" onClick={() => navigate("/admin")} className="border-blue-200 hover:bg-blue-50">
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            )}
            
            <Button variant="outline" onClick={() => navigate("/network-discovery")} className="border-green-200 hover:bg-green-50">
              <Search className="h-4 w-4 mr-2" />
              Network Discovery
            </Button>
            
            <Button variant="outline" onClick={handleLogout} className="border-red-200 hover:bg-red-50 hover:text-red-700">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
