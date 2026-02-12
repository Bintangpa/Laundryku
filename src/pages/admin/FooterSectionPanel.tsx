import { useEffect, useState } from 'react';
import { Loader2, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { homepageAPI } from '@/lib/api';
import { showToast } from '@/lib/toast-helper';

interface FooterData {
  brand_name: string;
  brand_description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  copyright_text: string;
}

export default function FooterSectionPanel() {
  const [data, setData] = useState<FooterData>({
    brand_name: '',
    brand_description: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    copyright_text: '',
  });
  const [original, setOriginal] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await homepageAPI.getFooter();
      if (response.data.success) {
        setData(response.data.data);
        setOriginal(response.data.data);
      }
    } catch (error) {
      showToast('Gagal memuat data footer!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FooterData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await homepageAPI.updateFooter(data);
      if (response.data.success) {
        setOriginal(data);
        showToast('Footer berhasil disimpan!', 'success');
      }
    } catch (error) {
      showToast('Gagal menyimpan footer!', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (original) setData(original);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const fields: { key: keyof FooterData; label: string; placeholder: string; hint?: string }[] = [
    { key: 'brand_name', label: 'Nama Brand', placeholder: 'LaundryKu' },
    { key: 'brand_description', label: 'Deskripsi Brand', placeholder: 'Platform laundry online terpercaya...' },
    { key: 'phone', label: 'Nomor Telepon (tampil)', placeholder: '+62 812-3456-7890', hint: 'Format tampilan di website' },
    { key: 'whatsapp', label: 'Nomor WhatsApp (link)', placeholder: '6281234567890', hint: 'Tanpa +, contoh: 6281234567890' },
    { key: 'email', label: 'Email', placeholder: 'info@laundryku.id' },
    { key: 'address', label: 'Alamat', placeholder: 'Jakarta, Indonesia' },
    { key: 'copyright_text', label: 'Teks Copyright', placeholder: '© 2026 LaundryKu. Semua hak dilindungi.' },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Footer Section</h2>
        <p className="text-sm text-muted-foreground mt-1">Edit konten bagian footer halaman</p>
      </div>

      <div className="space-y-4">
        {fields.map(({ key, label, placeholder, hint }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {label}
              {hint && <span className="text-xs text-muted-foreground font-normal ml-2">— {hint}</span>}
            </label>
            <Input
              value={data[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              className="h-11"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
        <Button onClick={handleReset} variant="outline" className="gap-2" disabled={saving}>
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}