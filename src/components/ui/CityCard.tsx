import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CityCardProps {
  name: string;
  isSelected?: boolean;
  onClick: () => void;
}

export function CityCard({ name, isSelected, onClick }: CityCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300",
        "bg-card hover:bg-primary/5",
        "shadow-card hover:shadow-card-hover hover:-translate-y-1",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-transparent hover:border-primary/30"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground"
        )}
      >
        <MapPin className="w-6 h-6" />
      </div>
      <span
        className={cn(
          "font-semibold text-card-foreground transition-colors",
          isSelected && "text-primary"
        )}
      >
        {name}
      </span>
    </button>
  );
}
