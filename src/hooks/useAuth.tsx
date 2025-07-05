
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, tokenManager, checkInitialSetup } from '@/services/api';
import { User } from '@/services/auth.api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setupRequired: boolean;
  login: (username: string, password: string, mfaCode?: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  checkSetup: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);

  const checkSetup = async (): Promise<boolean> => {
    try {
      const setupComplete = await checkInitialSetup();
      setSetupRequired(!setupComplete);
      return setupComplete;
    } catch (error) {
      console.error('Setup check failed:', error);
      setSetupRequired(true);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenManager.getAccessToken();
      
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
          setSetupRequired(false);
        } catch (error) {
          tokenManager.clearTokens();
          await checkSetup();
        }
      } else {
        await checkSetup();
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string, mfaCode?: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ username, password, mfa_code: mfaCode });
      const { access_token, refresh_token, user } = response.data;
      
      tokenManager.setTokens(access_token, refresh_token);
      setUser(user);
      setSetupRequired(false);
      
      toast.success(`Welcome back, ${user.username}!`);
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      
      // Re-throw for MFA handling in LoginForm
      if (error.response?.status === 401 && message.toLowerCase().includes('mfa')) {
        throw error;
      }
      
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.roles) return false;
    // Enhanced permission check based on roles
    if (user.roles.includes('admin')) return true;
    if (user.roles.includes('pentester') && permission.startsWith('scan')) return true;
    if (user.roles.includes('analyst') && ['findings:view', 'reports:view'].includes(permission)) return true;
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      setupRequired, 
      login, 
      logout, 
      hasPermission, 
      checkSetup 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
