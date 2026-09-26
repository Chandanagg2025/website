import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  isFirebaseConfigured,
  syncCatalogToCloud,
  subscribeToCatalog,
  fetchCatalogFromCloud,
  saveFirebaseConfig,
  reinitDb
} from '../services/firebase';

const AdminDataContext = createContext();

// Seed products across all verticals
const seedGifts = [
  { id: 'gift-1', name: 'Executive Gold Crest Gift Set', category: 'Corporate', price: 1899, originalPrice: 2499, stock: 45, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop', rating: 4.9, reviews: 128, inStock: true, sku: 'SP-GFT-001' },
  { id: 'gift-2', name: 'Royal Heritage Wedding Sweet Box', category: 'Wedding', price: 2450, originalPrice: 3200, stock: 28, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop', rating: 5.0, reviews: 94, inStock: true, sku: 'SP-GFT-002' },
  { id: 'gift-3', name: 'Celebration Confetti Birthday Hamper', category: 'Birthday', price: 1299, originalPrice: 1699, stock: 62, image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=400&auto=format&fit=crop', rating: 4.8, reviews: 215, inStock: true, sku: 'SP-GFT-003' },
  { id: 'gift-4', name: 'Divya Festive Brass Pooja Collection', category: 'Festive', price: 1999, originalPrice: 2799, stock: 0, image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=400&auto=format&fit=crop', rating: 4.9, reviews: 310, inStock: false, sku: 'SP-GFT-004' },
  { id: 'gift-5', name: 'Artisan Gourmet Chocolate Chest', category: 'Birthday', price: 1150, originalPrice: 1450, stock: 88, image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?q=80&w=400&auto=format&fit=crop', rating: 4.7, reviews: 82, inStock: true, sku: 'SP-GFT-005' },
];

const seedWater = [
  { id: 'water-1', name: '20L Premium Alkaline Mineral Jar', category: 'Jars', price: 85, originalPrice: 110, stock: 500, image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=400&auto=format&fit=crop', inStock: true, sku: 'SP-WTR-001' },
  { id: 'water-2', name: 'Packaged 500ml Still Water (24-Pack)', category: 'Bottled', price: 240, originalPrice: 320, stock: 200, image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?q=80&w=400&auto=format&fit=crop', inStock: true, sku: 'SP-WTR-002' },
  { id: 'water-3', name: '1L Premium Mineral Water (12-Pack)', category: 'Bottled', price: 180, originalPrice: 240, stock: 150, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=400&auto=format&fit=crop', inStock: true, sku: 'SP-WTR-003' },
];

const seedAppliances = [
  { id: 'app-1', name: 'Commercial Deep Freezer 500L', category: 'Refrigeration', price: 42999, originalPrice: 54999, stock: 8, image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=400&auto=format&fit=crop', inStock: true, sku: 'SP-IND-001' },
  { id: 'app-2', name: 'Glass Door Display Chiller 400L', category: 'Refrigeration', price: 38500, originalPrice: 48000, stock: 5, image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=400&auto=format&fit=crop', inStock: true, sku: 'SP-IND-002' },
  { id: 'app-3', name: 'Heavy-Duty 4 Burner Gas Range', category: 'Cooking', price: 28500, originalPrice: 35000, stock: 12, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=400&auto=format&fit=crop', inStock: true, sku: 'SP-IND-003' },
  { id: 'app-4', name: 'Spiral Dough Kneader 30KG', category: 'Processing', price: 65000, originalPrice: 82000, stock: 0, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop', inStock: false, sku: 'SP-IND-004' },
];

// Seed orders
const seedOrders = [
  {
    id: 'SP-ORD-10421', date: '2026-09-24',
    customer: { name: 'Rajesh Sharma', email: 'rajesh@example.com', phone: '+91 98201 23456', address: 'Bandra West, Mumbai 400050' },
    items: [{ name: 'Executive Gold Crest Gift Set', qty: 2, price: 1899 }, { name: '20L Alkaline Jar', qty: 5, price: 85 }],
    subtotal: 4223, discount: 422, deliveryCharge: 0, totalAmount: 3801,
    paymentMethod: 'Razorpay UPI', paymentStatus: 'Paid', razorpayId: 'pay_N1xR4yz8BqE2',
    orderStatus: 'Processing', shiprocketAwb: 'SR928471028IN', shiprocketCourier: 'Blue Dart Express'
  },
  {
    id: 'SP-ORD-10420', date: '2026-09-23',
    customer: { name: 'Priya Mehta', email: 'priya.mehta@company.in', phone: '+91 98765 43210', address: 'Andheri East, Mumbai 400059' },
    items: [{ name: 'Royal Heritage Wedding Sweet Box', qty: 50, price: 2450 }],
    subtotal: 122500, discount: 24500, deliveryCharge: 0, totalAmount: 98000,
    paymentMethod: 'Bank Transfer', paymentStatus: 'Paid', razorpayId: null,
    orderStatus: 'Dispatched', shiprocketAwb: 'SR293847561IN', shiprocketCourier: 'Delhivery'
  },
  {
    id: 'SP-ORD-10419', date: '2026-09-22',
    customer: { name: 'Amit Patel', email: 'amit@logistics.co', phone: '+91 99887 76655', address: 'Nariman Point, Mumbai 400021' },
    items: [{ name: 'Commercial Deep Freezer 500L', qty: 1, price: 42999 }],
    subtotal: 42999, discount: 0, deliveryCharge: 0, totalAmount: 42999,
    paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', razorpayId: null,
    orderStatus: 'Confirmed', shiprocketAwb: null, shiprocketCourier: null
  },
  {
    id: 'SP-ORD-10418', date: '2026-09-21',
    customer: { name: 'Sunita Desai', email: 'sunita@corp.in', phone: '+91 88776 65544', address: 'Juhu, Mumbai 400049' },
    items: [{ name: 'Celebration Confetti Birthday Hamper', qty: 10, price: 1299 }],
    subtotal: 12990, discount: 1299, deliveryCharge: 0, totalAmount: 11691,
    paymentMethod: 'Razorpay UPI', paymentStatus: 'Paid', razorpayId: 'pay_K8xY9aB2CqD1',
    orderStatus: 'Delivered', shiprocketAwb: 'SR847293847IN', shiprocketCourier: 'Blue Dart Express'
  },
];

// Seed payments
const seedPayments = [
  { id: 'pay_N1xR4yz8BqE2', orderId: 'SP-ORD-10421', amount: 3801, method: 'UPI', status: 'Captured', date: '2026-09-24', customerName: 'Rajesh Sharma' },
  { id: 'pay_M2wQ3xA1BcD4', orderId: 'SP-ORD-10420', amount: 98000, method: 'Bank Transfer', status: 'Captured', date: '2026-09-23', customerName: 'Priya Mehta' },
  { id: 'COD-10419', orderId: 'SP-ORD-10419', amount: 42999, method: 'COD', status: 'Pending', date: '2026-09-22', customerName: 'Amit Patel' },
  { id: 'pay_K8xY9aB2CqD1', orderId: 'SP-ORD-10418', amount: 11691, method: 'UPI', status: 'Captured', date: '2026-09-21', customerName: 'Sunita Desai' },
];

// Seed inquiries / queries
const seedQueries = [
  { id: 'SP-INQ-1001', name: 'Vikramaditya Singhania', email: 'vikram@singhania.in', phone: '+91 98200 11223', vertical: 'Gift Gallery', message: 'Looking for 500 bespoke luxury Diwali executive hampers with customized gold foil company branding.', date: '2026-09-24', status: 'Pending', preferredTime: 'Morning' },
  { id: 'SP-INQ-1002', name: 'Kavitha Reddy', email: 'kavitha@hotels.co', phone: '+91 93456 78901', vertical: 'Industrial Appliances', message: 'Need quotation for 10 commercial deep freezers and 5 4-burner gas ranges for new hotel opening in Bangalore.', date: '2026-09-23', status: 'Contacted', preferredTime: 'Afternoon' },
  { id: 'SP-INQ-1003', name: 'Rahul Gupta', email: 'rahul@startup.io', phone: '+91 87654 32109', vertical: 'Digital Marketing', message: 'Want to discuss SEO and PPC packages for our SaaS product launch.', date: '2026-09-23', status: 'Pending', preferredTime: 'Evening' },
  { id: 'SP-INQ-1004', name: 'Meena Kapoor', email: 'meena@office.com', phone: '+91 76543 21098', vertical: 'Drinking Water', message: 'Monthly subscription of 50 jars for our office in Powai.', date: '2026-09-22', status: 'Resolved', preferredTime: 'Morning' },
];

// Seed support tickets
const seedTickets = [
  { id: 'SP-TCK-101', subject: 'Cloud server downtime', category: 'IT Services', priority: 'Critical', status: 'Open', date: '2026-09-24', customerName: 'TechCorp Ltd', replies: [{ sender: 'TechCorp Ltd', text: 'Our production server is down since 2 hours.', time: '2h ago' }] },
  { id: 'SP-TCK-102', subject: 'Water jar quality concern', category: 'Drinking Water', priority: 'Medium', status: 'In Progress', date: '2026-09-23', customerName: 'Rahul Office', replies: [{ sender: 'Rahul Office', text: 'The last 3 jars had a slight plastic odor.', time: '1d ago' }, { sender: 'Support Team', text: 'We have escalated this to quality control. Replacement jars dispatched.', time: '12h ago' }] },
  { id: 'SP-TCK-103', subject: 'Gift engraving error', category: 'Gift Gallery', priority: 'High', status: 'Open', date: '2026-09-24', customerName: 'Priya Events', replies: [{ sender: 'Priya Events', text: 'The name on 15 gift boxes has a spelling mistake.', time: '3h ago' }] },
];

// Seed subscriptions
const seedSubscriptions = [
  { id: 'SP-SUB-201', planName: '20L Alkaline Jars – Thrice Weekly', frequency: '3x per week', jarCount: 3, ratePerJar: 85, monthlyTotal: 3060, status: 'Active', customerName: 'Sharma Logistics', address: 'Bandra West, Mumbai', nextDelivery: 'Tomorrow, 07:00 AM' },
  { id: 'SP-SUB-202', planName: '20L Jars – Daily Route', frequency: 'Daily', jarCount: 1, ratePerJar: 80, monthlyTotal: 2400, status: 'Active', customerName: 'Juhu Grand Hotel', address: 'Juhu, Mumbai', nextDelivery: 'Tomorrow, 06:30 AM' },
  { id: 'SP-SUB-203', planName: '500ml Bottles – Weekly Case', frequency: 'Weekly', jarCount: 24, ratePerJar: 10, monthlyTotal: 960, status: 'Paused', customerName: 'Startup Hub Powai', address: 'Powai, Mumbai', nextDelivery: 'On Hold' },
];

// Seed bulk quotes
const seedBulkQuotes = [
  { id: 'SP-QUO-3001', applianceName: 'Commercial Deep Freezer 500L', quantity: 10, company: 'Taj Hotels Group', contactPerson: 'Vikram Singh', email: 'vikram@tajhotels.com', phone: '+91 98200 11111', status: 'Under Review', estimatedTotal: '₹4,29,990', date: '2026-09-24', notes: '' },
  { id: 'SP-QUO-3002', applianceName: 'Heavy-Duty 4 Burner Gas Range', quantity: 5, company: 'Cloud Kitchen Mumbai', contactPerson: 'Anita Rao', email: 'anita@cloudkitchen.in', phone: '+91 97654 22222', status: 'Quote Sent', estimatedTotal: '₹1,42,500', date: '2026-09-23', notes: 'Offered 10% bulk discount' },
];

export const AdminDataProvider = ({ children }) => {
  // Toast
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  }, []);

  // Products
  const [gifts, setGifts] = useState(() => {
    const s = localStorage.getItem('sp_gift_products') || localStorage.getItem('admin_gifts');
    return s ? JSON.parse(s) : seedGifts;
  });
  const [water, setWater] = useState(() => {
    const s = localStorage.getItem('sp_water_products') || localStorage.getItem('admin_water');
    return s ? JSON.parse(s) : seedWater;
  });
  const [appliances, setAppliances] = useState(() => {
    const s = localStorage.getItem('sp_appliances') || localStorage.getItem('admin_appliances');
    return s ? JSON.parse(s) : seedAppliances;
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

  // Orders
  const [orders, setOrders] = useState(() => {
    const s = localStorage.getItem('admin_orders');
    return s ? JSON.parse(s) : seedOrders;
  });

  // Payments
  const [payments, setPayments] = useState(() => {
    const s = localStorage.getItem('admin_payments');
    return s ? JSON.parse(s) : seedPayments;
  });

  // Queries
  const [queries, setQueries] = useState(() => {
    const s = localStorage.getItem('admin_queries');
    return s ? JSON.parse(s) : seedQueries;
  });

  // Tickets
  const [tickets, setTickets] = useState(() => {
    const s = localStorage.getItem('admin_tickets');
    return s ? JSON.parse(s) : seedTickets;
  });

  // Subscriptions
  const [subscriptions, setSubscriptions] = useState(() => {
    const s = localStorage.getItem('admin_subs');
    return s ? JSON.parse(s) : seedSubscriptions;
  });

  // Bulk Quotes
  const [bulkQuotes, setBulkQuotes] = useState(() => {
    const s = localStorage.getItem('admin_quotes');
    return s ? JSON.parse(s) : seedBulkQuotes;
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    const s = localStorage.getItem('admin_settings');
    return s ? JSON.parse(s) : {
      razorpayKey: 'rzp_test_demo_key',
      merchantUpi: 'shreepratham@upi',
      salesEmail: 'sales@shreepratham.com',
      shiprocketEmail: 'logistics@shreepratham.com',
      shiprocketPickupPin: '400050',
      shiprocketPickupLocation: 'Mumbai Central Hub'
    };
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

  useEffect(() => { localStorage.setItem('admin_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('admin_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('admin_queries', JSON.stringify(queries)); }, [queries]);
  useEffect(() => { localStorage.setItem('admin_tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('admin_subs', JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem('admin_quotes', JSON.stringify(bulkQuotes)); }, [bulkQuotes]);
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
      showToast('Firebase not configured. Please paste your Firebase config in Settings.', 'error');
      return false;
    }
    try {
      showToast('Syncing all products to cloud...', 'info');
      await syncCatalogToCloud('gifts', gifts);
      await syncCatalogToCloud('water', water);
      await syncCatalogToCloud('appliances', appliances);
      showToast('All products successfully synced to cloud and live on website!', 'success');
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
    const newProduct = { ...product, id: `${vertical}-${Date.now()}`, inStock: (product.stock || 0) > 0 };
    if (vertical === 'gifts') {
      const updated = [newProduct, ...gifts];
      setGifts(updated);
      syncToCloud('gifts', updated);
    } else if (vertical === 'water') {
      const updated = [newProduct, ...water];
      setWater(updated);
      syncToCloud('water', updated);
    } else if (vertical === 'appliances') {
      const updated = [newProduct, ...appliances];
      setAppliances(updated);
      syncToCloud('appliances', updated);
    }
    showToast(`Product "${product.name}" added!`);
  };

  const updateProduct = (vertical, id, updates) => {
    const updater = prev => prev.map(p => p.id === id ? { ...p, ...updates, inStock: (updates.stock ?? p.stock) > 0 } : p);
    if (vertical === 'gifts') {
      const updated = updater(gifts);
      setGifts(updated);
      syncToCloud('gifts', updated);
    } else if (vertical === 'water') {
      const updated = updater(water);
      setWater(updated);
      syncToCloud('water', updated);
    } else if (vertical === 'appliances') {
      const updated = updater(appliances);
      setAppliances(updated);
      syncToCloud('appliances', updated);
    }
    showToast('Product updated!');
  };

  const deleteProduct = (vertical, id) => {
    const filter = prev => prev.filter(p => p.id !== id);
    if (vertical === 'gifts') {
      const updated = filter(gifts);
      setGifts(updated);
      syncToCloud('gifts', updated);
    } else if (vertical === 'water') {
      const updated = filter(water);
      setWater(updated);
      syncToCloud('water', updated);
    } else if (vertical === 'appliances') {
      const updated = filter(appliances);
      setAppliances(updated);
      syncToCloud('appliances', updated);
    }
    showToast('Product deleted!', 'info');
  };

  const updateStock = (vertical, id, newStock) => {
    updateProduct(vertical, id, { stock: newStock, inStock: newStock > 0 });
    showToast(`Stock updated to ${newStock}`);
  };

  // Order operations
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      orderStatus: newStatus,
      paymentStatus: newStatus === 'Delivered' && o.paymentMethod === 'Cash on Delivery' ? 'Paid' : o.paymentStatus
    } : o));
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
    const totalRevenue = orders.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.totalAmount, 0);
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
      addProduct, updateProduct, deleteProduct, updateStock,
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
