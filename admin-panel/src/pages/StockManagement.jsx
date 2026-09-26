import { useState } from 'react';
import { Package, AlertTriangle, CheckCircle2, Search, Save, Gift, Droplets, Wrench } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

const StockManagement = () => {
  const { gifts, water, appliances, updateStock } = useAdminData();
  const [activeVertical, setActiveVertical] = useState('gifts');
  const [search, setSearch] = useState('');
  const [editingStock, setEditingStock] = useState({});

  const verticals = [
    { id: 'gifts', name: 'Gift Gallery', icon: Gift, data: gifts },
    { id: 'water', name: 'Drinking Water', icon: Droplets, data: water },
    { id: 'appliances', name: 'Industrial Appliances', icon: Wrench, data: appliances },
  ];

  const current = verticals.find(v => v.id === activeVertical);
  const allProducts = current.data.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const inStockCount = allProducts.filter(p => p.inStock).length;
  const outOfStockCount = allProducts.filter(p => !p.inStock).length;
  const lowStockCount = allProducts.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;

  const handleStockChange = (id, value) => {
    setEditingStock(prev => ({ ...prev, [id]: value }));
  };

  const saveStock = (id) => {
    const val = parseInt(editingStock[id]);
    if (isNaN(val) || val < 0) return;
    updateStock(activeVertical, id, val);
    setEditingStock(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Stock Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Monitor and update inventory levels across all verticals</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="kpi-card" style={{ borderLeft: '3px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>In Stock</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6ee7b7' }}>{inStockCount}</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '3px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Low Stock (≤10)</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>{lowStockCount}</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '3px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <Package size={18} color="#ef4444" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Out of Stock</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fca5a5' }}>{outOfStockCount}</div>
        </div>
      </div>

      {/* Vertical Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {verticals.map(v => {
          const Icon = v.icon;
          return (
            <button key={v.id} onClick={() => setActiveVertical(v.id)}
              style={{
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem', fontWeight: 600,
                background: activeVertical === v.id ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                color: activeVertical === v.id ? '#6ee7b7' : 'var(--text-muted)',
                border: `1px solid ${activeVertical === v.id ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
                display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              <Icon size={14} /> {v.name}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '350px', marginBottom: '1rem' }}>
        <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input className="form-input" placeholder="Search products..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
      </div>

      {/* Stock Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map(product => {
                const stock = product.stock || 0;
                const isEditing = editingStock[product.id] !== undefined;
                return (
                  <tr key={product.id} style={{ background: stock === 0 ? 'rgba(239,68,68,0.04)' : stock <= 10 ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img src={product.image} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{product.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{product.sku || '-'}</td>
                    <td style={{ fontWeight: 700, fontSize: '1rem', color: stock === 0 ? '#fca5a5' : stock <= 10 ? '#fbbf24' : '#6ee7b7' }}>
                      {stock}
                    </td>
                    <td>
                      <span className={`badge ${stock === 0 ? 'badge-red' : stock <= 10 ? 'badge-gold' : 'badge-green'}`}>
                        {stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '80px', padding: '0.4rem 0.6rem', fontSize: '0.82rem' }}
                          value={isEditing ? editingStock[product.id] : stock}
                          onChange={e => handleStockChange(product.id, e.target.value)}
                          min="0"
                        />
                        {isEditing && (
                          <button onClick={() => saveStock(product.id)} className="btn-primary btn-sm" title="Save">
                            <Save size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
