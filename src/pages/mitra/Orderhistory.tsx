import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  History,
  Loader2,
  AlertCircle,
  Search,
  Eye,
  ArrowLeft,
  FileDown,
  Calendar,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Order {
  id: number;
  kode_laundry: string;
  jenis_layanan: string;
  total_harga: number;
  status: string;
  tanggal_masuk: string;
  tanggal_selesai: string;
  status_pembayaran: string;
  customer: {
    nama: string;
    no_wa: string;
  };
}

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ CHANGED: Fetch orders with 'Telah Diambil' status
      const response = await ordersAPI.getAll({ status: 'Telah Diambil' });

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching history:', err);
      setError(err.response?.data?.message || 'Gagal mengambil riwayat order');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    return (
      order.kode_laundry.toLowerCase().includes(search) ||
      order.customer.nama.toLowerCase().includes(search) ||
      order.customer.no_wa.includes(search)
    );
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = async (id: number, kode: string) => {
    if (!confirm(`Hapus riwayat order ${kode}?`)) return;

    try {
      await ordersAPI.delete(id.toString());
      fetchHistory(); // Refresh list
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus riwayat order');
    }
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = ['Kode', 'Customer', 'Layanan', 'Harga', 'Tanggal Masuk', 'Tanggal Selesai', 'Pembayaran'];
    const rows = filteredOrders.map(order => [
      order.kode_laundry,
      order.customer.nama,
      order.jenis_layanan,
      order.total_harga,
      format(new Date(order.tanggal_masuk), 'dd/MM/yyyy'),
      format(new Date(order.tanggal_selesai), 'dd/MM/yyyy'),
      order.status_pembayaran
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riwayat-order-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/dashboard/mitra')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <History className="w-6 h-6 text-primary" />
                  Riwayat Order
                </h1>
                <p className="text-muted-foreground mt-1">
                  Order yang sudah diambil customer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        {/* Search */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari kode, nama customer, atau nomor WA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {!loading && !error && orders.length > 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-3 bg-primary/5 rounded-lg border border-primary/20 min-w-[180px]">
                <p className="text-xs text-muted-foreground mb-1">Total Order Selesai</p>
                <p className="text-3xl font-bold text-primary">{filteredOrders.length}</p>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-destructive font-medium">Error</p>
              <p className="text-destructive/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Memuat riwayat order...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm
                ? 'Tidak ada riwayat yang cocok'
                : 'Belum ada riwayat order'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? 'Coba ubah kata kunci pencarian'
                : 'Riwayat order yang sudah diambil akan muncul di sini'}
            </p>
          </div>
        )}

        {/* Orders Table - Desktop */}
        {!loading && !error && filteredOrders.length > 0 && (
          <>
            {/* Desktop View */}
            <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode Tracking</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Layanan</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pembayaran</TableHead>
                    <TableHead>Tanggal Masuk</TableHead>
                    <TableHead>Tanggal Diambil</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-semibold text-primary">
                        {order.kode_laundry}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer.nama}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.customer.no_wa}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.jenis_layanan}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.total_harga)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status_pembayaran === 'Lunas'
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {order.status_pembayaran}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(order.tanggal_masuk), 'dd MMM yyyy', {
                          locale: id,
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(order.tanggal_selesai), 'dd MMM yyyy', {
                          locale: id,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(`/dashboard/mitra/orders/${order.id}`)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDelete(order.id, order.kode_laundry)
                            }
                            className="hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card rounded-xl border border-border p-4 space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-mono font-semibold text-primary text-sm">
                        {order.kode_laundry}
                      </p>
                      <p className="font-medium text-foreground mt-1">
                        {order.customer.nama}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer.no_wa}
                      </p>
                    </div>
                    <Badge
                      variant={
                        order.status_pembayaran === 'Lunas'
                          ? 'default'
                          : 'outline'
                      }
                      className="ml-2"
                    >
                      {order.status_pembayaran}
                    </Badge>
                  </div>

                  {/* Info */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Layanan:</span>
                      <span className="font-medium">{order.jenis_layanan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(order.total_harga)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Masuk:</span>
                      <span>
                        {format(new Date(order.tanggal_masuk), 'dd MMM yyyy', {
                          locale: id,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Diambil:</span>
                      <span>
                        {format(new Date(order.tanggal_selesai), 'dd MMM yyyy', {
                          locale: id,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() =>
                        navigate(`/dashboard/mitra/orders/${order.id}`)
                      }
                    >
                      <Eye className="w-4 h-4" />
                      Lihat Detail
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive"
                      onClick={() =>
                        handleDelete(order.id, order.kode_laundry)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Summary */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Menampilkan {filteredOrders.length} dari {orders.length} order
            yang telah diambil
          </div>
        )}
      </div>
    </div>
  );
}