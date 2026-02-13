import { useState } from "react";
import { CityCard } from "@/components/ui/CityCard";
import { MapPin, Search, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CitiesSectionProps {
  selectedCity: string | null;
  onCitySelect: (cityId: string) => void;
}

export function CitiesSection({ selectedCity, onCitySelect }: CitiesSectionProps) {
  // ✅ HARDCODE 5 kota besar
  const MAJOR_CITIES = [
    "Jakarta",
    "Surabaya", 
    "Bandung",
    "Yogyakarta",
    "Semarang"
  ];

  // ✅ State untuk search kota lain
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ✅ Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onCitySelect(searchQuery.trim().toLowerCase());
    }
  };

  // ✅ Handle clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // ✅ Handle reset - Clear search input & deselect city
  const handleReset = () => {
    setSearchQuery("");
    onCitySelect(""); // Kirim empty string untuk clear selectedCity di parent
  };

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Cari Mitra Laundry di <span className="text-gradient">Kotamu</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Pilih kota untuk melihat daftar mitra laundry terpercaya di sekitarmu
          </p>
        </div>

        {/* ✅ SEARCH BAR DI ATAS */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Masukkan nama kota lain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 md:pl-12 pr-20 md:pr-24 h-11 md:h-12 text-sm md:text-base border-2 focus:border-primary transition-colors"
            />
            {searchQuery ? (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 md:gap-2">
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1.5 md:p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 md:h-9 text-xs md:text-sm px-3 md:px-4"
                >
                  Cari
                </Button>
              </div>
            ) : (
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 md:h-9 text-xs md:text-sm px-3 md:px-4"
                disabled={!searchQuery.trim()}
              >
                Cari
              </Button>
            )}
          </form>

          {/* ✅ RESET BUTTON - Tampil hanya kalau ada city yang dipilih */}
          {selectedCity && (
            <div className="text-center mt-3">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="gap-2 text-xs md:text-sm"
              >
                <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                Reset Pencarian
              </Button>
            </div>
          )}

          
        </div>

        {/* ✅ 5 KOTA BESAR - SIMPLE, PROPORSIONAL, MOBILE FRIENDLY */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-5 text-center">
            Kota Populer
          </h3>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-5 gap-3 md:gap-4">
              {MAJOR_CITIES.map((city, index) => (
                <div
                  key={city}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CityCard
                    name={city}
                    isSelected={selectedCity?.toLowerCase() === city.toLowerCase()}
                    onClick={() => onCitySelect(city.toLowerCase())}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info Text */}
          
        </div>
      </div>
    </section>
  );
}