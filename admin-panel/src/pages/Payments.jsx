import { CreditCard, ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

const Payments = () => {
  const { payments, refundPayment } = useAdminData();

  const totalCaptured = payments.filter(p => p.status === 'Captured').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'Refunded').reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Payment Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Track Razorpay transactions, COD collections, and refunds</p>
      </div>

      {/* Payment Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="kpi-card" style={{ borderLeft: '3px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ArrowDown size={18} color="#10b981" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Captured / Received</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6ee7b7' }}>₹{totalCaptured.toLocaleString()}</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '3px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <CreditCard size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Pending (COD)</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>₹{totalPending.toLocaleString()}</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '3px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ArrowUp size={18} color="#ef4444" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Refunded</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fca5a5' }}>₹{totalRefunded.toLocaleString()}</div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent-emerald-light)' }}>{pay.id}</td>
                  <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{pay.orderId}</td>
                  <td style={{ fontSize: '0.85rem' }}>{pay.customerName}</td>
                  <td style={{ fontWeight: 700, fontSize: '0.9rem' }}>₹{pay.amount.toLocaleString()}</td>
                  <td><span className="badge badge-blue">{pay.method}</span></td>
                  <td>
                    <span className={`badge ${
                      pay.status === 'Captured' ? 'badge-green' :
                      pay.status === 'Refunded' ? 'badge-red' :
                      'badge-gold'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{pay.date}</td>
                  <td>
                    {pay.status === 'Captured' && (
                      <button
                        onClick={() => refundPayment(pay.id)}
                        className="btn-danger btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <RefreshCw size={12} /> Refund
                      </button>
                    )}
                    {pay.status === 'Refunded' && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Refunded</span>
                    )}
                    {pay.status === 'Pending' && (
                      <span style={{ fontSize: '0.78rem', color: '#fbbf24' }}>Awaiting COD</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
