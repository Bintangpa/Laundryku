import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Plus, LogOut, User, Edit } from 'lucide-react';

export default function MitraDashboard() {
  const { user, partner, logout } = useAuth();
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
                Dashboard Mitra
              </h1>
              <p className="text-muted-foreground mt-1">
                {partner?.nama_toko || 'Mitra LaundryKu'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* 🆕 NEW: Edit Profile Button */}
              <Button 
                onClick={() => navigate('/dashboard/mitra/edit-profile')} 
                variant="outline"
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profil
              </Button>
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
        <div className="max-w-6xl mx-auto">
          {/* 🆕 NEW: Profile Info Card */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    {partner?.nama_toko || 'Nama Laundry'}
                  </h2>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{partner?.alamat || '-'}</p>
                    <p>{partner?.kota || '-'}</p>
                    <p>📞 {partner?.no_telepon || '-'}</p>
                    {partner?.maps_url && (
                      <a 
                        href={partner.maps_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        📍 Lihat di Google Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/dashboard/mitra/edit-profile')}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Edit className="w-3 h-3" />
                Edit
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Order Hari Ini</p>
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
                  <p className="text-sm text-muted-foreground">Order Aktif</p>
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
                  <p className="text-sm text-muted-foreground">Siap Diambil</p>
                  <p className="text-2xl font-bold text-foreground">-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon - Will be replaced in Part 3 */}
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Mitra Dashboard
              </h2>
              <p className="text-muted-foreground mb-6">
                Fitur lengkap dashboard mitra akan tersedia segera. Anda akan bisa:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left max-w-sm mx-auto">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Input order customer baru
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Lihat daftar semua order
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Update status laundry
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Generate kode tracking otomatis
                </li>
              </ul>
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 mb-4">
                <p className="text-sm text-primary font-medium">
                  ✨ Fitur ini akan segera hadir di BAGIAN 3!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}