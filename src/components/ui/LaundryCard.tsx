import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LaundryCardProps {
  name: string;
  address: string;
  operationalHours: string;
  mapsUrl?: string; // 🆕 Now optional
  phone?: string;
}

export function LaundryCard({ 
  name, 
  address, 
  operationalHours, 
  mapsUrl,
  phone 
}: LaundryCardProps) {
  const handleMapsClick = () => {
    if (mapsUrl) {
      window.open(mapsUrl, '_blank');
    }
  };

  const handlePhoneClick = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 text-muted-foreground">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
            <p className="text-sm leading-relaxed">{address}</p>
          </div>
          
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="w-5 h-5 flex-shrink-0 text-primary" />
            <p className="text-sm">{operationalHours}</p>
          </div>
          
          {phone && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-5 h-5 flex-shrink-0 text-primary" />
              <button 
                onClick={handlePhoneClick}
                className="text-sm hover:text-primary transition-colors hover:underline"
              >
                {phone}
              </button>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {/* 🆕 Show Maps button only if mapsUrl exists */}
          {mapsUrl && (
            <Button 
              onClick={handleMapsClick}
              className="flex-1 gap-2"
              variant="default"
            >
              <MapPin className="w-4 h-4" />
              Lihat Maps
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
          
          {phone && (
            <Button 
              onClick={handlePhoneClick}
              className={mapsUrl ? "gap-2" : "flex-1 gap-2"} // Full width if no maps button
              variant="outline"
            >
              <Phone className="w-4 h-4" />
              Hubungi
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}