import { useState } from "react";
import { WashingMachine, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <WashingMachine className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LaundryKu</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Beranda
            </a>
            <a href="#services" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Layanan
            </a>
            <a href="#partners" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Mitra
            </a>
            <Button className="shadow-button">
              Hubungi Kami
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2">
                Beranda
              </a>
              <a href="#services" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2">
                Layanan
              </a>
              <a href="#partners" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2">
                Mitra
              </a>
              <Button className="shadow-button w-full">
                Hubungi Kami
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
