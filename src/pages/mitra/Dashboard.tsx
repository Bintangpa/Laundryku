import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Partner } from '@/types/partner.types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Plus,
  LogOut,
  User,
  Edit,
  Loader2,
  List,
  Clock,
  CheckCircle,
  History,
  MapPin,
  Phone,
  Map,
  ArrowRight,
} from 'lucide-react';
import { ordersAPI } from '@/lib/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function MitraDashboard() {
  const { user, partner, logout, refreshPartner } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Refresh partner data dan stats saat dashboard dimuat
    const loadData = async () => {
      try {
        // Refresh partner data terlebih dahulu jika fungsi tersedia
        if (refreshPartner) {
          await refreshPartner();
        }
        // Kemudian fetch stats
        await fetchStats();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Tetap fetch stats meskipun refresh partner gagal
        await fetchStats();
      }
    };
    
    loadData();
  }, []);

  // Tambahkan listener untuk event focus window
  // Ini akan refresh data ketika user kembali ke tab/window ini
  useEffect(() => {
    const handleFocus = async () => {
      if (refreshPartner) {
        await refreshPartner();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshPartner]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getDashboardStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-primary" />
                Dashboard Mitra
              </h1>
              <p className="text-muted-foreground mt-1">
                {partner?.nama_toko || 'Mitra LaundryKu'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/dashboard/mitra/edit-profile')}
                variant="outline"
                className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
              >
                <Edit className="w-4 h-4" />
                Edit Profil
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
              >
                Beranda
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Profile Info Card - Redesigned */}
          <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl border border-border p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    {partner?.nama_toko || 'Nama Laundry'}
                  </h2>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      {partner?.alamat || '-'}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      {partner?.kota || '-'}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4 text-primary" />
                      {partner?.no_telepon || '-'}
                    </p>
                    {partner?.maps_url && (
                      <a
                        href={partner.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline font-medium"
                      >
                        <Map className="w-4 h-4" />
                        Lihat di Google Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate('/dashboard/mitra/edit-profile')}
                size="sm"
                className="gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Edit className="w-3 h-3" />
                Edit
              </Button>
            </div>
          </div>

          {/* Quick Actions - Redesigned */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate('/dashboard/mitra/create-order')}
              className="h-auto py-8 gap-3 text-base bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all group"
              size="lg"
            >
              <div className="flex flex-col items-center gap-2">
                <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Input Pesanan Baru</span>
              </div>
            </Button>
            
            <Button
              onClick={() => navigate('/dashboard/mitra/orders')}
              variant="outline"
              className="h-auto py-8 gap-3 text-base border-2 hover:bg-primary/10 hover:border-primary hover:text-primary shadow-md hover:shadow-lg transition-all group"
              size="lg"
            >
              <div className="flex flex-col items-center gap-2">
                <List className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Kelola Pesanan</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/dashboard/mitra/history')}
              variant="outline"
              className="h-auto py-8 gap-3 text-base border-2 hover:bg-purple-500/10 hover:border-purple-500 hover:text-purple-500 shadow-md hover:shadow-lg transition-all group"
              size="lg"
            >
              <div className="flex flex-col items-center gap-2">
                <History className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Riwayat Order</span>
              </div>
            </Button>
          </div>

          {/* Stats Cards - Redesigned */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Memuat data...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Total Order Hari Ini */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package className="w-7 h-7 text-blue-500" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-500/40 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Order Hari Ini
                  </p>
                  <p className="text-3xl font-bold text-blue-500">
                    {stats?.today_orders || 0}
                  </p>
                </div>

                {/* Order Aktif */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock className="w-7 h-7 text-yellow-500" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-yellow-500/40 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Order Aktif
                  </p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {stats?.active_orders || 0}
                  </p>
                </div>

                {/* Siap Diambil */}
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-7 h-7 text-green-500" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-green-500/40 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Siap Diambil
                  </p>
                  <p className="text-3xl font-bold text-green-500">
                    {stats?.ready_orders || 0}
                  </p>
                </div>
              </div>

              {/* Recent Orders */}
              {stats?.recent_orders && stats.recent_orders.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Order Terbaru
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/dashboard/mitra/orders')}
                      className="gap-2 hover:bg-primary/10 hover:text-primary"
                    >
                      Lihat Semua
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {stats.recent_orders.slice(0, 5).map((order: any) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-xl hover:from-secondary/50 hover:to-secondary/20 transition-all cursor-pointer border border-border/50 hover:border-primary/30 group"
                        onClick={() =>
                          navigate(`/dashboard/mitra/orders/${order.id}`)
                        }
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-mono font-bold text-primary text-base">
                              {order.kode_laundry}
                            </p>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                order.status === 'Selesai'
                                  ? 'bg-gray-500/20 text-gray-600 border border-gray-500/30'
                                  : order.status === 'Siap Diambil'
                                  ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                                  : 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{order.customer?.nama}</span> • {order.jenis_layanan}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="font-bold text-base">
                              {formatCurrency(order.total_harga)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(order.tanggal_masuk), 'dd MMM', {
                                locale: id,
                              })}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}