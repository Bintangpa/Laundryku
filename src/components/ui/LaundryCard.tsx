import { MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "./button";

interface LaundryCardProps {
  name: string;
  address: string;
  operationalHours: string;
  mapsUrl: string;
}

export function LaundryCard({
  name,
  address,
  operationalHours,
  mapsUrl,
}: LaundryCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 hover:border-primary/20">
      <h3 className="text-lg font-bold text-card-foreground mb-3">{name}</h3>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <span className="text-sm">{address}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4 flex-shrink-0 text-accent" />
          <span className="text-sm">{operationalHours}</span>
        </div>
      </div>

      <Button
        asChild
        className="w-full shadow-button hover:shadow-none transition-shadow"
      >
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          <MapPin className="w-4 h-4 mr-2" />
          Lihat di Google Maps
          <ExternalLink className="w-3 h-3 ml-2" />
        </a>
      </Button>
    </div>
  );
}
