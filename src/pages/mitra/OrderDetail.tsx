import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ordersAPI } from '@/lib/api';
import type { Order } from '@/types/partner.types'; // ✅ Import type
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
  Package,
  Calendar,
  DollarSign,
  Clock,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const STATUS_OPTIONS = [
  'Diterima',
  'Sedang Dicuci',
  'Sedang Dikeringkan',
  'Sedang Disetrika',
  'Siap Diambil',
  'Selesai',
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Diterima': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Sedang Dicuci': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Sedang Dikeringkan': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'Sedang Disetrika': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'Siap Diambil': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Selesai': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  return colors[status] || '';
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null); // ✅ Ganti any jadi Order
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [newStatus, setNewStatus] = useState('');
  const [keterangan, setKeterangan] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.getById(id!);

      if (response.data.success) {
        setOrder(response.data.data);
        setNewStatus(response.data.data.status);
      }
    } catch (err: any) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.message || 'Gagal mengambil data order');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === order.status) {
      alert('Pilih status baru yang berbeda');
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      const response = await ordersAPI.updateStatus(id!, {
        status: newStatus,
        keterangan: keterangan || `Status diubah menjadi ${newStatus}`,
      });

      if (response.data.success) {
        setSuccess('Status berhasil diupdate!');
        setKeterangan('');
        fetchOrder(); // Refresh data
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || 'Gagal update status');
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat detail order...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/dashboard/mitra/orders')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
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
              onClick={() => navigate('/dashboard/mitra/orders')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                Detail Order #{order?.kode_laundry}
              </h1>
              <p className="text-muted-foreground mt-1">
                Lihat dan update status pesanan
              </p>
            </div>
            <Badge
              variant="outline"
              className={`${getStatusColor(order?.status)} text-sm px-3 py-1`}
            >
              {order?.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Alert Messages */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-destructive font-medium">Error</p>
                <p className="text-destructive/80 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-500 font-medium">Berhasil!</p>
                <p className="text-green-500/80 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Update Status */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">Update Status</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status Baru</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Keterangan (Opsional)</Label>
                <Textarea
                  placeholder="Tambahkan catatan..."
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  rows={2}
                />
              </div>
              <Button
                onClick={handleUpdateStatus}
                disabled={updating || newStatus === order.status}
                className="w-full"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengupdate...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Customer
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p className="font-medium">{order?.customer?.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">No. WhatsApp</p>
                  <p className="font-medium">{order?.customer?.no_wa}</p>
                </div>
                {order?.customer?.alamat && (
                  <div>
                    <p className="text-sm text-muted-foreground">Alamat</p>
                    <p className="font-medium">{order.customer.alamat}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Detail Pesanan
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Kode Tracking</p>
                  <p className="font-mono font-semibold text-primary">
                    {order?.kode_laundry}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jenis Layanan</p>
                  <p className="font-medium">{order?.jenis_layanan}</p>
                </div>
                {order?.berat && (
                  <div>
                    <p className="text-sm text-muted-foreground">Berat</p>
                    <p className="font-medium">{order.berat} kg</p>
                  </div>
                )}
                {order?.jumlah_item && (
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah Item</p>
                    <p className="font-medium">{order.jumlah_item} item</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Pembayaran
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Harga</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(order?.total_harga)}
                  </p>
                </div>
                {order?.metode_pembayaran && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Metode Pembayaran
                    </p>
                    <p className="font-medium">{order.metode_pembayaran}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">
                    Status Pembayaran
                  </p>
                  <Badge
                    variant={
                      order?.status_pembayaran === 'Lunas'
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {order?.status_pembayaran}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Tanggal
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Masuk</p>
                  <p className="font-medium">
                    {format(new Date(order?.tanggal_masuk), 'dd MMMM yyyy', {
                      locale: idLocale,
                    })}
                  </p>
                </div>
                {order?.estimasi_selesai && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Estimasi Selesai
                    </p>
                    <p className="font-medium">
                      {format(
                        new Date(order.estimasi_selesai),
                        'dd MMMM yyyy',
                        { locale: idLocale }
                      )}
                    </p>
                  </div>
                )}
                {order?.tanggal_selesai && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tanggal Selesai
                    </p>
                    <p className="font-medium">
                      {format(new Date(order.tanggal_selesai), 'dd MMMM yyyy', {
                        locale: idLocale,
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {order?.catatan && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Catatan
              </h2>
              <p className="text-muted-foreground">{order.catatan}</p>
            </div>
          )}

          {/* Status History */}
          {order?.status_history && order.status_history.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Riwayat Status
              </h2>
              <div className="space-y-4">
                {order.status_history.map((history: any, index: number) => (
                  <div key={history.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                      {index !== order.status_history.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant="outline"
                          className={getStatusColor(history.status)}
                        >
                          {history.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(history.created_at),
                            'dd MMM yyyy, HH:mm',
                            { locale: idLocale }
                          )}
                        </span>
                      </div>
                      {history.keterangan && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {history.keterangan}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}