import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI, pricingAPI } from '@/lib/api';
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
  Copy,
  X,
  Sparkles,
} from 'lucide-react';

interface ServicePricing {
  id: number;
  service_name: string;
  service_key: string;
  price_per_unit: number;
  unit_type: 'kg' | 'item';
}

// Map nama layanan ke service_key untuk lookup harga
const SERVICE_KEY_MAP: Record<string, string> = {
  'Laundry Kiloan':  'laundry_kiloan',
  'Express 6 Jam':   'express_6_jam',
  'Setrika Saja':    'setrika_saja',
  'Laundry Satuan':  'laundry_satuan',
  'Dry Cleaning':    'dry_cleaning',
  'Deep Clean':      'deep_clean',
};

const JENIS_LAYANAN = [
  { value: 'Laundry Kiloan', label: 'Laundry Kiloan', unit: 'kg' },
  { value: 'Laundry Satuan', label: 'Laundry Satuan', unit: 'item' },
  { value: 'Express 6 Jam',  label: 'Express 6 Jam',  unit: 'kg'   },
  { value: 'Dry Cleaning',   label: 'Dry Cleaning',   unit: 'item' },
  { value: 'Setrika Saja',   label: 'Setrika Saja',   unit: 'kg'   },
  { value: 'Deep Clean',     label: 'Deep Clean',     unit: 'item' },
];

export default function CreateOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pricing state
  const [pricingMap, setPricingMap] = useState<Record<string, ServicePricing>>({});
  const [autoCalcInfo, setAutoCalcInfo] = useState<string | null>(null);

  const [formData, setFormData] = useState({
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

  const selectedService = JENIS_LAYANAN.find((s) => s.value === formData.jenis_layanan);

  // Fetch harga dari API saat komponen mount
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await pricingAPI.getAll();
        if (response.data.success) {
          const map: Record<string, ServicePricing> = {};
          response.data.data.forEach((item: ServicePricing) => {
            map[item.service_key] = item;
          });
          setPricingMap(map);
        }
      } catch (err) {
        console.error('Gagal fetch pricing:', err);
        // Tidak blokir form jika fetch gagal, mitra bisa input manual
      }
    };
    fetchPricing();
  }, []);

  // Auto-kalkulasi harga saat layanan / berat / jumlah_item berubah
  useEffect(() => {
    if (!formData.jenis_layanan) return;

    const serviceKey = SERVICE_KEY_MAP[formData.jenis_layanan];
    const pricing = pricingMap[serviceKey];
    if (!pricing) return;

    if (pricing.unit_type === 'kg' && formData.berat) {
      const berat = parseFloat(formData.berat);
      if (!isNaN(berat) && berat > 0) {
        const total = berat * pricing.price_per_unit;
        setFormData((prev) => ({ ...prev, total_harga: formatRupiah(total.toString()) }));
        setAutoCalcInfo(`${berat} kg × Rp ${pricing.price_per_unit.toLocaleString('id-ID')} = Rp ${total.toLocaleString('id-ID')}`);
      }
    } else if (pricing.unit_type === 'item' && formData.jumlah_item) {
      const jumlah = parseInt(formData.jumlah_item);
      if (!isNaN(jumlah) && jumlah > 0) {
        const total = jumlah * pricing.price_per_unit;
        setFormData((prev) => ({ ...prev, total_harga: formatRupiah(total.toString()) }));
        setAutoCalcInfo(`${jumlah} item × Rp ${pricing.price_per_unit.toLocaleString('id-ID')} = Rp ${total.toLocaleString('id-ID')}`);
      }
    }
  }, [formData.jenis_layanan, formData.berat, formData.jumlah_item, pricingMap]);

  // Reset auto calc info saat ganti layanan
  useEffect(() => {
    setAutoCalcInfo(null);
    setFormData((prev) => ({ ...prev, total_harga: '', berat: '', jumlah_item: '' }));
  }, [formData.jenis_layanan]);

  const formatRupiah = (value: string) => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseRupiah = (value: string) => value.replace(/\./g, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseRupiah(rawValue);
    const formattedValue = formatRupiah(numericValue);
    setAutoCalcInfo(null); // user override manual
    setFormData((prev) => ({ ...prev, total_harga: formattedValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!formData.nama || !formData.no_wa || !formData.jenis_layanan || !formData.total_harga) {
        throw new Error('Mohon lengkapi semua field yang wajib diisi');
      }

      const orderData = {
        nama: formData.nama,
        no_wa: formData.no_wa,
        alamat: formData.alamat || null,
        jenis_layanan: formData.jenis_layanan,
        berat: formData.berat ? parseFloat(formData.berat) : null,
        jumlah_item: formData.jumlah_item ? parseInt(formData.jumlah_item) : null,
        catatan: formData.catatan || null,
        total_harga: parseFloat(parseRupiah(formData.total_harga)),
        estimasi_selesai: formData.estimasi_selesai || null,
        metode_pembayaran: null,
        status_pembayaran: formData.status_pembayaran,
      };

      const response = await ordersAPI.create(orderData);

      if (response.data.success) {
        const kodeTracking = response.data.data.kode_laundry;
        setGeneratedCode(kodeTracking);
        setSuccess(`Order berhasil dibuat! Kode tracking: ${kodeTracking}`);
        setShowSuccessModal(true);

        setFormData({
          nama: '', no_wa: '', alamat: '', jenis_layanan: '',
          berat: '', jumlah_item: '', catatan: '', total_harga: '',
          estimasi_selesai: '', status_pembayaran: 'Belum Lunas',
        });

        setTimeout(() => navigate('/dashboard/mitra/orders'), 3000);
      }
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || err.message || 'Gagal membuat order');
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
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-destructive font-medium">Error</p>
                <p className="text-destructive/80 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Modal - sama persis dengan yang asli */}
          {showSuccessModal && generatedCode && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-2xl border border-border shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-300">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Order Berhasil Dibuat!</h2>
                  <p className="text-muted-foreground text-sm">
                    Kode tracking untuk customer:
                  </p>
                  <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <code className="text-2xl font-bold text-primary tracking-widest flex-1 text-center">
                      {generatedCode}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Berikan kode ini ke customer untuk tracking pesanan.
                    Halaman akan dialihkan otomatis...
                  </p>
                  <Button
                    onClick={() => navigate('/dashboard/mitra/orders')}
                    className="w-full gap-2"
                  >
                    <X className="w-4 h-4" />
                    Ke Daftar Order
                  </Button>
                </div>
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
                  <Input id="nama" name="nama" placeholder="Nama lengkap customer"
                    value={formData.nama} onChange={handleChange} required disabled={loading}
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="no_wa" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    No. WhatsApp <span className="text-destructive">*</span>
                  </Label>
                  <Input id="no_wa" name="no_wa" type="tel" placeholder="08123456789"
                    value={formData.no_wa} onChange={handleChange} required disabled={loading}
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alamat" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Alamat (Opsional)
                  </Label>
                  <Textarea id="alamat" name="alamat" placeholder="Alamat lengkap customer..."
                    value={formData.alamat} onChange={handleChange} disabled={loading}
                    rows={2} className="resize-none transition-all focus:ring-2 focus:ring-primary/20" />
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
                  <Select value={formData.jenis_layanan}
                    onValueChange={(value) => handleSelectChange('jenis_layanan', value)}
                    disabled={loading}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih jenis layanan" />
                    </SelectTrigger>
                    <SelectContent>
                      {JENIS_LAYANAN.map((service) => {
                        const serviceKey = SERVICE_KEY_MAP[service.value];
                        const pricing = pricingMap[serviceKey];
                        return (
                          <SelectItem key={service.value} value={service.value}>
                            <span>{service.label}</span>
                            {pricing && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                — Rp {pricing.price_per_unit.toLocaleString('id-ID')}/{pricing.unit_type}
                              </span>
                            )}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {selectedService?.unit === 'kg' && (
                  <div className="space-y-2">
                    <Label htmlFor="berat">Berat (kg)</Label>
                    <Input id="berat" name="berat" type="number" step="0.1" min="0"
                      placeholder="Contoh: 3.5" value={formData.berat} onChange={handleChange}
                      disabled={loading} className="h-11 transition-all focus:ring-2 focus:ring-primary/20" />
                  </div>
                )}

                {selectedService?.unit === 'item' && (
                  <div className="space-y-2">
                    <Label htmlFor="jumlah_item">Jumlah Item</Label>
                    <Input id="jumlah_item" name="jumlah_item" type="number" min="1"
                      placeholder="Contoh: 5" value={formData.jumlah_item} onChange={handleChange}
                      disabled={loading} className="h-11 transition-all focus:ring-2 focus:ring-primary/20" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="catatan">Catatan (Opsional)</Label>
                  <Textarea id="catatan" name="catatan" placeholder="Catatan khusus untuk laundry ini..."
                    value={formData.catatan} onChange={handleChange} disabled={loading}
                    rows={2} className="resize-none transition-all focus:ring-2 focus:ring-primary/20" />
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
                  <Input id="total_harga" name="total_harga" type="text"
                    placeholder="Contoh: 25.000" value={formData.total_harga}
                    onChange={handlePriceChange} required disabled={loading}
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20" />

                  {/* Auto-calc info badge */}
                  {autoCalcInfo && (
                    <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 animate-in fade-in duration-300">
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Dihitung otomatis: <strong>{autoCalcInfo}</strong></span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status_pembayaran">Status Pembayaran</Label>
                  <Select value={formData.status_pembayaran}
                    onValueChange={(value) => handleSelectChange('status_pembayaran', value)}
                    disabled={loading}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
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
                  <Input id="estimasi_selesai" name="estimasi_selesai" type="date"
                    value={formData.estimasi_selesai} onChange={handleChange}
                    disabled={loading} className="h-11 transition-all focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline"
                onClick={() => navigate('/dashboard/mitra')} disabled={loading}
                className="flex-1 h-12 hover:bg-secondary transition-all">
                Batal
              </Button>
              <Button type="submit" disabled={loading}
                className="flex-1 h-12 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Menyimpan...</>
                ) : (
                  <><CheckCircle className="w-4 h-4" />Simpan Pesanan</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}