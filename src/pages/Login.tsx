
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield, CheckCircle, Users, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (formData.email === "admin@cyberscan.com" && formData.password === "admin123") {
        localStorage.setItem("user", JSON.stringify({ 
          email: formData.email, 
          role: "admin",
          name: "Admin User"
        }));
        toast.success("Welcome back, Admin!");
        navigate("/admin");
      } else if (formData.email === "user@cyberscan.com" && formData.password === "user123") {
        localStorage.setItem("user", JSON.stringify({ 
          email: formData.email, 
          role: "user",
          name: "Security Analyst"
        }));
        toast.success("Login successful!");
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex flex-col justify-center flex-1 max-w-lg">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent">
                  CyberScan Pro
                </h1>
                <p className="text-lg text-gray-600 mt-1">Advanced Security Platform</p>
              </div>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed">
              Comprehensive vulnerability management and security scanning solution for modern enterprises.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-100">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI-Powered Validation</h3>
                <p className="text-gray-600">Automatically validate vulnerabilities with 99.9% accuracy</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-100">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Real-Time Analytics</h3>
                <p className="text-gray-600">Monitor security posture with live dashboards</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-green-100">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Team Collaboration</h3>
                <p className="text-gray-600">Seamless workflow management for security teams</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent">
                CyberScan Pro
              </h1>
            </div>
            <p className="text-gray-600">Advanced Security Scanning Platform</p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-lg">
                Sign in to access your security dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 bg-white/50 border-gray-300 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-12 bg-white/50 border-gray-300 focus:border-blue-500 pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-3">
                  <p className="font-semibold text-center text-gray-800">Demo Credentials</p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg space-y-2 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Administrator:</span>
                      <code className="text-xs bg-white px-2 py-1 rounded">admin@cyberscan.com</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Password:</span>
                      <code className="text-xs bg-white px-2 py-1 rounded">admin123</code>
                    </div>
                    <hr className="my-2 border-gray-200" />
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Security Analyst:</span>
                      <code className="text-xs bg-white px-2 py-1 rounded">user@cyberscan.com</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Password:</span>
                      <code className="text-xs bg-white px-2 py-1 rounded">user123</code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
