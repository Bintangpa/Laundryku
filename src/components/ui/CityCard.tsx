import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CityCardProps {
  name: string;
  isSelected?: boolean;
  onClick: () => void;
}

// ✅ Utility function untuk membersihkan nama kota
// Menghilangkan kata "KABUPATEN" atau "KOTA" dari awal nama
const cleanCityName = (cityName: string): string => {
  return cityName
    .replace(/^KABUPATEN\s+/i, '') // Hapus "KABUPATEN " di awal (case insensitive)
    .replace(/^KOTA\s+/i, '')       // Hapus "KOTA " di awal (case insensitive)
    .trim();                         // Hapus whitespace di awal/akhir
};

export function CityCard({ name, isSelected, onClick }: CityCardProps) {
  // Bersihkan nama kota sebelum ditampilkan
  const displayName = cleanCityName(name);

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center p-4 md:p-6 rounded-xl border-2 transition-all duration-300 w-full",
        "bg-card hover:bg-primary/5",
        "shadow-sm hover:shadow-md hover:-translate-y-1",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-transparent hover:border-primary/30"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 md:mb-3 transition-colors",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground"
        )}
      >
        <MapPin className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <span
        className={cn(
          "font-semibold text-xs md:text-sm text-card-foreground transition-colors text-center",
          isSelected && "text-primary"
        )}
      >
        {displayName}
      </span>
    </button>
  );
}