import * as React from "react";
import { Check, ChevronsUpDown, MapPin, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface City {
  id: string;
  nama: string;
}

interface CityComboboxProps {
  cities: City[];
  loading?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
}

export function CityCombobox({
  cities,
  loading = false,
  value,
  onValueChange,
  disabled = false,
  error = false,
  placeholder = "Pilih kota...",
}: CityComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Filter cities based on search
  const filteredCities = React.useMemo(() => {
    if (!search) return cities;
    return cities.filter((city) =>
      city.nama.toLowerCase().includes(search.toLowerCase())
    );
  }, [cities, search]);

  // Get display value
  const displayValue = React.useMemo(() => {
    if (!value) return "";
    const city = cities.find((c) => c.nama === value);
    return city?.nama || value;
  }, [value, cities]);

  // Handle selection
  const handleSelect = (cityName: string) => {
    onValueChange(cityName);
    setOpen(false);
    setSearch(""); // Reset search
  };

  // Clear search when opening
  React.useEffect(() => {
    if (open) {
      setSearch("");
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          className={cn(
            "w-full h-12 justify-between pl-4 font-normal hover:bg-accent/50",
            !value && "text-muted-foreground",
            error && "border-destructive focus:ring-destructive"
          )}
        >
          {/* Display Text */}
          <span className={cn(
            "truncate",
            value ? "text-foreground" : "text-muted-foreground"
          )}>
            {loading ? "Memuat data kota..." : displayValue || placeholder}
          </span>
          
          {/* Arrow Icon */}
          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="p-0" 
        align="start"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Cari kota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="ml-2 hover:bg-secondary rounded p-1"
              >
                <X className="h-4 w-4 opacity-50" />
              </button>
            )}
          </div>

          {/* Cities List */}
          <ScrollArea className="h-[300px]">
            {filteredCities.length === 0 ? (
              <div className="py-6 text-center">
                <MapPin className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {search ? "Kota tidak ditemukan" : "Tidak ada data kota"}
                </p>
                {search && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Coba kata kunci lain
                  </p>
                )}
              </div>
            ) : (
              <div className="p-1">
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelect(city.nama)}
                    className={cn(
                      "w-full flex items-center px-2 py-2 text-sm rounded-sm cursor-pointer transition-colors",
                      "hover:bg-accent",
                      value === city.nama && "bg-accent/50"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 flex-shrink-0",
                        value === city.nama ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{city.nama}</span>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}