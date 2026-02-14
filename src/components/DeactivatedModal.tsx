import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, X } from 'lucide-react';

export function DeactivatedModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Listen untuk event account-deactivated dari api interceptor
    const handleDeactivated = (event: any) => {
      setIsOpen(true);
      setCountdown(30);
    };

    window.addEventListener('account-deactivated', handleDeactivated);

    return () => {
      window.removeEventListener('account-deactivated', handleDeactivated);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto logout ketika countdown habis
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              Akun Dinonaktifkan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Akun Anda telah dinonaktifkan oleh administrator
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="bg-muted/50 rounded-xl p-4 mb-4">
            <p className="text-sm text-foreground mb-2">
              Anda tidak dapat lagi mengakses sistem ini. Silakan hubungi administrator untuk informasi lebih lanjut.
            </p>
            <p className="text-xs text-muted-foreground">
              Email: admin@laundryku.com
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
            <p className="text-sm text-destructive font-medium mb-2">
              Anda akan otomatis logout dalam:
            </p>
            <div className="text-4xl font-bold text-destructive tabular-nums">
              {countdown}
            </div>
            <p className="text-xs text-destructive/70 mt-1">detik</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleLogout}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-3 font-medium transition-colors"
            >
              Logout Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}