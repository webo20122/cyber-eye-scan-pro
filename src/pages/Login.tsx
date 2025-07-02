
import { Shield } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { LoginBranding } from "@/components/LoginBranding";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Left Side - Branding & Features */}
        <LoginBranding />

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

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
