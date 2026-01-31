import { useEffect, useRef } from "react";
import { LaundryCard } from "@/components/ui/LaundryCard";
import { Building2 } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  address: string;
  operationalHours: string;
  mapsUrl: string;
  cityId: string;
}

const partners: Partner[] = [
  // Jakarta
  {
    id: "1",
    name: "Fresh & Clean Laundry",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    operationalHours: "08:00 - 21:00",
    mapsUrl: "https://maps.google.com/?q=Fresh+Clean+Laundry+Jakarta",
    cityId: "jakarta",
  },
  {
    id: "2",
    name: "Sparkle Wash",
    address: "Jl. Gatot Subroto No. 45, Jakarta Selatan",
    operationalHours: "07:00 - 22:00",
    mapsUrl: "https://maps.google.com/?q=Sparkle+Wash+Jakarta",
    cityId: "jakarta",
  },
  {
    id: "3",
    name: "Quick Clean Express",
    address: "Jl. Kemang Raya No. 88, Jakarta Selatan",
    operationalHours: "24 Jam",
    mapsUrl: "https://maps.google.com/?q=Quick+Clean+Express+Jakarta",
    cityId: "jakarta",
  },
  // Bandung
  {
    id: "4",
    name: "Bright Wash",
    address: "Jl. Dago No. 56, Bandung",
    operationalHours: "08:00 - 20:00",
    mapsUrl: "https://maps.google.com/?q=Bright+Wash+Bandung",
    cityId: "bandung",
  },
  {
    id: "5",
    name: "Clean House Laundry",
    address: "Jl. Riau No. 78, Bandung",
    operationalHours: "07:30 - 21:00",
    mapsUrl: "https://maps.google.com/?q=Clean+House+Laundry+Bandung",
    cityId: "bandung",
  },
  // Surabaya
  {
    id: "6",
    name: "Clean Master",
    address: "Jl. Pemuda No. 100, Surabaya",
    operationalHours: "08:00 - 21:00",
    mapsUrl: "https://maps.google.com/?q=Clean+Master+Surabaya",
    cityId: "surabaya",
  },
  {
    id: "7",
    name: "Prima Laundry",
    address: "Jl. Basuki Rahmat No. 55, Surabaya",
    operationalHours: "07:00 - 22:00",
    mapsUrl: "https://maps.google.com/?q=Prima+Laundry+Surabaya",
    cityId: "surabaya",
  },
  // Yogyakarta
  {
    id: "8",
    name: "Jogja Fresh Laundry",
    address: "Jl. Malioboro No. 32, Yogyakarta",
    operationalHours: "08:00 - 20:00",
    mapsUrl: "https://maps.google.com/?q=Jogja+Fresh+Laundry",
    cityId: "yogyakarta",
  },
  // Semarang
  {
    id: "9",
    name: "Semarang Clean",
    address: "Jl. Pandanaran No. 44, Semarang",
    operationalHours: "08:00 - 21:00",
    mapsUrl: "https://maps.google.com/?q=Semarang+Clean",
    cityId: "semarang",
  },
  // Malang
  {
    id: "10",
    name: "Malang Wash Center",
    address: "Jl. Ijen No. 23, Malang",
    operationalHours: "07:00 - 21:00",
    mapsUrl: "https://maps.google.com/?q=Malang+Wash+Center",
    cityId: "malang",
  },
  // Medan
  {
    id: "11",
    name: "Medan Laundry Pro",
    address: "Jl. Asia No. 67, Medan",
    operationalHours: "08:00 - 20:00",
    mapsUrl: "https://maps.google.com/?q=Medan+Laundry+Pro",
    cityId: "medan",
  },
  // Makassar
  {
    id: "12",
    name: "Makassar Fresh Clean",
    address: "Jl. Penghibur No. 12, Makassar",
    operationalHours: "08:00 - 21:00",
    mapsUrl: "https://maps.google.com/?q=Makassar+Fresh+Clean",
    cityId: "makassar",
  },
];

const cityNames: Record<string, string> = {
  jakarta: "Jakarta",
  bandung: "Bandung",
  surabaya: "Surabaya",
  yogyakarta: "Yogyakarta",
  semarang: "Semarang",
  malang: "Malang",
  medan: "Medan",
  makassar: "Makassar",
};

interface PartnersSectionProps {
  selectedCity: string | null;
}

export function PartnersSection({ selectedCity }: PartnersSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const filteredPartners = selectedCity
    ? partners.filter((p) => p.cityId === selectedCity)
    : [];

  useEffect(() => {
    if (selectedCity && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedCity]);

  if (!selectedCity) return null;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-secondary/30" id="partners">
      <div className="container px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Mitra Laundry di {cityNames[selectedCity]}
            </h2>
            <p className="text-muted-foreground">
              {filteredPartners.length} mitra tersedia
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner, index) => (
            <div
              key={partner.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <LaundryCard
                name={partner.name}
                address={partner.address}
                operationalHours={partner.operationalHours}
                mapsUrl={partner.mapsUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
