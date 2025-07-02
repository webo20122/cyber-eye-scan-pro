
import { Shield, CheckCircle, Users, BarChart3 } from "lucide-react";

export const LoginBranding = () => {
  return (
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
  );
};
