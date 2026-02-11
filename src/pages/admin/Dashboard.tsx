import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/lib/toast-helper';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  LogOut,
  Search,
  Filter,
  Loader2,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Ban,
  UserCheck,
  Menu,
  X,
  Package,
  FileText,
  Settings,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
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
import { partnersAPI } from '@/lib/api';
import { Partner } from '@/types/partner.types';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [partners, setPartners] = useState<Partner[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCities();
    fetchPartners();
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [selectedCity, selectedStatus, searchQuery]);

  const fetchCities = async () => {
    try {
      const response = await partnersAPI.getAvailableCities();
      if (response.data.success) {
        setCities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (selectedCity !== 'all') {
        params.kota = selectedCity;
      }
      
      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await partnersAPI.getAll(params);
      if (response.data.success) {
        setPartners(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string, nama: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'mengaktifkan' : 'menonaktifkan';

    try {
      await partnersAPI.update(id.toString(), { status: newStatus });
      fetchPartners();
      showToast(
        `Mitra berhasil ${action === 'mengaktifkan' ? 'diaktifkan' : 'dinonaktifkan'}!`,
        'success'
      );
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Gagal mengubah status mitra!', 'error');
    }
  };

  const handleDelete = async (id: number, nama: string) => {
    try {
      await partnersAPI.delete(id.toString());
      fetchPartners();
      showToast('Mitra berhasil dihapus!', 'success');
    } catch (error) {
      console.error('Error deleting partner:', error);
      showToast('Gagal menghapus mitra!', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cleanCityName = (cityName: string): string => {
    return cityName
      .replace(/^KABUPATEN\s+/i, '')
      .replace(/^KOTA\s+/i, '')
      .trim();
  };

  const activePartners = partners.filter(p => p.status === 'active').length;
  const inactivePartners = partners.filter(p => p.status === 'inactive').length;

  // Menu items
  const menuItems = [
    {
      icon: Users,
      label: 'Kelola Mitra',
      path: '/admin',
      active: true
    },
    {
      icon: FileText,
      label: 'Manajemen Kota',
      path: '/admin/cities',
      active: false,
      badge: 'Soon'
    },
    {
      icon: Settings,
      label: 'Pengaturan',
      path: '/admin/settings',
      active: false,
      badge: 'Soon'
    }
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
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-bold">Admin Panel</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  if (item.active) {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }
                }}
                disabled={!item.active}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all",
                  item.active
                    ? location.pathname === item.path
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-secondary"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {item.badge}
                  </span>
                )}
                {item.active && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="mb-3">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/')} variant="outline" size="sm" className="flex-1">
                Beranda
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-30">
          <div className="container px-4 py-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold">Kelola Mitra</h1>
            <div className="w-10" />
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-30">
          <div className="container px-4 py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Kelola Mitra</h1>
              <p className="text-muted-foreground mt-1">
                Manage semua mitra laundry
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <p className="text-sm text-muted-foreground">Total Mitra</p>
                </div>
                <p className="text-3xl font-bold text-blue-500">{partners.length}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <UserCheck className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-muted-foreground">Mitra Aktif</p>
                </div>
                <p className="text-3xl font-bold text-green-500">{activePartners}</p>
              </div>

              <div className="bg-gradient-to-br from-gray-500/10 to-gray-500/5 border border-gray-500/20 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <Ban className="w-5 h-5 text-gray-500" />
                  <p className="text-sm text-muted-foreground">Nonaktif</p>
                </div>
                <p className="text-3xl font-bold text-gray-500">{inactivePartners}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <p className="text-sm text-muted-foreground">Kota Aktif</p>
                </div>
                <p className="text-3xl font-bold text-purple-500">{cities.length}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari nama mitra, email, atau telepon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>

                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full md:w-[200px] h-12">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <SelectValue placeholder="Semua Kota" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kota</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {cleanCityName(city)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-[180px] h-12">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-primary" />
                      <SelectValue placeholder="Semua Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>

              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Menampilkan <span className="font-semibold text-foreground">{partners.length}</span> mitra
                  {selectedCity !== 'all' && (
                    <span> di <span className="font-semibold text-primary">{cleanCityName(selectedCity)}</span></span>
                  )}
                  {searchQuery && (
                    <span> untuk "<span className="font-semibold text-foreground">{searchQuery}</span>"</span>
                  )}
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Memuat data mitra...</p>
                  </div>
                </div>
              ) : partners.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Tidak Ada Mitra</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCity !== 'all' 
                      ? 'Tidak ada mitra yang sesuai dengan filter'
                      : 'Belum ada mitra yang terdaftar'}
                  </p>
                  {(searchQuery || selectedCity !== 'all' || selectedStatus !== 'all') && (
                    <Button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCity('all');
                        setSelectedStatus('all');
                      }}
                      variant="outline"
                    >
                      Reset Filter
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">No</TableHead>
                        <TableHead>Nama Toko</TableHead>
                        <TableHead>Kota</TableHead>
                        <TableHead>Kontak</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partners.map((partner, index) => (
                        <TableRow key={partner.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{partner.nama_toko}</p>
                              <p className="text-xs text-muted-foreground">{partner.alamat}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span>{cleanCityName(partner.kota || '-')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                <span>{partner.no_telepon}</span>
                              </div>
                              {partner.user && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs">{partner.user.email}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
                                partner.status === 'active'
                                  ? 'bg-green-100 text-green-700 border border-green-300'
                                  : 'bg-gray-100 text-gray-700 border border-gray-300'
                              )}
                            >
                              {partner.status === 'active' ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {partner.status === 'active' ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                onClick={() => handleToggleStatus(partner.id, partner.status, partner.nama_toko)}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "gap-2",
                                  partner.status === 'active' 
                                    ? "text-orange-600 hover:text-red-600 hover:bg-red-50"
                                    : "text-green-600 hover:text-green-700 hover:bg-green-50"
                                )}
                              >
                                {partner.status === 'active' ? (
                                  <>
                                    <Ban className="w-4 h-4" />
                                    Nonaktifkan
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    Aktifkan
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={() => handleDelete(partner.id, partner.nama_toko)}
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-destructive hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                Hapus
                              </Button>
                            </div>
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

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}