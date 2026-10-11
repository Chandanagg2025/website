import { useState } from 'react';
import { Truck, Search, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

const STATUS_OPTIONS = ['Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'];

const Orders = () => {
  const { orders, updateOrderStatus } = useAdminData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const filtered = orders.filter(o => {
    const custName = o.customer?.name || o.customerName || '';
    const custEmail = o.customer?.email || o.email || '';
    const matchesSearch = (o.id || '').toLowerCase().includes(search.toLowerCase()) ||
      custName.toLowerCase().includes(search.toLowerCase()) ||
      custEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Order Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Track, update status, and manage dispatch for all storefront orders</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '350px' }}>
          <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input className="form-input" placeholder="Search by order ID, customer..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
        </div>
        <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ width: 'auto', minWidth: '160px' }}>
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No orders found matching your filters.
          </div>
        ) : filtered.map(order => {
          const custName = order.customer?.name || order.customerName || 'Customer';
          const custEmail = order.customer?.email || order.email || '';
          const custPhone = order.customer?.phone || order.phone || '';
          const custAddress = order.customer?.address || order.address || 'Address provided on checkout';

          return (
            <div key={order.id} className="glass-card" style={{ overflow: 'hidden' }}>
              {/* Order Header */}
              <div
                style={{
                  padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: '0.75rem'
                }}
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--accent-emerald-light)', fontSize: '0.9rem' }}>{order.id}</span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{order.date}</div>
                  </div>
                  <div style={{ fontSize: '0.88rem' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{custName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{custEmail}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-gold-light)' }}>
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </div>
                    <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-green' : 'badge-gold'}`}>{order.paymentStatus}</span>
                  </div>
                  <span className={`badge ${
                    order.orderStatus === 'Delivered' ? 'badge-green' :
                    order.orderStatus === 'Dispatched' ? 'badge-blue' :
                    order.orderStatus === 'Cancelled' ? 'badge-red' :
                    'badge-gold'
                  }`}>
                    {order.orderStatus}
                  </span>
                  <ChevronDown size={16} color="var(--text-subtle)" style={{ transform: expandedOrder === order.id ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }} />
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))', gap: '1.25rem' }}>
                    {/* Items */}
                    <div>
                      <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>ORDER ITEMS</h4>
                      {(order.items || []).map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.3rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                          <span>{item.name} × {item.qty || item.quantity || 1}</span>
                          <span style={{ fontWeight: 600 }}>₹{((item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString()}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--accent-emerald-light)' }}>
                        <span>Total Paid</span>
                        <span>₹{(order.totalAmount || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Customer & Shipping Details */}
                    <div>
                      <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>DELIVERY & CONTACT</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                        <div><strong>Contact:</strong> {custPhone}</div>
                        <div><strong>Address:</strong> {custAddress}</div>
                        <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
                        {order.shiprocketAwb && (
                          <div style={{ marginTop: '0.4rem', color: 'var(--accent-emerald-light)' }}>
                            <strong>AWB:</strong> {order.shiprocketAwb} ({order.shiprocketCourier})
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Update Status Control */}
                    <div>
                      <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>UPDATE ORDER STATUS</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {STATUS_OPTIONS.map(status => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: order.orderStatus === status ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                              border: `1px solid ${order.orderStatus === status ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
                              color: order.orderStatus === status ? '#6ee7b7' : 'var(--text-muted)',
                              cursor: 'pointer'
                            }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
