import { createClient } from '@supabase/supabase-js';

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
// Storefront Catalog Operations
// ---------------------------------------------------------------------------

export const fetchCatalogFromCloud = async (vertical) => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('vertical', vertical)
      .order('position', { ascending: true });

    if (error || !data) {
      return null;
    }

    return data.map(row => ({
      ...(row.payload || {}),
      id: row.id,
      vertical: row.vertical,
      position: row.position
    }));
  } catch (err) {
    console.warn(`Error fetching ${vertical} from Supabase:`, err);
    return null;
  }
};

export const subscribeToCatalog = (vertical, onData) => {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  // Initial fetch
  fetchCatalogFromCloud(vertical).then(items => {
    if (Array.isArray(items) && items.length > 0) {
      onData(items);
    }
  });

  // Listen for real-time changes
  const channel = supabase
    .channel(`public:storefront:products:${vertical}:${Date.now()}`)
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
          if (Array.isArray(items) && items.length > 0) {
            onData(items);
          }
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ---------------------------------------------------------------------------
// Storefront Order Sync
// ---------------------------------------------------------------------------
export const sendOrderToCloud = async (order) => {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('orders')
      .upsert({
        id: order.id,
        customer_name: order.customer?.name || '',
        customer_email: order.customer?.email || '',
        total_amount: order.totalAmount || 0,
        payment_status: order.paymentStatus || 'Pending',
        order_status: order.orderStatus || 'Processing',
        payload: order,
        created_at: new Date().toISOString()
      }, { onConflict: 'id' });

    return !error;
  } catch {
    return false;
  }
};
