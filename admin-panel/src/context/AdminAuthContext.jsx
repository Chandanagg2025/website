import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('sp_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('sp_admin_auth', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  const login = (password) => {
    if (password === 'admin123' || password === 'admin' || password === 'shree@admin') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const loginDemo = () => {
    setIsAdmin(true);
    return true;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, loginDemo, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
