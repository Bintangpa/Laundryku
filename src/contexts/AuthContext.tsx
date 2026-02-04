import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, Partner, LoginCredentials, RegisterData } from '@/lib/services/authService';

interface AuthContextType {
  user: User | null;
  partner: Partner | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        const userData = JSON.parse(savedUser);
        setUser(userData.user || userData);
        setPartner(userData.partner || null);
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        const { user, partner, token } = response.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ user, partner }));
        
        // Update state
        setToken(token);
        setUser(user);
        setPartner(partner || null);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      
      if (response.success) {
        const { user, partner, token } = response.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ user, partner }));
        
        // Update state
        setToken(token);
        setUser(user);
        setPartner(partner || null);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setPartner(null);
    setToken(null);
  };

  const refreshProfile = async () => {
    try {
      if (!token) return;
      
      const response = await authService.getProfile();
      if (response.success) {
        const userData = response.data;
        setUser({
          id: userData.id,
          email: userData.email,
          role: userData.role,
          is_active: userData.is_active,
        });
        setPartner(userData.partner || null);
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify({
          user: {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            is_active: userData.is_active,
          },
          partner: userData.partner,
        }));
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const value = {
    user,
    partner,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}