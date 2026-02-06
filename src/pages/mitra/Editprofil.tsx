import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { partnersAPI } from '@/lib/api';
import { useKotaIndonesia } from '@/hooks/useKotaIndonesia';
import { CityCombobox } from '@/components/CityCombobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Map, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  Info
} from 'lucide-react';

interface PartnerProfile {
  id: number;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  kota: string;
  maps_url: string | null;
  status: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const { kota: kotaList, loading: kotaLoading, error: kotaError } = useKotaIndonesia();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nama_toko: '',
    alamat: '',
    no_telepon: '',
    kota: '',
    maps_url: ''
  });

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await partnersAPI.getMyProfile();
        
        if (response.data.success) {
          const profile = response.data.data;
          setFormData({
            nama_toko: profile.nama_toko || '',
            alamat: profile.alamat || '',
            no_telepon: profile.no_telepon || '',
            kota: profile.kota || '',
            maps_url: profile.maps_url || ''
          });
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Gagal memuat data profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle kota change dari CityCombobox
  const handleKotaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      kota: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validasi nomor telepon
    const phoneRegex = /^(08|62)\d{8,11}$/;
    if (!phoneRegex.test(formData.no_telepon)) {
      setError('Format nomor telepon tidak valid (contoh: 08123456789)');
      return;
    }

    setSaving(true);

    try {
      const response = await partnersAPI.updateMyProfile(formData);
      
      if (response.data.success) {
        setSuccess('Profil berhasil diupdate!');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard/mitra');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Gagal mengupdate profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/dashboard/mitra')}
              className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                Edit Profil Mitra
              </h1>
              <p className="text-muted-foreground mt-1">
                Perbarui informasi laundry Anda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-destructive font-medium">Error</p>
                <p className="text-destructive/80 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-500 font-medium">Berhasil!</p>
                <p className="text-green-500/80 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Kota API Error Warning */}
          {kotaError && (
            <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
              <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-700 dark:text-yellow-500">
                Gagal memuat daftar lengkap. Menampilkan kota-kota utama.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 space-y-6 shadow-lg">
            {/* Nama Toko */}
            <div className="space-y-2">
              <Label htmlFor="nama_toko" className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="w-4 h-4 text-primary" />
                Nama Laundry <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama_toko"
                name="nama_toko"
                type="text"
                placeholder="Misal: Fresh & Clean Laundry"
                value={formData.nama_toko}
                onChange={handleChange}
                required
                disabled={saving}
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <Label htmlFor="alamat" className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                Alamat Lengkap <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="alamat"
                name="alamat"
                placeholder="Jl. Contoh No. 123, RT/RW 01/02, Kelurahan, Kecamatan"
                value={formData.alamat}
                onChange={handleChange}
                required
                disabled={saving}
                rows={3}
                className="resize-none transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Kota - Using CityCombobox Component */}
            <div className="space-y-2">
              <Label htmlFor="kota" className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                Kota
              </Label>
              <CityCombobox
                cities={kotaList}
                loading={kotaLoading}
                value={formData.kota}
                onValueChange={handleKotaChange}
                disabled={saving}
                placeholder="Pilih kota"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                Kota akan muncul di halaman pencarian mitra
              </p>
              {kotaLoading && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Memuat daftar kota Indonesia...
                </p>
              )}
            </div>

            {/* No Telepon */}
            <div className="space-y-2">
              <Label htmlFor="no_telepon" className="flex items-center gap-2 text-sm font-medium">
                <Phone className="w-4 h-4 text-primary" />
                No. Telepon <span className="text-destructive">*</span>
              </Label>
              <Input
                id="no_telepon"
                name="no_telepon"
                type="tel"
                placeholder="08123456789"
                value={formData.no_telepon}
                onChange={handleChange}
                required
                disabled={saving}
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
              
            </div>

            {/* Maps URL */}
            <div className="space-y-2">
              <Label htmlFor="maps_url" className="flex items-center gap-2 text-sm font-medium">
                <Map className="w-4 h-4 text-primary" />
                Google Maps URL
              </Label>
              <Input
                id="maps_url"
                name="maps_url"
                type="url"
                placeholder="https://maps.google.com/?q=..."
                value={formData.maps_url}
                onChange={handleChange}
                disabled={saving}
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
              <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl space-y-2">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Cara mendapatkan Google Maps URL:
                </p>
                <ol className="text-sm text-muted-foreground space-y-1.5 ml-6 list-decimal">
                  <li>Buka Google Maps di browser</li>
                  <li>Cari lokasi laundry Anda</li>
                  <li>Klik "Bagikan" atau "Share"</li>
                  <li>Pilih "Salin link" atau "Copy link"</li>
                  <li>Paste link di field ini</li>
                </ol>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/mitra')}
                disabled={saving}
                className="flex-1 h-12 hover:bg-secondary transition-all"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saving || kotaLoading}
                className="flex-1 h-12 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}