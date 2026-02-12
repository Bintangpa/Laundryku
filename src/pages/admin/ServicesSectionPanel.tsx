import { useEffect, useState } from 'react';
import { Loader2, Save, RotateCcw, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { homepageAPI } from '@/lib/api';
import { showToast } from '@/lib/toast-helper';

const ICON_OPTIONS = ['Shirt', 'Timer', 'Sparkles', 'Package', 'Wind', 'Brush', 'Star', 'Zap', 'Heart', 'Shield'];

interface ServiceItem {
  id?: number;
  icon_name: string;
  title: string;
  duration: string;
  description: string;
  sort_order: number;
  is_active: number;
  isNew?: boolean;
}

interface SectionHeader {
  section_title: string;
  section_title_highlight: string;
  section_subtitle: string;
}

export default function ServicesSectionPanel() {
  const [header, setHeader] = useState<SectionHeader>({
    section_title: '',
    section_title_highlight: '',
    section_subtitle: '',
  });
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [originalHeader, setOriginalHeader] = useState<SectionHeader | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingHeader, setSavingHeader] = useState(false);
  const [savingItem, setSavingItem] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await homepageAPI.getServices();
      if (response.data.success) {
        const { items: fetchedItems, ...headerData } = response.data.data;
        setHeader(headerData);
        setOriginalHeader(headerData);
        setItems(fetchedItems || []);
      }
    } catch (error) {
      showToast('Gagal memuat data services!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderChange = (field: keyof SectionHeader, value: string) => {
    setHeader(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveHeader = async () => {
    try {
      setSavingHeader(true);
      const response = await homepageAPI.updateServicesSection(header);
      if (response.data.success) {
        setOriginalHeader(header);
        showToast('Header services berhasil disimpan!', 'success');
      }
    } catch (error) {
      showToast('Gagal menyimpan header services!', 'error');
    } finally {
      setSavingHeader(false);
    }
  };

  const handleItemChange = (index: number, field: keyof ServiceItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleSaveItem = async (index: number) => {
    const item = items[index];
    try {
      setSavingItem(index);
      if (item.isNew) {
        const response = await homepageAPI.addServiceItem({
          icon_name: item.icon_name,
          title: item.title,
          duration: item.duration,
          description: item.description,
          sort_order: item.sort_order,
        });
        if (response.data.success) {
          setItems(prev => prev.map((it, i) => i === index ? { ...response.data.data, isNew: false } : it));
          showToast('Item berhasil ditambahkan!', 'success');
        }
      } else {
        const response = await homepageAPI.updateServiceItem(item.id!, {
          icon_name: item.icon_name,
          title: item.title,
          duration: item.duration,
          description: item.description,
          sort_order: item.sort_order,
          is_active: item.is_active,
        });
        if (response.data.success) {
          showToast('Item berhasil disimpan!', 'success');
        }
      }
    } catch (error) {
      showToast('Gagal menyimpan item!', 'error');
    } finally {
      setSavingItem(null);
    }
  };

  const handleDeleteItem = async (index: number) => {
    const item = items[index];
    if (item.isNew) {
      setItems(prev => prev.filter((_, i) => i !== index));
      return;
    }
    try {
      setSavingItem(index);
      await homepageAPI.deleteServiceItem(item.id!);
      setItems(prev => prev.filter((_, i) => i !== index));
      showToast('Item berhasil dihapus!', 'success');
    } catch (error) {
      showToast('Gagal menghapus item!', 'error');
    } finally {
      setSavingItem(null);
    }
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, {
      icon_name: 'Package',
      title: '',
      duration: '',
      description: '',
      sort_order: prev.length + 1,
      is_active: 1,
      isNew: true,
    }]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Services Section</h2>
          <p className="text-sm text-muted-foreground mt-1">Edit judul dan daftar layanan laundry</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Judul Section</label>
            <Input value={header.section_title} onChange={(e) => handleHeaderChange('section_title', e.target.value)} placeholder="Layanan" className="h-11" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Judul Highlight (warna)</label>
            <Input value={header.section_title_highlight} onChange={(e) => handleHeaderChange('section_title_highlight', e.target.value)} placeholder="Laundry Kami" className="h-11" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Subtitle</label>
            <Input value={header.section_subtitle} onChange={(e) => handleHeaderChange('section_subtitle', e.target.value)} placeholder="Berbagai pilihan layanan..." className="h-11" />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
          <Button onClick={handleSaveHeader} disabled={savingHeader} className="gap-2">
            {savingHeader ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {savingHeader ? 'Menyimpan...' : 'Simpan Header'}
          </Button>
          <Button onClick={() => originalHeader && setHeader(originalHeader)} variant="outline" className="gap-2" disabled={savingHeader}>
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Daftar Layanan</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{items.length} layanan terdaftar</p>
          </div>
          <Button onClick={handleAddItem} className="gap-2" size="sm">
            <Plus className="w-4 h-4" />
            Tambah Layanan
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id ?? `new-${index}`} className="border border-border rounded-xl p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Nama Layanan</label>
                  <Input value={item.title} onChange={(e) => handleItemChange(index, 'title', e.target.value)} placeholder="Laundry Kiloan" className="h-10" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Durasi</label>
                  <Input value={item.duration} onChange={(e) => handleItemChange(index, 'duration', e.target.value)} placeholder="2-3 Hari" className="h-10" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Icon</label>
                  <select
                    value={item.icon_name}
                    onChange={(e) => handleItemChange(index, 'icon_name', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Urutan</label>
                  <Input type="number" value={item.sort_order} onChange={(e) => handleItemChange(index, 'sort_order', parseInt(e.target.value))} className="h-10" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Deskripsi</label>
                  <Input value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} placeholder="Deskripsi singkat layanan..." className="h-10" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Button onClick={() => handleSaveItem(index)} size="sm" className="gap-1.5" disabled={savingItem === index}>
                  {savingItem === index ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  {item.isNew ? 'Simpan Baru' : 'Simpan'}
                </Button>
                <Button onClick={() => handleDeleteItem(index)} size="sm" variant="ghost" className="gap-1.5 text-destructive hover:text-red-700 hover:bg-red-50" disabled={savingItem === index}>
                  <Trash2 className="w-3 h-3" />
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}