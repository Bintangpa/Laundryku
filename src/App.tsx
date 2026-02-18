import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DeactivatedModal } from '@/components/DeactivatedModal';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminSettings from '@/pages/admin/AdminSettings';
import ManageOrders from '@/pages/admin/ManageOrders';

// Mitra Pages
import MitraDashboard from '@/pages/mitra/Dashboard';
import EditProfile from '@/pages/mitra/Editprofil';
import CreateOrder from '@/pages/mitra/Createorder';
import OrdersList from '@/pages/mitra/OrdersList';
import OrderDetail from '@/pages/mitra/OrderDetail';
import OrderHistory from '@/pages/mitra/Orderhistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Mitra Only */}
          <Route element={<ProtectedRoute allowedRoles={['mitra']} />}>
            <Route path="/mitra" element={<MitraDashboard />} />
            <Route path="/dashboard/mitra" element={<MitraDashboard />} />
            <Route path="/dashboard/mitra/edit-profile" element={<EditProfile />} />
            <Route path="/dashboard/mitra/create-order" element={<CreateOrder />} />
            <Route path="/dashboard/mitra/orders" element={<OrdersList />} />
            <Route path="/dashboard/mitra/orders/:id" element={<OrderDetail />} />
            <Route path="/dashboard/mitra/orders/:id/edit" element={<OrderDetail />} />
            <Route path="/dashboard/mitra/history" element={<OrderHistory />} />
          </Route>

          {/* Protected Routes - Admin Only */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/content" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <DeactivatedModal />
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;