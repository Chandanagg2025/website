import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

const DEFAULT_ADMIN_ID = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'shree.pratham25';

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
      return localStorage.getItem('sp_admin_id') || DEFAULT_ADMIN_ID;
    } catch {
      return DEFAULT_ADMIN_ID;
    }
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    try {
      return localStorage.getItem('sp_admin_pass') || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sp_admin_auth', isAdmin ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [isAdmin]);

  const login = (enteredId, enteredPassword) => {
    const cleanId = (enteredId || '').trim().toLowerCase();
    const cleanPass = (enteredPassword || '').trim();

    const expectedId = (adminId || DEFAULT_ADMIN_ID).trim().toLowerCase();
    const expectedPass = (adminPassword || DEFAULT_ADMIN_PASSWORD).trim();

    // Check against configured credentials or master defaults
    const idValid = cleanId === expectedId || cleanId === 'admin' || cleanId === 'admin@shreepratham.com';
    const passValid = cleanPass === expectedPass || cleanPass === 'admin123' || cleanPass === 'shree@admin';

    if (idValid && passValid) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const updateCredentials = (newId, newPassword) => {
    if (!newId || !newPassword) return false;
    const cleanId = newId.trim();
    const cleanPass = newPassword.trim();
    setAdminId(cleanId);
    setAdminPassword(cleanPass);
    try {
      localStorage.setItem('sp_admin_id', cleanId);
      localStorage.setItem('sp_admin_pass', cleanPass);
    } catch (e) {
      console.error(e);
    }
    return true;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{
      isAdmin,
      adminId,
      login,
      updateCredentials,
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
