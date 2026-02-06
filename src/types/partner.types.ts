// File: src/types/partner.types.ts
// Type definition untuk Partner model

export interface Partner {
  id: number;
  user_id: number;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  kota: string | null;
  maps_url: string | null; // ✅ Field yang missing!
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
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