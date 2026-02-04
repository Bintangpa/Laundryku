import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WashingMachine, Mail, Lock, Store, MapPin, Phone, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nama_toko: '',
    alamat: '',
    no_telepon: '',
    kota: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      
      // Registration success - redirect to mitra dashboard
      navigate('/mitra');
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <WashingMachine className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Daftar Sebagai Mitra
          </h1>
          <p className="text-muted-foreground">
            Bergabung dengan LaundryKu dan kelola bisnis laundry Anda
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Keuntungan Menjadi Mitra:</p>
                <ul className="text-xs space-y-1 text-primary/80">
                  <li>• Dashboard untuk kelola order customer</li>
                  <li>• Sistem tracking otomatis untuk customer</li>
                  <li>• Notifikasi WhatsApp (coming soon)</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@laundry.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-12 h-12"
                    required
                  />
                </div>
              </div>

              {/* Nama Toko */}
              <div className="space-y-2">
                <label htmlFor="nama_toko" className="text-sm font-medium text-foreground">
                  Nama Toko <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="nama_toko"
                    name="nama_toko"
                    type="text"
                    placeholder="Fresh Clean Laundry"
                    value={formData.nama_toko}
                    onChange={handleChange}
                    className="pl-12 h-12"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-12 h-12"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Konfirmasi Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-12 h-12"
                    required
                  />
                </div>
              </div>

              {/* No Telepon */}
              <div className="space-y-2">
                <label htmlFor="no_telepon" className="text-sm font-medium text-foreground">
                  No. Telepon <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="no_telepon"
                    name="no_telepon"
                    type="tel"
                    placeholder="08123456789"
                    value={formData.no_telepon}
                    onChange={handleChange}
                    className="pl-12 h-12"
                    required
                  />
                </div>
              </div>

              {/* Kota */}
              <div className="space-y-2">
                <label htmlFor="kota" className="text-sm font-medium text-foreground">
                  Kota
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="kota"
                    name="kota"
                    type="text"
                    placeholder="Jakarta"
                    value={formData.kota}
                    onChange={handleChange}
                    className="pl-12 h-12"
                  />
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <label htmlFor="alamat" className="text-sm font-medium text-foreground">
                Alamat Lengkap <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                <Input
                  id="alamat"
                  name="alamat"
                  type="text"
                  placeholder="Jl. Contoh No. 123, Jakarta"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="pl-12 h-12"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login di sini
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}