import { Check, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { OrderStatus, OrderStatusHistory } from "@/types/tracking.types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface TrackingTimelineProps {
  currentStatus: OrderStatus;
  statusHistory: OrderStatusHistory[];
}

// ✅ Urutan status yang benar
const STATUS_FLOW: OrderStatus[] = [
  'Diterima',
  'Sedang Dicuci',
  'Sedang Dikeringkan',
  'Sedang Disetrika',
  'Siap Diambil',
  'Telah Diambil'
];

// 🎨 Warna yang lebih baik - Siap Diambil: amber, Telah Diambil: green
const STATUS_CONFIG = {
  'Diterima': { color: 'bg-blue-500', label: 'Diterima' },
  'Sedang Dicuci': { color: 'bg-cyan-500', label: 'Sedang Dicuci' },
  'Sedang Dikeringkan': { color: 'bg-orange-500', label: 'Sedang Dikeringkan' },
  'Sedang Disetrika': { color: 'bg-purple-500', label: 'Sedang Disetrika' },
  'Siap Diambil': { color: 'bg-amber-500', label: 'Siap Diambil' },
  'Telah Diambil': { color: 'bg-green-600', label: 'Telah Diambil' }
};

export function TrackingTimeline({ currentStatus, statusHistory }: TrackingTimelineProps) {
  // Get index status saat ini
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  // Function untuk cek apakah status sudah dilewati
  const isCompleted = (status: OrderStatus) => {
    const statusIndex = STATUS_FLOW.indexOf(status);
    return statusIndex <= currentIndex;
  };

  // Function untuk cek apakah status adalah status saat ini
  const isCurrent = (status: OrderStatus) => {
    return status === currentStatus;
  };

  // ✅ Function untuk cek apakah status adalah final (Telah Diambil)
  const isFinalStatus = (status: OrderStatus) => {
    return status === 'Telah Diambil';
  };

  // ✅ Cek apakah pesanan sudah selesai (current status = Telah Diambil)
  const isOrderCompleted = currentStatus === 'Telah Diambil';

  // Function untuk get waktu dari history
  const getStatusTime = (status: OrderStatus) => {
    const history = statusHistory.find(h => h.status === status);
    return history ? format(new Date(history.created_at), 'dd MMM yyyy, HH:mm', { locale: id }) : null;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-4">Status Tracking</h3>
      
      <div className="relative">
        {/* ✅ FIXED: Vertical line logic */}
        {/* Jika pesanan SUDAH SELESAI (Telah Diambil) → garis berhenti sebelum item terakhir */}
        {/* Jika pesanan BELUM SELESAI → garis sampai bawah (full height) */}
        <div 
          className="absolute left-4 top-0 w-0.5 bg-border" 
          style={{ 
            height: isOrderCompleted ? `calc(100% - 4.5rem)` : '100%'
          }}
        />

        {/* Status items */}
        <div className="space-y-6">
          {STATUS_FLOW.map((status, index) => {
            const completed = isCompleted(status);
            const current = isCurrent(status);
            const isFinal = isFinalStatus(status);
            const config = STATUS_CONFIG[status];
            const time = getStatusTime(status);

            return (
              <div key={status} className="relative flex items-start gap-4">
                {/* Status icon */}
                <div
                  className={cn(
                    "relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    completed
                      ? `${config.color} text-white shadow-lg`
                      : "bg-muted text-muted-foreground border-2 border-border"
                  )}
                >
                  {/* ✅ FIXED LOGIC: Telah Diambil tidak ada spinner, hanya centang */}
                  {completed && !current && (
                    <Check className="w-4 h-4" />
                  )}
                  {/* Jika current DAN bukan Telah Diambil → tampilkan loading */}
                  {current && !isFinal && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {/* Jika current DAN Telah Diambil → tampilkan centang (bukan loading) */}
                  {current && isFinal && (
                    <Check className="w-4 h-4" />
                  )}
                  {/* Jika belum completed */}
                  {!completed && !current && (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                {/* Status content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <p
                      className={cn(
                        "font-medium transition-colors",
                        completed ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {config.label}
                    </p>
                    {time && (
                      <p className="text-xs text-muted-foreground">
                        {time}
                      </p>
                    )}
                  </div>
                  
                  {current && (
                    <p className={cn(
                      "text-sm font-medium mt-1 flex items-center gap-1",
                      isFinal ? "text-green-600" : "text-primary"
                    )}>
                      {isFinal && <CheckCircle2 className="w-4 h-4" />}
                      {isFinal ? 'Pesanan sudah selesai' : 'Status saat ini'}
                    </p>
                  )}
                  
                  {/* Keterangan dari history */}
                  {completed && statusHistory.find(h => h.status === status)?.keterangan && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {statusHistory.find(h => h.status === status)?.keterangan}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}