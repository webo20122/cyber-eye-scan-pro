
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Database, Key, User, Mail, Lock, AlertTriangle } from "lucide-react";
import { initialSetupAPI } from "@/services/api";
import { toast } from "sonner";

const InitialSetup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    database_url: "",
    aes_key: "",
    admin_username: "",
    admin_email: "",
    admin_password: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await initialSetupAPI.setup(formData);
      toast.success("Initial setup completed successfully!");
      navigate("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Setup failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAESKey = () => {
    const key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setFormData({ ...formData, aes_key: key });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-white/95 backdrop-blur-sm border-gray-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent">
                CyberScan
              </h1>
            </div>
            <CardTitle className="text-xl font-bold">Initial Setup</CardTitle>
            <CardDescription>
              Configure your CyberScan security platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Database Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Database Configuration</h3>
                </div>
                <div>
                  <Label htmlFor="database_url">Database URL</Label>
                  <Input
                    id="database_url"
                    type="text"
                    placeholder="postgresql://user:password@localhost:5432/cyberscan"
                    value={formData.database_url}
                    onChange={(e) => setFormData({ ...formData, database_url: e.target.value })}
                    className="h-11 bg-white/70 border-gray-300 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Security Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Security Configuration</h3>
                </div>
                <div>
                  <Label htmlFor="aes_key">AES Encryption Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="aes_key"
                      type="text"
                      placeholder="Enter 64-character hex key or generate one"
                      value={formData.aes_key}
                      onChange={(e) => setFormData({ ...formData, aes_key: e.target.value })}
                      className="h-11 bg-white/70 border-gray-300 focus:border-blue-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateAESKey}
                      className="h-11 px-4"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              {/* Admin User Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Admin User</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admin_username">Username</Label>
                    <Input
                      id="admin_username"
                      type="text"
                      placeholder="admin"
                      value={formData.admin_username}
                      onChange={(e) => setFormData({ ...formData, admin_username: e.target.value })}
                      className="h-11 bg-white/70 border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin_email"
                        type="email"
                        placeholder="admin@cyberscan.com"
                        value={formData.admin_email}
                        onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                        className="h-11 bg-white/70 border-gray-300 focus:border-blue-500 pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="admin_password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="admin_password"
                      type="password"
                      placeholder="Enter a strong password"
                      value={formData.admin_password}
                      onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                      className="h-11 bg-white/70 border-gray-300 focus:border-blue-500 pl-10"
                      required
                    />
                  </div>
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
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Setting up...
                  </div>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InitialSetup;
