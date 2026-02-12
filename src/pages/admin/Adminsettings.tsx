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
  Layout,
  Settings,
  LogOut,
  ArrowLeft,
  Mail,
  Lock,
  Loader2,
  Menu,
  X,
  Eye,
  EyeOff,
  ChevronRight,
  UserCheck
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
      icon: Layout,
      label: 'Konten Halaman',
      path: '/admin/content',
      active: false
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
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all",
                  item.active
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
                <h1 className="text-xl font-bold text-foreground">Pengaturan</h1>
                <p className="text-sm text-muted-foreground">Kelola email dan password akun admin Anda</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            {/* Single Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Akun Admin</CardTitle>
                <CardDescription>
                  Ubah email dan password akun Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Current Info */}
                <div className="space-y-4 pb-6 border-b">
                  <h3 className="font-semibold text-foreground">Informasi Saat Ini</h3>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      type="text"
                      value="Admin"
                      disabled
                      className="bg-muted capitalize"
                    />
                  </div>
                </div>

                {/* Update Email Form */}
                <form onSubmit={handleUpdateEmail} className="space-y-4 pb-6 border-b">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Ubah Email
                  </h3>
                  
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-password">Password Saat Ini (untuk konfirmasi)</Label>
                    <div className="relative">
                      <input
                        id="email-password"
                        type={showEmailPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={emailForm.current_password}
                        onChange={(e) =>
                          setEmailForm({ ...emailForm, current_password: e.target.value })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-textfield-decoration-container]:pr-0"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                        onClick={() => setShowEmailPassword(!showEmailPassword)}
                      >
                        {showEmailPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
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

                {/* Update Password Form */}
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Ubah Password
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-current">Password Saat Ini</Label>
                    <div className="relative">
                      <input
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-textfield-decoration-container]:pr-0"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-new">Password Baru</Label>
                    <div className="relative">
                      <input
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-textfield-decoration-container]:pr-0"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-confirm">Konfirmasi Password Baru</Label>
                    <div className="relative">
                      <input
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-textfield-decoration-container]:pr-0"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
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