import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  Loader2,
  Eye,
  Package,
  MapPin,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ordersAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: number;
  kode_laundry: string;
  jenis_layanan: string;
  berat: number | null;
  jumlah_item: number | null;
  catatan: string | null;
  total_harga: number;
  status: string;
  status_pembayaran: string;
  metode_pembayaran: string | null;
  tanggal_masuk: string;
  estimasi_selesai: string | null;
  tanggal_selesai: string | null;
  customer: {
    nama: string;
    no_wa: string;
    alamat: string | null;
  };
  partner: {
    nama_toko: string;
    no_telepon: string;
    kota: string | null;
    alamat: string | null;
  };
}

const STATUS_OPTIONS = [
  'Diterima',
  'Sedang Dicuci',
  'Sedang Dikeringkan',
  'Sedang Disetrika',
  'Siap Diambil',
  'Telah Diambil',
];

const STATUS_COLORS: Record<string, string> = {
  'Diterima': 'bg-blue-100 text-blue-700 border-blue-300',
  'Sedang Dicuci': 'bg-cyan-100 text-cyan-700 border-cyan-300',
  'Sedang Dikeringkan': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Sedang Disetrika': 'bg-orange-100 text-orange-700 border-orange-300',
  'Siap Diambil': 'bg-green-100 text-green-700 border-green-300',
  'Telah Diambil': 'bg-gray-100 text-gray-600 border-gray-300',
};

const PEMBAYARAN_COLORS: Record<string, string> = {
  'Lunas': 'bg-green-100 text-green-700 border-green-300',
  'Belum Lunas': 'bg-red-100 text-red-700 border-red-300',
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(amount);
}

function cleanCityName(cityName: string): string {
  return cityName
    .replace(/^KABUPATEN\s+/i, '')
    .replace(/^KOTA\s+/i, '')
    .trim();
}

export default function ManageOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPembayaran, setSelectedPembayaran] = useState<string>('all');
  const [detailOrder, setDetailOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, selectedPembayaran, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedPembayaran !== 'all') params.status_pembayaran = selectedPembayaran;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await ordersAPI.getAllAdmin(params);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border flex-shrink-0">
        <div className="container px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              size="icon"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Package className="w-6 h-6 text-primary" />
                Kelola Order
              </h1>
              <p className="text-muted-foreground mt-1">
                Semua order dari seluruh mitra
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="container h-full px-4 pt-6 pb-0">
          <div className="max-w-7xl mx-auto h-full flex flex-col gap-4">

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-shrink-0">
              {[
                { label: 'Total Order', value: orders.length, color: 'text-primary' },
                { label: 'Aktif', value: orders.filter(o => o.status !== 'Telah Diambil').length, color: 'text-blue-600' },
                { label: 'Siap Diambil', value: orders.filter(o => o.status === 'Siap Diambil').length, color: 'text-green-600' },
                { label: 'Belum Lunas', value: orders.filter(o => o.status_pembayaran === 'Belum Lunas').length, color: 'text-red-500' },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl border border-border p-4 shadow-sm">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={cn('text-2xl font-bold mt-1', stat.color)}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-lg flex-shrink-0">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari kode order, nama customer, atau mitra..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-[200px] h-11">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-primary" />
                      <SelectValue placeholder="Semua Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPembayaran} onValueChange={setSelectedPembayaran}>
                  <SelectTrigger className="w-full md:w-[190px] h-11">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-primary" />
                      <SelectValue placeholder="Semua Pembayaran" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Pembayaran</SelectItem>
                    <SelectItem value="Lunas">Lunas</SelectItem>
                    <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                  </SelectContent>
                </Select>

                {(selectedStatus !== 'all' || selectedPembayaran !== 'all' || searchQuery) && (
                  <Button
                    variant="outline"
                    className="h-11 gap-2"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedStatus('all');
                      setSelectedPembayaran('all');
                    }}
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </Button>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> order
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-t-2xl border border-border shadow-lg overflow-hidden flex-1 flex flex-col min-h-0">
              {loading ? (
                <div className="flex items-center justify-center flex-1">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Memuat data order...</p>
                  </div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center flex-1">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Tidak Ada Order</h3>
                    <p className="text-muted-foreground">Tidak ada order yang sesuai dengan filter</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-auto flex-1">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">No</TableHead>
                        <TableHead>Kode Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Mitra</TableHead>
                        <TableHead>Layanan</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status Order</TableHead>
                        <TableHead>Pembayaran</TableHead>
                        <TableHead>Tgl Masuk</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((order, index) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <span className="font-mono text-xs font-semibold text-primary">
                              {order.kode_laundry}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{order.customer?.nama || '-'}</p>
                              <p className="text-xs text-muted-foreground">{order.customer?.no_wa || '-'}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{order.partner?.nama_toko || '-'}</p>
                              {order.partner?.kota && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {cleanCityName(order.partner.kota)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{order.jenis_layanan}</p>
                              <p className="text-xs text-muted-foreground">
                                {order.berat ? `${order.berat} kg` : order.jumlah_item ? `${order.jumlah_item} item` : '-'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-sm">{formatRupiah(order.total_harga)}</span>
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
                              STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600 border-gray-300'
                            )}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
                              PEMBAYARAN_COLORS[order.status_pembayaran] || 'bg-gray-100 text-gray-600'
                            )}>
                              {order.status_pembayaran}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(order.tanggal_masuk)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => setDetailOrder(order)}
                              variant="ghost"
                              size="sm"
                              className="gap-1.5"
                            >
                              <Eye className="w-4 h-4" />
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Detail Order
            </DialogTitle>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-4 text-sm">
              {/* Kode & Status */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="font-mono font-bold text-primary text-base">{detailOrder.kode_laundry}</span>
                <div className="flex gap-2">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', STATUS_COLORS[detailOrder.status])}>
                    {detailOrder.status}
                  </span>
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', PEMBAYARAN_COLORS[detailOrder.status_pembayaran])}>
                    {detailOrder.status_pembayaran}
                  </span>
                </div>
              </div>

              {/* Info Mitra */}
              <div className="border border-border rounded-xl p-4 space-y-1">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Mitra</p>
                <p className="font-semibold">{detailOrder.partner?.nama_toko}</p>
                {detailOrder.partner?.kota && (
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {cleanCityName(detailOrder.partner.kota)}
                  </p>
                )}
                <p className="text-muted-foreground">{detailOrder.partner?.no_telepon}</p>
              </div>

              {/* Info Customer */}
              <div className="border border-border rounded-xl p-4 space-y-1">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Customer</p>
                <p className="font-semibold">{detailOrder.customer?.nama}</p>
                <p className="text-muted-foreground">{detailOrder.customer?.no_wa}</p>
                {detailOrder.customer?.alamat && (
                  <p className="text-muted-foreground">{detailOrder.customer.alamat}</p>
                )}
              </div>

              {/* Info Order */}
              <div className="border border-border rounded-xl p-4 space-y-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Detail Order</p>
                <div className="flex justify-between"><span className="text-muted-foreground">Layanan</span><span className="font-medium">{detailOrder.jenis_layanan}</span></div>
                {detailOrder.berat && <div className="flex justify-between"><span className="text-muted-foreground">Berat</span><span>{detailOrder.berat} kg</span></div>}
                {detailOrder.jumlah_item && <div className="flex justify-between"><span className="text-muted-foreground">Jumlah Item</span><span>{detailOrder.jumlah_item} item</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Total Harga</span><span className="font-bold text-primary">{formatRupiah(detailOrder.total_harga)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Metode Bayar</span><span>{detailOrder.metode_pembayaran || '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tgl Masuk</span><span>{formatDate(detailOrder.tanggal_masuk)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Estimasi Selesai</span><span>{formatDate(detailOrder.estimasi_selesai)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tgl Selesai</span><span>{formatDate(detailOrder.tanggal_selesai)}</span></div>
                {detailOrder.catatan && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-muted-foreground mb-1">Catatan</p>
                    <p className="bg-muted/50 rounded-lg p-2">{detailOrder.catatan}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}