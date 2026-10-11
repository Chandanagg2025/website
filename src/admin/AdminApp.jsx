import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminDataProvider } from './context/AdminDataContext';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import StockManagement from './pages/StockManagement';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Queries from './pages/Queries';
import Tickets from './pages/Tickets';
import Settings from './pages/Settings';

const AdminAppContent = () => {
  const { isAdmin } = useAdminAuth();

  if (!isAdmin) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="stock" element={<StockManagement />} />
        <Route path="orders" element={<Orders />} />
        <Route path="payments" element={<Payments />} />
        <Route path="queries" element={<Queries />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>
    </Routes>
  );
};

const AdminApp = () => {
  return (
    <AdminAuthProvider>
      <AdminDataProvider>
        <AdminAppContent />
      </AdminDataProvider>
    </AdminAuthProvider>
  );
};

export default AdminApp;
