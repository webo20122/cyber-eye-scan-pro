
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertTriangle, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    mfa_code: ""
  });
  const [error, setError] = useState("");
  const [showMFA, setShowMFA] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(formData.username, formData.password, formData.mfa_code || undefined);
      if (success) {
        navigate("/");
      }
    } catch (error: any) {
      if (error.response?.status === 401 && error.response?.data?.message?.includes('MFA')) {
        setShowMFA(true);
        setError("Please enter your MFA code");
      } else {
        setError(error.response?.data?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (username: string, password: string) => {
    setFormData({ ...formData, username, password });
  };

  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-gray-200 shadow-xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent">
            CyberScan Pro
          </h1>
        </div>
        <CardTitle className="text-xl font-bold">Enterprise Security Platform</CardTitle>
        <CardDescription>
          Advanced penetration testing and vulnerability assessment suite
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="h-11 bg-white/70 border-gray-300 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-11 bg-white/70 border-gray-300 focus:border-blue-500 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {showMFA && (
            <div className="space-y-2">
              <Label htmlFor="mfa_code">MFA Code</Label>
              <Input
                id="mfa_code"
                type="text"
                placeholder="Enter 6-digit MFA code"
                value={formData.mfa_code}
                onChange={(e) => setFormData({ ...formData, mfa_code: e.target.value })}
                className="h-11 bg-white/70 border-gray-300 focus:border-blue-500"
                maxLength={6}
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Authenticating...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 text-center">
            <p className="font-medium mb-3">Demo Access - Click to Fill</p>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => fillDemoCredentials('admin', 'admin123')}
              >
                <Shield className="h-3 w-3 mr-1" />
                Administrator Access
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => fillDemoCredentials('analyst', 'analyst123')}
              >
                <Eye className="h-3 w-3 mr-1" />
                Security Analyst Access
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => fillDemoCredentials('pentest', 'pentest123')}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Penetration Tester Access
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
