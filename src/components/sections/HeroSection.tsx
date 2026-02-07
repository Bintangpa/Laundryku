import { useState } from "react";
import { Search, Loader2, Sparkles, AlertCircle, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderTrackingModal } from "@/components/tracking/OrderTrackingModal";
import { ordersAPI } from "@/lib/api";
import { TrackingOrder } from "@/types/tracking.types";

export function HeroSection() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<TrackingOrder | null>(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Mohon masukkan kode laundry");
      return;
    }

    setIsLoading(true);
    setError("");
    setOrderData(null);

    try {
      // Call real API
      const response = await ordersAPI.track(code.trim().toUpperCase());
      
      if (response.data.success) {
        setOrderData(response.data.data);
        setIsModalOpen(true);
        setCode(""); // Clear input after success
      } else {
        setError(response.data.message || "Kode laundry tidak ditemukan");
      }
    } catch (err: any) {
      console.error("Error tracking order:", err);
      
      // Handle different error types
      if (err.response?.status === 404) {
        setError("Kode laundry tidak ditemukan. Pastikan kode yang Anda masukkan benar.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan saat melacak pesanan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOrderData(null);
  };

  return (
    <>
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero opacity-90" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        {/* Content */}
        <div className="container relative z-10 px-4 py-16 md:py-24">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Lacak cucianmu dengan mudah
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Cek Status <br className="hidden sm:block" />
                <span className="text-white/90">Laundry Kamu</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-lg mx-auto">
                Masukkan kode laundry untuk mengetahui status cucianmu secara real-time
              </p>
            </div>

            {/* Search Card */}
            <div className="bg-card/95 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Masukkan kode laundry anda"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        setError(""); // Clear error saat user mengetik
                      }}
                      className="pl-12 h-14 text-lg rounded-xl border-2 focus:border-primary uppercase"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !code.trim()}
                    className="h-14 px-8 text-lg rounded-xl shadow-button hover:shadow-none transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Mencari...
                      </>
                    ) : (
                      "Lacak Pesanan"
                    )}
                  </Button>
                </div>
              </form>

              {/* Error message */}
              {error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl animate-fade-in">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-destructive">Pesanan Tidak Ditemukan</p>
                      <p className="text-sm text-destructive/80 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Info / Tips */}
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-medium">Tips:</span> Kode laundry bisa ditemukan di struk atau bukti penerimaan laundry Anda
                  </span>
                </p>
              </div>
            </div>

            {/* Hint text */}
            <p className="text-center text-white/60 text-sm mt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              Kode laundry terdiri dari 3 huruf diikuti dengan angka
            </p>
          </div>
        </div>
      </section>

      {/* Tracking Modal */}
      {orderData && (
        <OrderTrackingModal
          order={orderData}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}