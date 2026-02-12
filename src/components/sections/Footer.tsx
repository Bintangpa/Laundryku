import { useEffect, useState } from "react";
import { WashingMachine, Phone, Mail, MapPin } from "lucide-react";
import { homepageAPI } from "@/lib/api";

interface FooterData {
  brand_name: string;
  brand_description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  copyright_text: string;
}

const defaultFooter: FooterData = {
  brand_name: "LaundryKu",
  brand_description: "Platform laundry online terpercaya yang menghubungkan kamu dengan mitra laundry profesional di seluruh Indonesia.",
  phone: "+62 812-3456-7890",
  whatsapp: "6281234567890",
  email: "info@laundryku.id",
  address: "Jakarta, Indonesia",
  copyright_text: "© 2026 LaundryKu. Semua hak dilindungi.",
};

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData>(defaultFooter);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await homepageAPI.getFooter();
        if (response.data.success) {
          setFooterData(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch footer data:", err);
      }
    };
    fetchFooter();
  }, []);

  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="container px-4">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <WashingMachine className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">{footerData.brand_name}</span>
            </div>
            <p className="text-background/70 leading-relaxed">
              {footerData.brand_description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigasi</h3>
            <ul className="space-y-2 text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">Beranda</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cek Status</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mitra Laundry</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Layanan</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-background/70">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href={`https://wa.me/${footerData.whatsapp}`} className="hover:text-primary transition-colors">
                  {footerData.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href={`mailto:${footerData.email}`} className="hover:text-primary transition-colors">
                  {footerData.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span>{footerData.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-8 text-center text-background/50 text-sm">
          <p>{footerData.copyright_text}</p>
        </div>
      </div>
    </footer>
  );
}