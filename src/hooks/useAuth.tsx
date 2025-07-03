
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, tokenManager, User } from '@/services/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string, mfaCode?: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenManager.getAccessToken();
    if (token) {
      getCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      tokenManager.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string, mfaCode?: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ username, password, mfa_code: mfaCode });
      const { access_token, refresh_token, user } = response.data;
      
      tokenManager.setTokens(access_token, refresh_token);
      setUser(user);
      
      toast.success(`Welcome back, ${user.username}!`);
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
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
    // Simplified permission check - in real implementation, you'd check against user permissions
    return user.roles.includes('admin') || user.roles.includes('pentester');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>
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
