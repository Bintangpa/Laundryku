// File: src/types/partner.types.ts
// Type definition untuk Partner model

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'mitra' | 'customer';
  is_active: boolean;
}

export interface Partner {
  id: number;
  user_id: number;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  kota: string | null;
  maps_url: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
}

export interface Customer {
  id: number;
  nama: string;
  no_wa: string;
  alamat?: string;
}

export interface StatusHistory {
  id: number;
  status: string;
  keterangan?: string;
  created_at: string;
}

export interface Order {
  id: number;
  kode_laundry: string;
  partner_id: number;
  customer_id: number;
  jenis_layanan: string;
  berat?: number;
  jumlah_item?: number;
  total_harga: number;
  metode_pembayaran?: string;
  status_pembayaran: string;
  status: string;
  tanggal_masuk: string;
  estimasi_selesai?: string;
  tanggal_selesai?: string;
  catatan?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  partner?: Partner;
  customer?: Customer;
  status_history?: StatusHistory[];
}

// ✅ TAMBAH: Admin Dashboard Types
export interface AdminStats {
  overview: {
    total_orders: number;
    total_revenue: number;
    total_partners: number;
    total_customers: number;
  };
  orders_by_status: {
    [key: string]: number;
  };
  recent_orders?: Order[];
  revenue_by_month?: {
    month: string;
    revenue: number;
  }[];
}