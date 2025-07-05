
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                CyberScan
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">System Healthy</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">{user.username}</span>
              <Badge variant={user.roles?.includes("admin") ? "default" : "secondary"} className="capitalize">
                {user.roles?.[0] || "User"}
              </Badge>
            </div>
            {hasPermission('config:manage') && (
              <Button variant="outline" onClick={() => navigate("/admin")} className="border-blue-200 hover:bg-blue-50">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
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
