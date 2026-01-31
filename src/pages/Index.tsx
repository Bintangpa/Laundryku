import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { CitiesSection } from "@/components/sections/CitiesSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <HeroSection />
        <CitiesSection
          selectedCity={selectedCity}
          onCitySelect={setSelectedCity}
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
