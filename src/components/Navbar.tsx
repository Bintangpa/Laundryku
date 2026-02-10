import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WashingMachine, Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, partner, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const goToDashboard = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'mitra') {
      navigate('/mitra');
    }
    setIsOpen(false);
  };

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
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Beranda
            </a>
            <a href="/#services" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Layanan
            </a>
            <a href="/#partners" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Mitra
            </a>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">
                      {partner?.nama_toko || user?.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>

                {/* Dashboard Button */}
                <Button
                  onClick={goToDashboard}
                  variant="outline"
                  className="gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>

                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                >
                  Login sebagai Mitra
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="shadow-button"
                >
                  Daftar Mitra
                </Button>
              </div>
            )}
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
              <a 
                href="/" 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
              >
                Beranda
              </a>
              <a 
                href="/#services" 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
              >
                Layanan
              </a>
              <a 
                href="/#partners" 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
              >
                Mitra
              </a>

              {/* Mobile Auth Buttons */}
              {isAuthenticated ? (
                <>
                  {/* User Info Mobile */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {partner?.nama_toko || user?.email.split('@')[0]}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={goToDashboard}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>

                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      navigate('/login');
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Login sebagai Mitra
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/register');
                      setIsOpen(false);
                    }}
                    className="shadow-button w-full"
                  >
                    Daftar Mitra
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}