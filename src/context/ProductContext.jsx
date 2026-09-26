import { createContext, useState, useEffect, useContext } from 'react';
import {
  initialGiftProducts,
  initialWaterProducts,
  initialAppliances,
  marketingPackages as initialMarketingPackages,
  itServicesCatalog as initialItServices,
  itPricingTiers as initialItPricingTiers,
  seedOrders,
  seedSubscriptions,
  seedQuotes,
  seedTickets
} from '../data/mockData';
import { sendOrderConfirmationEmail, OFFICIAL_SALES_EMAIL } from '../services/emailService';
import { sendGSTInvoiceEmail, generateGSTInvoiceHtml, getInvoiceByOrderId } from '../services/gstInvoiceService';
import { getRazorpayKey, getMerchantUpiId, RAZORPAY_CONFIG } from '../services/razorpayService';
import {
  getShiprocketConfig,
  saveShiprocketConfig,
  createShiprocketOrder,
  getShiprocketTrackingUrl,
  checkPincodeServiceability,
  generatePrintableShippingLabelHtml
} from '../services/shiprocketService';

import {
  isFirebaseConfigured,
  subscribeToCatalog,
  sendOrderToCloud,
  sendInquiryToCloud
} from '../services/firebase';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // 1. Catalog States
  const [giftProducts, setGiftProducts] = useState(() => {
    const saved = localStorage.getItem('sp_gift_products') || localStorage.getItem('admin_gifts');
    return saved ? JSON.parse(saved) : initialGiftProducts;
  });

  const [waterProducts, setWaterProducts] = useState(() => {
    const saved = localStorage.getItem('sp_water_products') || localStorage.getItem('admin_water');
    return saved ? JSON.parse(saved) : initialWaterProducts;
  });

  const [appliances, setAppliances] = useState(() => {
    const saved = localStorage.getItem('sp_appliances') || localStorage.getItem('admin_appliances');
    return saved ? JSON.parse(saved) : initialAppliances;
  });

  const [marketingPkgs, setMarketingPkgs] = useState(() => {
    const saved = localStorage.getItem('sp_marketing_pkgs');
    return saved ? JSON.parse(saved) : initialMarketingPackages;
  });

  const [itServices, setItServices] = useState(() => {
    const saved = localStorage.getItem('sp_it_services');
    return saved ? JSON.parse(saved) : initialItServices;
  });

  const [itTiers, setItTiers] = useState(() => {
    const saved = localStorage.getItem('sp_it_tiers');
    return saved ? JSON.parse(saved) : initialItPricingTiers;
  });

  // 2. Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('sp_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem('sp_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  // 3. Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('sp_orders');
    return saved ? JSON.parse(saved) : seedOrders;
  });

  // 4. Subscriptions State
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('sp_subscriptions');
    return saved ? JSON.parse(saved) : seedSubscriptions;
  });

  // 5. Bulk Quotes State
  const [quotes, setQuotes] = useState(() => {
    const saved = localStorage.getItem('sp_quotes');
    return saved ? JSON.parse(saved) : seedQuotes;
  });

  // 6. Support Tickets State
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('sp_tickets');
    return saved ? JSON.parse(saved) : seedTickets;
  });

  // 7. Consultation Bookings State
  const [consultations, setConsultations] = useState(() => {
    const saved = localStorage.getItem('sp_consultations');
    return saved ? JSON.parse(saved) : [
      {
        id: 'SP-CNS-101',
        service: 'High-ROAS Paid Performance Ads',
        date: '2026-09-28',
        time: '03:00 PM',
        clientName: 'Rajesh Sharma',
        email: 'rajesh.sharma@example.com',
        phone: '+91 98201 23456',
        status: 'Confirmed'
      }
    ];
  });

  // 8. Contact Inquiries / Callbacks State
  const [inquiries, setInquiries] = useState(() => {
    const saved = localStorage.getItem('sp_contact_inquiries');
    return saved ? JSON.parse(saved) : [
      {
        id: 'SP-INQ-101',
        name: 'Vikramaditya Singhania',
        email: 'vikram@singhaniagroup.in',
        phone: '+91 98200 11223',
        vertical: 'Gift Gallery',
        preferredTime: 'Morning (10:00 AM - 01:00 PM)',
        contactMethod: 'WhatsApp',
        message: 'Looking for 500 bespoke luxury Diwali executive hampers with customized gold foil company branding.',
        date: '2026-09-22',
        status: 'Contacted'
      }
    ];
  });

  // 8. Appliances Comparison Drawer State
  const [compareList, setCompareList] = useState([]);

  // 9. Shiprocket Logistics Configuration State
  const [shiprocketConfig, setShiprocketConfig] = useState(() => getShiprocketConfig());

  // 10. Toast Notification State
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  // Real-time Cloud Catalog Sync from Firebase (Cross-Domain)
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const unsubGifts = subscribeToCatalog('gifts', (cloudGifts) => {
      if (Array.isArray(cloudGifts) && cloudGifts.length > 0) {
        setGiftProducts(cloudGifts);
      }
    });

    const unsubWater = subscribeToCatalog('water', (cloudWater) => {
      if (Array.isArray(cloudWater) && cloudWater.length > 0) {
        setWaterProducts(cloudWater);
      }
    });

    const unsubApps = subscribeToCatalog('appliances', (cloudApps) => {
      if (Array.isArray(cloudApps) && cloudApps.length > 0) {
        setAppliances(cloudApps);
      }
    });

    return () => {
      unsubGifts();
      unsubWater();
      unsubApps();
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('sp_gift_products', JSON.stringify(giftProducts));
  }, [giftProducts]);

  useEffect(() => {
    localStorage.setItem('sp_water_products', JSON.stringify(waterProducts));
  }, [waterProducts]);

  useEffect(() => {
    localStorage.setItem('sp_appliances', JSON.stringify(appliances));
  }, [appliances]);

  useEffect(() => {
    localStorage.setItem('sp_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sp_coupon', JSON.stringify(coupon));
  }, [coupon]);

  useEffect(() => {
    localStorage.setItem('sp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sp_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('sp_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('sp_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('sp_consultations', JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    localStorage.setItem('sp_contact_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // Cart Operations
  const addToCart = (product, quantity = 1, customization = null, subscriptionPlan = null) => {
    setCart(prev => {
      const cartItemId = customization
        ? `${product.id}-${Date.now()}`
        : subscriptionPlan
        ? `${product.id}-sub-${subscriptionPlan.frequency}`
        : product.id;

      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);

      if (existingIndex > -1 && !customization) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const newItem = {
        cartItemId,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category || product.type || 'General',
        quantity,
        customization,
        subscriptionPlan
      };

      return [...prev, newItem];
    });

    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'PRATHAM10') {
      setCoupon({ code: 'PRATHAM10', discountPercent: 10, description: '10% Welcome Discount' });
      showToast('Coupon PRATHAM10 applied! 10% OFF', 'success');
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'SHREE20') {
      setCoupon({ code: 'SHREE20', discountPercent: 20, description: '20% Mega Celebration Discount' });
      showToast('Coupon SHREE20 applied! 20% OFF', 'success');
      return { success: true, message: '20% discount applied!' };
    } else {
      showToast('Invalid promo code. Try PRATHAM10 or SHREE20', 'error');
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getDiscount = () => {
    if (!coupon) return 0;
    const subtotal = getSubtotal();
    return Math.round((subtotal * coupon.discountPercent) / 100);
  };

  const getCartTotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscount();
    const delivery = subtotal > 1500 || subtotal === 0 ? 0 : 90;
    return Math.max(0, subtotal - discount + delivery);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Orders & Payment Operations
  const merchantUpiId = getMerchantUpiId();
  const razorpayKey = getRazorpayKey();

  const updateShiprocketConfig = (updatedConfig) => {
    const saved = saveShiprocketConfig(updatedConfig);
    setShiprocketConfig(saved);
    showToast('Shiprocket logistics settings updated successfully!', 'success');
  };

  const dispatchOrderViaShiprocket = async (orderId, preferredCourier) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return null;

    showToast(`Initiating Shiprocket automated dispatch for ${orderId}...`, 'info');
    const result = await createShiprocketOrder(targetOrder);

    const awb = result.awbCode;
    const courier = preferredCourier || result.courierName;
    const trackingUrl = result.trackingUrl || getShiprocketTrackingUrl(awb);

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedSteps = [...(order.trackingSteps || [])];
        if (updatedSteps.length >= 3) {
          updatedSteps[1].completed = true;
          updatedSteps[1].time = 'Today, Quality Checked';
          updatedSteps[2].completed = true;
          updatedSteps[2].title = `Dispatched via ${courier}`;
          updatedSteps[2].time = `Today, AWB: ${awb}`;
        }
        return {
          ...order,
          orderStatus: 'Dispatched',
          shiprocketAwb: awb,
          shiprocketCourier: courier,
          shiprocketShipmentId: result.shipmentId,
          shiprocketStatus: 'Dispatched via Shiprocket',
          shiprocketTrackingUrl: trackingUrl,
          trackingSteps: updatedSteps
        };
      }
      return order;
    }));

    showToast(`Order ${orderId} dispatched via Shiprocket (${courier}, AWB: ${awb})!`, 'success');
    return { ...result, courierName: courier };
  };

  const checkShippingServiceability = async (pincode, weightKg = 1.5, isCod = false) => {
    return await checkPincodeServiceability({
      deliveryPincode: pincode,
      weightKg,
      isCod,
      pickupPincode: shiprocketConfig.PICKUP_PINCODE
    });
  };

  const placeOrder = (orderDetails) => {
    const newOrderId = 'SP-ORD-' + Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toISOString().split('T')[0];

    // Generate initial Shiprocket consignment details
    const randomSuffix = Math.floor(100000000 + Math.random() * 900000000);
    const initialAwb = `SR${randomSuffix}IN`;
    const initialCourier = 'Blue Dart Express (Shiprocket)';

    const newOrder = {
      id: newOrderId,
      date: dateStr,
      customer: orderDetails.customer,
      items: [...cart],
      subtotal: getSubtotal(),
      discount: getDiscount(),
      deliveryCharge: getSubtotal() > 1500 ? 0 : 90,
      totalAmount: getCartTotal(),
      paymentMethod: orderDetails.paymentMethod || 'UPI',
      paymentStatus: orderDetails.paymentStatus || (orderDetails.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid'),
      razorpayPaymentId: orderDetails.razorpayPaymentId || null,
      orderStatus: 'Processing',
      slot: orderDetails.deliverySlot || 'Standard Delivery',
      notes: orderDetails.deliveryNotes || '',
      shiprocketAwb: initialAwb,
      shiprocketCourier: initialCourier,
      shiprocketStatus: 'Manifest Queued',
      shiprocketTrackingUrl: getShiprocketTrackingUrl(initialAwb),
      confirmationEmailSent: true,
      emailSentFrom: OFFICIAL_SALES_EMAIL,
      emailSentTo: orderDetails.customer?.email,
      trackingSteps: [
        { title: 'Order Confirmed', time: 'Just now', completed: true },
        { title: 'Processing & Quality Check', time: 'In Progress', completed: false },
        { title: `Dispatched via ${initialCourier} (AWB: ${initialAwb})`, time: 'Upcoming', completed: false },
        { title: 'Out for Delivery', time: 'Upcoming', completed: false },
        { title: 'Delivered', time: 'Upcoming', completed: false }
      ]
    };

    // Auto-dispatch confirmation email from contact@shreepratham.com
    sendOrderConfirmationEmail(newOrder);

    // Auto-dispatch GST Tax Invoice to customer email
    sendGSTInvoiceEmail(newOrder);

    // Sync order to Cloud Firestore so Admin sees it immediately
    sendOrderToCloud(newOrder);

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    showToast(`Order ${newOrderId} placed with Shiprocket AWB: ${initialAwb}!`, 'success');
    return newOrder;
  };

  const resendOrderEmail = async (orderId) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return false;
    await sendOrderConfirmationEmail(targetOrder);
    showToast(`Confirmation email re-dispatched from ${OFFICIAL_SALES_EMAIL} to ${targetOrder.customer?.email}`, 'success');
    return true;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedSteps = [...order.trackingSteps];
        if (newStatus === 'Processing') {
          updatedSteps[1].completed = true;
          updatedSteps[1].time = 'Today, Just now';
        } else if (newStatus === 'Dispatched') {
          updatedSteps[1].completed = true;
          updatedSteps[2].completed = true;
          updatedSteps[2].time = 'Today, Dispatched';
        } else if (newStatus === 'Out for Delivery') {
          updatedSteps[1].completed = true;
          updatedSteps[2].completed = true;
          updatedSteps[3].completed = true;
          updatedSteps[3].time = 'Today, On Route';
        } else if (newStatus === 'Delivered') {
          updatedSteps.forEach(s => s.completed = true);
          updatedSteps[4].time = 'Delivered Today';
        }
        return {
          ...order,
          orderStatus: newStatus,
          paymentStatus: newStatus === 'Delivered' ? 'Paid' : order.paymentStatus,
          trackingSteps: updatedSteps
        };
      }
      return order;
    }));
    showToast(`Order ${orderId} marked as ${newStatus}`, 'info');
  };

  // Water Subscriptions
  const createSubscription = (planData) => {
    const subId = 'SP-SUB-' + Math.floor(100 + Math.random() * 900);
    const newSub = {
      id: subId,
      planName: planData.planName || '20L Alkaline Jars Routine',
      frequency: planData.frequency,
      jarCount: planData.jarCount || 1,
      ratePerJar: planData.ratePerJar || 85,
      monthlyTotal: planData.monthlyTotal || 1020,
      nextDeliveryDate: 'Tomorrow, 07:00 AM - 09:00 AM',
      status: 'Active',
      address: planData.address,
      preferredSlot: planData.preferredSlot || 'Morning 7-9 AM',
      startedOn: new Date().toISOString().split('T')[0]
    };
    setSubscriptions(prev => [newSub, ...prev]);
    showToast(`Water delivery subscription ${subId} activated!`, 'success');
    return newSub;
  };

  const toggleSubscriptionPause = (subId) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subId) {
        const nextStatus = sub.status === 'Active' ? 'Paused' : 'Active';
        showToast(`Subscription ${subId} is now ${nextStatus}`, 'info');
        return { ...sub, status: nextStatus };
      }
      return sub;
    }));
  };

  const cancelSubscription = (subId) => {
    setSubscriptions(prev => prev.map(sub => sub.id === subId ? { ...sub, status: 'Cancelled' } : sub));
    showToast(`Subscription ${subId} has been cancelled`, 'info');
  };

  // Bulk Quotes
  const submitQuoteRequest = (quoteData) => {
    const quoteId = 'SP-QUO-' + Math.floor(1000 + Math.random() * 9000);
    const newQuote = {
      id: quoteId,
      date: new Date().toISOString().split('T')[0],
      applianceName: quoteData.applianceName,
      quantity: quoteData.quantity,
      company: quoteData.company,
      contactPerson: quoteData.contactPerson,
      email: quoteData.email,
      phone: quoteData.phone,
      gstin: quoteData.gstin || 'Pending',
      installationRequired: !!quoteData.installationRequired,
      estimatedTotal: quoteData.estimatedTotal || 'Custom Pricing Pending',
      status: 'Under Review',
      adminNotes: 'Inquiry received. Technical sales engineer is evaluating discount matrix.'
    };
    setQuotes(prev => [newQuote, ...prev]);
    showToast(`Quote request ${quoteId} submitted! We will contact you within 2 hours.`, 'success');
    return newQuote;
  };

  const updateQuoteStatus = (quoteId, status, adminNotes) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status, adminNotes: adminNotes || q.adminNotes } : q));
    showToast(`Quote ${quoteId} updated to ${status}`, 'info');
  };

  // IT Support Tickets
  const createTicket = (ticketData) => {
    const ticketId = 'SP-TCK-' + Math.floor(100 + Math.random() * 900);
    const newTicket = {
      id: ticketId,
      date: new Date().toISOString().split('T')[0],
      subject: ticketData.subject,
      category: ticketData.category || 'General Support',
      priority: ticketData.priority || 'Medium',
      status: 'Open',
      description: ticketData.description,
      replies: [
        {
          sender: `${ticketData.contactPerson || 'Customer'}`,
          time: 'Just now',
          text: ticketData.description
        },
        {
          sender: 'Antigravity AI Automation System',
          time: 'Just now',
          text: `Thank you for reaching Shree Pratham Support. Ticket #${ticketId} is logged with priority ${ticketData.priority}. A specialized engineer has been assigned.`
        }
      ]
    };
    setTickets(prev => [newTicket, ...prev]);
    showToast(`Support Ticket #${ticketId} created!`, 'success');
    return newTicket;
  };

  const replyToTicket = (ticketId, text, sender) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'In Progress',
          replies: [
            ...t.replies,
            {
              sender,
              time: 'Just now',
              text
            }
          ]
        };
      }
      return t;
    }));
    showToast('Reply submitted!', 'success');
  };

  const updateTicketStatus = (ticketId, status) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    showToast(`Ticket #${ticketId} marked as ${status}`, 'info');
  };

  // Marketing Consultations
  const bookConsultation = (bookingData) => {
    const consId = 'SP-CNS-' + Math.floor(100 + Math.random() * 900);
    const newBooking = {
      id: consId,
      service: bookingData.service,
      date: bookingData.date,
      time: bookingData.time,
      clientName: bookingData.clientName,
      email: bookingData.email,
      phone: bookingData.phone,
      website: bookingData.website || '',
      notes: bookingData.notes || '',
      status: 'Confirmed'
    };
    setConsultations(prev => [newBooking, ...prev]);
    showToast(`Consultation #${consId} booked for ${bookingData.date} at ${bookingData.time}!`, 'success');
    return newBooking;
  };

  // Contact Inquiries & Callbacks
  const submitContactInquiry = (inquiryData) => {
    const inqId = 'SP-INQ-' + Math.floor(1000 + Math.random() * 9000);
    const newInquiry = {
      id: inqId,
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone,
      vertical: inquiryData.vertical || 'General Inquiry',
      preferredTime: inquiryData.preferredTime || 'Immediate',
      contactMethod: inquiryData.contactMethod || 'WhatsApp',
      message: inquiryData.message || '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setInquiries(prev => [newInquiry, ...prev]);
    sendInquiryToCloud(newInquiry);
    showToast(`Thank you ${inquiryData.name.split(' ')[0]}! Inquiry #${inqId} received. We will contact you shortly.`, 'success');
    return newInquiry;
  };

  const updateInquiryStatus = (inquiryId, status) => {
    setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status } : inq));
    showToast(`Inquiry #${inquiryId} marked as ${status}`, 'info');
  };

  // Compare Appliances
  const addToCompare = (appliance) => {
    if (compareList.some(item => item.id === appliance.id)) {
      showToast('Appliance is already in comparison list', 'info');
      return;
    }
    if (compareList.length >= 3) {
      showToast('You can compare up to 3 appliances at a time', 'error');
      return;
    }
    setCompareList(prev => [...prev, appliance]);
    showToast(`Added "${appliance.name}" to comparison!`, 'success');
  };

  const removeFromCompare = (applianceId) => {
    setCompareList(prev => prev.filter(item => item.id !== applianceId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Admin Catalog Updates
  const addProductToCatalog = (vertical, item) => {
    const newItem = { ...item, id: `${vertical}-${Date.now()}` };
    if (vertical === 'gifts') setGiftProducts(prev => [newItem, ...prev]);
    else if (vertical === 'water') setWaterProducts(prev => [newItem, ...prev]);
    else if (vertical === 'appliances') setAppliances(prev => [newItem, ...prev]);
    showToast(`New item added to ${vertical} catalog!`, 'success');
  };

  const deleteProductFromCatalog = (vertical, id) => {
    if (vertical === 'gifts') setGiftProducts(prev => prev.filter(p => p.id !== id));
    else if (vertical === 'water') setWaterProducts(prev => prev.filter(p => p.id !== id));
    else if (vertical === 'appliances') setAppliances(prev => prev.filter(p => p.id !== id));
    showToast('Item deleted from catalog', 'info');
  };

  return (
    <ProductContext.Provider value={{
      // Catalog Data
      giftProducts,
      waterProducts,
      appliances,
      marketingPkgs,
      itServices,
      itTiers,
      addProductToCatalog,
      deleteProductFromCatalog,

      // Cart
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      coupon,
      applyCoupon,
      removeCoupon,
      getSubtotal,
      getDiscount,
      getCartTotal,
      getCartItemCount,

      // Orders & Gateway
      orders,
      placeOrder,
      updateOrderStatus,
      resendOrderEmail,
      razorpayKey,
      merchantUpiId,
      razorpayConfig: RAZORPAY_CONFIG,
      officialSalesEmail: OFFICIAL_SALES_EMAIL,

      // GST Invoice
      generateGSTInvoiceHtml,
      getInvoiceByOrderId,
      resendGSTInvoice: async (orderId) => {
        const targetOrder = orders.find(o => o.id === orderId);
        if (!targetOrder) return false;
        await sendGSTInvoiceEmail(targetOrder);
        return true;
      },

      // Subscriptions
      subscriptions,
      createSubscription,
      toggleSubscriptionPause,
      cancelSubscription,

      // Bulk Quotes
      quotes,
      submitQuoteRequest,
      updateQuoteStatus,

      // IT Support Tickets
      tickets,
      createTicket,
      replyToTicket,
      updateTicketStatus,

      // Marketing Consultations
      consultations,
      bookConsultation,

      // Contact Inquiries
      inquiries,
      submitContactInquiry,
      updateInquiryStatus,

      // Appliances Comparison
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,

      // Shiprocket Logistics Integration
      shiprocketConfig,
      updateShiprocketConfig,
      dispatchOrderViaShiprocket,
      checkShippingServiceability,
      generatePrintableShippingLabelHtml,
      getShiprocketTrackingUrl,

      // Toast Notifications
      toast,
      showToast,
      hideToast
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
