import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Search,
  Filter,
  Loader2,
  Eye,
  Package,
  MapPin,
  X,
  Settings,
  ChevronRight,
  Layout,
  Menu,
  UserCheck,
  Tag,
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
  'Diproses',
  'Siap Diambil',
  'Telah Diambil',
];

const STATUS_COLORS: Record<string, string> = {
  'Diterima': 'bg-blue-100 text-blue-700 border-blue-300',
  'Diproses': 'bg-yellow-100 text-yellow-700 border-yellow-300',
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPembayaran, setSelectedPembayaran] = useState<string>('all');
  const [detailOrder, setDetailOrder] = useState<OrderItem | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: Users, label: 'Kelola Mitra', path: '/admin' },
    { icon: Package, label: 'Kelola Order', path: '/admin/orders' },
    { icon: Tag, label: 'Kelola Harga', path: '/admin/pricing' },
    { icon: Layout, label: 'Konten Halaman', path: '/admin/content' },
    { icon: Settings, label: 'Pengaturan', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-bold">Admin Panel</h2>
              </div>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">

        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Kelola Order</h1>
                <p className="text-sm text-muted-foreground">Semua order dari seluruh mitra</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate('/')} variant="outline" size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Beranda</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Order', value: orders.length, color: 'text-primary', bg: 'bg-primary/10', icon: Package },
              { label: 'Aktif', value: orders.filter(o => o.status !== 'Telah Diambil').length, color: 'text-blue-600', bg: 'bg-blue-500/10', icon: Package },
              { label: 'Siap Diambil', value: orders.filter(o => o.status === 'Siap Diambil').length, color: 'text-green-600', bg: 'bg-green-500/10', icon: Package },
              { label: 'Belum Lunas', value: orders.filter(o => o.status_pembayaran === 'Belum Lunas').length, color: 'text-red-500', bg: 'bg-red-500/10', icon: Package },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                    <stat.icon className={cn('w-5 h-5', stat.color)} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scrollable Table Container - sama persis dengan Kelola Mitra */}
          <div
            className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 320px)' }}
          >
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>

              {/* Filter - sticky di atas */}
              <div className="bg-card border-b border-border p-5 sticky top-0 z-10">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Cari kode order, nama customer, atau mitra..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-[200px] h-12">
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
                    <SelectTrigger className="w-full md:w-[200px] h-12">
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
                      className="h-12 gap-2"
                      onClick={() => { setSearchQuery(''); setSelectedStatus('all'); setSelectedPembayaran('all'); }}
                    >
                      <X className="w-4 h-4" />
                      Reset
                    </Button>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Menampilkan <span className="font-semibold text-foreground">{orders.length}</span> order
                  </p>
                </div>
              </div>

              {/* Table */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Memuat data order...</p>
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Tidak Ada Order</h3>
                  <p className="text-muted-foreground">Tidak ada order yang sesuai dengan filter</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                      {orders.map((order, index) => (
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

      {/* Sidebar Overlay Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

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

              <div className="border border-border rounded-xl p-4 space-y-1">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Customer</p>
                <p className="font-semibold">{detailOrder.customer?.nama}</p>
                <p className="text-muted-foreground">{detailOrder.customer?.no_wa}</p>
                {detailOrder.customer?.alamat && (
                  <p className="text-muted-foreground">{detailOrder.customer.alamat}</p>
                )}
              </div>

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