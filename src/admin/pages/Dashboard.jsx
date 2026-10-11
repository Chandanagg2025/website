import {
  DollarSign, ShoppingCart, Package, AlertTriangle, LifeBuoy,
  ArrowUpRight, MessageSquare, Droplets, ExternalLink, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';

const Dashboard = () => {
  const { getKPIs, orders, queries } = useAdminData();
  const kpis = getKPIs();

  const recentOrders = orders.slice(0, 5);
  const recentQueries = queries.filter(q => q.status === 'Pending').slice(0, 3);

  const kpiCards = [
    { label: 'Total Revenue', value: `₹${kpis.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#10b981', sub: 'From captured orders' },
    { label: 'Pending Orders', value: kpis.pendingOrders, icon: ShoppingCart, color: '#f59e0b', sub: 'Awaiting dispatch' },
    { label: 'Total Products', value: kpis.totalProducts, icon: Package, color: '#3b82f6', sub: `${kpis.outOfStock} out of stock` },
    { label: 'Open Tickets', value: kpis.openTickets, icon: LifeBuoy, color: '#ef4444', sub: '15-min SLA target' },
    { label: 'Pending Queries', value: kpis.pendingQueries, icon: MessageSquare, color: '#8b5cf6', sub: 'Awaiting response' },
    { label: 'Active Subscriptions', value: kpis.activeSubscriptions, icon: Droplets, color: '#06b6d4', sub: 'Water delivery routes' },
    { label: 'Pending Payments', value: kpis.pendingPayments, icon: AlertTriangle, color: '#f97316', sub: 'COD awaiting collection' },
    { label: 'Out of Stock', value: kpis.outOfStock, icon: AlertTriangle, color: kpis.outOfStock > 0 ? '#ef4444' : '#10b981', sub: kpis.outOfStock > 0 ? 'Needs restocking' : 'All products stocked' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.3rem' }}>Operations Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Real-time overview of Shree Pratham's business metrics, catalog, and operations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Link to="products" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Package size={16} /> Manage Products
          </Link>
          <Link to="/" target="_blank" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ExternalLink size={15} /> Storefront ↗
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
        gap: '1rem', marginBottom: '2rem'
      }}>
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="kpi-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: `${kpi.color}15`, border: `1px solid ${kpi.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={20} color={kpi.color} />
                </div>
                <ArrowUpRight size={16} color="var(--text-subtle)" />
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600, marginTop: '0.3rem' }}>{kpi.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders + Pending Queries */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(450px, 100%), 1fr))',
        gap: '1.5rem'
      }}>
        {/* Recent Orders */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Orders</h3>
            <Link to="orders" className="btn-outline btn-sm">View All</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>No orders recorded</td></tr>
                ) : recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, color: 'var(--accent-emerald-light)', fontSize: '0.82rem' }}>{order.id}</td>
                    <td style={{ fontSize: '0.85rem' }}>{order.customer?.name || order.customerName || 'Customer'}</td>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>₹{(order.totalAmount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        order.orderStatus === 'Delivered' ? 'badge-green' :
                        order.orderStatus === 'Dispatched' ? 'badge-blue' :
                        order.orderStatus === 'Processing' ? 'badge-gold' :
                        'badge-purple'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Inquiries */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Pending Customer Queries</h3>
            <Link to="queries" className="btn-outline btn-sm">View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentQueries.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                All customer inquiries resolved!
              </div>
            ) : recentQueries.map(q => (
              <div key={q.id} style={{
                padding: '1rem', borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>{q.name}</span>
                  <span className="badge badge-gold">{q.vertical}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                  {q.message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                  <span>{q.phone} • {q.email}</span>
                  <Link to="queries" style={{ color: 'var(--accent-emerald-light)', fontWeight: 600 }}>Respond →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
