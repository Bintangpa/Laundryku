// Type definitions for Order Tracking

export interface Customer {
  id: number;
  nama: string;
  no_wa: string;
  alamat?: string;
}

export interface Partner {
  id: number;
  nama_toko: string;
  no_telepon: string;
  alamat: string;
  kota?: string;
}

export interface OrderStatusHistory {
  id: number;
  order_id: number;
  status: string;
  keterangan: string;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface TrackingOrder {
  id: number;
  kode_laundry: string;
  partner_id: number;
  customer_id: number;
  jenis_layanan: string;
  berat?: number;
  jumlah_item?: number;
  catatan?: string;
  total_harga: number;
  estimasi_selesai?: string;
  tanggal_masuk: string;
  tanggal_selesai?: string;
  metode_pembayaran?: string;
  status_pembayaran: string;
  status: string;
  created_at: string;
  updated_at: string;
  customer: Customer;
  partner: Partner;
  status_history: OrderStatusHistory[];
}

export interface TrackingResponse {
  success: boolean;
  data: TrackingOrder;
  message?: string;
}

// ✅ FIXED: Status types - 'Selesai' → 'Telah Diambil'
export type OrderStatus = 
  | 'Diterima'
  | 'Diproses'
  | 'Siap Diambil'
  | 'Telah Diambil';

export type PaymentStatus = 'Belum Lunas' | 'Lunas';