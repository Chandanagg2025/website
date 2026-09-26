import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore, doc, setDoc, getDoc, collection,
  onSnapshot, addDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';

const STORAGE_KEY = 'sp_firebase_config';

// 1. Retrieve config from localStorage or Vite environment variables
export const getFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading saved firebase config', e);
  }

  // Fallback to env vars
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  return null;
};

// 2. Save config into localStorage
export const saveFirebaseConfig = (config) => {
  if (!config || !config.projectId || !config.apiKey) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('Error saving firebase config', e);
    return false;
  }
};

// 3. Initialize Firebase instance
let dbInstance = null;

export const getDb = () => {
  if (dbInstance) return dbInstance;

  const config = getFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return null;
  }

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
    return null;
  }
};

// Reset instance when config updates
export const reinitDb = () => {
  dbInstance = null;
  return getDb();
};

export const isFirebaseConfigured = () => {
  const config = getFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
};

// 4. Catalog Firestore Helpers
export const syncCatalogToCloud = async (vertical, products) => {
  const db = getDb();
  if (!db) return false;
  try {
    const docRef = doc(db, 'sp_catalog', vertical);
    await setDoc(docRef, {
      vertical,
      products,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error(`Failed to sync ${vertical} to Firestore:`, error);
    throw error;
  }
};

export const fetchCatalogFromCloud = async (vertical) => {
  const db = getDb();
  if (!db) return null;
  try {
    const docRef = doc(db, 'sp_catalog', vertical);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().products || null;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch ${vertical} from Firestore:`, error);
    return null;
  }
};

// Real-time listener for catalog
export const subscribeToCatalog = (vertical, onData) => {
  const db = getDb();
  if (!db) return () => {};
  try {
    const docRef = doc(db, 'sp_catalog', vertical);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.products)) {
          onData(data.products);
        }
      }
    }, (err) => {
      console.warn(`Firestore subscription error for ${vertical}:`, err);
    });
  } catch (err) {
    console.error(err);
    return () => {};
  }
};
