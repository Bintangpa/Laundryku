import { useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";

type StatusType = "diterima" | "dicuci" | "dikeringkan" | "dilipat" | "siap" | "diambil";

interface LaundryResult {
  code: string;
  laundryName: string;
  city: string;
  service: string;
  status: StatusType;
  estimatedDate: string;
}

// Mock data untuk demo
const mockResults: Record<string, LaundryResult> = {
  "LDR001": {
    code: "LDR001",
    laundryName: "Fresh & Clean Laundry",
    city: "Jakarta",
    service: "Laundry Kiloan",
    status: "dicuci",
    estimatedDate: "31 Januari 2026",
  },
  "LDR002": {
    code: "LDR002",
    laundryName: "Bright Wash",
    city: "Bandung",
    service: "Express 6 Jam",
    status: "siap",
    estimatedDate: "30 Januari 2026",
  },
  "LDR003": {
    code: "LDR003",
    laundryName: "Clean Master",
    city: "Surabaya",
    service: "Laundry Satuan",
    status: "dilipat",
    estimatedDate: "31 Januari 2026",
  },
};

export function HeroSection() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LaundryResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    // Simulasi API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundResult = mockResults[code.toUpperCase()];
    if (foundResult) {
      setResult(foundResult);
    } else {
      setError("Kode laundry tidak ditemukan. Coba: LDR001, LDR002, atau LDR003");
    }
    setIsLoading(false);
  };

  return (
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
                    placeholder="Masukkan kode laundry (cth: LDR001)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="pl-12 h-14 text-lg rounded-xl border-2 focus:border-primary"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !code.trim()}
                  className="h-14 px-8 text-lg rounded-xl shadow-button hover:shadow-none transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Cek Status"
                  )}
                </Button>
              </div>
            </form>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm animate-fade-in">
                {error}
              </div>
            )}

            {/* Result card */}
            {result && (
              <div className="mt-6 p-6 bg-secondary/50 rounded-xl border border-border animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Kode Laundry</p>
                    <p className="text-xl font-bold text-primary">{result.code}</p>
                  </div>
                  <StatusBadge status={result.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nama Laundry</p>
                    <p className="font-medium text-card-foreground">{result.laundryName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kota</p>
                    <p className="font-medium text-card-foreground">{result.city}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Layanan</p>
                    <p className="font-medium text-card-foreground">{result.service}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimasi Selesai</p>
                    <p className="font-medium text-accent">{result.estimatedDate}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hint text */}
          <p className="text-center text-white/60 text-sm mt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Contoh kode: LDR001, LDR002, LDR003
          </p>
        </div>
      </div>
    </section>
  );
}
