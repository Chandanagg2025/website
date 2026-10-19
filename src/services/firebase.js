import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore, getFirestore, doc, setDoc, getDocs, collection,
  query, orderBy, onSnapshot, writeBatch
} from 'firebase/firestore';

const STORAGE_KEY = 'sp_firebase_config';

// 1. Retrieve config. Env vars (shared with the admin panel) take precedence so the
//    storefront always reads the same Firebase project the admin panel writes to.
export const getFirebaseConfig = () => {
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

  // Legacy fallback (used only by the built-in /admin route when no env vars are set)
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

// 3. Initialize Firestore
let dbInstance = null;

export const getDb = () => {
  if (dbInstance) return dbInstance;

  const config = getFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return null;
  }

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    try {
      // Orders/inquiries can contain undefined fields; Firestore rejects those by default.
      dbInstance = initializeFirestore(app, { ignoreUndefinedProperties: true });
    } catch {
      dbInstance = getFirestore(app);
    }
    return dbInstance;
  } catch (err) {
    console.error('Failed to initialize Firebase in client:', err);
    return null;
  }
};

export const reinitDb = () => {
  dbInstance = null;
  return getDb();
};

export const isFirebaseConfigured = () => {
  const config = getFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
};

// Catalog lives at sp_catalog/{vertical}/items/{productId} (one document per product).
const itemsCollection = (db, vertical) => collection(db, 'sp_catalog', vertical, 'items');

// Writes require the signed-in admin (see firestore.rules). Kept for the built-in /admin route.
export const syncCatalogToCloud = async (vertical, products) => {
  const db = getDb();
  if (!db) return false;
  try {
    const col = itemsCollection(db, vertical);
    const existing = await getDocs(col);
    const keepIds = new Set(products.map(p => String(p.id)));
    const now = new Date().toISOString();
    const ops = [
      ...existing.docs.filter(d => !keepIds.has(d.id)).map(d => b => b.delete(d.ref)),
      ...products.map((p, index) => b => b.set(doc(col, String(p.id)), { ...p, position: index, updatedAt: now }))
    ];
    for (let i = 0; i < ops.length; i += 20) {
      const batch = writeBatch(db);
      ops.slice(i, i + 20).forEach(op => op(batch));
      await batch.commit();
    }
    return true;
  } catch (error) {
    console.error(`Failed to sync ${vertical} to Firestore:`, error);
    throw error;
  }
};

// 3. Listen to live catalog changes from Firestore (published by the admin panel)
export const subscribeToCatalog = (vertical, onData) => {
  const db = getDb();
  if (!db) return () => {};
  try {
    const q = query(itemsCollection(db, vertical), orderBy('position'));
    return onSnapshot(q, (snap) => {
      onData(snap.docs.map(d => d.data()));
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
    const snap = await getDocs(query(itemsCollection(db, vertical), orderBy('position')));
    return snap.empty ? null : snap.docs.map(d => d.data());
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
