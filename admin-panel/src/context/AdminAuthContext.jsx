import { createContext, useContext, useState, useEffect } from 'react';
import { adminSignIn, adminSignOut } from '../services/supabase';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('sp_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [adminId, setAdminId] = useState(() => {
    try {
      return localStorage.getItem('sp_admin_id') || 'admin@shreepratham.com';
    } catch {
      return 'admin@shreepratham.com';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sp_admin_auth', isAdmin ? 'true' : 'false');
      localStorage.setItem('sp_admin_id', adminId);
    } catch (e) {
      console.error(e);
    }
  }, [isAdmin, adminId]);

  const login = async (idOrEmail, password) => {
    try {
      const res = await adminSignIn(idOrEmail, password);
      const email = res?.user?.email || idOrEmail || 'admin@shreepratham.com';
      setAdminId(email);
      setIsAdmin(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid Admin ID or Password.' };
    }
  };

  const logout = async () => {
    await adminSignOut();
    setIsAdmin(false);
  };

  const updatePassword = async (currentPassword, newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    // Update local admin password fallback
    localStorage.setItem('sp_admin_pass', newPassword);
    return { success: true };
  };

  return (
    <AdminAuthContext.Provider value={{
      isAdmin,
      authLoading: false,
      adminId,
      login,
      updatePassword,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
