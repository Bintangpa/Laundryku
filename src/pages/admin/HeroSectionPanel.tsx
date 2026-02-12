import { useEffect, useState } from 'react';
import { Loader2, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { homepageAPI } from '@/lib/api';
import { showToast } from '@/lib/toast-helper';

interface HeroData {
  badge_text: string;
  title: string;
  title_highlight: string;
  subtitle: string;
  placeholder_text: string;
  button_text: string;
  hint_text: string;
  tips_text: string;
}

export default function HeroSectionPanel() {
  const [data, setData] = useState<HeroData>({
    badge_text: '',
    title: '',
    title_highlight: '',
    subtitle: '',
    placeholder_text: '',
    button_text: '',
    hint_text: '',
    tips_text: '',
  });
  const [original, setOriginal] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await homepageAPI.getHero();
      if (response.data.success) {
        setData(response.data.data);
        setOriginal(response.data.data);
      }
    } catch (error) {
      showToast('Gagal memuat data hero!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof HeroData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await homepageAPI.updateHero(data);
      if (response.data.success) {
        setOriginal(data);
        showToast('Hero section berhasil disimpan!', 'success');
      }
    } catch (error) {
      showToast('Gagal menyimpan hero section!', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (original) {
      setData(original);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const fields: { key: keyof HeroData; label: string; placeholder: string }[] = [
    { key: 'badge_text', label: 'Badge Text', placeholder: 'Lacak cucianmu dengan mudah' },
    { key: 'title', label: 'Judul Utama', placeholder: 'Cek Status' },
    { key: 'title_highlight', label: 'Judul Highlight (warna)', placeholder: 'Laundry Kamu' },
    { key: 'subtitle', label: 'Subtitle', placeholder: 'Masukkan kode laundry...' },
    { key: 'placeholder_text', label: 'Placeholder Input', placeholder: 'Masukkan kode laundry anda' },
    { key: 'button_text', label: 'Teks Tombol', placeholder: 'Lacak Pesanan' },
    { key: 'hint_text', label: 'Teks Hint (bawah kartu)', placeholder: 'Kode laundry terdiri dari...' },
    { key: 'tips_text', label: 'Teks Tips', placeholder: 'Kode laundry bisa ditemukan di...' },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Hero Section</h2>
        <p className="text-sm text-muted-foreground mt-1">Edit konten bagian hero / banner utama halaman depan</p>
      </div>

      <div className="space-y-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
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