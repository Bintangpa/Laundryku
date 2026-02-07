import { X, Package, Calendar, CreditCard, MapPin, Phone, Store } from "lucide-react";
import { TrackingOrder } from "@/types/tracking.types";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface OrderTrackingModalProps {
  order: TrackingOrder;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderTrackingModal({ order, isOpen, onClose }: OrderTrackingModalProps) {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: id });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Detail Pesanan</h2>
            </div>
            <p className="text-white/90">Lacak status cucian Anda secara real-time</p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Order Info */}
              <div className="space-y-6">
                {/* Kode Laundry */}
                <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Kode Laundry</p>
                  <p className="text-2xl font-bold text-primary font-mono">
                    {order.kode_laundry}
                  </p>
                </div>

                {/* Info Mitra */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    Info Laundry
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Store className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{order.partner.nama_toko}</p>
                        {order.partner.kota && (
                          <p className="text-muted-foreground">{order.partner.kota}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <p className="text-muted-foreground">{order.partner.alamat}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p className="text-muted-foreground">{order.partner.no_telepon}</p>
                    </div>
                  </div>
                </div>

                {/* Detail Pesanan */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Detail Pesanan
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Jenis Layanan</p>
                      <p className="font-medium">{order.jenis_layanan}</p>
                    </div>
                    {order.berat && (
                      <div>
                        <p className="text-muted-foreground">Berat</p>
                        <p className="font-medium">{order.berat} kg</p>
                      </div>
                    )}
                    {order.jumlah_item && (
                      <div>
                        <p className="text-muted-foreground">Jumlah Item</p>
                        <p className="font-medium">{order.jumlah_item} pcs</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Total Harga</p>
                      <p className="font-bold text-primary">{formatCurrency(order.total_harga)}</p>
                    </div>
                  </div>
                </div>

                {/* Tanggal & Estimasi */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Waktu
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-muted-foreground">Tanggal Masuk</p>
                        <p className="font-medium">{formatDate(order.tanggal_masuk)}</p>
                      </div>
                    </div>
                    {order.estimasi_selesai && (
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-muted-foreground">Estimasi Selesai</p>
                          <p className="font-medium text-orange-600">
                            {formatDate(order.estimasi_selesai)}
                          </p>
                        </div>
                      </div>
                    )}
                    {order.tanggal_selesai && (
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-muted-foreground">Tanggal Selesai</p>
                          <p className="font-medium text-green-600">
                            {formatDate(order.tanggal_selesai)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pembayaran */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Pembayaran
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Status Pembayaran</p>
                      <span
                        className={cn(
                          "inline-block px-3 py-1 rounded-full text-sm font-medium mt-1",
                          order.status_pembayaran === "Lunas"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        )}
                      >
                        {order.status_pembayaran}
                      </span>
                    </div>
                    {order.metode_pembayaran && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Metode</p>
                        <p className="font-medium">{order.metode_pembayaran}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Catatan */}
                {order.catatan && (
                  <div className="bg-secondary/50 border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Catatan</p>
                    <p className="text-sm">{order.catatan}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Tracking Timeline */}
              <div className="bg-secondary/30 rounded-xl p-6">
                <TrackingTimeline
                  currentStatus={order.status as any}
                  statusHistory={order.status_history}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 bg-secondary/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Terakhir diupdate: {formatDate(order.updated_at)}
              </p>
              <Button onClick={onClose} variant="outline">
                Tutup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}