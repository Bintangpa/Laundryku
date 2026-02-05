import { useEffect, useState } from "react";
import { CityCard } from "@/components/ui/CityCard";
import { partnersAPI } from "@/lib/api";
import { Loader2, AlertCircle, MapPin } from "lucide-react";

interface CitiesSectionProps {
  selectedCity: string | null;
  onCitySelect: (cityId: string) => void;
}

export function CitiesSection({ selectedCity, onCitySelect }: CitiesSectionProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available cities from API
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await partnersAPI.getAvailableCities();

        if (response.data.success) {
          setCities(response.data.data);
        } else {
          setError(response.data.message || 'Gagal mengambil data kota');
        }
      } catch (err: any) {
        console.error('Error fetching cities:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil data kota';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cari Mitra Laundry di <span className="text-gradient">Kotamu</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pilih kota untuk melihat daftar mitra laundry terpercaya di sekitarmu
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Memuat daftar kota...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 bg-destructive/10 rounded-lg border border-destructive/20 max-w-2xl mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive mb-4" />
            <p className="text-destructive font-medium mb-2">Terjadi Kesalahan</p>
            <p className="text-muted-foreground text-sm text-center px-4">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Pastikan backend server berjalan di http://localhost:5000
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && cities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-muted/50 rounded-lg max-w-2xl mx-auto">
            <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium mb-2">
              Belum Ada Mitra Terdaftar
            </p>
            <p className="text-muted-foreground text-sm">
              Saat ini belum ada mitra laundry yang terdaftar di sistem
            </p>
          </div>
        )}

        {/* Cities Grid */}
        {!loading && !error && cities.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {cities.map((city, index) => (
              <div
                key={city}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CityCard
                  name={city}
                  isSelected={selectedCity?.toLowerCase() === city.toLowerCase()}
                  onClick={() => onCitySelect(city.toLowerCase())}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}