import axios from 'axios';

// Base URL dari backend
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests (kalau ada)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== TRACKING API (PUBLIC) ==========
export const trackingAPI = {
  trackOrder: (code: string) => api.get(`/tracking/${code}`)
};

// ========== PARTNERS API ==========
export const partnersAPI = {
  // Public endpoints
  getAll: (params?: any) => api.get('/partners', { params }),
  getById: (id: string) => api.get(`/partners/${id}`),
  getByCity: (city: string) => api.get(`/partners/city/${city}`),
  getAvailableCities: () => api.get('/partners/available/cities'),
  
  // Protected endpoints (require auth)
  getMyProfile: () => api.get('/partners/profile/me'),
  updateMyProfile: (data: any) => api.put('/partners/profile/me', data),
  
  // ✅ TAMBAH: Admin endpoints
  create: (data: any) => api.post('/partners', data),
  update: (id: string, data: any) => api.put(`/partners/${id}`, data),
  delete: (id: string) => api.delete(`/partners/${id}`)
};

// ========== AUTH API ==========
export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile')
};

// ========== ORDERS API ==========
export const ordersAPI = {
  // Dashboard stats
  getDashboardStats: () => api.get('/orders/stats/dashboard'),
  
  // CRUD operations
  getAll: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
  updateStatus: (id: string, data: any) => api.patch(`/orders/${id}/status`, data),
  delete: (id: string) => api.delete(`/orders/${id}`),
  
  // Track order (public)
  track: (code: string) => api.get(`/orders/track/${code}`)
};

// ========== DASHBOARD API ==========
export const dashboardAPI = {
  getAdminStats: () => api.get('/dashboard/admin'),
  getMitraStats: () => api.get('/dashboard/mitra')
};

// ========== ADMIN API ==========
export const adminAPI = {
  updateEmail: (data: any) => api.put('/admin/update-email', data),
  updatePassword: (data: any) => api.put('/admin/update-password', data)
};

export default api;