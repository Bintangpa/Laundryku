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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  Loader2,
  AlertCircle,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
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
  customer: {
    nama: string;
    no_wa: string;
  };
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'Diterima', label: 'Diterima' },
  { value: 'Sedang Dicuci', label: 'Sedang Dicuci' },
  { value: 'Sedang Dikeringkan', label: 'Sedang Dikeringkan' },
  { value: 'Sedang Disetrika', label: 'Sedang Disetrika' },
  { value: 'Siap Diambil', label: 'Siap Diambil' },
  { value: 'Selesai', label: 'Selesai' },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Diterima': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Sedang Dicuci': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Sedang Dikeringkan': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'Sedang Disetrika': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'Siap Diambil': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Selesai': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  return colors[status] || 'bg-gray-500/10 text-gray-500';
};

export default function OrdersList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {};
      // Only add status filter if it's not 'all'
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await ordersAPI.getAll(params);

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Gagal mengambil data order');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, kode: string) => {
    if (!confirm(`Hapus order ${kode}?`)) return;

    try {
      await ordersAPI.delete(id.toString());
      fetchOrders(); // Refresh list
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus order');
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
                  <Package className="w-6 h-6 text-primary" />
                  Kelola Pesanan
                </h1>
                <p className="text-muted-foreground mt-1">
                  Lihat dan kelola semua pesanan laundry
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/dashboard/mitra/create-order')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Pesanan Baru
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari kode, nama customer, atau nomor WA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <p className="text-muted-foreground">Memuat data pesanan...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm || (statusFilter && statusFilter !== 'all')
                ? 'Tidak ada pesanan yang cocok'
                : 'Belum ada pesanan'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || (statusFilter && statusFilter !== 'all')
                ? 'Coba ubah filter pencarian'
                : 'Mulai dengan membuat pesanan baru'}
            </p>
            {!searchTerm && (!statusFilter || statusFilter === 'all') && (
              <Button
                onClick={() => navigate('/dashboard/mitra/create-order')}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Buat Pesanan Pertama
              </Button>
            )}
          </div>
        )}

        {/* Orders Table */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Tracking</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
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
                        variant="outline"
                        className={getStatusColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(order.tanggal_masuk), 'dd MMM yyyy', {
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
                            navigate(`/dashboard/mitra/orders/${order.id}/edit`)
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDelete(order.id, order.kode_laundry)
                          }
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
        )}

        {/* Summary */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Menampilkan {filteredOrders.length} dari {orders.length} pesanan
          </div>
        )}
      </div>
    </div>
  );
}