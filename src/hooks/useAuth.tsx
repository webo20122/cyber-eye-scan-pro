
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, tokenManager, checkInitialSetup } from '@/services/api';
import { User } from '@/services/auth.api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setupRequired: boolean;
  login: (username: string, password: string, mfaCode?: string) => Promise<boolean>;
  logout: () => Promise<void>;
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
      // For demo purposes, simulate different user roles
      let mockUser: User;
      
      if (username === 'admin' && password === 'admin123') {
        mockUser = {
          user_id: '1',
          username: 'admin',
          email: 'admin@cyberscan.pro',
          roles: ['admin'],
          mfa_enabled: false
        };
      } else if (username === 'analyst' && password === 'analyst123') {
        mockUser = {
          user_id: '2',
          username: 'analyst',
          email: 'analyst@cyberscan.pro',
          roles: ['analyst'],
          mfa_enabled: false
        };
      } else if (username === 'pentest' && password === 'pentest123') {
        mockUser = {
          user_id: '3',
          username: 'pentest',
          email: 'pentest@cyberscan.pro',
          roles: ['pentester'],
          mfa_enabled: false
        };
      } else {
        toast.error('Invalid credentials. Please use demo credentials.');
        return false;
      }

      // Simulate token storage
      tokenManager.setTokens('demo_access_token', 'demo_refresh_token');
      setUser(mockUser);
      setSetupRequired(false);
      
      toast.success(`Welcome to CyberScan Pro, ${mockUser.username}!`);
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

  const logout = async (): Promise<void> => {
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
    
    if (user.roles.includes('pentester')) {
      const pentesterPermissions = [
        'scan:create', 'scan:manage', 'exploit:run', 'findings:manage',
        'reports:create', 'assets:manage', 'tools:advanced'
      ];
      return pentesterPermissions.some(p => permission.startsWith(p.split(':')[0]));
    }
    
    if (user.roles.includes('analyst')) {
      const analystPermissions = ['findings:view', 'reports:view', 'scan:view', 'assets:view'];
      return analystPermissions.includes(permission);
    }
    
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
