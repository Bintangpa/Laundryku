import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Package, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
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
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Mitra</p>
                  <p className="text-2xl font-bold text-foreground">-</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Order</p>
                  <p className="text-2xl font-bold text-foreground">-</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Aktif</p>
                  <p className="text-2xl font-bold text-foreground">-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Admin Dashboard
              </h2>
              <p className="text-muted-foreground mb-6">
                Fitur admin dashboard sedang dalam pengembangan. Anda akan bisa mengelola semua mitra dan order dari sini.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}