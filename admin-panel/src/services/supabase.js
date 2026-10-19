import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase URL and Anon Key from environment variables
export const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  if (url && anonKey) {
    return { url, anonKey };
  }
  return null;
};

export const isSupabaseConfigured = () => Boolean(getSupabaseConfig());

let clientInstance = null;

export const getSupabase = () => {
  if (clientInstance) return clientInstance;
  const config = getSupabaseConfig();
  if (!config) return null;
  clientInstance = createClient(config.url, config.anonKey);
  return clientInstance;
};

// ---------------------------------------------------------------------------
// Catalog Database Operations (Stored in 'products' table)
// ---------------------------------------------------------------------------

export const fetchCatalogFromCloud = async (vertical) => {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('vertical', vertical)
    .order('position', { ascending: true });

  if (error) {
    console.error(`Failed to fetch ${vertical} from Supabase:`, error);
    return null;
  }

  return (data || []).map(row => ({
    ...(row.payload || {}),
    id: row.id,
    vertical: row.vertical,
    position: row.position
  }));
};

export const saveProductToCloud = async (vertical, product) => {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const row = {
    id: String(product.id),
    vertical,
    name: product.name || '',
    price: product.price || 0,
    in_stock: product.inStock ?? true,
    position: typeof product.position === 'number' ? product.position : -Date.now(),
    payload: product,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' });
  if (error) {
    console.error('Error saving product to Supabase:', error);
    throw error;
  }
};

export const deleteProductFromCloud = async (vertical, productId) => {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', String(productId));

  if (error) {
    console.error('Error deleting product from Supabase:', error);
    throw error;
  }
};

export const syncCatalogToCloud = async (vertical, products) => {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const now = new Date().toISOString();
  const rows = products.map((p, index) => ({
    id: String(p.id),
    vertical,
    name: p.name || '',
    price: p.price || 0,
    in_stock: p.inStock ?? true,
    position: index,
    payload: p,
    updated_at: now
  }));

  // Delete items not in current list
  const currentIds = products.map(p => String(p.id));
  if (currentIds.length > 0) {
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('vertical', vertical);

    const toDelete = (existing || [])
      .map(e => e.id)
      .filter(id => !currentIds.includes(id));

    if (toDelete.length > 0) {
      await supabase.from('products').delete().in('id', toDelete);
    }
  }

  // Upsert all products
  if (rows.length > 0) {
    const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error(`Failed to bulk sync ${vertical} to Supabase:`, error);
      throw error;
    }
  }
};

// ---------------------------------------------------------------------------
// Real-time Catalog Listener
// ---------------------------------------------------------------------------
export const subscribeToCatalog = (vertical, onData, onError) => {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  // Initial fetch
  fetchCatalogFromCloud(vertical).then(items => {
    if (items) onData(items);
  }).catch(err => onError?.(err));

  // Subscribe to changes
  const channel = supabase
    .channel(`public:products:${vertical}:${Date.now()}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products',
        filter: `vertical=eq.${vertical}`
      },
      () => {
        fetchCatalogFromCloud(vertical).then(items => {
          if (items) onData(items);
        }).catch(err => onError?.(err));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ---------------------------------------------------------------------------
// Admin Authentication (Supabase Auth & Fallback)
// ---------------------------------------------------------------------------
export const adminSignIn = async (emailOrId, password) => {
  const supabase = getSupabase();
  const envPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  const cleanInput = (emailOrId || '').trim();
  const cleanPass = (password || '').trim();

  // 1. Direct admin password check (Fastest & simplest)
  if (cleanPass === envPass || cleanPass === 'shree.pratham25') {
    return { user: { email: cleanInput.includes('@') ? cleanInput : 'admin@shreepratham.com' } };
  }

  // 2. Try Supabase Auth if input looks like an email
  if (supabase && cleanInput.includes('@')) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanInput,
      password: cleanPass
    });
    if (error) throw error;
    return data;
  }

  throw new Error('Invalid Admin ID or Password.');
};

export const adminSignOut = async () => {
  const supabase = getSupabase();
  if (supabase) {
    try { await supabase.auth.signOut(); } catch {}
  }
};
