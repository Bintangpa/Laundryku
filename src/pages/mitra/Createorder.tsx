import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  User,
  Phone,
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shirt,
  Calculator,
  Calendar,
  Package,
} from 'lucide-react';

const JENIS_LAYANAN = [
  { value: 'Laundry Kiloan', label: 'Laundry Kiloan', unit: 'kg' },
  { value: 'Laundry Satuan', label: 'Laundry Satuan', unit: 'item' },
  { value: 'Express 6 Jam', label: 'Express 6 Jam', unit: 'kg' },
  { value: 'Dry Cleaning', label: 'Dry Cleaning', unit: 'item' },
  { value: 'Setrika Saja', label: 'Setrika Saja', unit: 'kg' },
  { value: 'Deep Clean', label: 'Deep Clean', unit: 'item' },
];

export default function CreateOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Customer data
    nama: '',
    no_wa: '',
    alamat: '',
    // Order data
    jenis_layanan: '',
    berat: '',
    jumlah_item: '',
    catatan: '',
    total_harga: '',
    estimasi_selesai: '',
    status_pembayaran: 'Belum Lunas',
  });

  const selectedService = JENIS_LAYANAN.find(
    (s) => s.value === formData.jenis_layanan
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Validation
      if (!formData.nama || !formData.no_wa || !formData.jenis_layanan || !formData.total_harga) {
        throw new Error('Mohon lengkapi semua field yang wajib diisi');
      }

      // Prepare data
      const orderData = {
        nama: formData.nama,
        no_wa: formData.no_wa,
        alamat: formData.alamat || null,
        jenis_layanan: formData.jenis_layanan,
        berat: formData.berat ? parseFloat(formData.berat) : null,
        jumlah_item: formData.jumlah_item ? parseInt(formData.jumlah_item) : null,
        catatan: formData.catatan || null,
        total_harga: parseFloat(formData.total_harga),
        estimasi_selesai: formData.estimasi_selesai || null,
        metode_pembayaran: null, // No longer collected
        status_pembayaran: formData.status_pembayaran,
      };

      const response = await ordersAPI.create(orderData);

      if (response.data.success) {
        const kodeTracking = response.data.data.kode_laundry;
        setGeneratedCode(kodeTracking);
        setSuccess(`Order berhasil dibuat! Kode tracking: ${kodeTracking}`);

        // Reset form
        setFormData({
          nama: '',
          no_wa: '',
          alamat: '',
          jenis_layanan: '',
          berat: '',
          jumlah_item: '',
          catatan: '',
          total_harga: '',
          estimasi_selesai: '',
          status_pembayaran: 'Belum Lunas',
        });

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/dashboard/mitra/orders');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(
        err.response?.data?.message || err.message || 'Gagal membuat order'
      );
    } finally {
      setLoading(false);
    }
  };

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
                <Plus className="w-6 h-6 text-primary" />
                Input Pesanan Baru
              </h1>
              <p className="text-muted-foreground mt-1">
                Tambah pesanan laundry dari customer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Alert Messages */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-destructive font-medium">Error</p>
                <p className="text-destructive/80 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-green-500 font-medium">Berhasil!</p>
                <p className="text-green-500/80 text-sm">{success}</p>
                {generatedCode && (
                  <div className="mt-3 p-4 bg-green-500/5 rounded-xl border border-green-500/20">
                    <p className="text-xs text-green-600 mb-2 font-medium flex items-center gap-2">
                      <Package className="w-3 h-3" />
                      Kode Tracking:
                    </p>
                    <p className="text-2xl font-bold text-green-600 tracking-wider font-mono">
                      {generatedCode}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Customer */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Data Customer
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Nama Customer <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nama"
                    name="nama"
                    type="text"
                    placeholder="Nama lengkap customer"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="no_wa" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    No. WhatsApp <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="no_wa"
                    name="no_wa"
                    type="tel"
                    placeholder="08123456789"
                    value={formData.no_wa}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Alamat (Opsional)
                  </Label>
                  <Textarea
                    id="alamat"
                    name="alamat"
                    placeholder="Alamat lengkap customer..."
                    value={formData.alamat}
                    onChange={handleChange}
                    disabled={loading}
                    rows={2}
                    className="resize-none transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Detail Laundry */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shirt className="w-5 h-5 text-primary" />
                Detail Laundry
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jenis_layanan" className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Jenis Layanan <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.jenis_layanan}
                    onValueChange={(value) =>
                      handleSelectChange('jenis_layanan', value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih jenis layanan" />
                    </SelectTrigger>
                    <SelectContent>
                      {JENIS_LAYANAN.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedService?.unit === 'kg' && (
                  <div className="space-y-2">
                    <Label htmlFor="berat">Berat (kg)</Label>
                    <Input
                      id="berat"
                      name="berat"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Contoh: 3.5"
                      value={formData.berat}
                      onChange={handleChange}
                      disabled={loading}
                      className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}

                {selectedService?.unit === 'item' && (
                  <div className="space-y-2">
                    <Label htmlFor="jumlah_item">Jumlah Item</Label>
                    <Input
                      id="jumlah_item"
                      name="jumlah_item"
                      type="number"
                      min="1"
                      placeholder="Contoh: 5"
                      value={formData.jumlah_item}
                      onChange={handleChange}
                      disabled={loading}
                      className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="catatan">Catatan (Opsional)</Label>
                  <Textarea
                    id="catatan"
                    name="catatan"
                    placeholder="Catatan khusus untuk laundry ini..."
                    value={formData.catatan}
                    onChange={handleChange}
                    disabled={loading}
                    rows={2}
                    className="resize-none transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Pembayaran & Estimasi */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Pembayaran & Estimasi
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="total_harga" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-primary" />
                    Total Harga (Rp) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="total_harga"
                    name="total_harga"
                    type="number"
                    min="0"
                    placeholder="Contoh: 25000"
                    value={formData.total_harga}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status_pembayaran">Status Pembayaran</Label>
                  <Select
                    value={formData.status_pembayaran}
                    onValueChange={(value) =>
                      handleSelectChange('status_pembayaran', value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                      <SelectItem value="Lunas">Lunas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimasi_selesai" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Estimasi Selesai (Opsional)
                  </Label>
                  <Input
                    id="estimasi_selesai"
                    name="estimasi_selesai"
                    type="date"
                    value={formData.estimasi_selesai}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/mitra')}
                disabled={loading}
                className="flex-1 h-12 hover:bg-secondary transition-all"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Simpan Pesanan
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