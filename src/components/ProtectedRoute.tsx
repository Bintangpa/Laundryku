import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'mitra')[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  allowedRoles, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has allowed role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'mitra') {
      return <Navigate to="/mitra" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Authenticated and authorized
  return <Outlet />;
}