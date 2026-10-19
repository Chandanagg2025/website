import { createContext, useContext, useState, useEffect } from 'react';
import {
  isFirebaseConfigured,
  getAllowedAdminEmails,
  adminSignIn,
  adminSignOut,
  onAdminAuthChange,
  changeAdminPassword
} from '../services/firebase';

const AdminAuthContext = createContext();

const isEmailAllowed = (email) => {
  const allowed = getAllowedAdminEmails();
  return allowed.length === 0 || allowed.includes((email || '').toLowerCase());
};

const friendlyAuthError = (err) => {
  switch (err?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'Invalid admin email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Authentication.';
    case 'auth/weak-password':
      return 'New password is too weak (minimum 6 characters).';
    default:
      return err?.message || 'Something went wrong. Please try again.';
  }
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured());

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setAuthLoading(false);
      return;
    }
    return onAdminAuthChange(async (firebaseUser) => {
      if (firebaseUser && !isEmailAllowed(firebaseUser.email)) {
        await adminSignOut();
        setUser(null);
      } else {
        setUser(firebaseUser);
      }
      setAuthLoading(false);
    });
  }, []);

  /** Returns { success: true } or { success: false, error: string } */
  const login = async (email, password) => {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase is not configured. Add VITE_FIREBASE_* values to .env and restart.' };
    }
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!isEmailAllowed(cleanEmail)) {
      return { success: false, error: 'This account is not authorised for admin access.' };
    }
    try {
      await adminSignIn(cleanEmail, password);
      return { success: true };
    } catch (err) {
      return { success: false, error: friendlyAuthError(err) };
    }
  };

  /** Returns { success: true } or { success: false, error: string } */
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await changeAdminPassword(currentPassword, newPassword);
      return { success: true };
    } catch (err) {
      return { success: false, error: friendlyAuthError(err) };
    }
  };

  const logout = () => adminSignOut();

  return (
    <AdminAuthContext.Provider value={{
      isAdmin: Boolean(user),
      authLoading,
      adminId: user?.email || '',
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
