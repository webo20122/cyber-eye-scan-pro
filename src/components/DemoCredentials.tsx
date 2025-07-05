
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
      color: "bg-red-50 border-red-200 text-red-800"
    },
    {
      role: "Security Analyst",
      username: "analyst",
      password: "analyst123",
      icon: Search,
      description: "View scans, findings, and generate reports",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      role: "Penetration Tester",
      username: "pentester",
      password: "pentest123",
      icon: User,
      description: "Create and execute security scans",
      color: "bg-purple-50 border-purple-200 text-purple-800"
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Demo Accounts</CardTitle>
        <CardDescription>
          Click any account below to auto-fill the login form with demo credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {credentials.map((cred, index) => {
            const Icon = cred.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className={`h-auto p-4 text-left flex flex-col items-start gap-3 ${cred.color} hover:opacity-80`}
                onClick={() => onFillCredentials(cred.username, cred.password)}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-5 w-5" />
                  <span className="font-semibold">{cred.role}</span>
                </div>
                <div className="text-sm space-y-1 w-full">
                  <div className="font-mono bg-white/50 px-2 py-1 rounded text-xs">
                    {cred.username} / {cred.password}
                  </div>
                  <div className="text-xs opacity-80">{cred.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
