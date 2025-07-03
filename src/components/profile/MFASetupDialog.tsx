
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/services/api";
import { toast } from "sonner";
import { Key, Smartphone, Shield, AlertTriangle } from "lucide-react";

interface MFASetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMFAStatus: boolean;
}

export const MFASetupDialog = ({ open, onOpenChange, currentMFAStatus }: MFASetupDialogProps) => {
  const [mfaCode, setMfaCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<'setup' | 'verify' | 'disable'>('setup');
  const queryClient = useQueryClient();

  const { data: mfaSetupData } = useQuery({
    queryKey: ['mfa-setup'],
    queryFn: () => authAPI.setupMFA(),
    enabled: open && !currentMFAStatus && step === 'setup'
  });

  const setupMFAMutation = useMutation({
    mutationFn: (code: string) => authAPI.setupMFA(code),
    onSuccess: () => {
      toast.success("MFA enabled successfully");
      queryClient.invalidateQueries({ queryKey: ['auth', 'current_user'] });
      onOpenChange(false);
      resetState();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to enable MFA");
    }
  });

  const disableMFAMutation = useMutation({
    mutationFn: (password: string) => authAPI.disableMFA(password),
    onSuccess: () => {
      toast.success("MFA disabled successfully");
      queryClient.invalidateQueries({ queryKey: ['auth', 'current_user'] });
      onOpenChange(false);
      resetState();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to disable MFA");
    }
  });

  const resetState = () => {
    setMfaCode("");
    setPassword("");
    setStep('setup');
  };

  const handleSetupMFA = () => {
    if (!mfaCode || mfaCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    setupMFAMutation.mutate(mfaCode);
  };

  const handleDisableMFA = () => {
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    disableMFAMutation.mutate(password);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            {currentMFAStatus ? "Manage MFA" : "Enable MFA"}
          </DialogTitle>
          <DialogDescription>
            {currentMFAStatus 
              ? "Multi-factor authentication is currently enabled"
              : "Secure your account with multi-factor authentication"
            }
          </DialogDescription>
        </DialogHeader>

        {!currentMFAStatus ? (
          // MFA Setup Flow
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  Setup Authenticator
                </CardTitle>
                <CardDescription>
                  Scan the QR code with your authenticator app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mfaSetupData?.data?.qr_code ? (
                  <div className="text-center">
                    <img 
                      src={mfaSetupData.data.qr_code} 
                      alt="MFA QR Code" 
                      className="mx-auto mb-4 border rounded-lg"
                    />
                    <p className="text-sm text-gray-600 mb-4">
                      Or enter this secret manually: 
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs block mt-1">
                        {mfaSetupData.data.secret}
                      </code>
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Loading QR code...</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="mfaCode">Verification Code</Label>
                  <Input
                    id="mfaCode"
                    type="text"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSetupMFA}
                disabled={setupMFAMutation.isPending || !mfaCode || mfaCode.length !== 6}
              >
                {setupMFAMutation.isPending ? "Enabling..." : "Enable MFA"}
              </Button>
            </div>
          </div>
        ) : (
          // MFA Management (Disable)
          <div className="space-y-6">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Disable MFA</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Disabling MFA will make your account less secure. Are you sure you want to continue?
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <Label htmlFor="password">Current Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password to disable MFA"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDisableMFA}
                disabled={disableMFAMutation.isPending || !password}
              >
                {disableMFAMutation.isPending ? "Disabling..." : "Disable MFA"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
