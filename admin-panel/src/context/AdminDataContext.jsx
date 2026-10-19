import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import {
  isFirebaseConfigured,
  syncCatalogToCloud,
  saveProductToCloud,
  deleteProductFromCloud,
  subscribeToCatalog
} from '../services/firebase';
import { catalogSync } from '../services/catalogSync';

const describeCloudError = (err) => {
  if (err?.code === 'permission-denied') {
    return 'permission denied. Check Firestore rules and that you are signed in with the admin email.';
  }
  if (err?.code === 'unavailable') return 'network unavailable. Changes will not reach the website until you retry.';
  return err?.message || 'unknown error';
};

const AdminDataContext = createContext();

// Seed products across all verticals with complete schema
const seedGifts = [
  { id: 'custom-mug', name: 'Personalized Ceramic & Magic Photo Mug', category: 'Personalized Studio', price: 349, originalPrice: 599, stock: 150, image: '/images/custom_mug.jpg', rating: 4.9, reviews: 420, inStock: true, sku: 'SP-CST-MUG', customizationType: 'mug', description: 'High-definition edge-to-edge sublimation print with gloss ceramic finish. Choose from Classic White or Heat-Sensitive Magic Color-Reveal. Microwave & dishwasher safe.', isPersonalizable: true, tags: ['Personalized Studio', 'Best Seller'] },
  { id: 'custom-tshirt', name: 'Custom Printed Bio-Wash Cotton T-Shirt', category: 'Personalized Studio', price: 499, originalPrice: 899, stock: 200, image: '/images/custom_tshirt.jpg', rating: 4.8, reviews: 380, inStock: true, sku: 'SP-CST-TSHIRT', customizationType: 'tshirt', description: '100% super-combed 180 GSM bio-washed breathable cotton. Direct-to-Film (DTF) vivid printing for your photos, custom artwork, corporate logo, or slogan.', isPersonalizable: true, tags: ['Personalized Studio', 'Apparel'] },
  { id: 'custom-pillow', name: 'Personalized Velvet & Sequin Photo Pillow', category: 'Personalized Studio', price: 599, originalPrice: 999, stock: 120, image: '/images/custom_pillow.jpg', rating: 4.9, reviews: 295, inStock: true, sku: 'SP-CST-PILLOW', customizationType: 'pillow', description: 'Ultra-plush microfiber filled cushion with vibrant fade-resistant photo printing. Choose between Smooth Satin, Magic Two-Way Reversible Sequin, or Velvet Heart.', isPersonalizable: true, tags: ['Personalized Studio', 'Home Decor'] },
  { id: 'custom-keychain', name: 'Custom Engraved Metallic & Wooden Keychains', category: 'Personalized Studio', price: 199, originalPrice: 399, stock: 300, image: '/images/custom_keychain.jpg', rating: 4.9, reviews: 510, inStock: true, sku: 'SP-CST-KEYCHAIN', customizationType: 'keychain', description: 'Precision fiber laser engraved metallic bar, wooden keepsake, or acrylic photo keychain with your name, anniversary date, or vehicle registration plate.', isPersonalizable: true, tags: ['Personalized Studio', 'Accessories'] },
  { id: 'custom-god-dress', name: 'Handcrafted Designer Deity Poshak & God Dresses', category: 'Personalized Studio', price: 449, originalPrice: 799, stock: 180, image: '/images/god_dress_poshak.jpg', rating: 5.0, reviews: 340, inStock: true, sku: 'SP-CST-GODDRESS', customizationType: 'god-dress', description: 'Exquisite handcrafted deity poshak for Laddu Gopal Ji, Radha Krishna, Mata Rani, and Temple Vigrahas. Tailored in pure silk, heavy zari borders, and gemstone work with custom deity size selection.', isPersonalizable: true, tags: ['Personalized Studio', 'Devotional', 'Handmade'] },
  { id: 'gift-1', name: 'Executive Gold Crest Gift Set', category: 'Corporate', price: 1899, originalPrice: 2499, stock: 45, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', rating: 4.9, reviews: 128, inStock: true, sku: 'SP-GFT-001', description: 'Bespoke corporate gifting box featuring 24K gold foil pen, premium leatherette notebook, customized metallic keychain & insulated cardholder.', isPersonalizable: false, tags: ['Best Seller', 'Corporate'] },
  { id: 'gift-2', name: 'Royal Heritage Wedding Sweet Box', category: 'Wedding', price: 2450, originalPrice: 3200, stock: 28, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop', rating: 5.0, reviews: 94, inStock: true, sku: 'SP-GFT-002', description: 'Handcrafted velvet keepsake hamper filled with organic dry fruits, saffron-infused treats, scented brass diya, and gold-foil congratulations card.', isPersonalizable: false, tags: ['Luxury', 'Wedding'] },
  { id: 'gift-3', name: 'Celebration Confetti Birthday Hamper', category: 'Birthday', price: 1299, originalPrice: 1699, stock: 62, image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=800&auto=format&fit=crop', rating: 4.8, reviews: 215, inStock: true, sku: 'SP-GFT-003', description: 'Vibrant celebratory box packed with artisanal chocolates, customized thermal tumbler, personalized birthday plaque, and party sparklers.', isPersonalizable: false, tags: ['Trending', 'Birthday'] },
  { id: 'gift-4', name: 'Divya Festive Brass Pooja Collection', category: 'Festive', price: 1999, originalPrice: 2799, stock: 15, image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=800&auto=format&fit=crop', rating: 4.9, reviews: 310, inStock: true, sku: 'SP-GFT-004', description: 'Pure bell-metal brass Aarti Thali set with engraved lotus motifs, natural dhoop cones, silver coin and festive velvet pouch.', isPersonalizable: false, tags: ['Festive Special', 'Handmade'] },
  { id: 'gift-5', name: 'Artisan Gourmet Chocolate Chest', category: 'Birthday', price: 1150, originalPrice: 1450, stock: 88, image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?q=80&w=800&auto=format&fit=crop', rating: 4.7, reviews: 82, inStock: true, sku: 'SP-GFT-005', description: 'Assorted Belgian dark, hazelnut praline, and berry infused artisanal chocolates in a reusable mahogany-finished wooden case.', isPersonalizable: false, tags: ['Gourmet', 'Birthday'] },
  { id: 'gift-6', name: 'Eco-Elite Sustainable Corporate Kit', category: 'Corporate', price: 999, originalPrice: 1350, stock: 50, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop', rating: 4.8, reviews: 140, inStock: true, sku: 'SP-GFT-006', description: 'Plantable seed pen, bamboo flask with digital temperature gauge, cork notebook, and unbleached cotton tote bag.', isPersonalizable: false, tags: ['Eco-Friendly', 'Corporate'] },
];

const seedWater = [
  { id: 'water-1', name: '20L Alkaline Mineral Bubble Jar', type: 'Jar', category: 'Jar', price: 90, originalPrice: 120, deposit: 150, stock: 500, image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=800&auto=format&fit=crop', rating: 4.9, reviews: 820, inStock: true, sku: 'SP-WTR-001', description: '10-stage purified 20 Litre water jar with added copper, magnesium, and essential alkaline minerals. 100% BPA-free food-grade container.', purity: 'TDS 90-120 PPM • pH 8.2 Alkaline', subscriptionEligible: true },
  { id: 'water-2', name: 'Smart Bottom-Loading Hot & Cold Dispenser', type: 'Jar', category: 'Jar', price: 5499, originalPrice: 6999, deposit: 0, stock: 40, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop', rating: 4.8, reviews: 145, inStock: true, sku: 'SP-WTR-002', description: 'Ergonomic stainless steel bottom-loading dispenser. Three water temperatures (Chill, Room, Instant Boiling 90°C) with child safety lock.', purity: 'Energy Star Rated • Stainless Steel Reservoir', subscriptionEligible: false },
  { id: 'water-3', name: 'Premium 500ml Bottled Water Case (24 Bottles)', type: 'Bottled', category: 'Bottled', price: 360, originalPrice: 480, deposit: 0, stock: 200, image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?q=80&w=800&auto=format&fit=crop', rating: 4.9, reviews: 430, inStock: true, sku: 'SP-WTR-003', description: 'Box of 24 shatterproof 500ml bottles, UV sterilized and ozonized for conferences, weddings, executive travel, and daily hydration.', purity: 'UV Sterilized • Micro-Filtered • Pack of 24', subscriptionEligible: true },
  { id: 'water-4', name: 'Executive 1 Litre Mineral Bottles Case (12 Bottles)', type: 'Bottled', category: 'Bottled', price: 240, originalPrice: 300, deposit: 0, stock: 150, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=800&auto=format&fit=crop', rating: 4.7, reviews: 260, inStock: true, sku: 'SP-WTR-004', description: 'Box of 12 ergonomic 1-Litre bottles. Ideal for home, gym, long-distance road trips, and meeting rooms.', purity: 'Reverse Osmosis • Ozonized • Pack of 12', subscriptionEligible: true },
  { id: 'water-5', name: 'Commercial 50 LPH Industrial RO Purifier', type: 'RO Purified', category: 'RO Purified', price: 18500, originalPrice: 22000, deposit: 0, stock: 15, image: 'https://images.unsplash.com/photo-1584771145729-0bd9fda6529b?q=80&w=800&auto=format&fit=crop', rating: 5.0, reviews: 62, inStock: true, sku: 'SP-WTR-005', description: 'Heavy duty 50 Litres Per Hour RO plant with dual Dow Filmtec membranes, antiscalant dosing, and 50L SS storage vessel.', purity: 'Multi-Stage Commercial RO + UV + TDS Controller', subscriptionEligible: false }
];

const seedAppliances = [
  { id: 'app-1', name: 'Titan Frost 550L Double Door Deep Freezer', category: 'Refrigeration', price: 42500, originalPrice: 54999, stock: 8, image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800&auto=format&fit=crop', rating: 4.9, reviews: 73, inStock: true, sku: 'SP-IND-001', description: 'Commercial high-capacity horizontal chest freezer designed for cloud kitchens, restaurants, dairy outlets, and frozen supermarkets.', specs: { capacity: '550 Litres', tempRange: '-18°C to -26°C (Sub-Zero Rapid Freeze)', power: '280 Watts • 230V / 50Hz Single Phase', material: 'Food Grade SS 304 Inner Liner • Powder Coated Steel', dimensions: '1650 x 740 x 850 mm', warranty: '3 Years Comprehensive + 5 Years on Emerson Compressor', energyRating: '5 Star Commercial Inverter' } },
  { id: 'app-2', name: 'CoolBreeze 4-Door Glass Upright Display Chiller', category: 'Refrigeration', price: 68000, originalPrice: 82000, stock: 5, image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=800&auto=format&fit=crop', rating: 4.8, reviews: 41, inStock: true, sku: 'SP-IND-002', description: 'Full-height ventilated upright chiller with heated anti-fog double glazed glass doors and brilliant LED canopy illumination.', specs: { capacity: '880 Litres', tempRange: '+2°C to +8°C Beverage & Dairy Chilling', power: '420 Watts • 230V / 50Hz Single Phase', material: 'SS 304 Exterior & Interior • Tempered Double Glass', dimensions: '1200 x 700 x 2050 mm', warranty: '2 Years Comprehensive Commercial Warranty', energyRating: 'A+ Commercial Eco-Cooling' } },
  { id: 'app-3', name: 'Vulcan Pro 4-Burner Heavy Commercial Gas Range', category: 'Cooking', price: 34500, originalPrice: 42000, stock: 12, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop', rating: 4.9, reviews: 88, inStock: true, sku: 'SP-IND-003', description: 'Heavy-duty commercial cooking range with high-BTU brass crown burners, heavy cast iron pan supports, and seamless drip tray.', specs: { capacity: '4 High-Heat Commercial Burners (25,000 BTU each)', tempRange: 'Dual Control High-Flame & Simmering Flame', power: 'Commercial LPG / PNG Compatible (Low Pressure)', material: 'Heavy Gauge 16-Gauge SS 304 Seamless Top', dimensions: '900 x 900 x 850 mm', warranty: '2 Years Comprehensive On-Site Warranty', energyRating: 'High-Efficiency Low Gas Consumption Tech' } },
  { id: 'app-4', name: 'MasterMix 30KG Heavy Duty Spiral Dough Kneader', category: 'Processing', price: 78500, originalPrice: 95000, stock: 6, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop', rating: 4.7, reviews: 36, inStock: true, sku: 'SP-IND-004', description: 'High-torque two-speed spiral mixer with stainless steel rotating safety bowl, emergency stop microswitch, and dual timers.', specs: { capacity: '30 KG Flour Dough Batch / 50 Litre Bowl', tempRange: 'Ambient Commercial Bakery Continuous Run', power: '2.2 kW Heavy Duty Motor • 415V Three Phase', material: 'Full SS 304 Spiral Hook, Bowl & Safety Guard', dimensions: '850 x 550 x 950 mm', warranty: '2 Years Mechanical Warranty + Motor Replacement', energyRating: 'Heavy Torque Low Decibel Drive' } }
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
    items: [{ name: 'Titan Frost 550L Double Door Deep Freezer', qty: 1, price: 42500 }],
    subtotal: 42500, discount: 0, deliveryCharge: 0, totalAmount: 42500,
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
  { id: 'COD-10419', orderId: 'SP-ORD-10419', amount: 42500, method: 'COD', status: 'Pending', date: '2026-09-22', customerName: 'Amit Patel' },
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
  { id: 'SP-QUO-3001', applianceName: 'Titan Frost 550L Double Door Deep Freezer', quantity: 10, company: 'Taj Hotels Group', contactPerson: 'Vikram Singh', email: 'vikram@tajhotels.com', phone: '+91 98200 11111', status: 'Under Review', estimatedTotal: '₹4,25,000', date: '2026-09-24', notes: '' },
  { id: 'SP-QUO-3002', applianceName: 'Vulcan Pro 4-Burner Heavy Commercial Gas Range', quantity: 5, company: 'Cloud Kitchen Mumbai', contactPerson: 'Anita Rao', email: 'anita@cloudkitchen.in', phone: '+91 97654 22222', status: 'Quote Sent', estimatedTotal: '₹1,72,500', date: '2026-09-23', notes: 'Offered 10% bulk discount' },
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
    if (!s) return seedGifts;
    try {
      const parsed = JSON.parse(s);
      const existingIds = new Set(parsed.map(p => p.id));
      const missing = seedGifts.filter(p => !existingIds.has(p.id));
      if (missing.length > 0) return [...missing, ...parsed];
      return parsed;
    } catch {
      return seedGifts;
    }
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
  const cloudConnected = isFirebaseConfigured();
  // Per-vertical: true = cloud catalog is empty, false = has products, null = not loaded yet
  const cloudEmptyRef = useRef({ gifts: null, water: null, appliances: null });

  // Listen to Firestore real-time if configured
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const listen = (vertical, setter) => subscribeToCatalog(vertical, (cloudData) => {
      cloudEmptyRef.current[vertical] = cloudData.length === 0;
      if (cloudData.length > 0) setter(cloudData);
    });

    const unsubGifts = listen('gifts', setGifts);
    const unsubWater = listen('water', setWater);
    const unsubApps = listen('appliances', setAppliances);

    return () => {
      unsubGifts();
      unsubWater();
      unsubApps();
    };
  }, []);

  // Listen to catalogSync broadcast channel
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
          console.error(e);
        }
      }
    });
    return unsub;
  }, []);

  // Orders
  const [orders, setOrders] = useState(() => {
    const s = localStorage.getItem('sp_orders') || localStorage.getItem('admin_orders');
    return s ? JSON.parse(s) : seedOrders;
  });

  // Payments
  const [payments, setPayments] = useState(() => {
    const s = localStorage.getItem('admin_payments');
    return s ? JSON.parse(s) : seedPayments;
  });

  // Queries
  const [queries, setQueries] = useState(() => {
    const s = localStorage.getItem('sp_contact_inquiries') || localStorage.getItem('admin_queries');
    return s ? JSON.parse(s) : seedQueries;
  });

  // Tickets
  const [tickets, setTickets] = useState(() => {
    const s = localStorage.getItem('sp_tickets') || localStorage.getItem('admin_tickets');
    return s ? JSON.parse(s) : seedTickets;
  });

  // Subscriptions
  const [subscriptions, setSubscriptions] = useState(() => {
    const s = localStorage.getItem('sp_subscriptions') || localStorage.getItem('admin_subs');
    return s ? JSON.parse(s) : seedSubscriptions;
  });

  // Bulk Quotes
  const [bulkQuotes, setBulkQuotes] = useState(() => {
    const s = localStorage.getItem('sp_quotes') || localStorage.getItem('admin_quotes');
    return s ? JSON.parse(s) : seedBulkQuotes;
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    const s = localStorage.getItem('admin_settings');
    return s ? JSON.parse(s) : {
      razorpayKey: 'rzp_test_51ShreePrathamKey',
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

  // Publish a change to the live website (Firestore).
  // If the cloud catalog for this vertical is still empty, publish the full list instead of
  // a single item so the website never ends up showing a partial catalog.
  const publishToCloud = useCallback(async (vertical, fullList, singleOp) => {
    if (!isFirebaseConfigured()) return;
    try {
      if (cloudEmptyRef.current[vertical] === true) {
        await syncCatalogToCloud(vertical, fullList);
        cloudEmptyRef.current[vertical] = false;
      } else {
        await singleOp();
      }
    } catch (err) {
      console.error(`Could not publish ${vertical} to cloud:`, err);
      showToast(`Saved in admin, but NOT published to website: ${describeCloudError(err)}`, 'error');
    }
  }, [showToast]);

  // Force sync all to cloud
  const pushAllToCloud = async () => {
    if (!isFirebaseConfigured()) {
      showToast('Firebase not configured. Add VITE_FIREBASE_* values to .env.', 'error');
      return false;
    }
    try {
      showToast('Syncing all products to cloud...', 'info');
      await syncCatalogToCloud('gifts', gifts);
      await syncCatalogToCloud('water', water);
      await syncCatalogToCloud('appliances', appliances);
      cloudEmptyRef.current = { gifts: false, water: false, appliances: false };
      showToast('All products successfully synced to cloud and live on website!', 'success');
      return true;
    } catch (e) {
      showToast('Sync failed: ' + describeCloudError(e), 'error');
      return false;
    }
  };

  // Product operations
  const productLists = { gifts, water, appliances };
  const productSetters = { gifts: setGifts, water: setWater, appliances: setAppliances };
  const storageKeys = { gifts: 'sp_gift_products', water: 'sp_water_products', appliances: 'sp_appliances' };

  const applyLocal = (vertical, updated) => {
    productSetters[vertical](updated);
    localStorage.setItem(storageKeys[vertical], JSON.stringify(updated));
    catalogSync.broadcast('CATALOG_UPDATE', { vertical, data: updated });
  };

  const addProduct = (vertical, product) => {
    if (!productSetters[vertical]) return;
    const newProduct = {
      ...product,
      id: product.id || `${vertical}-${Date.now()}`,
      position: -Date.now(), // newest first
      inStock: product.inStock !== undefined ? product.inStock : ((product.stock || 0) > 0)
    };
    const updated = [newProduct, ...productLists[vertical]];
    applyLocal(vertical, updated);
    publishToCloud(vertical, updated, () => saveProductToCloud(vertical, newProduct));
    showToast(`Product "${product.name}" published to storefront!`);
  };

  const updateProduct = (vertical, id, updates) => {
    if (!productSetters[vertical]) return;
    const updated = productLists[vertical].map(p => {
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
    const index = updated.findIndex(p => p.id === id);
    if (index === -1) return;
    const item = updated[index];
    applyLocal(vertical, updated);
    publishToCloud(vertical, updated, () =>
      saveProductToCloud(vertical, { ...item, position: item.position ?? index })
    );
    showToast('Product updated on live storefront!');
  };

  const deleteProduct = (vertical, id) => {
    if (!productSetters[vertical]) return;
    const updated = productLists[vertical].filter(p => p.id !== id);
    applyLocal(vertical, updated);
    publishToCloud(vertical, updated, () => deleteProductFromCloud(vertical, id));
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
      pushAllToCloud
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
