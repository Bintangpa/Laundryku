import { CityCard } from "@/components/ui/CityCard";

interface City {
  id: string;
  name: string;
}

const cities: City[] = [
  { id: "jakarta", name: "Jakarta" },
  { id: "bandung", name: "Bandung" },
  { id: "surabaya", name: "Surabaya" },
  { id: "yogyakarta", name: "Yogyakarta" },
  { id: "semarang", name: "Semarang" },
  { id: "malang", name: "Malang" },
  { id: "medan", name: "Medan" },
  { id: "makassar", name: "Makassar" },
];

interface CitiesSectionProps {
  selectedCity: string | null;
  onCitySelect: (cityId: string) => void;
}

export function CitiesSection({ selectedCity, onCitySelect }: CitiesSectionProps) {
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {cities.map((city) => (
            <CityCard
              key={city.id}
              name={city.name}
              isSelected={selectedCity === city.id}
              onClick={() => onCitySelect(city.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
