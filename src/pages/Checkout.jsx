import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck, CreditCard, QrCode, Building, Truck,
  CheckCircle2, ArrowRight, ChevronLeft, Printer,
  Mail, Eye, RefreshCw, ExternalLink, X, Clock, Copy, Check
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import {
  initiateRazorpayCheckout,
  getMerchantUpiId,
  generateUpiUri,
  RAZORPAY_CONFIG
} from '../services/razorpayService';
import {
  OFFICIAL_SALES_EMAIL,
  generateOrderEmailHtml,
  generateMailtoLink
} from '../services/emailService';
import { generateGSTInvoiceHtml } from '../services/gstInvoiceService';

const PAYMENT_METHODS = [
  { id: 'upi', name: 'Instant UPI / QR Code (Google Pay, PhonePe, Paytm, BHIM)', icon: QrCode, tag: 'Zero Surcharge • Official Razorpay VPA' },
  { id: 'card', name: 'Credit / Debit Card (Visa, MasterCard, RuPay)', icon: CreditCard, tag: 'Instant OTP' },
  { id: 'netbanking', name: 'Net Banking (All Major Indian Banks)', icon: Building, tag: 'Direct Bank Portal' },
  { id: 'cod', name: 'Pay on Delivery / Cash on Delivery', icon: Truck, tag: 'Doorstep Verification' }
];

const generateMockPaymentId = (prefix = 'pay_upi_') => prefix + Date.now();

const Checkout = () => {
  const { cart, getSubtotal, getDiscount, getCartTotal, placeOrder, showToast, resendOrderEmail } = useProducts();
  const { user } = useAuth();

  // Form states
  const [name, setName] = useState(user?.name || 'Rajesh Sharma');
  const [email, setEmail] = useState(user?.email || 'rajesh.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98201 23456');
  const [addressLine1, setAddressLine1] = useState(user?.address?.line1 || 'Flat 402, Sea Green Heights, Hill Road');
  const [city, setCity] = useState(user?.address?.city || 'Mumbai');
  const [state, setState] = useState(user?.address?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(user?.address?.pincode || '400050');
  const [deliverySlot, setDeliverySlot] = useState('Standard Morning Slot (08:00 AM - 12:00 PM)');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isUpiSimulating, setIsUpiSimulating] = useState(false);
  const [isUpiApproved, setIsUpiApproved] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [customerUpiRef, setCustomerUpiRef] = useState('');
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState(null);

  // Email confirmation states
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
  const [showGSTInvoiceModal, setShowGSTInvoiceModal] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8829');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('492');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCharge = subtotal > 1500 || subtotal === 0 ? 0 : 90;
  const total = getCartTotal();
  const merchantUpiId = getMerchantUpiId();

  // Generate real dynamic UPI Payment URI for the exact cart total
  const dynamicUpiUri = generateUpiUri({
    upiId: merchantUpiId,
    payeeName: RAZORPAY_CONFIG.MERCHANT_NAME,
    amount: total,
    note: `Payment for ${cart.length} item(s) - Shree Pratham`
  });

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <Link to="/cart" className="btn-gold" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          Back to Cart
        </Link>
      </div>
    );
  }

  // Copy Merchant UPI ID to Clipboard
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopiedUpi(true);
    showToast(`Razorpay UPI ID ${merchantUpiId} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  // Simulated instant approval for sandbox testing
  const handleSimulateUpi = () => {
    setIsUpiSimulating(true);
    setTimeout(() => {
      setIsUpiSimulating(false);
      setIsUpiApproved(true);
      const mockPayId = generateMockPaymentId('pay_upi_');
      setRazorpayPaymentId(mockPayId);
      showToast('UPI payment authorized and received successfully!', 'success');
    }, 1200);
  };

  // Launch Razorpay standard checkout popup with code-integrated API key
  const handleLaunchRazorpay = () => {
    setIsRazorpayLoading(true);
    const activeKey = getRazorpayKey();

    if (!activeKey || activeKey.includes('YOUR_RAZORPAY_KEY')) {
      setIsRazorpayLoading(false);
      showToast('Razorpay Key is ready to be configured in src/services/razorpayService.js. In the meantime, you can scan the generated UPI QR code directly or pay using any UPI app!', 'info');
      return;
    }

    const orderDetails = {
      customer: {
        name,
        email,
        phone,
        address: `${addressLine1}, ${city}, ${state} - ${pincode}`
      },
      items: cart,
      deliverySlot
    };

    initiateRazorpayCheckout({
      amount: total,
      orderDetails,
      preferredMethod: 'upi',
      onSuccess: (response) => {
        setIsRazorpayLoading(false);
        setIsUpiApproved(true);
        setRazorpayPaymentId(response.razorpay_payment_id);

        // Complete order immediately upon Razorpay success
        const orderData = {
          customer: orderDetails.customer,
          paymentMethod: `Razorpay UPI (${merchantUpiId})`,
          paymentStatus: 'Paid',
          razorpayPaymentId: response.razorpay_payment_id,
          deliverySlot,
          deliveryNotes
        };
        const newOrder = placeOrder(orderData);
        setConfirmedOrder(newOrder);
      },
      onDismiss: () => {
        setIsRazorpayLoading(false);
        showToast('Razorpay payment window closed.', 'info');
      },
      onError: (errMsg) => {
        setIsRazorpayLoading(false);
        showToast(errMsg || 'Razorpay checkout error. You can also scan the UPI QR code directly.', 'error');
      }
    });
  };

  // Complete Order via regular submit
  const handleCompleteOrder = (e) => {
    e.preventDefault();

    const assignedPaymentId = razorpayPaymentId || (customerUpiRef ? `utr_${customerUpiRef}` : null) || (paymentMethod === 'upi' ? generateMockPaymentId('pay_upi_') : null);

    const orderDetails = {
      customer: {
        name,
        email,
        phone,
        address: `${addressLine1}, ${city}, ${state} - ${pincode}`
      },
      paymentMethod: paymentMethod === 'upi' 
        ? `Razorpay UPI (${merchantUpiId})` 
        : paymentMethod === 'card' 
          ? 'Credit Card' 
          : paymentMethod === 'netbanking' 
            ? `Net Banking (${selectedBank})` 
            : 'Pay on Delivery',
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      razorpayPaymentId: assignedPaymentId,
      deliverySlot,
      deliveryNotes
    };

    const newOrder = placeOrder(orderDetails);
    setConfirmedOrder(newOrder);
  };

  // Re-trigger confirmation email dispatch from contact@shreepratham.com
  const handleResendEmail = async () => {
    if (!confirmedOrder) return;
    setIsResendingEmail(true);
    await resendOrderEmail(confirmedOrder.id);
    setTimeout(() => {
      setIsResendingEmail(false);
    }, 600);
  };

  // ========================================================
  // 1. ORDER CONFIRMATION & TAX INVOICE SCREEN
  // ========================================================
  if (confirmedOrder) {
    return (
      <div style={{ padding: '4rem 0 6rem 0' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          
          {/* Success Banner */}
          <div className="glass-card" style={{
            padding: '2.5rem',
            textAlign: 'center',
            marginBottom: '1.75rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={42} color="#10b981" />
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Payment & Order Confirmed!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
              Thank you for choosing Shree Pratham. Your package has been logged into our central fulfillment dispatch.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
              <div style={{ background: '#090d16', border: '1px solid var(--border-gold)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 800, color: 'var(--accent-gold-light)', fontSize: '1.2rem' }}>
                Order ID: {confirmedOrder.id}
              </div>
              <Link to="/account" className="btn-gold">
                Track Live Order in Account <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Shiprocket Delivery Partner Tracking Banner */}
          {confirmedOrder.shiprocketAwb && (
            <div className="glass-card" style={{
              padding: '1.5rem 2rem',
              marginBottom: '1.75rem',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(15, 23, 42, 0.98) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid #38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    flexShrink: 0
                  }}>
                    <Truck size={24} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#ffffff' }}>Fulfilled via Shiprocket Delivery Partner</h3>
                      <span className="badge-blue" style={{ fontSize: '0.72rem' }}>AWB: {confirmedOrder.shiprocketAwb}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Carrier: <strong style={{ color: '#fff' }}>{confirmedOrder.shiprocketCourier || 'Blue Dart Express (Shiprocket)'}</strong> • Status: <span style={{ color: '#6ee7b7' }}>{confirmedOrder.shiprocketStatus || 'Manifest Generated'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={confirmedOrder.shiprocketTrackingUrl || `https://shiprocket.co/tracking/${confirmedOrder.shiprocketAwb}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <ExternalLink size={14} /> Track on Shiprocket
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Email Confirmation Notice Banner (contact@shreepratham.com) */}
          <div className="glass-card" style={{
            padding: '1.5rem 2rem',
            marginBottom: '1.75rem',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: '280px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold-light)',
                  flexShrink: 0
                }}>
                  <Mail size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#ffffff' }}>Tax Invoice Confirmation Email Sent</h3>
                    <span className="badge-green" style={{ fontSize: '0.72rem' }}>✓ Dispatched Automatically</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 0.6rem 0', lineHeight: 1.5 }}>
                    An official digital tax invoice and dispatch notice has been dispatched from official desk <strong style={{ color: 'var(--accent-gold-light)' }}>{OFFICIAL_SALES_EMAIL}</strong> to <strong style={{ color: '#ffffff' }}>{confirmedOrder.customer?.email}</strong>.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    <div><strong>From:</strong> {OFFICIAL_SALES_EMAIL}</div>
                    <div><strong>To:</strong> {confirmedOrder.customer?.email}</div>
                    {confirmedOrder.razorpayPaymentId && (
                      <div style={{ color: '#60a5fa' }}><strong>Razorpay Ref:</strong> {confirmedOrder.razorpayPaymentId}</div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowEmailPreviewModal(true)}
                  className="btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Eye size={14} /> Preview Sent Email
                </button>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  className="btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  disabled={isResendingEmail}
                >
                  <RefreshCw size={14} className={isResendingEmail ? 'spin' : ''} /> {isResendingEmail ? 'Sending...' : 'Resend Email'}
                </button>
              </div>
            </div>
          </div>

          {/* Printable Invoice Summary Card with White Background Logo */}
          <div className="glass-card" style={{ padding: '2.5rem', background: '#0b111e', border: '1px solid var(--border-gold)' }}>
            <div className="flex justify-between items-start" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                {/* Official Logo with Crisp White Background */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '2px solid rgba(245, 158, 11, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4), 0 0 16px rgba(245, 158, 11, 0.25)',
                  flexShrink: 0
                }}>
                  <img
                    src="/logo.png"
                    alt="Shree Pratham"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--accent-gold-light)', letterSpacing: '0.04em' }}>
                    SHREE PRATHAM TAX INVOICE
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    GSTIN: 07ELQPA7054H1ZW • Authorized Enterprise Center • Sales: {OFFICIAL_SALES_EMAIL}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div>Date: <strong>{confirmedOrder.date}</strong></div>
                <div>Status: <strong style={{ color: '#6ee7b7' }}>{confirmedOrder.paymentStatus}</strong></div>
                {confirmedOrder.razorpayPaymentId && (
                  <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '0.2rem' }}>
                    UPI Ref: {confirmedOrder.razorpayPaymentId}
                  </div>
                )}
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem', fontSize: '0.88rem' }}>
              <div>
                <div style={{ color: 'var(--text-subtle)', fontWeight: 600, marginBottom: '0.3rem' }}>BILLED & SHIPPED TO:</div>
                <div style={{ fontWeight: 700, color: '#fff' }}>{confirmedOrder.customer.name}</div>
                <div style={{ color: 'var(--text-muted)' }}>{confirmedOrder.customer.address}</div>
                <div style={{ color: 'var(--text-muted)' }}>Phone: {confirmedOrder.customer.phone}</div>
                <div style={{ color: 'var(--accent-gold-light)' }}>Email: {confirmedOrder.customer.email}</div>
              </div>

              <div>
                <div style={{ color: 'var(--text-subtle)', fontWeight: 600, marginBottom: '0.3rem' }}>DELIVERY & GATEWAY DISPATCH:</div>
                <div style={{ color: '#fff' }}>Preferred Window: {confirmedOrder.slot}</div>
                <div style={{ color: '#fff' }}>Payment Method: <span style={{ color: 'var(--accent-gold-light)' }}>{confirmedOrder.paymentMethod}</span></div>
                <div style={{ color: 'var(--text-muted)' }}>Carrier: Blue Dart Express Air Delivery</div>
                <div style={{ color: '#34d399', fontSize: '0.8rem', marginTop: '0.2rem' }}>✓ Confirmation Mailed via {OFFICIAL_SALES_EMAIL}</div>
              </div>
            </div>

            {/* Line Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.6rem 0' }}>Item Description</th>
                  <th style={{ padding: '0.6rem 0', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '0.6rem 0', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {confirmedOrder.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem 0' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{item.name}</div>
                      {item.customization && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)' }}>
                          Customization: {item.customization.engravingText}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 0', textAlign: 'center', color: '#fff' }}>{item.quantity}</td>
                    <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Invoice Totals */}
            <div style={{ borderTop: '2px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span style={{ color: '#fff' }}>₹{confirmedOrder.subtotal.toLocaleString()}</span>
              </div>
              {confirmedOrder.discount > 0 && (
                <div className="flex justify-between" style={{ color: '#6ee7b7' }}>
                  <span>Promo Discount:</span>
                  <span>-₹{confirmedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Shipping Fee:</span>
                <span style={{ color: confirmedOrder.deliveryCharge === 0 ? '#6ee7b7' : '#fff' }}>
                  {confirmedOrder.deliveryCharge === 0 ? 'FREE' : `₹${confirmedOrder.deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between" style={{ fontSize: '1.2rem', fontWeight: 800, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span style={{ color: '#fff' }}>Total Paid:</span>
                <span style={{ color: 'var(--accent-gold-light)' }}>₹{confirmedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowGSTInvoiceModal(true)}
                className="btn-gold btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Eye size={15} /> View GST Invoice
              </button>
              <button
                onClick={() => {
                  const invoiceHtml = generateGSTInvoiceHtml(confirmedOrder);
                  const printWin = window.open('', '_blank');
                  printWin.document.write(invoiceHtml);
                  printWin.document.close();
                  setTimeout(() => printWin.print(), 600);
                }}
                className="btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Printer size={15} /> Download GST Invoice PDF
              </button>
              <button
                onClick={() => setShowEmailPreviewModal(true)}
                className="btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Mail size={15} /> View Confirmation Email
              </button>
              <Link to="/account" className="btn-outline btn-sm">
                View in Customer Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Modal: Preview Sent Confirmation Email */}
        {showEmailPreviewModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}>
            <div className="glass-card" style={{
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              background: '#0e1626',
              border: '1px solid var(--border-gold)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }}>
              {/* Header */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--accent-gold-light)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={18} /> Official Confirmation Mail Sent
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    From: <strong>{OFFICIAL_SALES_EMAIL}</strong> • To: <strong>{confirmedOrder.customer?.email}</strong>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailPreviewModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Email Content Frame */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f8fafc' }}>
                <iframe
                  title="Sent Email Preview"
                  srcDoc={generateOrderEmailHtml(confirmedOrder)}
                  style={{ width: '100%', minHeight: '480px', border: 'none', background: '#ffffff' }}
                />
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'gap', gap: '0.5rem' }}>
                <a
                  href={generateMailtoLink(confirmedOrder)}
                  className="btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  <ExternalLink size={14} /> Open in Email App
                </a>
                <button
                  type="button"
                  onClick={() => setShowEmailPreviewModal(false)}
                  className="btn-gold btn-sm"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: GST Tax Invoice Preview */}
        {showGSTInvoiceModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}>
            <div className="glass-card" style={{
              width: '100%',
              maxWidth: '950px',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              background: '#0e1626',
              border: '1px solid rgba(8, 145, 178, 0.6)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
            }}>
              {/* Header */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#22d3ee', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} /> GST Tax Invoice
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    GSTIN: 07ELQPA7054H1ZW • Order #{confirmedOrder.id} • Sent to: <strong>{confirmedOrder.customer?.email}</strong>
                  </div>
                </div>
                <button
                  onClick={() => setShowGSTInvoiceModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Invoice Content Frame */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f1f5f9' }}>
                <iframe
                  title="GST Tax Invoice Preview"
                  srcDoc={generateGSTInvoiceHtml(confirmedOrder)}
                  style={{ width: '100%', minHeight: '650px', border: 'none', background: '#ffffff', borderRadius: '4px' }}
                />
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    const invoiceHtml = generateGSTInvoiceHtml(confirmedOrder);
                    const printWin = window.open('', '_blank');
                    printWin.document.write(invoiceHtml);
                    printWin.document.close();
                    setTimeout(() => printWin.print(), 600);
                  }}
                  className="btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Printer size={14} /> Print / Save as PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowGSTInvoiceModal(false)}
                  className="btn-gold btn-sm"
                >
                  Close Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========================================================
  // 2. CHECKOUT FLOW SCREEN
  // ========================================================
  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold-light)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ChevronLeft size={16} /> Return to Cart
        </Link>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>Secure Checkout & Payment</h1>

        <form onSubmit={handleCompleteOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
            
            {/* Left Column: Delivery Address & Slot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Step 1: Shipping Address */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="var(--accent-gold)" /> 1. Shipping & Contact Details
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">
                      Email Address (Order Confirmation sent here) *
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)', marginTop: '0.35rem' }}>
                      ✉️ Verified tax invoice will be emailed from {OFFICIAL_SALES_EMAIL} upon order placement.
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Flat / House No. / Street Address *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={addressLine1}
                      onChange={e => setAddressLine1(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">PIN Code *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={pincode}
                        onChange={e => setPincode(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{
                      gridColumn: 'span 3',
                      background: 'rgba(14, 165, 233, 0.08)',
                      border: '1px solid rgba(14, 165, 233, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.8rem',
                      color: '#93c5fd'
                    }}>
                      <Truck size={16} color="#38bdf8" />
                      <div>
                        <strong>Shiprocket Express Delivery:</strong> Verified serviceable for PIN <strong>{pincode}</strong> (Estimated 2-3 Days via Blue Dart / Delhivery Express).
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Slot Preferences */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={20} color="var(--accent-gold)" /> 2. Delivery Window Preference
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Standard Morning Slot (08:00 AM - 12:00 PM)',
                    'Afternoon Priority Dispatch (01:00 PM - 05:00 PM)',
                    'Evening Express Window (06:00 PM - 09:00 PM)',
                    'Weekend Dedicated Corporate Delivery'
                  ].map(slot => (
                    <label
                      key={slot}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: deliverySlot === slot ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: deliverySlot === slot ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <input
                        type="radio"
                        name="deliverySlot"
                        checked={deliverySlot === slot}
                        onChange={() => setDeliverySlot(slot)}
                        style={{ accentColor: 'var(--accent-gold)' }}
                      />
                      <span style={{ fontSize: '0.92rem', color: deliverySlot === slot ? '#fff' : 'var(--text-muted)', fontWeight: deliverySlot === slot ? 600 : 400 }}>
                        {slot}
                      </span>
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <label className="form-label">Special Delivery / Security Gate Instructions (Optional)</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={deliveryNotes}
                    onChange={e => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Leave with building security desk, ring bell twice, call on arrival..."
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Payment Gateways & Order Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} color="var(--accent-gold)" /> 3. Select Payment Gateway
                </h3>

                {/* Payment Methods Tabs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {PAYMENT_METHODS.map(m => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                          border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={isSelected}
                          onChange={() => setPaymentMethod(m.id)}
                          style={{ accentColor: 'var(--accent-gold)' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Icon size={16} color="var(--accent-gold)" />
                            {m.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.tag}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sub-form 1: Razorpay Generated UPI VPA & QR Code */}
                {paymentMethod === 'upi' && (
                  <div style={{
                    background: '#090d16',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    {/* Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      paddingBottom: '0.85rem',
                      marginBottom: '1.25rem',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                          Razorpay UPI Direct Receiver
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Verified Virtual Payment Address (VPA) for Instant Collection
                        </div>
                      </div>
                      <span className="badge-green" style={{ fontSize: '0.72rem' }}>✓ Verified Merchant</span>
                    </div>

                    {/* Official Razorpay UPI Address Card */}
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '10px',
                      padding: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                        Razorpay Merchant UPI ID (Send Payment Here):
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <code style={{
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          color: 'var(--accent-gold-light)',
                          background: '#0e1626',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          letterSpacing: '0.03em'
                        }}>
                          {merchantUpiId}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="btn-outline btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem' }}
                        >
                          {copiedUpi ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                          {copiedUpi ? 'Copied UPI ID!' : 'Copy UPI ID'}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
                        Payee: <strong>{RAZORPAY_CONFIG.MERCHANT_NAME}</strong> • Zero transaction surcharge
                      </div>
                    </div>

                    {/* Scannable Dynamic QR Code Section */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1.25rem',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      marginBottom: '1.5rem'
                    }}>
                      {/* Real Dynamic NPCI QR Code on White Container */}
                      <div style={{
                        background: '#ffffff',
                        padding: '10px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                        border: '2px solid rgba(245, 158, 11, 0.5)',
                        flexShrink: 0
                      }}>
                        <QRCodeSVG
                          value={dynamicUpiUri}
                          size={135}
                          level="M"
                          includeMargin={false}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.3rem' }}>
                          Scan to Pay with Any UPI App
                        </div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-gold-light)', marginBottom: '0.4rem' }}>
                          ₹{total.toLocaleString()}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>
                          Open Google Pay, PhonePe, Paytm, or BHIM on your mobile device and scan this QR code to transfer directly to Razorpay.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay', 'Cred'].map(app => (
                            <span key={app} style={{ background: '#0e1626', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px', padding: '2px 7px', fontSize: '0.7rem', color: '#94a3b8' }}>
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action 1: Mobile Deep-Link Payment */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <a
                        href={dynamicUpiUri}
                        className="btn-gold"
                        style={{
                          width: '100%',
                          padding: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          textDecoration: 'none',
                          textAlign: 'center',
                          fontWeight: 700
                        }}
                      >
                        <QrCode size={18} /> Pay ₹{total.toLocaleString()} via UPI App (Mobile)
                      </a>

                      <button
                        type="button"
                        onClick={handleLaunchRazorpay}
                        className="btn-outline btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={isRazorpayLoading}
                      >
                        {isRazorpayLoading ? 'Launching Gateway...' : 'Or Open Razorpay Standard Checkout Window'}
                      </button>
                    </div>

                    {/* Action 2: UTR Reference Input & Confirmation */}
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>
                        UPI Reference / UTR Number (Optional):
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          value={customerUpiRef}
                          onChange={e => setCustomerUpiRef(e.target.value)}
                          placeholder="e.g. 429381729831 (12-digit UTR)"
                          style={{ fontSize: '0.85rem' }}
                        />
                        <button
                          type="button"
                          onClick={handleSimulateUpi}
                          className="btn-secondary btn-sm"
                          style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}
                          title="Simulate instant verification for testing"
                        >
                          {isUpiSimulating ? 'Verifying...' : isUpiApproved ? '✓ Approved' : 'Simulate Approval'}
                        </button>
                      </div>

                      {isUpiApproved && (
                        <div style={{ fontSize: '0.78rem', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                          <CheckCircle2 size={13} /> Payment verified! Click Complete Order below to receive your tax invoice.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sub-form 2: Card */}
                {paymentMethod === 'card' && (
                  <div style={{
                    background: '#090d16',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div>
                      <label className="form-label">Card Number</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="form-label">Expiry Date</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="form-label">CVV</label>
                        <input
                          type="password"
                          className="form-input"
                          maxLength={3}
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          placeholder="•••"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-form 3: Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div style={{
                    background: '#090d16',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1.5rem'
                  }}>
                    <label className="form-label">Select Your Bank:</label>
                    <select
                      className="form-select"
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* Final Cost Breakdown */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  <div className="flex justify-between" style={{ marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
                    <span style={{ color: '#fff' }}>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between" style={{ color: '#6ee7b7', marginBottom: '0.4rem' }}>
                      <span>Discount:</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between" style={{ marginBottom: '0.6rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Delivery Charge:</span>
                    <span style={{ color: deliveryCharge === 0 ? '#6ee7b7' : '#fff' }}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center" style={{ borderTop: '2px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Total Payable:</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                >
                  Pay ₹{total.toLocaleString()} & Complete Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
