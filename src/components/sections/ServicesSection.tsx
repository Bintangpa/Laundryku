import { Shirt, Timer, Sparkles, Package, Wind, Brush } from "lucide-react";
import { ServiceCard } from "@/components/ui/ServiceCard";

const services = [
  {
    icon: Shirt,
    title: "Laundry Kiloan",
    duration: "2-3 Hari",
    description: "Cuci, keringkan, dan lipat rapi per kilogram",
  },
  {
    icon: Package,
    title: "Laundry Satuan",
    duration: "3-5 Hari",
    description: "Perawatan khusus untuk setiap item pakaian",
  },
  {
    icon: Timer,
    title: "Express 6 Jam",
    duration: "6 Jam",
    description: "Layanan kilat untuk kebutuhan mendesak",
  },
  {
    icon: Sparkles,
    title: "Dry Cleaning",
    duration: "3-4 Hari",
    description: "Pembersihan khusus tanpa air untuk bahan sensitif",
  },
  {
    icon: Wind,
    title: "Setrika Saja",
    duration: "1 Hari",
    description: "Layanan setrika profesional dengan hasil rapi",
  },
  {
    icon: Brush,
    title: "Deep Clean",
    duration: "4-5 Hari",
    description: "Pembersihan mendalam untuk noda membandel",
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Layanan <span className="text-gradient">Laundry Kami</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Berbagai pilihan layanan laundry untuk memenuhi kebutuhan cucianmu
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                duration={service.duration}
                description={service.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
