import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '@/lib/api';
import { showToast } from '@/lib/toast-helper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
  Mail,
  Lock,
  Loader2,
  Menu,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Email form state
  const [emailForm, setEmailForm] = useState({
    current_password: '',
    new_email: ''
  });
  const [emailLoading, setEmailLoading] = useState(false);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Show password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // Menu items
  const menuItems = [
    {
      icon: Users,
      label: 'Kelola Mitra',
      path: '/admin',
      active: false
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
      active: true
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle update email
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailForm.current_password || !emailForm.new_email) {
      showToast('Semua field wajib diisi', 'error');
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.new_email)) {
      showToast('Format email tidak valid', 'error');
      return;
    }

    try {
      setEmailLoading(true);
      const response = await adminAPI.updateEmail(emailForm);

      if (response.data.success) {
        showToast('Email berhasil diubah! Silakan login kembali.', 'success');
        
        // Reset form
        setEmailForm({ current_password: '', new_email: '' });
        
        // Logout dan redirect ke login
        setTimeout(() => {
          logout();
          navigate('/');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error updating email:', error);
      showToast(
        error.response?.data?.message || 'Gagal mengubah email',
        'error'
      );
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle update password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      showToast('Semua field wajib diisi', 'error');
      return;
    }

    if (passwordForm.new_password.length < 6) {
      showToast('Password baru minimal 6 karakter', 'error');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showToast('Konfirmasi password tidak cocok', 'error');
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await adminAPI.updatePassword(passwordForm);

      if (response.data.success) {
        showToast('Password berhasil diubah! Silakan login kembali.', 'success');
        
        // Reset form
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        
        // Logout dan redirect ke login
        setTimeout(() => {
          logout();
          navigate('/');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      showToast(
        error.response?.data?.message || 'Gagal mengubah password',
        'error'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

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
                  if (!item.badge) {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }
                }}
                disabled={!!item.badge}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  item.active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : item.badge
                    ? "text-muted-foreground cursor-not-allowed opacity-50"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted mb-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">
                  {user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Pengaturan</h1>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="container px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Pengaturan Akun</h1>
            <p className="text-muted-foreground mt-2">
              Kelola email dan password akun admin Anda
            </p>
          </div>

          <div className="space-y-6">
            {/* Update Email Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Ubah Email
                </CardTitle>
                <CardDescription>
                  Perbarui alamat email Anda. Anda akan diminta login kembali setelah mengubah email.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-current-email">Email Saat Ini</Label>
                    <Input
                      id="email-current-email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-new">Email Baru</Label>
                    <Input
                      id="email-new"
                      type="email"
                      placeholder="email-baru@example.com"
                      value={emailForm.new_email}
                      onChange={(e) =>
                        setEmailForm({ ...emailForm, new_email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-password">Konfirmasi Password</Label>
                    <div className="relative">
                      <Input
                        id="email-password"
                        type={showEmailPassword ? "text" : "password"}
                        placeholder="Masukkan password saat ini"
                        value={emailForm.current_password}
                        onChange={(e) =>
                          setEmailForm({ ...emailForm, current_password: e.target.value })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowEmailPassword(!showEmailPassword)}
                      >
                        {showEmailPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={emailLoading}
                    className="w-full gap-2"
                  >
                    {emailLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {emailLoading ? 'Menyimpan...' : 'Ubah Email'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Update Password Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Ubah Password
                </CardTitle>
                <CardDescription>
                  Perbarui password Anda. Anda akan diminta login kembali setelah mengubah password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password-current">Password Saat Ini</Label>
                    <div className="relative">
                      <Input
                        id="password-current"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Masukkan password saat ini"
                        value={passwordForm.current_password}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            current_password: e.target.value
                          })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-new">Password Baru</Label>
                    <div className="relative">
                      <Input
                        id="password-new"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Minimal 6 karakter"
                        value={passwordForm.new_password}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            new_password: e.target.value
                          })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-confirm">Konfirmasi Password Baru</Label>
                    <div className="relative">
                      <Input
                        id="password-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Ulangi password baru"
                        value={passwordForm.confirm_password}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirm_password: e.target.value
                          })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full gap-2"
                  >
                    {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {passwordLoading ? 'Menyimpan...' : 'Ubah Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
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