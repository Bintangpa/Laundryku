import { useEffect, useState } from "react";
import { Shirt, Timer, Sparkles, Package, Wind, Brush, LucideIcon } from "lucide-react";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { homepageAPI } from "@/lib/api";

// Map icon_name string dari DB ke komponen Lucide
const iconMap: Record<string, LucideIcon> = {
  Shirt,
  Timer,
  Sparkles,
  Package,
  Wind,
  Brush,
};

interface ServiceItem {
  id: number;
  icon_name: string;
  title: string;
  duration: string;
  description: string;
  sort_order: number;
}

interface ServicesSectionData {
  section_title: string;
  section_title_highlight: string;
  section_subtitle: string;
  items: ServiceItem[];
}

const defaultData: ServicesSectionData = {
  section_title: "Layanan",
  section_title_highlight: "Laundry Kami",
  section_subtitle: "Berbagai pilihan layanan laundry untuk memenuhi kebutuhan cucianmu",
  items: [],
};

export function ServicesSection() {
  const [data, setData] = useState<ServicesSectionData>(defaultData);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await homepageAPI.getServices();
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch services data:", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {data.section_title} <span className="text-gradient">{data.section_title_highlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {data.section_subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.items.map((service, index) => {
            const IconComponent = iconMap[service.icon_name] || Package;
            return (
              <div
                key={service.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceCard
                  icon={IconComponent}
                  title={service.title}
                  duration={service.duration}
                  description={service.description}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}