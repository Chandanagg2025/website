import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Plus, Trash2, LogOut, Send, Edit3,
  Key, Mail, RefreshCw, Eye, CheckCircle2, X,
  Truck, ExternalLink, Printer, Sparkles, MapPin, Box
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { getSentEmails } from '../services/emailService';

const Admin = () => {
  const { isAdmin, logoutAdmin } = useAuth();
  const {
    orders,
    updateOrderStatus,
    subscriptions,
    toggleSubscriptionPause,
    quotes,
    updateQuoteStatus,
    tickets,
    replyToTicket,
    updateTicketStatus,
    giftProducts,
    waterProducts,
    appliances,
    addProductToCatalog,
    deleteProductFromCatalog,
    inquiries,
    updateInquiryStatus,
    resendOrderEmail,
    razorpayKey,
    updateRazorpayKey,
    officialSalesEmail,
    shiprocketConfig,
    updateShiprocketConfig,
    dispatchOrderViaShiprocket,
    checkShippingServiceability,
    generatePrintableShippingLabelHtml,
    showToast
  } = useProducts();

  const [activeTab, setActiveTab] = useState('orders');
  const [adminKeyInput, setAdminKeyInput] = useState(razorpayKey || '');
  const [selectedEmailPreview, setSelectedEmailPreview] = useState(null);
  const [sentEmailsList, setSentEmailsList] = useState(() => getSentEmails());

  // Shiprocket Logistics States
  const [srEmail, setSrEmail] = useState(shiprocketConfig?.EMAIL || 'logistics@shreepratham.com');
  const [srPassword, setSrPassword] = useState(shiprocketConfig?.PASSWORD || '');
  const [srPickupLoc, setSrPickupLoc] = useState(shiprocketConfig?.PICKUP_LOCATION || 'Mumbai Central Fulfillment Hub');
  const [srPickupPin, setSrPickupPin] = useState(shiprocketConfig?.PICKUP_PINCODE || '400050');
  const [showSrPassword, setShowSrPassword] = useState(false);

  // Shiprocket Pincode Calculator State
  const [calcPincode, setCalcPincode] = useState('110001');
  const [calcResult, setCalcResult] = useState(null);
  const [isCalculatingRate, setIsCalculatingRate] = useState(false);

  // Print Barcode Shipping Label
  const handlePrintLabel = (order) => {
    const labelHtml = generatePrintableShippingLabelHtml(order, {
      awbCode: order.shiprocketAwb,
      courierName: order.shiprocketCourier
    });
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(labelHtml);
      printWindow.document.close();
    } else {
      showToast('Popup blocker prevented opening label. Please allow popups.', 'error');
    }
  };

  // Check courier rates for pincode
  const handleRunServiceabilityCheck = async (e) => {
    e.preventDefault();
    if (!calcPincode || calcPincode.length !== 6) {
      showToast('Please enter a valid 6-digit Indian PIN code', 'error');
      return;
    }
    setIsCalculatingRate(true);
    const res = await checkShippingServiceability(calcPincode);
    setCalcResult(res);
    setIsCalculatingRate(false);
  };

  // Save Shiprocket credentials
  const handleSaveShiprocketSettings = (e) => {
    e.preventDefault();
    updateShiprocketConfig({
      EMAIL: srEmail.trim(),
      PASSWORD: srPassword.trim(),
      PICKUP_LOCATION: srPickupLoc.trim(),
      PICKUP_PINCODE: srPickupPin.trim()
    });
  };

  // New product form state
  const [newVertical, setNewVertical] = useState('gifts');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Ticket reply in admin
  const [adminTicketReply, setAdminTicketReply] = useState('');
  const [replyingTicketId, setReplyingTicketId] = useState(null);

  // Quote editing in admin
  const [quoteNotes, setQuoteNotes] = useState('');
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <ShieldCheck size={50} color="#fca5a5" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Admin Console Access Required</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Please authenticate with authorized credentials to view system orders, subscriptions, and tickets.
        </p>
        <Link to="/admin/login" className="btn-gold">
          Sign In to Admin Portal
        </Link>
      </div>
    );
  }

  // Calculate high-level KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
  const activeSubsCount = subscriptions.filter(s => s.status === 'Active').length;
  const pendingQuotesCount = quotes.filter(q => q.status === 'Under Review').length;
  const openTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    addProductToCatalog(newVertical, {
      name: newName,
      price: parseFloat(newPrice),
      originalPrice: Math.round(parseFloat(newPrice) * 1.25),
      category: newCategory || (newVertical === 'gifts' ? 'Corporate' : newVertical === 'water' ? 'Bottled' : 'Refrigeration'),
      image: newImage || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
      description: newDesc || 'High quality enterprise equipment certified by Shree Pratham standards.',
      rating: 5.0,
      reviews: 1,
      inStock: true
    });

    setNewName('');
    setNewPrice('');
    setNewDesc('');
    setNewImage('');
  };

  const handleAdminTicketReplySubmit = (ticketId) => {
    if (!adminTicketReply.trim()) return;
    replyToTicket(ticketId, adminTicketReply.trim(), 'Engineering Helpdesk NOC Lead');
    setAdminTicketReply('');
    setReplyingTicketId(null);
  };

  const handleSaveQuoteNote = (quoteId) => {
    updateQuoteStatus(quoteId, 'Quote Sent', quoteNotes.trim());
    setQuoteNotes('');
    setEditingQuoteId(null);
  };

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Admin Header */}
        <div className="glass-card" style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)'
        }}>
          <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '2px solid rgba(245, 158, 11, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 16px rgba(245, 158, 11, 0.25)',
                flexShrink: 0
              }}>
                <img
                  src="/logo.png"
                  alt="Shree Pratham"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Operations Management Center</h1>
                  <span className="badge-green">Live Production</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Shree Pratham Central Fulfillment, Water Logistics & NOC Dashboard
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/account" className="btn-outline btn-sm">
                View Customer View
              </Link>
              <button onClick={logoutAdmin} className="btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <LogOut size={14} /> Exit Admin
              </button>
            </div>
          </div>
        </div>

        {/* Executive KPI Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Revenue (Paid)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold-light)', marginTop: '0.25rem' }}>
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6ee7b7', marginTop: '0.2rem' }}>Across {orders.length} total orders</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Water Routes</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.25rem' }}>
              {activeSubsCount} Subscriptions
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Daily morning vans active</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Appliance RFQs</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a5b4fc', marginTop: '0.25rem' }}>
              {pendingQuotesCount} Inquiries
            </div>
            <div style={{ fontSize: '0.75rem', color: pendingQuotesCount > 0 ? '#fbbf24' : '#6ee7b7', marginTop: '0.2rem' }}>
              {pendingQuotesCount > 0 ? 'Requires commercial pricing' : 'All quotes sent'}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Open Helpdesk Tickets</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171', marginTop: '0.25rem' }}>
              {openTicketsCount} Active
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>15-min SLA monitoring</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'orders', name: 'Orders Dispatch', count: orders.length },
            { id: 'shiprocket', name: 'Shiprocket Logistics & AWBs', count: 'Active' },
            { id: 'gateways', name: 'Razorpay UPI & Sales Email', count: 'Active' },
            { id: 'inquiries', name: 'Customer Inquiries & Callbacks', count: inquiries?.length || 0 },
            { id: 'water', name: 'Water Subscriptions', count: subscriptions.length },
            { id: 'quotes', name: 'Bulk Appliance Quotes', count: quotes.length },
            { id: 'tickets', name: 'IT Helpdesk Tickets', count: tickets.length },
            { id: 'catalog', name: 'Product Catalog Manager' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 600,
                background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: activeTab === tab.id ? '#6ee7b7' : 'var(--text-muted)',
                border: activeTab === tab.id ? '1px solid #10b981' : '1px solid transparent',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {tab.name} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* TAB 1: ORDERS DISPATCH MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Customer Orders & Delivery Status Dispatch</h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem' }}>Customer Details</th>
                  <th style={{ padding: '0.75rem' }}>Items Ordered</th>
                  <th style={{ padding: '0.75rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem' }}>Payment & UPI</th>
                  <th style={{ padding: '0.75rem' }}>Shiprocket Logistics & AWB</th>
                  <th style={{ padding: '0.75rem' }}>Invoice Email (sales@)</th>
                  <th style={{ padding: '0.75rem' }}>Fulfillment Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                      {order.id}
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                      {order.date}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{order.customer.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{order.customer.phone}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '200px' }}>{order.customer.address}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.82rem', color: '#fff' }}>
                        {order.items?.map((it, i) => (
                          <div key={i}>• {it.name} (×{it.quantity})</div>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: '#fff' }}>
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={order.paymentStatus === 'Paid' ? 'badge-green' : 'badge-gold'}>
                        {order.paymentStatus}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {order.paymentMethod}
                      </div>
                      {order.razorpayPaymentId && (
                        <div style={{ fontSize: '0.72rem', color: '#60a5fa', fontFamily: 'monospace', marginTop: '0.15rem' }}>
                          Ref: {order.razorpayPaymentId}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {order.shiprocketAwb ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span className="badge-blue" style={{ fontSize: '0.7rem' }}>AWB: {order.shiprocketAwb}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>
                            {order.shiprocketCourier || 'Blue Dart Express (Shiprocket)'}
                          </div>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                            <button
                              type="button"
                              onClick={() => handlePrintLabel(order)}
                              className="btn-outline btn-sm"
                              style={{ padding: '0.15rem 0.5rem', fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                              title="Print official barcode shipping label"
                            >
                              <Printer size={10} /> Label
                            </button>
                            <a
                              href={order.shiprocketTrackingUrl || `https://shiprocket.co/tracking/${order.shiprocketAwb}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-secondary btn-sm"
                              style={{ padding: '0.15rem 0.5rem', fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                              <ExternalLink size={10} /> Track
                            </a>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => dispatchOrderViaShiprocket(order.id)}
                          className="btn-gold btn-sm"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Truck size={12} /> Ship via Shiprocket
                        </button>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <span style={{ fontSize: '0.74rem', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Mail size={12} /> {officialSalesEmail || 'sales@shreepratham.com'}
                        </span>
                        <button
                          type="button"
                          onClick={() => resendOrderEmail(order.id)}
                          className="btn-outline btn-sm"
                          style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content' }}
                          title="Resend confirmation tax invoice email to customer"
                        >
                          <RefreshCw size={10} /> Resend Mail
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <select
                        value={order.orderStatus}
                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                        style={{
                          background: '#090d16',
                          border: '1px solid var(--border-gold)',
                          color: '#fff',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600
                        }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: WATER SUBSCRIPTIONS MANAGEMENT */}
        {activeTab === 'water' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Active Recurring Water Delivery Routes</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {subscriptions.map(sub => (
                <div key={sub.id} style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontWeight: 800, color: '#38bdf8' }}>{sub.id}</span>
                      <span className={sub.status === 'Active' ? 'badge-green' : 'badge-gold'}>{sub.status}</span>
                    </div>
                    <div style={{ fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>{sub.planName}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Cadence: {sub.frequency} • Next Delivery: {sub.nextDeliveryDate}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                      📍 Drop: {sub.address}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                        ₹{sub.monthlyTotal.toLocaleString()}/mo
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>₹{sub.ratePerJar}/jar</div>
                    </div>

                    <button
                      onClick={() => toggleSubscriptionPause(sub.id)}
                      className="btn-secondary btn-sm"
                    >
                      {sub.status === 'Active' ? 'Pause Route' : 'Resume Route'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BULK APPLIANCE QUOTES */}
        {activeTab === 'quotes' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>B2B Industrial Equipment RFQs</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {quotes.map(quote => (
                <div key={quote.id} style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem'
                }}>
                  <div className="flex justify-between items-start" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--accent-gold-light)' }}>{quote.id}</span>
                        <span className={quote.status === 'Quote Sent' ? 'badge-green' : 'badge-gold'}>{quote.status}</span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', color: '#fff', marginTop: '0.25rem' }}>
                        {quote.applianceName} (Qty: {quote.quantity})
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Company: <strong>{quote.company}</strong> • Contact: {quote.contactPerson} ({quote.phone}, {quote.email})
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-gold btn-sm"
                        onClick={() => { setEditingQuoteId(quote.id); setQuoteNotes(quote.adminNotes || ''); }}
                      >
                        <Edit3 size={14} /> Send Official Offer
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#a5b4fc', marginBottom: '0.75rem' }}>
                    Estimated Commercial Total: <strong>{quote.estimatedTotal}</strong>
                  </div>

                  {editingQuoteId === quote.id ? (
                    <div style={{ marginTop: '1rem', background: '#090d16', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-gold)' }}>
                      <label className="form-label">Approved Quote Terms & Commercial Offer:</label>
                      <textarea
                        className="form-textarea"
                        rows={2}
                        value={quoteNotes}
                        onChange={e => setQuoteNotes(e.target.value)}
                        placeholder="e.g. Special institutional discount approved. 10% off + Free Freight."
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button className="btn-gold btn-sm" onClick={() => handleSaveQuoteNote(quote.id)}>
                          Confirm & Send Quote to Customer
                        </button>
                        <button className="btn-secondary btn-sm" onClick={() => setEditingQuoteId(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    quote.adminNotes && (
                      <div style={{ fontSize: '0.82rem', color: '#fef3c7', background: 'rgba(245, 158, 11, 0.08)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                        Admin Response: {quote.adminNotes}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: IT HELPDESK TICKETS NOC */}
        {activeTab === 'tickets' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Level-2 NOC Helpdesk Dispatch</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {tickets.map(ticket => (
                <div key={ticket.id} style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem'
                }}>
                  <div className="flex justify-between items-start" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--accent-gold-light)' }}>#{ticket.id}</span>
                        <span className={ticket.status === 'Resolved' ? 'badge-green' : 'badge-blue'}>{ticket.status}</span>
                        <span className="badge-gold">Priority: {ticket.priority}</span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', color: '#fff', marginTop: '0.25rem' }}>{ticket.subject}</h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Category: {ticket.category} • Created: {ticket.date}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <select
                        value={ticket.status}
                        onChange={e => updateTicketStatus(ticket.id, e.target.value)}
                        style={{
                          background: '#090d16',
                          border: '1px solid #10b981',
                          color: '#fff',
                          padding: '0.35rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem'
                        }}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  {/* Messages */}
                  <div style={{
                    background: '#090d16',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {ticket.replies?.map((rep, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem' }}>
                        <span style={{ color: rep.sender.includes('Customer') ? 'var(--accent-gold-light)' : '#6ee7b7', fontWeight: 600 }}>
                          {rep.sender}:
                        </span>{' '}
                        <span style={{ color: '#fff' }}>{rep.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Admin Reply Box */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Type engineer diagnosis or resolution update..."
                      value={replyingTicketId === ticket.id ? adminTicketReply : ''}
                      onFocus={() => setReplyingTicketId(ticket.id)}
                      onChange={e => { setReplyingTicketId(ticket.id); setAdminTicketReply(e.target.value); }}
                    />
                    <button
                      className="btn-gold btn-sm"
                      onClick={() => handleAdminTicketReplySubmit(ticket.id)}
                      style={{ padding: '0 1.25rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}
                    >
                      <Send size={14} /> Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CUSTOMER INQUIRIES & CALLBACKS */}
        {activeTab === 'inquiries' && (
          <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Customer Popup Contact Requests & Inquiries</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                  Live leads submitted through the Contact Us popup modal
                </p>
              </div>
              <span className="badge-gold">Total: {inquiries?.length || 0} Inquiries</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Ref ID</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Division / Vertical</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Callback Window</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Customer Message</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Channel</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Direct WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {(!inquiries || inquiries.length === 0) ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No contact inquiries received yet.
                    </td>
                  </tr>
                ) : (
                  inquiries.map(inq => (
                    <tr key={inq.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                        #{inq.id}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{inq.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)' }}>{inq.phone}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{inq.email}</div>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className="badge-blue" style={{ fontSize: '0.75rem' }}>{inq.vertical}</span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {inq.preferredTime}
                      </td>
                      <td style={{ padding: '1rem 0.5rem', maxWidth: '240px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {inq.message || 'Callback request submitted'}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className="badge-green" style={{ fontSize: '0.75rem' }}>{inq.contactMethod}</span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <select
                          className="form-select"
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}, this is Shree Pratham reaching out regarding your inquiry #${inq.id}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-gold btn-sm"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          Message
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: PRODUCT CATALOG MANAGER */}
        {activeTab === 'catalog' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Add New Item Form */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} color="var(--accent-gold)" /> Add New Product or Equipment to Vertical Catalog
              </h3>

              <form onSubmit={handleCreateProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label">Target Vertical</label>
                  <select
                    className="form-select"
                    value={newVertical}
                    onChange={e => setNewVertical(e.target.value)}
                  >
                    <option value="gifts">Gift Gallery</option>
                    <option value="water">Drinking Water</option>
                    <option value="appliances">Industrial Appliances</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Product / Model Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Royal Silver Hamper"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    placeholder="e.g. 2499"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Category Tag</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Wedding, Cooking, etc."
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Image URL (Unsplash or CDN)</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                    value={newImage}
                    onChange={e => setNewImage(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description & Highlights</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Detailed specifications, packaging, warranty..."
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="btn-gold" style={{ padding: '0.8rem 1.8rem' }}>
                    Publish to Public Website Catalog
                  </button>
                </div>
              </form>
            </div>

            {/* Current Products Quick List */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Active Catalog Products (Gifts, Water, Appliances)</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {giftProducts.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.6)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)' }}>Gift Gallery • ₹{p.price}</div>
                    </div>
                    <button onClick={() => deleteProductFromCatalog('gifts', p.id)} style={{ background: 'transparent', color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {waterProducts.map(w => (
                  <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.6)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>{w.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Drinking Water • ₹{w.price}</div>
                    </div>
                    <button onClick={() => deleteProductFromCatalog('water', w.id)} style={{ background: 'transparent', color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {appliances.map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.6)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>{a.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>Appliances • ₹{a.price.toLocaleString()}</div>
                    </div>
                    <button onClick={() => deleteProductFromCatalog('appliances', a.id)} style={{ background: 'transparent', color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: RAZORPAY UPI & SALES EMAIL GATEWAYS */}
        {activeTab === 'gateways' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Razorpay Payment Gateway Settings */}
            <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--border-gold)' }}>
              <div className="flex justify-between items-start" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold-light)'
                  }}>
                    <Key size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Razorpay UPI Payment Gateway</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      In-Code Integration • Customer Checkout API Key field removed for merchant security
                    </div>
                  </div>
                </div>

                <span className="badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} /> Active in Code
                </span>
              </div>

              <div style={{ maxWidth: '650px' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '0.3rem' }}>
                    🔒 API Key Secured in Code (Hidden from Customers)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    The public API key field has been completely removed from customer checkout. You can integrate your Razorpay Live Key directly in the code at <code style={{ color: 'var(--accent-gold-light)' }}>src/services/razorpayService.js</code> or in <code style={{ color: 'var(--accent-gold-light)' }}>.env</code>.
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    Razorpay Merchant UPI ID (Receiver):
                  </label>
                  <div style={{
                    background: '#090d16',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}>
                    <code style={{ fontSize: '1rem', color: 'var(--accent-gold-light)', fontWeight: 800 }}>
                      shreepratham@razorpay
                    </code>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Configured in razorpayService.js</span>
                  </div>
                </div>

                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Razorpay Key ID (API Key):
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={adminKeyInput}
                    onChange={e => setAdminKeyInput(e.target.value)}
                    placeholder="rzp_test_... or rzp_live_..."
                    style={{ flex: 1, minWidth: '280px', fontFamily: 'monospace', fontSize: '0.95rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!adminKeyInput.trim()) {
                        showToast('Please enter a valid Razorpay Key', 'error');
                        return;
                      }
                      updateRazorpayKey(adminKeyInput.trim());
                    }}
                    className="btn-gold"
                    style={{ padding: '0.65rem 1.4rem' }}
                  >
                    Save API Key
                  </button>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  💡 <strong>Active Runtime Key:</strong> <code style={{ color: '#6ee7b7', background: '#090d16', padding: '2px 8px', borderRadius: '4px' }}>{razorpayKey}</code>
                  <br />
                  Integrate permanently in <code style={{ color: 'var(--accent-gold-light)' }}>src/services/razorpayService.js</code> (<code style={{ color: '#fff' }}>RAZORPAY_CONFIG.KEY_ID</code>) or <code style={{ color: 'var(--accent-gold-light)' }}>.env</code> (<code style={{ color: '#fff' }}>VITE_RAZORPAY_KEY_ID</code>).
                </div>

                {/* Supported Payment Channels */}
                <div style={{ marginTop: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>
                    Active UPI Protocols:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['Google Pay (UPI Intent)', 'PhonePe (Direct App)', 'Paytm UPI', 'BHIM QR Code', 'Cred UPI', 'Amazon Pay UPI', 'Any Bank UPI Handle'].map(m => (
                      <span key={m} style={{ background: '#090d16', border: '1px solid var(--border-gold)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--accent-gold-light)' }}>
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Official Sales Email Dispatch Settings */}
            <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--border-gold)' }}>
              <div className="flex justify-between items-start" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981'
                  }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Official Confirmation Mail Dispatch Desk</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Automated order tax invoices, confirmation receipts, and live logistics dispatch alerts
                    </div>
                  </div>
                </div>

                <div style={{ background: '#090d16', border: '1px solid var(--border-gold)', padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--accent-gold-light)', fontWeight: 700 }}>
                  Sender: {officialSalesEmail || 'sales@shreepratham.com'}
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#e2e8f0' }}>
                ✓ <strong>Sender Email Registered:</strong> Every customer order instantly generates and sends a branded, itemized tax invoice directly from <strong>sales@shreepratham.com</strong> to the customer's billing email.
              </div>

              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#fff' }}>
                Dispatched Confirmation Emails Audit Log ({sentEmailsList.length} total)
              </h4>

              {sentEmailsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No emails dispatched yet in this session. Place an order through checkout to test instant dispatch!
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.6rem' }}>Order ID</th>
                        <th style={{ padding: '0.6rem' }}>From Address</th>
                        <th style={{ padding: '0.6rem' }}>Recipient To</th>
                        <th style={{ padding: '0.6rem' }}>Timestamp</th>
                        <th style={{ padding: '0.6rem' }}>Status</th>
                        <th style={{ padding: '0.6rem', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sentEmailsList.map((em, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                            {em.orderId}
                          </td>
                          <td style={{ padding: '0.6rem', color: '#6ee7b7' }}>
                            {em.from}
                          </td>
                          <td style={{ padding: '0.6rem', color: '#fff' }}>
                            {em.to}
                          </td>
                          <td style={{ padding: '0.6rem', color: 'var(--text-muted)' }}>
                            {new Date(em.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '0.6rem' }}>
                            <span className="badge-green" style={{ fontSize: '0.72rem' }}>
                              ✓ {em.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedEmailPreview(em)}
                              className="btn-outline btn-sm"
                              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <Eye size={12} /> Preview Mail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: SHIPROCKET LOGISTICS & AUTOMATED DISPATCH */}
        {activeTab === 'shiprocket' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 1. Header Banner with Live Connection Status */}
            <div className="glass-card" style={{ padding: '2rem', border: '1px solid #38bdf8' }}>
              <div className="flex justify-between items-start" style={{ flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(56, 189, 248, 0.25) 100%)',
                    border: '1px solid #38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8'
                  }}>
                    <Truck size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#fff' }}>Shiprocket Delivery Partner Management</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Pan-India Automated Courier Dispatch (Blue Dart, Delhivery, DTDC, Shadowfax)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}>
                    <CheckCircle2 size={14} /> Shiprocket Connected & Active
                  </span>
                </div>
              </div>

              {/* Grid: Credentials Form & Step-by-Step Guide */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                
                {/* Left: Credentials Configuration */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Box size={16} color="var(--accent-gold)" /> Shiprocket Account API Settings
                  </h4>

                  <form onSubmit={handleSaveShiprocketSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Shiprocket API User Email *</label>
                      <input
                        type="email"
                        className="form-input"
                        value={srEmail}
                        onChange={e => setSrEmail(e.target.value)}
                        placeholder="e.g. logistics@shreepratham.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Shiprocket API User Password *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showSrPassword ? 'text' : 'password'}
                          className="form-input"
                          value={srPassword}
                          onChange={e => setSrPassword(e.target.value)}
                          placeholder="Your Shiprocket API user password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSrPassword(!showSrPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          {showSrPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        Created in Shiprocket Panel &rarr; Settings &rarr; API &rarr; Configure API Users.
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="form-label">Pickup Location Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={srPickupLoc}
                          onChange={e => setSrPickupLoc(e.target.value)}
                          placeholder="e.g. Mumbai Central Fulfillment Hub"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Origin Pincode *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={srPickupPin}
                          onChange={e => setSrPickupPin(e.target.value)}
                          placeholder="400050"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-gold"
                      style={{ marginTop: '0.5rem', width: 'fit-content', padding: '0.75rem 1.8rem' }}
                    >
                      Save & Sync Shiprocket Settings
                    </button>
                  </form>
                </div>

                {/* Right: What You Have To Do Guide */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={16} /> What You Need To Do (One-Time Setup)
                  </h4>

                  <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    <li>
                      <strong>Create / Log into Shiprocket:</strong><br />
                      Visit <a href="https://app.shiprocket.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>app.shiprocket.in</a> and sign in with your business mobile or email.
                    </li>
                    <li>
                      <strong>Create API Credentials:</strong><br />
                      In your Shiprocket dashboard, open <em>Settings &rarr; API &rarr; Configure API Users</em>. Click <strong>"Add New API User"</strong> and set an email and password.
                    </li>
                    <li>
                      <strong>Register Pickup Address:</strong><br />
                      Go to <em>Settings &rarr; Company &rarr; Pickup Address</em> and confirm your dispatch warehouse (e.g. Bandra West, Mumbai 400050).
                    </li>
                    <li>
                      <strong>Recharge Shipping Wallet:</strong><br />
                      Shiprocket requires minimum ₹200 wallet balance to generate real-time Blue Dart / Delhivery courier labels.
                    </li>
                    <li>
                      <strong>Enter Credentials:</strong><br />
                      Save the API email & password in the form on the left or in <code style={{ color: 'var(--accent-gold-light)' }}>.env</code> (<code style={{ color: '#fff' }}>VITE_SHIPROCKET_EMAIL</code>).
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* 2. Interactive Pan-India Courier Serviceability & Rate Calculator */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="#38bdf8" /> Live Pincode Serviceability & Courier Rate Engine
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Test any Indian pincode to preview available Shiprocket couriers, expected delivery turnaround, and shipping cost from Mumbai Hub ({srPickupPin}).
              </p>

              <form onSubmit={handleRunServiceabilityCheck} style={{ display: 'flex', gap: '0.75rem', maxWidth: '500px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="form-input"
                  value={calcPincode}
                  onChange={e => setCalcPincode(e.target.value)}
                  placeholder="Enter 6-digit delivery PIN (e.g. 110001)"
                  maxLength={6}
                  style={{ flex: 1, minWidth: '220px' }}
                />
                <button
                  type="submit"
                  className="btn-gold btn-sm"
                  disabled={isCalculatingRate}
                  style={{ padding: '0.65rem 1.4rem', whiteSpace: 'nowrap' }}
                >
                  {isCalculatingRate ? 'Calculating...' : 'Check Rates'}
                </button>
              </form>

              {calcResult && (
                <div style={{ background: '#090d16', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <span className="badge-green" style={{ marginBottom: '0.35rem' }}>✓ Serviceable Destination</span>
                      <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#fff' }}>
                        Route: Mumbai Hub ({calcResult.pickupPincode}) &rarr; PIN {calcResult.deliveryPincode} ({calcResult.region || 'Domestic Metro'})
                      </h4>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Available Courier Partners: <strong>{calcResult.couriers?.length || 0}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {calcResult.couriers?.map((courier, cIdx) => (
                      <div key={cIdx} className="glass-card" style={{ padding: '1.25rem', border: cIdx === 0 ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{courier.name}</span>
                          {courier.badge && (
                            <span className="badge-gold" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>{courier.badge}</span>
                          )}
                        </div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold-light)', margin: '0.4rem 0' }}>
                          ₹{courier.rate} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ 1.5kg</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ETA: <strong>{courier.estimatedDays} Days</strong> • Mode: {courier.mode}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6ee7b7', marginTop: '0.2rem' }}>
                          ✓ COD Verified • Courier Rating: ★ {courier.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Shiprocket Dispatch Consignments Table */}
            <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Active Shiprocket Consignments & Barcode Labels</h3>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Order ID</th>
                    <th style={{ padding: '0.75rem' }}>Customer / Destination</th>
                    <th style={{ padding: '0.75rem' }}>Assigned Courier</th>
                    <th style={{ padding: '0.75rem' }}>Shiprocket AWB</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                        {order.id}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{order.customer.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customer.address}</div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 600, color: '#38bdf8' }}>
                          {order.shiprocketCourier || 'Blue Dart Air Express (Shiprocket)'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                          Origin: Mumbai Hub (400050)
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {order.shiprocketAwb ? (
                          <code style={{ background: '#090d16', border: '1px solid #38bdf8', padding: '3px 8px', borderRadius: '4px', color: '#7dd3fc', fontSize: '0.82rem' }}>
                            {order.shiprocketAwb}
                          </code>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={order.orderStatus === 'Delivered' ? 'badge-green' : 'badge-gold'}>
                          {order.shiprocketStatus || order.orderStatus}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handlePrintLabel(order)}
                            className="btn-outline btn-sm"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                            title="Print official barcode shipping label"
                          >
                            <Printer size={13} /> Print Label
                          </button>
                          {order.shiprocketAwb && (
                            <a
                              href={order.shiprocketTrackingUrl || `https://shiprocket.co/tracking/${order.shiprocketAwb}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-gold btn-sm"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              <ExternalLink size={13} /> Track
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Modal: Admin Email Preview */}
        {selectedEmailPreview && (
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
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--accent-gold-light)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={18} /> Official Dispatched Email
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    From: <strong>{selectedEmailPreview.from}</strong> • To: <strong>{selectedEmailPreview.to}</strong>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmailPreview(null)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f8fafc' }}>
                <iframe
                  title="Sent Email Content"
                  srcDoc={selectedEmailPreview.html}
                  style={{ width: '100%', minHeight: '480px', border: 'none', background: '#ffffff' }}
                />
              </div>

              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setSelectedEmailPreview(null)}
                  className="btn-gold btn-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
