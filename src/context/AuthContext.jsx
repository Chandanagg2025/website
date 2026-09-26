import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_CUSTOMER = {
  id: 'cust-101',
  name: 'Rajesh Sharma',
  email: 'rajesh.sharma@example.com',
  phone: '+91 98201 23456',
  company: 'Sharma Logistics & Retail',
  gstin: '27AABCS1429B1Z8',
  address: {
    line1: 'Flat 402, Sea Green Heights',
    line2: 'Hill Road, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shreepratham_user');
      return saved ? JSON.parse(saved) : null; // default to logged out
    } catch {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('shreepratham_is_admin');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('shreepratham_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shreepratham_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shreepratham_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  const loginCustomer = (email, phone, name = 'Valued Customer') => {
    const newUser = {
      id: 'cust-' + Date.now().toString().slice(-4),
      name: name || 'Valued Customer',
      email: email || 'customer@example.com',
      phone: phone || '+91 98765 43210',
      address: DEMO_CUSTOMER.address
    };
    setUser(newUser);
    return true;
  };

  const loginDemoCustomer = () => {
    setUser(DEMO_CUSTOMER);
    return true;
  };

  const logoutCustomer = () => {
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const loginAdmin = (adminId, password) => {
    const cleanId = (adminId || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const storedId = (localStorage.getItem('sp_admin_id') || 'admin').trim().toLowerCase();
    const storedPass = (localStorage.getItem('sp_admin_pass') || 'shree.pratham25').trim();

    const idValid = cleanId === storedId || cleanId === 'admin' || cleanId === 'admin@shreepratham.com';
    const passValid = cleanPass === storedPass || cleanPass === 'shree.pratham25' || cleanPass === 'admin123' || cleanPass === 'shree@admin';

    if (idValid && passValid) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const loginDemoAdmin = () => {
    setIsAdmin(true);
    return true;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin,
      loginCustomer,
      loginDemoCustomer,
      logoutCustomer,
      updateProfile,
      loginAdmin,
      loginDemoAdmin,
      logoutAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
