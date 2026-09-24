import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Package, Droplets, FileText, LifeBuoy, Settings,
  LogOut, Send, Mail, RefreshCw, Truck, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

const Account = () => {
  const { user, logoutCustomer, isAdmin } = useAuth();
  const {
    orders,
    subscriptions,
    toggleSubscriptionPause,
    cancelSubscription,
    quotes,
    tickets,
    replyToTicket,
    resendOrderEmail
  } = useProducts();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  // Ticket reply state
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  if (!user) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Please Sign In to View Your Account</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Access your orders, water delivery schedules, appliance quotes, and IT tickets.
        </p>
        <Link to="/login" className="btn-gold">
          Go to Customer Sign In
        </Link>
      </div>
    );
  }

  const handleSendTicketReply = (ticketId) => {
    if (!replyMessage.trim()) return;
    replyToTicket(ticketId, replyMessage.trim(), `${user.name} (Customer)`);
    setReplyMessage('');
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem 0' }}>
      <div className="container">
        {/* Welcome Header */}
        <div className="glass-card" style={{
          padding: '2rem 2.5rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid var(--border-gold)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#080c14',
                fontSize: '1.8rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{user.name}</h1>
                  <span className="badge-gold">Verified Customer</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  {user.email} • {user.phone} • {user.company || 'Enterprise Account'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {isAdmin && (
                <Link to="/admin" className="btn-outline btn-sm" style={{ borderColor: '#6ee7b7', color: '#6ee7b7' }}>
                  Switch to Admin Console
                </Link>
              )}
              <button
                onClick={() => { logoutCustomer(); navigate('/'); }}
                className="btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Portal Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          marginBottom: '2.5rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'orders', name: 'Order History', icon: Package, count: orders.length },
            { id: 'water', name: 'Water Subscriptions', icon: Droplets, count: subscriptions.length },
            { id: 'quotes', name: 'Bulk Appliance Quotes', icon: FileText, count: quotes.length },
            { id: 'tickets', name: 'IT Support Tickets', icon: LifeBuoy, count: tickets.length },
            { id: 'profile', name: 'Profile & Addresses', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.4rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? 'var(--accent-gold-light)' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--accent-gold)' : '1px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                {tab.name}
                {tab.count !== undefined && (
                  <span style={{
                    background: isActive ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? '#080c14' : '#fff',
                    borderRadius: '9999px',
                    padding: '0.1rem 0.45rem',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT: 1. ORDERS */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Package size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1rem auto' }} />
                <h3>No Orders Yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Browse our collections to place your first order.</p>
                <Link to="/gifts" className="btn-gold">Shop Gift Gallery</Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="glass-card" style={{ padding: '2rem' }}>
                  {/* Order Top Bar */}
                  <div className="flex justify-between items-start" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                          {order.id}
                        </span>
                        <span className={order.orderStatus === 'Delivered' ? 'badge-green' : 'badge-gold'}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Placed on {order.date} • Paid via {order.paymentMethod}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>
                        Payment: {order.paymentStatus}
                      </div>
                    </div>
                  </div>

                  {/* Visual Status Stepper */}
                  <div style={{ marginBottom: '2rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--accent-gold-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Truck size={14} color="var(--accent-gold)" />
                        <span>FULFILLED BY SHIPROCKET • {order.shiprocketCourier || 'Blue Dart Express (Shiprocket)'}</span>
                      </div>
                      {order.shiprocketAwb && (
                        <a
                          href={order.shiprocketTrackingUrl || `https://shiprocket.co/tracking/${order.shiprocketAwb}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline btn-sm"
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(2, 132, 199, 0.15)', borderColor: '#0284c7', color: '#7dd3fc' }}
                          title="Track live shipment on official Shiprocket portal"
                        >
                          <span>Track AWB: {order.shiprocketAwb}</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                      {order.trackingSteps?.map((step, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: step.completed ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                              border: step.completed ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '10px'
                            }}>
                              {step.completed ? '✓' : ''}
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: step.completed ? 700 : 500, color: step.completed ? '#fff' : 'var(--text-subtle)' }}>
                              {step.title}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', paddingLeft: '22px' }}>
                            {step.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                        <div>
                          <strong style={{ color: '#fff' }}>{item.name}</strong> × {item.quantity}
                          {item.customization && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)' }}>
                              Engraving: "{item.customization.engravingText}"
                            </div>
                          )}
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address & email confirmation footer */}
                  <div style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div>
                      📍 <strong>Destination:</strong> {order.customer?.address || 'Standard Registered Address'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ color: '#6ee7b7', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Mail size={13} /> Invoice sent from <strong>sales@shreepratham.com</strong>
                      </span>
                      <button
                        onClick={() => resendOrderEmail(order.id)}
                        className="btn-outline btn-sm"
                        style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        title="Resend official tax invoice email to customer"
                      >
                        <RefreshCw size={11} /> Resend Email
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB CONTENT: 2. WATER SUBSCRIPTIONS */}
        {activeTab === 'water' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {subscriptions.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Droplets size={48} color="#38bdf8" style={{ margin: '0 auto 1rem auto' }} />
                <h3>No Active Water Subscriptions</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Set up a recurring morning jar delivery routine for home or office.
                </p>
                <Link to="/water" className="btn-gold" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#fff' }}>
                  Configure Water Routine
                </Link>
              </div>
            ) : (
              subscriptions.map(sub => (
                <div key={sub.id} className="glass-card" style={{ padding: '2rem' }}>
                  <div className="flex justify-between items-start" style={{ marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>{sub.id}</span>
                        <span className={sub.status === 'Active' ? 'badge-green' : 'badge-gold'}>
                          {sub.status}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', marginTop: '0.35rem', color: '#fff' }}>{sub.planName}</h3>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
                        ₹{sub.monthlyTotal.toLocaleString()}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>/mo</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    fontSize: '0.88rem'
                  }}>
                    <div>
                      <div style={{ color: 'var(--text-subtle)' }}>Routine Cadence:</div>
                      <strong style={{ color: '#fff' }}>{sub.frequency}</strong>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-subtle)' }}>Next Scheduled Drop:</div>
                      <strong style={{ color: '#6ee7b7' }}>{sub.nextDeliveryDate}</strong>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-subtle)' }}>Effective Rate:</div>
                      <strong style={{ color: '#fff' }}>₹{sub.ratePerJar} / jar</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    📍 Delivery Drop Address: <strong>{sub.address}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => toggleSubscriptionPause(sub.id)}
                      className="btn-outline btn-sm"
                    >
                      {sub.status === 'Active' ? 'Pause Routine (Vacation Mode)' : 'Resume Routine'}
                    </button>
                    <button
                      onClick={() => cancelSubscription(sub.id)}
                      className="btn-danger btn-sm"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB CONTENT: 3. BULK APPLIANCE QUOTES */}
        {activeTab === 'quotes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {quotes.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <FileText size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1rem auto' }} />
                <h3>No Bulk Quotes Requested</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Explore heavy kitchen equipment and request institutional bulk pricing.
                </p>
                <Link to="/appliances" className="btn-gold">Browse Industrial Appliances</Link>
              </div>
            ) : (
              quotes.map(quote => (
                <div key={quote.id} className="glass-card" style={{ padding: '2rem' }}>
                  <div className="flex justify-between items-start" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>{quote.id}</span>
                        <span className={quote.status === 'Quote Sent' ? 'badge-green' : 'badge-gold'}>
                          {quote.status}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', marginTop: '0.35rem', color: '#fff' }}>{quote.applianceName}</h3>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Requested: {quote.date}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    fontSize: '0.88rem'
                  }}>
                    <div>
                      <div style={{ color: 'var(--text-subtle)' }}>Requested Quantity:</div>
                      <strong style={{ color: '#fff' }}>{quote.quantity} Units</strong>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-subtle)' }}>Company / Entity:</div>
                      <strong style={{ color: '#fff' }}>{quote.company}</strong>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-subtle)' }}>Commercial Price Estimate:</div>
                      <strong style={{ color: 'var(--accent-gold-light)' }}>{quote.estimatedTotal}</strong>
                    </div>
                  </div>

                  {quote.adminNotes && (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      color: '#fef3c7'
                    }}>
                      💬 <strong>Engineering Sales Desk Note:</strong> {quote.adminNotes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB CONTENT: 4. IT SUPPORT TICKETS */}
        {activeTab === 'tickets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {tickets.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <LifeBuoy size={48} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
                <h3>No Support Tickets Found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Our NOC helpdesk is available 24/7 for cloud, website, and hardware support.
                </p>
                <Link to="/it-services" className="btn-gold" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
                  Open Helpdesk Ticket
                </Link>
              </div>
            ) : (
              tickets.map(ticket => (
                <div key={ticket.id} className="glass-card" style={{ padding: '2rem' }}>
                  <div className="flex justify-between items-start" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>#{ticket.id}</span>
                        <span className={ticket.status === 'Resolved' ? 'badge-green' : ticket.status === 'In Progress' ? 'badge-blue' : 'badge-gold'}>
                          {ticket.status}
                        </span>
                        <span className="badge-gold" style={{ fontSize: '0.72rem' }}>
                          Priority: {ticket.priority}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', marginTop: '0.4rem', color: '#fff' }}>{ticket.subject}</h3>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Category: {ticket.category} • Logged on {ticket.date}
                      </div>
                    </div>
                  </div>

                  {/* Ticket Replies Thread */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    {ticket.replies?.map((rep, rIdx) => (
                      <div key={rIdx} style={{
                        borderLeft: rep.sender.includes('Customer') ? '3px solid var(--accent-gold)' : '3px solid #10b981',
                        paddingLeft: '0.85rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                          <strong style={{ color: rep.sender.includes('Customer') ? 'var(--accent-gold-light)' : '#6ee7b7' }}>{rep.sender}</strong>
                          <span>{rep.time}</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#fff', margin: 0, lineHeight: 1.5 }}>
                          {rep.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Customer Quick Reply Box */}
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Type reply or additional error message..."
                      value={selectedTicketId === ticket.id ? replyMessage : ''}
                      onFocus={() => setSelectedTicketId(ticket.id)}
                      onChange={e => { setSelectedTicketId(ticket.id); setReplyMessage(e.target.value); }}
                    />
                    <button
                      className="btn-gold btn-sm"
                      onClick={() => handleSendTicketReply(ticket.id)}
                      style={{ padding: '0 1.25rem' }}
                    >
                      <Send size={15} /> Send
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB CONTENT: 5. PROFILE & ADDRESSES */}
        {activeTab === 'profile' && (
          <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '750px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--accent-gold)" /> Account & Corporate Profile
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" readOnly value={user.name} />
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-input" readOnly value={user.phone} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" readOnly value={user.email} />
              </div>
              <div>
                <label className="form-label">Company / Entity</label>
                <input type="text" className="form-input" readOnly value={user.company || 'Enterprise Customer'} />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Registered Delivery Headquarters</label>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.9rem'
              }}>
                {user.address ? `${user.address.line1}, ${user.address.line2 || ''}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}` : 'Standard Shipping Address on File'}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                Account ID: {user.id} • Registered Enterprise
              </span>
              <button
                onClick={() => { logoutCustomer(); navigate('/login'); }}
                className="btn-danger btn-sm"
              >
                Log Out of Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
