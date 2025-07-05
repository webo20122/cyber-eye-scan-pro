
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, Search } from "lucide-react";

interface DemoCredentialsProps {
  onFillCredentials: (username: string, password: string) => void;
}

export const DemoCredentials = ({ onFillCredentials }: DemoCredentialsProps) => {
  const credentials = [
    {
      role: "Administrator",
      username: "admin",
      password: "admin123",
      icon: Shield,
      description: "Full system access with all permissions",
      color: "bg-red-50 border-red-200 hover:bg-red-100"
    },
    {
      role: "Security Analyst",
      username: "analyst",
      password: "analyst123",
      icon: Search,
      description: "View scans, findings, and generate reports",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    },
    {
      role: "Penetration Tester",
      username: "pentester",
      password: "pentest123",
      icon: User,
      description: "Create and execute security scans",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
    }
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">Demo Accounts</CardTitle>
        <CardDescription className="text-gray-600">
          Click any account below to auto-fill the login form
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {credentials.map((cred, index) => {
            const Icon = cred.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className={`h-auto p-4 text-left flex items-center gap-4 ${cred.color} border-2 transition-all duration-200`}
                onClick={() => onFillCredentials(cred.username, cred.password)}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/80">
                  <Icon className="h-5 w-5 text-gray-700" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-800 mb-1">{cred.role}</div>
                  <div className="text-xs font-mono bg-white/60 px-2 py-1 rounded mb-1">
                    {cred.username} / {cred.password}
                  </div>
                  <div className="text-xs text-gray-600">{cred.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
