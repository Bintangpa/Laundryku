import api from '../api';

export type JenisLayanan =
  | 'Laundry Kiloan'
  | 'Laundry Satuan'
  | 'Express 6 Jam'
  | 'Dry Cleaning'
  | 'Setrika Saja'
  | 'Deep Clean';

export type StatusOrder =
  | 'Diterima'
  | 'Sedang Dicuci'
  | 'Sedang Dikeringkan'
  | 'Sedang Disetrika'
  | 'Siap Diambil'
  | 'Selesai';

export interface CreateOrderData {
  // Customer data
  nama: string;
  no_wa: string;
  alamat?: string;
  
  // Order data
  partner_id: number;
  jenis_layanan: JenisLayanan;
  berat?: number;
  jumlah_item?: number;
  catatan?: string;
  total_harga: number;
  estimasi_selesai?: string;
  metode_pembayaran?: 'Cash' | 'Transfer' | 'QRIS';
  status_pembayaran?: 'Belum Lunas' | 'Lunas';
}

export interface Order {
  id: number;
  kode_laundry: string;
  partner_id: number;
  customer_id: number;
  jenis_layanan: JenisLayanan;
  berat?: number;
  jumlah_item?: number;
  catatan?: string;
  total_harga: number;
  status: StatusOrder;
  tanggal_masuk: string;
  estimasi_selesai?: string;
  tanggal_selesai?: string;
  metode_pembayaran?: string;
  status_pembayaran?: string;
  customer?: {
    id: number;
    nama: string;
    no_wa: string;
    alamat?: string;
  };
  partner?: {
    id: number;
    nama_toko: string;
    alamat: string;
    no_telepon: string;
  };
  status_history?: Array<{
    id: number;
    status: StatusOrder;
    keterangan?: string;
    created_at: string;
  }>;
}

export interface UpdateStatusData {
  status: StatusOrder;
  keterangan?: string;
  updated_by: number;
}

const orderService = {
  /**
   * Create order baru (by mitra)
   */
  createOrder: async (data: CreateOrderData): Promise<any> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  /**
   * Track order by kode (PUBLIC - no auth)
   */
  trackOrder: async (kode: string): Promise<{ success: boolean; data: Order }> => {
    const response = await api.get(`/orders/track/${kode}`);
    return response.data;
  },

  /**
   * Get orders by partner ID
   */
  getOrdersByPartner: async (
    partnerId: number,
    params?: { status?: StatusOrder; limit?: number; offset?: number }
  ): Promise<any> => {
    const response = await api.get(`/orders/partner/${partnerId}`, { params });
    return response.data;
  },

  /**
   * Get order details by ID
   */
  getOrderDetails: async (orderId: number): Promise<{ success: boolean; data: Order }> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (orderId: number, data: UpdateStatusData): Promise<any> => {
    const response = await api.put(`/orders/${orderId}/status`, data);
    return response.data;
  },
};

export default orderService;