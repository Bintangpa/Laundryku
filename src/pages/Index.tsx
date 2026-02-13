import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { CitiesSection } from "@/components/sections/CitiesSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // ✅ Handle city selection - convert empty string to null for reset
  const handleCitySelect = (city: string) => {
    setSelectedCity(city === "" ? null : city);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <HeroSection />
        <CitiesSection
          selectedCity={selectedCity}
          onCitySelect={handleCitySelect}
        />
        <PartnersSection selectedCity={selectedCity} />
        <div id="services">
          <ServicesSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;