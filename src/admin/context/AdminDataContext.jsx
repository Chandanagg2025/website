import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  initialGiftProducts,
  initialWaterProducts,
  initialAppliances,
  seedOrders as initialOrders,
  seedSubscriptions as initialSubscriptions,
  seedQuotes as initialQuotes,
  seedTickets as initialTickets
} from '../../data/mockData';
import { catalogSync } from '../../services/catalogSync';
import {
  isFirebaseConfigured,
  syncCatalogToCloud,
  subscribeToCatalog,
  saveFirebaseConfig,
  reinitDb
} from '../../services/firebase';

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  // Toast notifications
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  }, []);

  // 1. Catalogs
  const [gifts, setGifts] = useState(() => {
    try {
      const s = localStorage.getItem('sp_gift_products') || localStorage.getItem('admin_gifts');
      if (!s) return initialGiftProducts;
      const parsed = JSON.parse(s);
      const existingIds = new Set(parsed.map(p => p.id));
      const missing = initialGiftProducts.filter(p => !existingIds.has(p.id));
      if (missing.length > 0) return [...missing, ...parsed];
      return parsed;
    } catch {
      return initialGiftProducts;
    }
  });

  const [water, setWater] = useState(() => {
    try {
      const s = localStorage.getItem('sp_water_products') || localStorage.getItem('admin_water');
      return s ? JSON.parse(s) : initialWaterProducts;
    } catch {
      return initialWaterProducts;
    }
  });

  const [appliances, setAppliances] = useState(() => {
    try {
      const s = localStorage.getItem('sp_appliances') || localStorage.getItem('admin_appliances');
      return s ? JSON.parse(s) : initialAppliances;
    } catch {
      return initialAppliances;
    }
  });

  // Cloud status
  const [cloudConnected, setCloudConnected] = useState(isFirebaseConfigured());

  // Listen to Firestore real-time if configured
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    setCloudConnected(true);

    const unsubGifts = subscribeToCatalog('gifts', (cloudData) => {
      if (Array.isArray(cloudData) && cloudData.length > 0) setGifts(cloudData);
    });
    const unsubWater = subscribeToCatalog('water', (cloudData) => {
      if (Array.isArray(cloudData) && cloudData.length > 0) setWater(cloudData);
    });
    const unsubApps = subscribeToCatalog('appliances', (cloudData) => {
      if (Array.isArray(cloudData) && cloudData.length > 0) setAppliances(cloudData);
    });

    return () => {
      unsubGifts();
      unsubWater();
      unsubApps();
    };
  }, []);

  // Real-time synchronization across browser tabs and store windows
  useEffect(() => {
    const unsub = catalogSync.subscribe((event) => {
      if (event.type === 'CATALOG_UPDATE' || event.type === 'STORAGE_CHANGE') {
        try {
          const g = localStorage.getItem('sp_gift_products');
          if (g) setGifts(JSON.parse(g));
          const w = localStorage.getItem('sp_water_products');
          if (w) setWater(JSON.parse(w));
          const a = localStorage.getItem('sp_appliances');
          if (a) setAppliances(JSON.parse(a));
          const o = localStorage.getItem('sp_orders');
          if (o) setOrders(JSON.parse(o));
        } catch (e) {
          console.error('Error syncing admin data', e);
        }
      }
    });

    return unsub;
  }, []);

  // 2. Orders
  const [orders, setOrders] = useState(() => {
    try {
      const s = localStorage.getItem('sp_orders') || localStorage.getItem('admin_orders');
      return s ? JSON.parse(s) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  // 3. Payments
  const [payments, setPayments] = useState(() => {
    try {
      const s = localStorage.getItem('admin_payments');
      return s ? JSON.parse(s) : [
        { id: 'pay_N1xR4yz8BqE2', orderId: 'SP-ORD-10421', amount: 3801, method: 'UPI', status: 'Captured', date: '2026-09-24', customerName: 'Rajesh Sharma' },
        { id: 'pay_M2wQ3xA1BcD4', orderId: 'SP-ORD-10420', amount: 98000, method: 'Bank Transfer', status: 'Captured', date: '2026-09-23', customerName: 'Priya Mehta' },
        { id: 'COD-10419', orderId: 'SP-ORD-10419', amount: 42999, method: 'COD', status: 'Pending', date: '2026-09-22', customerName: 'Amit Patel' },
        { id: 'pay_K8xY9aB2CqD1', orderId: 'SP-ORD-10418', amount: 11691, method: 'UPI', status: 'Captured', date: '2026-09-21', customerName: 'Sunita Desai' },
      ];
    } catch {
      return [];
    }
  });

  // 4. Queries
  const [queries, setQueries] = useState(() => {
    try {
      const s = localStorage.getItem('sp_contact_inquiries') || localStorage.getItem('admin_queries');
      return s ? JSON.parse(s) : [
        { id: 'SP-INQ-1001', name: 'Vikramaditya Singhania', email: 'vikram@singhania.in', phone: '+91 98200 11223', vertical: 'Gift Gallery', message: 'Looking for 500 bespoke luxury Diwali executive hampers with customized gold foil company branding.', date: '2026-09-24', status: 'Pending', preferredTime: 'Morning' },
        { id: 'SP-INQ-1002', name: 'Kavitha Reddy', email: 'kavitha@hotels.co', phone: '+91 93456 78901', vertical: 'Industrial Appliances', message: 'Need quotation for 10 commercial deep freezers and 5 4-burner gas ranges for new hotel opening in Bangalore.', date: '2026-09-23', status: 'Contacted', preferredTime: 'Afternoon' },
        { id: 'SP-INQ-1003', name: 'Rahul Gupta', email: 'rahul@startup.io', phone: '+91 87654 32109', vertical: 'Digital Marketing', message: 'Want to discuss SEO and PPC packages for our SaaS product launch.', date: '2026-09-23', status: 'Pending', preferredTime: 'Evening' },
        { id: 'SP-INQ-1004', name: 'Meena Kapoor', email: 'meena@office.com', phone: '+91 76543 21098', vertical: 'Drinking Water', message: 'Monthly subscription of 50 jars for our office in Powai.', date: '2026-09-22', status: 'Resolved', preferredTime: 'Morning' },
      ];
    } catch {
      return [];
    }
  });

  // 5. Tickets
  const [tickets, setTickets] = useState(() => {
    try {
      const s = localStorage.getItem('sp_tickets') || localStorage.getItem('admin_tickets');
      return s ? JSON.parse(s) : initialTickets;
    } catch {
      return initialTickets;
    }
  });

  // 6. Subscriptions
  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const s = localStorage.getItem('sp_subscriptions') || localStorage.getItem('admin_subs');
      return s ? JSON.parse(s) : initialSubscriptions;
    } catch {
      return initialSubscriptions;
    }
  });

  // 7. Bulk Quotes
  const [bulkQuotes, setBulkQuotes] = useState(() => {
    try {
      const s = localStorage.getItem('sp_quotes') || localStorage.getItem('admin_quotes');
      return s ? JSON.parse(s) : initialQuotes;
    } catch {
      return initialQuotes;
    }
  });

  // 8. Settings
  const [settings, setSettings] = useState(() => {
    try {
      const s = localStorage.getItem('admin_settings');
      return s ? JSON.parse(s) : {
        razorpayKey: 'rzp_test_51ShreePrathamKey',
        merchantUpi: 'shreepratham@upi',
        salesEmail: 'sales@shreepratham.com',
        shiprocketEmail: 'logistics@shreepratham.com',
        shiprocketPickupPin: '400050',
        shiprocketPickupLocation: 'Mumbai Central Hub'
      };
    } catch {
      return {};
    }
  });

  // Persist locally under both keys for maximum compatibility
  useEffect(() => {
    localStorage.setItem('sp_gift_products', JSON.stringify(gifts));
    localStorage.setItem('admin_gifts', JSON.stringify(gifts));
  }, [gifts]);

  useEffect(() => {
    localStorage.setItem('sp_water_products', JSON.stringify(water));
    localStorage.setItem('admin_water', JSON.stringify(water));
  }, [water]);

  useEffect(() => {
    localStorage.setItem('sp_appliances', JSON.stringify(appliances));
    localStorage.setItem('admin_appliances', JSON.stringify(appliances));
  }, [appliances]);

  useEffect(() => {
    localStorage.setItem('sp_orders', JSON.stringify(orders));
    localStorage.setItem('admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => { localStorage.setItem('admin_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('sp_contact_inquiries', JSON.stringify(queries)); localStorage.setItem('admin_queries', JSON.stringify(queries)); }, [queries]);
  useEffect(() => { localStorage.setItem('sp_tickets', JSON.stringify(tickets)); localStorage.setItem('admin_tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('sp_subscriptions', JSON.stringify(subscriptions)); localStorage.setItem('admin_subs', JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem('sp_quotes', JSON.stringify(bulkQuotes)); localStorage.setItem('admin_quotes', JSON.stringify(bulkQuotes)); }, [bulkQuotes]);
  useEffect(() => { localStorage.setItem('admin_settings', JSON.stringify(settings)); }, [settings]);

  // Sync to cloud helper
  const syncToCloud = useCallback(async (vertical, newProducts) => {
    if (isFirebaseConfigured()) {
      try {
        await syncCatalogToCloud(vertical, newProducts);
      } catch (err) {
        console.warn(`Could not sync ${vertical} to cloud:`, err);
      }
    }
  }, []);

  // Force sync all to cloud
  const pushAllToCloud = async () => {
    if (!isFirebaseConfigured()) {
      showToast('Firebase not configured. Setup credentials in Settings.', 'error');
      return false;
    }
    try {
      showToast('Syncing all products to cloud...', 'info');
      await syncCatalogToCloud('gifts', gifts);
      await syncCatalogToCloud('water', water);
      await syncCatalogToCloud('appliances', appliances);
      showToast('All products successfully synced to cloud and live on storefront!', 'success');
      return true;
    } catch (e) {
      showToast('Sync failed: ' + (e.message || 'Check connection / Firestore rules'), 'error');
      return false;
    }
  };

  // Connect Firebase from Settings
  const configureFirebase = (configObj) => {
    const ok = saveFirebaseConfig(configObj);
    if (ok) {
      reinitDb();
      setCloudConnected(true);
      showToast('Firebase Cloud Database connected successfully!');
      return true;
    }
    showToast('Invalid Firebase configuration object.', 'error');
    return false;
  };

  // Product operations
  const addProduct = (vertical, product) => {
    const newProduct = {
      ...product,
      id: product.id || `${vertical}-${Date.now()}`,
      inStock: product.inStock !== undefined ? product.inStock : (parseInt(product.stock || '0') > 0)
    };

    if (vertical === 'gifts') {
      const updated = [newProduct, ...gifts];
      setGifts(updated);
      localStorage.setItem('sp_gift_products', JSON.stringify(updated));
      catalogSync.broadcast('CATALOG_UPDATE', { vertical: 'gifts', products: updated });
      syncToCloud('gifts', updated);
    } else if (vertical === 'water') {
      const updated = [newProduct, ...water];
      setWater(updated);
      localStorage.setItem('sp_water_products', JSON.stringify(updated));
      catalogSync.broadcast('CATALOG_UPDATE', { vertical: 'water', products: updated });
      syncToCloud('water', updated);
    } else if (vertical === 'appliances') {
      const updated = [newProduct, ...appliances];
      setAppliances(updated);
      localStorage.setItem('sp_appliances', JSON.stringify(updated));
      catalogSync.broadcast('CATALOG_UPDATE', { vertical: 'appliances', products: updated });
      syncToCloud('appliances', updated);
    }
    showToast(`Product "${product.name}" added to live storefront!`);
  };

  const updateProduct = (vertical, id, updates) => {
    const updater = prev => prev.map(p => {
      if (p.id !== id) return p;
      const stockVal = updates.stock !== undefined ? parseInt(updates.stock) : (p.stock || 0);
      const inStockVal = updates.inStock !== undefined ? updates.inStock : (stockVal > 0);
      return {
        ...p,
        ...updates,
        stock: stockVal,
        inStock: inStockVal
      };
    });

    if (vertical === 'gifts') {
      const updated = updater(gifts);
      setGifts(updated);
      localStorage.setItem('sp_gift_products', JSON.stringify(updated));
      catalogSync.broadcast('CATALOG_UPDATE', { vertical: 'gifts', products: updated });
      syncToCloud('gifts', updated);
    } else if (vertical === 'water') {
      const updated = updater(water);
      setWater(updated);
      localStorage.setItem('sp_water_products', JSON.stringify(updated));
      catalogSync.broadcast('CATALOG_UPDATE', { vertical: 'water', products: updated });
      syncToCloud('water', updated);
    } else if (vertical === 'appliances') {
      const updated = updater(appliances);
      setAppliances(updated);
      localStorage.setItem('sp_appliances', JSON.stringify(updated));
      catalogSync.broadcast('CATALOG_UPDATE', { vertical: 'appliances', products: updated });
      syncToCloud('appliances', updated);
    }
    showToast('Product updated on live storefront!');
  };

  const deleteProduct = (vertical, id) => {
    const filter = prev => prev.filter(p => p.id !== id);
    if (vertical === 'gifts') {
      const updated = filter(gifts);
      setGifts(updated);
      localStorage.setItem('sp_gift_products', JSON.stringify(updated));
      catalogSync.broadcast('CATALOG_UPDATE', { vertical: 'gifts', products: updated });
      syncToCloud('gifts', updated);
    } else if (vertical === 'water') {
      const updated = filter(water);
      setWater(updated);
      localStorage.setItem('sp_water_products', JSON.stringify(updated));
      catalogSync.broadcast('CATALOG_UPDATE', { vertical: 'water', products: updated });
      syncToCloud('water', updated);
    } else if (vertical === 'appliances') {
      const updated = filter(appliances);
      setAppliances(updated);
      localStorage.setItem('sp_appliances', JSON.stringify(updated));
      catalogSync.broadcast('CATALOG_UPDATE', { vertical: 'appliances', products: updated });
      syncToCloud('appliances', updated);
    }
    showToast('Product deleted from catalog!', 'info');
  };

  const updateStock = (vertical, id, newStock) => {
    updateProduct(vertical, id, { stock: newStock, inStock: newStock > 0 });
    showToast(`Stock updated to ${newStock}`);
  };

  const toggleProductStockStatus = (vertical, id) => {
    const list = vertical === 'gifts' ? gifts : vertical === 'water' ? water : appliances;
    const item = list.find(p => p.id === id);
    if (!item) return;
    const newStatus = !item.inStock;
    updateProduct(vertical, id, {
      inStock: newStatus,
      stock: newStatus ? (item.stock > 0 ? item.stock : 10) : 0
    });
    showToast(`${item.name} marked as ${newStatus ? 'In Stock' : 'Out of Stock'}`);
  };

  // Order operations
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? {
        ...o,
        orderStatus: newStatus,
        paymentStatus: newStatus === 'Delivered' && o.paymentMethod === 'Cash on Delivery' ? 'Paid' : o.paymentStatus
      } : o);
      localStorage.setItem('sp_orders', JSON.stringify(updated));
      catalogSync.broadcast('ORDERS_UPDATE', { orders: updated });
      return updated;
    });
    showToast(`Order ${orderId} → ${newStatus}`);
  };

  // Query operations
  const updateQueryStatus = (queryId, newStatus) => {
    setQueries(prev => prev.map(q => q.id === queryId ? { ...q, status: newStatus } : q));
    showToast(`Query ${queryId} → ${newStatus}`);
  };

  // Ticket operations
  const replyToTicket = (ticketId, text) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t, status: 'In Progress',
      replies: [...t.replies, { sender: 'Admin Support', text, time: 'Just now' }]
    } : t));
    showToast('Reply sent!');
  };

  const updateTicketStatus = (ticketId, status) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    showToast(`Ticket ${ticketId} → ${status}`);
  };

  // Subscription operations
  const toggleSubscriptionPause = (subId) => {
    setSubscriptions(prev => prev.map(s => s.id === subId ? {
      ...s, status: s.status === 'Active' ? 'Paused' : 'Active'
    } : s));
  };

  // Bulk Quote operations
  const updateQuoteStatus = (quoteId, status, notes) => {
    setBulkQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status, notes: notes || q.notes } : q));
    showToast(`Quote ${quoteId} → ${status}`);
  };

  // Payment refund simulation
  const refundPayment = (paymentId) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'Refunded' } : p));
    showToast(`Payment ${paymentId} refunded!`, 'info');
  };

  // Settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Settings saved!');
  };

  // KPI calculations
  const getKPIs = () => {
    const totalRevenue = orders.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
    const openTickets = tickets.filter(t => t.status !== 'Resolved').length;
    const pendingQueries = queries.filter(q => q.status === 'Pending').length;
    const activeSubscriptions = subscriptions.filter(s => s.status === 'Active').length;
    const totalProducts = gifts.length + water.length + appliances.length;
    const outOfStock = [...gifts, ...water, ...appliances].filter(p => !p.inStock).length;
    const pendingPayments = payments.filter(p => p.status === 'Pending').length;
    return { totalRevenue, pendingOrders, openTickets, pendingQueries, activeSubscriptions, totalProducts, outOfStock, pendingPayments };
  };

  return (
    <AdminDataContext.Provider value={{
      gifts, water, appliances,
      addProduct, updateProduct, deleteProduct, updateStock, toggleProductStockStatus,
      orders, updateOrderStatus,
      payments, refundPayment,
      queries, updateQueryStatus,
      tickets, replyToTicket, updateTicketStatus,
      subscriptions, toggleSubscriptionPause,
      bulkQuotes, updateQuoteStatus,
      settings, updateSettings,
      toast, showToast,
      getKPIs,
      cloudConnected,
      pushAllToCloud,
      configureFirebase
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
};
