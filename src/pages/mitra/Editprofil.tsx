import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { partnersAPI } from '@/lib/api';
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
  ArrowLeft 
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/dashboard/mitra')}
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
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-destructive font-medium">Error</p>
                <p className="text-destructive/80 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-500 font-medium">Berhasil!</p>
                <p className="text-green-500/80 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-6">
            {/* Nama Toko */}
            <div className="space-y-2">
              <Label htmlFor="nama_toko" className="flex items-center gap-2">
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
              />
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <Label htmlFor="alamat" className="flex items-center gap-2">
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
              />
            </div>

            {/* Kota */}
            <div className="space-y-2">
              <Label htmlFor="kota" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Kota
              </Label>
              <Input
                id="kota"
                name="kota"
                type="text"
                placeholder="Misal: Jakarta"
                value={formData.kota}
                onChange={handleChange}
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                Kota akan muncul di halaman pencarian mitra
              </p>
            </div>

            {/* No Telepon */}
            <div className="space-y-2">
              <Label htmlFor="no_telepon" className="flex items-center gap-2">
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
              />
            </div>

            {/* Maps URL */}
            <div className="space-y-2">
              <Label htmlFor="maps_url" className="flex items-center gap-2">
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
              />
              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <p className="text-xs font-medium text-foreground">📍 Cara mendapatkan Google Maps URL:</p>
                <ol className="text-xs text-muted-foreground space-y-1 ml-4 list-decimal">
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
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 gap-2"
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