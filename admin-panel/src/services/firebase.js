import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore, getFirestore, doc, setDoc, deleteDoc, getDocs,
  collection, query, orderBy, onSnapshot, writeBatch
} from 'firebase/firestore';
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  EmailAuthProvider, reauthenticateWithCredential, updatePassword
} from 'firebase/auth';

// ---------------------------------------------------------------------------
// 1. Configuration
// The admin panel and the website MUST point at the same Firebase project.
// Both read the same VITE_FIREBASE_* env vars (see .env.example at repo root).
// ---------------------------------------------------------------------------
export const getFirebaseConfig = () => {
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };
  return envConfig.apiKey && envConfig.projectId ? envConfig : null;
};

export const isFirebaseConfigured = () => Boolean(getFirebaseConfig());

/** Optional client-side allowlist (comma-separated). Firestore rules are the real gate. */
export const getAllowedAdminEmails = () =>
  (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

// ---------------------------------------------------------------------------
// 2. Initialization
// ---------------------------------------------------------------------------
let appInstance = null;
let dbInstance = null;
let authInstance = null;

const getFirebaseApp = () => {
  if (appInstance) return appInstance;
  const config = getFirebaseConfig();
  if (!config) return null;
  try {
    appInstance = getApps().length === 0 ? initializeApp(config) : getApp();
    return appInstance;
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
    return null;
  }
};

export const getDb = () => {
  if (dbInstance) return dbInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    // Product forms can leave fields undefined; Firestore rejects those by default.
    dbInstance = initializeFirestore(app, { ignoreUndefinedProperties: true });
  } catch {
    // Already initialized (e.g. HMR) – reuse the existing instance.
    dbInstance = getFirestore(app);
  }
  return dbInstance;
};

export const getAuthInstance = () => {
  if (authInstance) return authInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  authInstance = getAuth(app);
  return authInstance;
};

// ---------------------------------------------------------------------------
// 3. Admin Authentication (Firebase Auth – email/password)
// ---------------------------------------------------------------------------
export const adminSignIn = (email, password) => {
  const auth = getAuthInstance();
  if (!auth) return Promise.reject(new Error('Firebase is not configured.'));
  return signInWithEmailAndPassword(auth, email, password);
};

export const adminSignOut = () => {
  const auth = getAuthInstance();
  return auth ? signOut(auth) : Promise.resolve();
};

export const onAdminAuthChange = (callback) => {
  const auth = getAuthInstance();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const changeAdminPassword = async (currentPassword, newPassword) => {
  const auth = getAuthInstance();
  const user = auth?.currentUser;
  if (!user || !user.email) throw new Error('You are not signed in.');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};

// ---------------------------------------------------------------------------
// 4. Catalog – one Firestore document per product
//    Path: sp_catalog/{vertical}/items/{productId}
//    (Keeps each doc well under Firestore's 1 MiB limit even with uploaded photos.)
// ---------------------------------------------------------------------------
const itemsCollection = (db, vertical) => collection(db, 'sp_catalog', vertical, 'items');

export const saveProductToCloud = async (vertical, product) => {
  const db = getDb();
  if (!db) throw new Error('Firebase is not configured.');
  await setDoc(doc(itemsCollection(db, vertical), String(product.id)), {
    ...product,
    // orderBy('position') excludes docs without the field, so always set it.
    position: typeof product.position === 'number' ? product.position : -Date.now(),
    updatedAt: new Date().toISOString()
  });
};

export const deleteProductFromCloud = async (vertical, productId) => {
  const db = getDb();
  if (!db) throw new Error('Firebase is not configured.');
  await deleteDoc(doc(itemsCollection(db, vertical), String(productId)));
};

/**
 * Replace the entire cloud catalog for a vertical with `products`
 * (order preserved via `position`). Removes cloud items not in the list.
 */
export const syncCatalogToCloud = async (vertical, products) => {
  const db = getDb();
  if (!db) throw new Error('Firebase is not configured.');

  const col = itemsCollection(db, vertical);
  const existing = await getDocs(col);
  const keepIds = new Set(products.map(p => String(p.id)));
  const now = new Date().toISOString();

  const ops = [
    ...existing.docs
      .filter(d => !keepIds.has(d.id))
      .map(d => batch => batch.delete(d.ref)),
    ...products.map((p, index) => batch =>
      batch.set(doc(col, String(p.id)), { ...p, position: index, updatedAt: now })
    )
  ];

  // Small batches: uploaded images are base64 and batches are capped at ~10 MiB.
  const CHUNK = 20;
  for (let i = 0; i < ops.length; i += CHUNK) {
    const batch = writeBatch(db);
    ops.slice(i, i + CHUNK).forEach(op => op(batch));
    await batch.commit();
  }
};

/** Live listener. Always calls onData with an array (may be empty). */
export const subscribeToCatalog = (vertical, onData, onError) => {
  const db = getDb();
  if (!db) return () => {};
  const q = query(itemsCollection(db, vertical), orderBy('position'));
  return onSnapshot(
    q,
    snap => onData(snap.docs.map(d => d.data())),
    err => {
      console.warn(`Firestore subscription error for ${vertical}:`, err);
      onError?.(err);
    }
  );
};
