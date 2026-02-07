import { useEffect, useState } from "react";
import { CityCard } from "@/components/ui/CityCard";
import { partnersAPI } from "@/lib/api";
import { Loader2, AlertCircle, MapPin, Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CitiesSectionProps {
  selectedCity: string | null;
  onCitySelect: (cityId: string) => void;
}

export function CitiesSection({ selectedCity, onCitySelect }: CitiesSectionProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ State untuk search dan filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  // ✅ Fungsi untuk membersihkan nama kota (hapus "KABUPATEN" atau "KOTA")
  const cleanCityName = (cityName: string): string => {
    return cityName
      .replace(/^KABUPATEN\s+/i, '')
      .replace(/^KOTA\s+/i, '')
      .trim();
  };

  // ✅ Filter cities berdasarkan search query
  const filteredCities = cities.filter((city) => {
    const cleanedCity = cleanCityName(city);
    return cleanedCity.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // ✅ Sort cities berdasarkan order
  const sortedCities = [...filteredCities].sort((a, b) => {
    const cleanA = cleanCityName(a);
    const cleanB = cleanCityName(b);
    
    if (sortOrder === "asc") {
      return cleanA.localeCompare(cleanB);
    } else {
      return cleanB.localeCompare(cleanA);
    }
  });

  // ✅ Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // ✅ Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

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

        {/* ✅ Search Bar & Filter - Hanya tampil jika ada cities */}
        {!loading && !error && cities.length > 0 && (
          <>
            <div className="max-w-3xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari nama kota..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 h-12 text-base border-2 focus:border-primary transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Sort Filter Button */}
                <Button
                  onClick={toggleSortOrder}
                  variant="outline"
                  className="h-12 gap-2 border-2 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {sortOrder === "asc" ? "A-Z" : "Z-A"}
                  </span>
                  <span className="sm:hidden">
                    Sort {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                </Button>
              </div>

              {/* Counter */}
              <div className="mt-3 text-center">
                <p className="text-sm text-muted-foreground">
                  Menampilkan <span className="font-semibold text-primary">{sortedCities.length}</span> dari{" "}
                  <span className="font-semibold">{cities.length}</span> kota
                  {searchQuery && (
                    <span className="ml-1">
                      untuk pencarian "<span className="font-medium text-foreground">{searchQuery}</span>"
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Cities Grid */}
            {sortedCities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 max-w-6xl mx-auto">
                {sortedCities.map((city, index) => (
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
            ) : (
              /* Empty Search Result */
              <div className="flex flex-col items-center justify-center py-12 bg-muted/50 rounded-lg max-w-2xl mx-auto">
                <Search className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-foreground font-medium mb-2">
                  Kota Tidak Ditemukan
                </p>
                <p className="text-muted-foreground text-sm text-center px-4">
                  Tidak ada kota yang sesuai dengan pencarian "<span className="font-medium">{searchQuery}</span>"
                </p>
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  className="mt-4 gap-2"
                >
                  <X className="w-4 h-4" />
                  Hapus Pencarian
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}