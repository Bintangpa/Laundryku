import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  LogOut,
  TrendingUp,
  DollarSign,
  UserCheck,
  Loader2
} from 'lucide-react';
import { dashboardAPI } from '@/lib/api';

interface AdminStats {
  overview: {
    total_orders: number;
    total_revenue: number;
    total_partners: number;
    total_customers: number;
  };
  orders_by_status: {
    [key: string]: number;
  };
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getAdminStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
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
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Selamat datang, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate('/')} variant="outline">
                Beranda
              </Button>
              <Button onClick={handleLogout} variant="outline" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate('/dashboard/admin/partners')}
              className="h-auto py-6 gap-3 text-base bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all group"
              size="lg"
            >
              <div className="flex flex-col items-center gap-2">
                <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Kelola Mitra</span>
              </div>
            </Button>
            
            <Button
              onClick={() => navigate('/dashboard/admin/orders')}
              variant="outline"
              className="h-auto py-6 gap-3 text-base border-2 hover:bg-primary/10 hover:border-primary hover:text-primary shadow-md hover:shadow-lg transition-all group"
              size="lg"
            >
              <div className="flex flex-col items-center gap-2">
                <Package className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Kelola Order</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/dashboard/admin/reports')}
              variant="outline"
              className="h-auto py-6 gap-3 text-base border-2 hover:bg-purple-500/10 hover:border-purple-500 hover:text-purple-500 shadow-md hover:shadow-lg transition-all group"
              size="lg"
            >
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Laporan</span>
              </div>
            </Button>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Memuat data...</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Mitra */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-7 h-7 text-blue-500" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Mitra</p>
                <p className="text-3xl font-bold text-blue-500">
                  {stats?.overview.total_partners || 0}
                </p>
              </div>

              {/* Total Order */}
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Package className="w-7 h-7 text-green-500" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Order</p>
                <p className="text-3xl font-bold text-green-500">
                  {stats?.overview.total_orders || 0}
                </p>
              </div>

              {/* Total Revenue */}
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <DollarSign className="w-7 h-7 text-purple-500" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-500">
                  {formatCurrency(stats?.overview.total_revenue || 0)}
                </p>
              </div>

              {/* Total Customer */}
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <UserCheck className="w-7 h-7 text-orange-500" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Customer</p>
                <p className="text-3xl font-bold text-orange-500">
                  {stats?.overview.total_customers || 0}
                </p>
              </div>
            </div>
          )}

          {/* Status Breakdown */}
          {stats?.orders_by_status && Object.keys(stats.orders_by_status).length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order by Status
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(stats.orders_by_status).map(([status, count]) => (
                  <div key={status} className="bg-secondary/30 rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">{status}</p>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}