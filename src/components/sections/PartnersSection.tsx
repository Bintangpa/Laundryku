import { useEffect, useRef, useState } from "react";
import { LaundryCard } from "@/components/ui/LaundryCard";
import { Building2, Loader2, AlertCircle } from "lucide-react";
import { partnersAPI } from "@/lib/api";

interface Partner {
  id: number;
  user_id?: number;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  kota: string;
  maps_url?: string | null; // 🆕 Add maps_url
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface PartnersSectionProps {
  selectedCity: string | null;
}

export function PartnersSection({ selectedCity }: PartnersSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch partners from API
  useEffect(() => {
    if (!selectedCity) {
      setPartners([]);
      return;
    }

    const fetchPartners = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use the city name directly from the API
        const response = await partnersAPI.getByCity(selectedCity);

        if (response.data.success) {
          setPartners(response.data.data);
        } else {
          setError(response.data.message || 'Gagal mengambil data mitra');
        }
      } catch (err: any) {
        console.error('Error fetching partners:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [selectedCity]);

  // Auto scroll when city is selected
  useEffect(() => {
    if (selectedCity && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedCity]);

  if (!selectedCity) return null;

  // Capitalize city name for display
  const displayCityName = selectedCity
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-secondary/30" id="partners">
      <div className="container px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Mitra Laundry di {displayCityName}
            </h2>
            {!loading && !error && (
              <p className="text-muted-foreground">
                {partners.length} mitra tersedia
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Memuat data mitra...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 bg-destructive/10 rounded-lg border border-destructive/20">
            <AlertCircle className="w-8 h-8 text-destructive mb-4" />
            <p className="text-destructive font-medium mb-2">Terjadi Kesalahan</p>
            <p className="text-muted-foreground text-sm">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Pastikan backend server berjalan di http://localhost:5000
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && partners.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-muted/50 rounded-lg">
            <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium mb-2">
              Belum Ada Mitra di {displayCityName}
            </p>
            <p className="text-muted-foreground text-sm">
              Mitra laundry akan segera hadir di kota ini
            </p>
          </div>
        )}

        {/* Partners Grid */}
        {!loading && !error && partners.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <div
                key={partner.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <LaundryCard
                  name={partner.nama_toko}
                  address={partner.alamat}
                  operationalHours="08:00 - 21:00"
                  mapsUrl={partner.maps_url || undefined} // 🆕 Pass maps_url from database
                  phone={partner.no_telepon}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}