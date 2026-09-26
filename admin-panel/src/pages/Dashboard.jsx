import {
  DollarSign, ShoppingCart, Package, AlertTriangle, Users, LifeBuoy,
  TrendingUp, Clock, ArrowUpRight, MessageSquare, Droplets
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';

const Dashboard = () => {
  const { getKPIs, orders, queries, tickets } = useAdminData();
  const kpis = getKPIs();

  const recentOrders = orders.slice(0, 5);
  const recentQueries = queries.filter(q => q.status === 'Pending').slice(0, 3);

  const kpiCards = [
    { label: 'Total Revenue', value: `₹${kpis.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#10b981', sub: 'From paid orders' },
    { label: 'Pending Orders', value: kpis.pendingOrders, icon: ShoppingCart, color: '#f59e0b', sub: 'Awaiting dispatch' },
    { label: 'Total Products', value: kpis.totalProducts, icon: Package, color: '#3b82f6', sub: `${kpis.outOfStock} out of stock` },
    { label: 'Open Tickets', value: kpis.openTickets, icon: LifeBuoy, color: '#ef4444', sub: '15-min SLA target' },
    { label: 'Pending Queries', value: kpis.pendingQueries, icon: MessageSquare, color: '#8b5cf6', sub: 'Awaiting response' },
    { label: 'Active Subscriptions', value: kpis.activeSubscriptions, icon: Droplets, color: '#06b6d4', sub: 'Water delivery routes' },
    { label: 'Pending Payments', value: kpis.pendingPayments, icon: Clock, color: '#f97316', sub: 'COD awaiting collection' },
    { label: 'Out of Stock', value: kpis.outOfStock, icon: AlertTriangle, color: kpis.outOfStock > 0 ? '#ef4444' : '#10b981', sub: kpis.outOfStock > 0 ? 'Needs restocking' : 'All products stocked' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.3rem' }}>Operations Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time overview of Shree Pratham's business metrics and operational status.
        </p>
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
            <Link to="/orders" className="btn-outline btn-sm">View All</Link>
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
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, color: 'var(--accent-emerald-light)', fontSize: '0.82rem' }}>{order.id}</td>
                    <td style={{ fontSize: '0.85rem' }}>{order.customer.name}</td>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>₹{order.totalAmount.toLocaleString()}</td>
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

        {/* Pending Queries */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Pending Queries</h3>
            <Link to="/queries" className="btn-outline btn-sm">View All</Link>
          </div>
          {recentQueries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <MessageSquare size={32} color="var(--accent-emerald)" style={{ margin: '0 auto 0.75rem' }} />
              <p>All queries have been addressed! 🎉</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentQueries.map(q => (
                <div key={q.id} style={{
                  padding: '1rem', borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{q.name}</span>
                    <span className="badge badge-purple">{q.vertical}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    {q.message.slice(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    <span>{q.date}</span>
                    <span>{q.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
