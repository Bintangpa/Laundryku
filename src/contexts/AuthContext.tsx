import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import type { Partner } from '@/types/partner.types';

interface User {
  id: number;
  email: string;
  nama: string;
  role: 'admin' | 'mitra' | 'customer';
}

interface AuthContextType {
  user: User | null;
  partner: Partner | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshPartner: () => Promise<void>; // ✅ TAMBAH: Refresh partner function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData.user || userData);
        
        // Load partner data if user is mitra
        if (userData.partner) {
          setPartner(userData.partner);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await authAPI.login(credentials.email, credentials.password);
      
      if (response.data.success) {
        const { token, user, partner } = response.data.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ user, partner }));
        
        // Update state
        setUser(user);
        if (partner) {
          setPartner(partner);
        }
      } else {
        throw new Error(response.data.message || 'Login gagal');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Email atau password salah');
    }
  };

  // Register function
  const register = async (data: any) => {
    try {
      const response = await authAPI.register(data);
      
      if (response.data.success) {
        const { token, user, partner } = response.data.data;
        
        // Save to localStorage (sama seperti login)
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ user, partner }));
        
        // Update state
        setUser(user);
        if (partner) {
          setPartner(partner);
        }
      } else {
        throw new Error(response.data.message || 'Registrasi gagal');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
    }
  };

  // ✅ TAMBAH: Refresh partner function untuk reload data partner terbaru
  const refreshPartner = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        return;
      }

      // Panggil API untuk mendapatkan data partner terbaru
      // Sesuaikan dengan endpoint API Anda
      const response = await authAPI.getProfile();
      
      if (response.data.success) {
        const { user: updatedUser, partner: updatedPartner } = response.data.data;
        
        // Update partner state dengan data terbaru
        if (updatedPartner) {
          setPartner(updatedPartner);
          
          // Update juga di localStorage
          const savedData = localStorage.getItem('user');
          if (savedData) {
            const userData = JSON.parse(savedData);
            userData.partner = updatedPartner;
            if (updatedUser) {
              userData.user = updatedUser;
              setUser(updatedUser);
            }
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing partner data:', error);
      // Tidak throw error agar tidak mengganggu flow aplikasi
    }
  };

  const logout = () => {
    setUser(null);
    setPartner(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        partner,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
        refreshPartner, // ✅ TAMBAH: Export refresh partner function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}