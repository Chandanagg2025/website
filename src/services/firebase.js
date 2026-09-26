import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore, doc, setDoc, getDoc, collection,
  onSnapshot, addDoc, updateDoc
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

// 2. Initialize Firestore
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
    console.error('Failed to initialize Firebase in client:', err);
    return null;
  }
};

export const isFirebaseConfigured = () => {
  const config = getFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
};

// 3. Listen to live catalog changes from Firestore
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
      console.warn(`Firestore subscription notice for ${vertical}:`, err);
    });
  } catch (err) {
    console.error(err);
    return () => {};
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

// 4. Send customer orders to Firestore so Admin panel sees them immediately
export const sendOrderToCloud = async (order) => {
  const db = getDb();
  if (!db) return false;
  try {
    const docRef = doc(db, 'sp_orders', order.id || `order-${Date.now()}`);
    await setDoc(docRef, {
      ...order,
      createdAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Failed to sync order to cloud:', err);
    return false;
  }
};

// 5. Send customer inquiries to Firestore
export const sendInquiryToCloud = async (inquiry) => {
  const db = getDb();
  if (!db) return false;
  try {
    const docRef = doc(db, 'sp_queries', inquiry.id || `inq-${Date.now()}`);
    await setDoc(docRef, {
      ...inquiry,
      createdAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Failed to sync inquiry to cloud:', err);
    return false;
  }
};
