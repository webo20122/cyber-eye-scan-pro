
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { MFASetupDialog } from "./MFASetupDialog";
import { 
  User, 
  Shield, 
  Key, 
  Mail, 
  Clock, 
  Settings,
  CheckCircle,
  XCircle
} from "lucide-react";

export const ProfileSection = () => {
  const { user } = useAuth();
  const [showMFADialog, setShowMFADialog] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* User Information */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            User Profile
          </CardTitle>
          <CardDescription>Your account information and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">Username:</span>
                <div className="text-lg font-semibold">{user.username}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">User ID:</span>
                <div className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                  {user.user_id}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">Roles:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.roles?.map((role, index) => (
                    <Badge key={index} variant="secondary" className="capitalize">
                      {role}
                    </Badge>
                  )) || <span className="text-gray-500">No roles assigned</span>}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Account Status:</span>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage your account security and authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* MFA Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Key className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Multi-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {user.mfa_enabled ? (
                  <>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setShowMFADialog(true)}>
                      Manage
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge variant="outline" className="text-gray-600">
                      <XCircle className="h-3 w-3 mr-1" />
                      Disabled
                    </Badge>
                    <Button size="sm" onClick={() => setShowMFADialog(true)}>
                      Enable MFA
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Password Security */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Key className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Password</h3>
                  <p className="text-sm text-gray-600">
                    Change your account password
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>

            {/* Session Management */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Active Sessions</h3>
                  <p className="text-sm text-gray-600">
                    Manage your active login sessions
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Sessions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Activity */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Account Activity
          </CardTitle>
          <CardDescription>Recent account activity and login history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Current Session</div>
                <div className="text-sm text-gray-600">Started today at {new Date().toLocaleTimeString()}</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No additional session history available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <MFASetupDialog
        open={showMFADialog}
        onOpenChange={setShowMFADialog}
        currentMFAStatus={user.mfa_enabled}
      />
    </div>
  );
};
