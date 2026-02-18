import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useKotaIndonesia } from '@/hooks/useKotaIndonesia';
import { CityCombobox } from '@/components/CityCombobox';
import { stripCityPrefix } from '@/lib/cityUtils'; // 🆕 Import utility
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  WashingMachine, 
  Mail, 
  Lock, 
  Building2,
  MapPin,
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Info
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
    kota: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleKotaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      kota: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);

    try {
      // 🆕 FIX: Strip prefix KABUPATEN/KOTA sebelum kirim ke backend
      const registerData = {
        email: formData.email,
        password: formData.password,
        nama_toko: formData.nama_toko,
        alamat: formData.alamat,
        no_telepon: formData.no_telepon,
        kota: stripCityPrefix(formData.kota) // 🆕 Strip prefix
      };

      await register(registerData);
      
      // Redirect akan dilakukan oleh AuthContext
      setTimeout(() => {
        navigate('/mitra');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
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
            Bergabung dengan jaringan laundry LaundryKu
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

            {/* Kota API Error Warning */}
            {kotaError && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-700 dark:text-yellow-500">
                  Gagal memuat daftar lengkap. Menampilkan kota-kota utama.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-12 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Nama Toko */}
              <div className="space-y-2">
                <Label htmlFor="nama_toko">Nama Laundry <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="nama_toko"
                    name="nama_toko"
                    type="text"
                    placeholder="Fresh & Clean Laundry"
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
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-12 pr-12 h-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-12 pr-12 h-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Alamat (Full Width) */}
            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat Lengkap <span className="text-destructive">*</span></Label>
              <Textarea
                id="alamat"
                name="alamat"
                placeholder="Jl. Contoh No. 123, RT/RW 01/02, Kelurahan, Kecamatan"
                value={formData.alamat}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* No Telepon */}
              <div className="space-y-2">
                <Label htmlFor="no_telepon">No. Telepon <span className="text-destructive">*</span></Label>
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
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Kota */}
              <div className="space-y-2">
                <Label htmlFor="kota">Kota</Label>
                <CityCombobox
                  cities={kotaList}
                  loading={kotaLoading}
                  value={formData.kota}
                  onValueChange={handleKotaChange}
                  disabled={isLoading}
                  placeholder="Pilih kota"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || kotaLoading}
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