import api from '../api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  kota?: string;
}

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'mitra';
  is_active: boolean;
}

export interface Partner {
  id: number;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  kota?: string;
  status: 'active' | 'inactive';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    partner?: Partner;
    token: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: User & {
    partner?: Partner;
  };
}

const authService = {
  /**
   * Login user (admin atau mitra)
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register mitra baru
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Get user profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  /**
   * Update profile mitra
   */
  updateProfile: async (data: Partial<Partner>): Promise<any> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (oldPassword: string, newPassword: string): Promise<any> => {
    const response = await api.put('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  /**
   * Logout - clear token from localStorage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;