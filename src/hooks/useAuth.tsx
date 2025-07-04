
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

// Demo credentials for testing
const DEMO_USERS = {
  'admin@cyberscan.com': {
    user_id: 'admin-001',
    username: 'admin@cyberscan.com',
    email: 'admin@cyberscan.com',
    roles: ['admin', 'pentester'],
    mfa_enabled: false,
    password: 'admin123'
  },
  'user@cyberscan.com': {
    user_id: 'user-001',
    username: 'user@cyberscan.com',
    email: 'user@cyberscan.com',
    roles: ['analyst'],
    mfa_enabled: false,
    password: 'user123'
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenManager.getAccessToken();
    const savedUser = localStorage.getItem('demo_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, mfaCode?: string): Promise<boolean> => {
    try {
      // Check demo credentials first
      const demoUser = DEMO_USERS[username as keyof typeof DEMO_USERS];
      if (demoUser && demoUser.password === password) {
        // Demo login successful
        const mockTokens = {
          access_token: 'demo-access-token',
          refresh_token: 'demo-refresh-token'
        };
        
        tokenManager.setTokens(mockTokens.access_token, mockTokens.refresh_token);
        const userWithoutPassword = { ...demoUser };
        delete (userWithoutPassword as any).password;
        setUser(userWithoutPassword as User);
        localStorage.setItem('demo_user', JSON.stringify(userWithoutPassword));
        
        toast.success(`Welcome back, ${userWithoutPassword.username}!`);
        return true;
      }

      // Fallback to API login for real backend
      const response = await authAPI.login({ username, password, mfa_code: mfaCode });
      const { access_token, refresh_token, user } = response.data;
      
      tokenManager.setTokens(access_token, refresh_token);
      setUser(user);
      localStorage.setItem('demo_user', JSON.stringify(user));
      
      toast.success(`Welcome back, ${user.username}!`);
      return true;
    } catch (error: any) {
      // If it's not a demo user and API fails, show appropriate error
      if (!DEMO_USERS[username as keyof typeof DEMO_USERS]) {
        const message = error.response?.data?.message || 'Login failed';
        toast.error(message);
        throw error; // Re-throw for MFA handling in LoginForm
      } else {
        toast.error('Invalid credentials');
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      // Only call API logout if not using demo credentials
      if (!localStorage.getItem('demo_user')) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
      localStorage.removeItem('demo_user');
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
