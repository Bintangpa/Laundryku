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
  Settings,
  ChevronRight,
  Layout
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

// Import panel content management
import FooterSectionPanel from './FooterSectionPanel';
import HeroSectionPanel from './HeroSectionPanel';
import ServicesSectionPanel from './ServicesSectionPanel';
// Tipe active tab untuk content management
type ContentTab = 'hero' | 'services' | 'footer';

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
  const [activeContentTab, setActiveContentTab] = useState<ContentTab>('hero');

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
      
      if (selectedCity !== 'all') params.kota = selectedCity;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

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
    const isActive = currentStatus === 'active';
    const action = isActive ? 'menonaktifkan' : 'mengaktifkan';

    try {
      await partnersAPI.toggleStatus(id.toString());
      fetchPartners();
      showToast(
        `Mitra berhasil ${action === 'menonaktifkan' ? 'dinonaktifkan' : 'diaktifkan'}!`,
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

  const activePartners = partners.filter(p => p.user?.is_active).length;
  const inactivePartners = partners.filter(p => !p.user?.is_active).length;

  const menuItems = [
    {
      icon: Users,
      label: 'Kelola Mitra',
      path: '/admin'
    },
    {
      icon: Package,
      label: 'Kelola Order',
      path: '/admin/orders'
    },
    {
      icon: Layout,
      label: 'Konten Halaman',
      path: '/admin/content'
    },
    {
      icon: Settings,
      label: 'Pengaturan',
      path: '/admin/settings'
    }
  ];

  const isContentPage = location.pathname === '/admin/content';

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
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
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

          {/* User Info & Logout */}
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
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {isContentPage ? 'Konten Halaman' : 'Kelola Mitra'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isContentPage
                    ? 'Edit konten Hero, Services, dan Footer'
                    : `${activePartners} aktif · ${inactivePartners} nonaktif`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="gap-2"
              >
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

        <div className="p-6">

          {/* ==================== */}
          {/* CONTENT MANAGEMENT   */}
          {/* ==================== */}
          {isContentPage && (
            <div>
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 bg-muted p-1 rounded-xl w-fit">
                {([
                  { key: 'hero', label: 'Hero' },
                  { key: 'services', label: 'Services' },
                  { key: 'footer', label: 'Footer' },
                ] as { key: ContentTab; label: string }[]).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveContentTab(tab.key)}
                    className={cn(
                      'px-5 py-2 rounded-lg text-sm font-medium transition-all',
                      activeContentTab === tab.key
                        ? 'bg-card shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Panel Content */}
              {activeContentTab === 'hero' && <HeroSectionPanel />}
              {activeContentTab === 'services' && <ServicesSectionPanel />}
              {activeContentTab === 'footer' && <FooterSectionPanel />}
            </div>
          )}

          {/* ==================== */}
          {/* KELOLA MITRA         */}
          {/* ==================== */}
          {!isContentPage && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Mitra</p>
                      <p className="text-2xl font-bold">{partners.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Aktif</p>
                      <p className="text-2xl font-bold">{activePartners}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nonaktif</p>
                      <p className="text-2xl font-bold">{inactivePartners}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Container - Filter & Table */}
              <div 
                className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden" 
                style={{ maxHeight: 'calc(100vh - 380px)' }}
              >
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)' }}>
                  {/* Filter & Search - STICKY di atas table */}
                  <div className="bg-card border-b border-border p-5 sticky top-0 z-10">
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="relative flex-1">
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
                  <div>
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
                                      partner.user?.is_active
                                        ? 'bg-green-100 text-green-700 border border-green-300'
                                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                                    )}
                                  >
                                    {partner.user?.is_active ? (
                                      <CheckCircle className="w-3 h-3" />
                                    ) : (
                                      <XCircle className="w-3 h-3" />
                                    )}
                                    {partner.user?.is_active ? 'Aktif' : 'Nonaktif'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      onClick={() => handleToggleStatus(partner.id, partner.user?.is_active ? 'active' : 'inactive', partner.nama_toko)}
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "gap-2",
                                        partner.user?.is_active
                                          ? "text-orange-600 hover:text-red-600 hover:bg-red-50"
                                          : "text-green-600 hover:text-green-700 hover:bg-green-50"
                                      )}
                                    >
                                      {partner.user?.is_active ? (
                                        <><Ban className="w-4 h-4" />Nonaktifkan</>
                                      ) : (
                                        <><CheckCircle className="w-4 h-4" />Aktifkan</>
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
          )}
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