import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useKotaIndonesia } from '@/hooks/useKotaIndonesia';
import { CityCombobox } from '@/components/CityCombobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  WashingMachine, 
  Mail, 
  Lock, 
  Store, 
  MapPin, 
  Phone, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  CheckCircle2,
  Info,
  Sparkles
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { kota: kotaList, loading: kotaLoading, error: kotaError } = useKotaIndonesia();
  
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
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    no_telepon?: string;
    kota?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setFieldErrors({});

    // ✅ Frontend Validasi
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    // ✅ Validasi format nomor telepon Indonesia
    const phoneRegex = /^(08|62)\d{8,11}$/;
    if (!phoneRegex.test(formData.no_telepon)) {
      setFieldErrors({ no_telepon: 'Format nomor telepon tidak valid (contoh: 08123456789)' });
      setError('Periksa kembali nomor telepon Anda');
      return;
    }

    // ✅ Validasi nama toko minimal 3 karakter
    if (formData.nama_toko.length < 3) {
      setError('Nama toko minimal 3 karakter');
      return;
    }

    // ✅ Validasi alamat minimal 10 karakter
    if (formData.alamat.length < 10) {
      setError('Alamat minimal 10 karakter');
      return;
    }

    // ✅ Validasi kota harus dipilih
    if (!formData.kota || formData.kota.trim() === '') {
      setFieldErrors({ kota: 'Silakan pilih kota' });
      setError('Kota harus dipilih');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      
      setSuccessMessage('Registrasi berhasil! Selamat datang di LaundryKu 🎉');
      
      setTimeout(() => {
        navigate('/mitra');
      }, 1500);
      
    } catch (err: any) {
      setIsLoading(false);
      
      const errorMessage = err.message || 'Registrasi gagal. Silakan coba lagi.';
      
      if (errorMessage.toLowerCase().includes('email sudah terdaftar')) {
        setFieldErrors({ email: 'Email ini sudah terdaftar. Gunakan email lain atau login.' });
        setError('Email sudah terdaftar');
      } else if (errorMessage.toLowerCase().includes('nomor telepon sudah terdaftar')) {
        setFieldErrors({ no_telepon: 'Nomor telepon ini sudah terdaftar. Gunakan nomor lain.' });
        setError('Nomor telepon sudah terdaftar');
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear field error saat user mulai ngetik lagi
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: undefined,
      });
    }
  };

  // Handle kota selection dari CityCombobox
  const handleKotaChange = (value: string) => {
    setFormData({
      ...formData,
      kota: value,
    });
    
    if (fieldErrors.kota) {
      setFieldErrors({
        ...fieldErrors,
        kota: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4 shadow-lg">
            <WashingMachine className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Daftar Sebagai Mitra
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Bergabung dengan LaundryKu dan kelola bisnis laundry Anda
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 animate-in zoom-in duration-300" />
                <p className="font-medium">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Kota API Error Warning */}
            {kotaError && (
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-700 dark:text-yellow-500 text-xs">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  Gagal memuat daftar lengkap. Menampilkan kota-kota utama.
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl text-primary">
              <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-2">Keuntungan Menjadi Mitra:</p>
                <ul className="text-xs space-y-1.5 text-primary/90">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>Dashboard untuk kelola order customer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>Sistem tracking otomatis untuk customer</span>
                  </li>
                  
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-1">
                  Email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@laundry.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={cn(
                      "pl-12 h-12 transition-all",
                      fieldErrors.email && "border-destructive focus-visible:ring-destructive"
                    )}
                    required
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Nama Toko */}
              <div className="space-y-2">
                <label htmlFor="nama_toko" className="text-sm font-medium text-foreground flex items-center gap-1">
                  Nama Toko <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="nama_toko"
                    name="nama_toko"
                    type="text"
                    placeholder="Nama Laundry"
                    value={formData.nama_toko}
                    onChange={handleChange}
                    className="pl-12 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-1">
                  Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-12 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground flex items-center gap-1">
                  Konfirmasi Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-12 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* No Telepon */}
              <div className="space-y-2">
                <label htmlFor="no_telepon" className="text-sm font-medium text-foreground flex items-center gap-1">
                  No. Telepon <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="no_telepon"
                    name="no_telepon"
                    type="tel"
                    placeholder="08123456789"
                    value={formData.no_telepon}
                    onChange={handleChange}
                    className={cn(
                      "pl-12 h-12 transition-all",
                      fieldErrors.no_telepon && "border-destructive focus-visible:ring-destructive"
                    )}
                    required
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.no_telepon && (
                  <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.no_telepon}
                  </p>
                )}
              </div>

              {/* Kota - Using CityCombobox Component */}
              <div className="space-y-2">
                <label htmlFor="kota" className="text-sm font-medium text-foreground flex items-center gap-1">
                  Kota <span className="text-destructive">*</span>
                </label>
                <CityCombobox
                  cities={kotaList}
                  loading={kotaLoading}
                  value={formData.kota}
                  onValueChange={handleKotaChange}
                  disabled={isLoading}
                  error={!!fieldErrors.kota}
                  placeholder="Pilih kota"
                />
                {fieldErrors.kota && (
                  <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.kota}
                  </p>
                )}
                {kotaLoading && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Memuat daftar kota Indonesia...
                  </p>
                )}
              </div>
            </div>

            {/* Alamat - Full Width */}
            <div className="space-y-2">
              <label htmlFor="alamat" className="text-sm font-medium text-foreground flex items-center gap-1">
                Alamat Lengkap <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="alamat"
                  name="alamat"
                  type="text"
                  placeholder="Jl. Contoh No. 123 (minimal 10 karakter)"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="pl-12 h-12"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || kotaLoading}
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                successMessage ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2 animate-pulse" />
                    Berhasil! Mengarahkan...
                  </>
                ) : (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Mendaftar...
                  </>
                )
              ) : (
                'Daftar Sekarang'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold transition-colors">
                Login di sini
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function untuk cn (class names merge)
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}