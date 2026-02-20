import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Layout,
  Settings,
  LogOut,
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  Tag,
  Weight,
  Package,
  Info,
  Menu,
  X,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { pricingAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface ServicePricing {
  id: number;
  service_name: string;
  service_key: string;
  price_per_unit: number;
  unit_type: 'kg' | 'item';
  is_active: number;
}

const serviceConfig: Record<string, { color: string; bg: string; border: string }> = {
  laundry_kiloan:  { color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200' },
  express_6_jam:   { color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200' },
  setrika_saja:    { color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200' },
  laundry_satuan:  { color: 'text-cyan-600',    bg: 'bg-cyan-50',    border: 'border-cyan-200' },
  dry_cleaning:    { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  deep_clean:      { color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-200' },
};

export default function KelolaHarga() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pricingList, setPricingList] = useState<ServicePricing[]>([]);
  const [editValues, setEditValues] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const menuItems = [
    { icon: Users,    label: 'Kelola Mitra',   path: '/admin' },
    { icon: Package,  label: 'Kelola Order',   path: '/admin/orders' },
    { icon: Tag,      label: 'Kelola Harga',   path: '/admin/pricing' },
    { icon: Layout,   label: 'Konten Halaman', path: '/admin/content' },
    { icon: Settings, label: 'Pengaturan',     path: '/admin/settings' },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  useEffect(() => { fetchPricing(); }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const response = await pricingAPI.getAll();
      if (response.data.success) {
        const data: ServicePricing[] = response.data.data;
        setPricingList(data);
        const initVals: Record<number, string> = {};
        data.forEach((item) => { initVals[item.id] = item.price_per_unit.toString(); });
        setEditValues(initVals);
      }
    } catch (err) {
      setGlobalError('Gagal memuat data harga. Pastikan server berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (item: ServicePricing) => {
    const parsed = parseFloat(editValues[item.id]);
    if (isNaN(parsed) || parsed < 0) { setError(`Harga untuk ${item.service_name} tidak valid`); return; }
    try {
      setSavingId(item.id);
      setError(null);
      await pricingAPI.update(item.id, { price_per_unit: parsed });
      setPricingList((prev) => prev.map((p) => p.id === item.id ? { ...p, price_per_unit: parsed } : p));
      setSavedId(item.id);
      setTimeout(() => setSavedId(null), 2000);
    } catch (err) {
      setError(`Gagal menyimpan harga ${item.service_name}`);
    } finally {
      setSavingId(null);
    }
  };

  const perKilo = pricingList.filter((p) => p.unit_type === 'kg');
  const perItem = pricingList.filter((p) => p.unit_type === 'item');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-bold">Admin Panel</h2>
              </div>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <LogOut className="w-5 h-5" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Kelola Harga</h1>
                <p className="text-sm text-muted-foreground">Tetapkan harga untuk setiap jenis layanan laundry</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate('/')} variant="outline" size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Beranda</span>
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-8">

            {globalError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-destructive text-sm">{globalError}</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Memuat data harga...</p>
                </div>
              </div>
            ) : (
              <>
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Weight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Layanan Per Kilogram</h2>
                      <p className="text-xs text-muted-foreground">Harga dikalikan berat (kg) yang diinput mitra</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {perKilo.map((item) => (
                      <PricingCard key={item.id} item={item} config={serviceConfig[item.service_key]}
                        editValue={editValues[item.id] ?? ''} isSaving={savingId === item.id} isSaved={savedId === item.id}
                        onChange={(val) => setEditValues((prev) => ({ ...prev, [item.id]: val }))}
                        onSave={() => handleSave(item)} />
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Layanan Per Item/Satuan</h2>
                      <p className="text-xs text-muted-foreground">Harga dikalikan jumlah item yang diinput mitra</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {perItem.map((item) => (
                      <PricingCard key={item.id} item={item} config={serviceConfig[item.service_key]}
                        editValue={editValues[item.id] ?? ''} isSaving={savingId === item.id} isSaved={savedId === item.id}
                        onChange={(val) => setEditValues((prev) => ({ ...prev, [item.id]: val }))}
                        onSave={() => handleSave(item)} />
                    ))}
                  </div>
                </section>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground flex items-start gap-3">
                  <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Cara kerja:</strong> Saat mitra membuat order dan memasukkan berat atau jumlah item, total harga akan otomatis terhitung berdasarkan harga yang sudah di set di sini.</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

// ─── PricingCard ─────────────────────────────────────────────────────────────
interface PricingCardProps {
  item: ServicePricing;
  config?: { color: string; bg: string; border: string };
  editValue: string;
  isSaving: boolean;
  isSaved: boolean;
  onChange: (val: string) => void;
  onSave: () => void;
}

function PricingCard({ item, config, editValue, isSaving, isSaved, onChange, onSave }: PricingCardProps) {
  const cfg = config ?? { color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' };
  const currentPrice = parseFloat(editValue);
  const isDirty = !isNaN(currentPrice) && currentPrice !== item.price_per_unit;
  const fmt = (v: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

  return (
    <div className={`bg-card rounded-2xl border ${cfg.border} shadow-sm p-5 flex flex-col gap-4 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between gap-2">
        <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
          {item.unit_type === 'kg' ? '/ kg' : '/ item'}
        </div>
        {isSaved && (
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium animate-in fade-in duration-300">
            <CheckCircle className="w-3.5 h-3.5" /> Tersimpan
          </span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-foreground text-base">{item.service_name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Harga saat ini: <span className="font-medium text-foreground">{fmt(item.price_per_unit)}</span>
        </p>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">Rp</span>
          <Input type="number" min="0" step="500" value={editValue}
            onChange={(e) => onChange(e.target.value)} className="pl-10 h-10" placeholder="0" />
        </div>
        {!isNaN(currentPrice) && currentPrice > 0 && (
          <p className="text-xs text-muted-foreground">
            Preview: {item.unit_type === 'kg' ? '2 kg' : '3 item'} ={' '}
            <span className="font-semibold text-foreground">{fmt(currentPrice * (item.unit_type === 'kg' ? 2 : 3))}</span>
          </p>
        )}
      </div>
      <Button onClick={onSave} disabled={isSaving || !isDirty} size="sm" className="w-full gap-2" variant={isDirty ? 'default' : 'outline'}>
        {isSaving
          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Menyimpan...</>
          : <><Save className="w-3.5 h-3.5" />{isDirty ? 'Simpan Harga' : 'Belum Ada Perubahan'}</>
        }
      </Button>
    </div>
  );
}