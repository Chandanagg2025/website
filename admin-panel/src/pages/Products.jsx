import { useState } from 'react';
import { Plus, Trash2, Edit3, Package, Gift, Droplets, Wrench, X, Save, Search } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

const Products = () => {
  const { gifts, water, appliances, addProduct, updateProduct, deleteProduct } = useAdminData();
  const [activeVertical, setActiveVertical] = useState('gifts');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({ name: '', price: '', originalPrice: '', category: '', stock: '', image: '', sku: '' });

  const verticals = [
    { id: 'gifts', name: 'Gift Gallery', icon: Gift, data: gifts },
    { id: 'water', name: 'Drinking Water', icon: Droplets, data: water },
    { id: 'appliances', name: 'Industrial Appliances', icon: Wrench, data: appliances },
  ];

  const current = verticals.find(v => v.id === activeVertical);
  const filtered = current.data.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ name: '', price: '', originalPrice: '', category: '', stock: '', image: '', sku: '' });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    addProduct(activeVertical, {
      name: form.name,
      price: parseFloat(form.price),
      originalPrice: parseFloat(form.originalPrice || form.price * 1.25),
      category: form.category || 'General',
      stock: parseInt(form.stock || '0'),
      image: form.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop',
      sku: form.sku || `SP-${Date.now().toString().slice(-6)}`,
      rating: 5.0, reviews: 0,
    });
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      originalPrice: String(product.originalPrice || ''),
      category: product.category || '',
      stock: String(product.stock || 0),
      image: product.image || '',
      sku: product.sku || '',
    });
    setShowAddForm(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    updateProduct(activeVertical, editingId, {
      name: form.name,
      price: parseFloat(form.price),
      originalPrice: parseFloat(form.originalPrice || form.price * 1.25),
      category: form.category,
      stock: parseInt(form.stock || '0'),
      image: form.image,
      sku: form.sku,
    });
    resetForm();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Product Catalog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Manage products across all verticals</p>
        </div>
        <button onClick={() => { resetForm(); setShowAddForm(true); }} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Vertical Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {verticals.map(v => {
          const Icon = v.icon;
          return (
            <button
              key={v.id}
              onClick={() => { setActiveVertical(v.id); setSearch(''); }}
              style={{
                padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem', fontWeight: 600,
                background: activeVertical === v.id ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                color: activeVertical === v.id ? '#6ee7b7' : 'var(--text-muted)',
                border: `1px solid ${activeVertical === v.id ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
                display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              <Icon size={15} /> {v.name} ({v.data.length})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '1.25rem' }}>
        <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          className="form-input"
          placeholder="Search by name, category, SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <button onClick={resetForm} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X size={18} /></button>
          </div>
          <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Product Name *</label>
              <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Executive Gift Set" />
            </div>
            <div>
              <label className="form-label">Selling Price (₹) *</label>
              <input className="form-input" type="number" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="1899" />
            </div>
            <div>
              <label className="form-label">Original / MRP (₹)</label>
              <input className="form-input" type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} placeholder="2499" />
            </div>
            <div>
              <label className="form-label">Category</label>
              <input className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Corporate, Wedding, etc." />
            </div>
            <div>
              <label className="form-label">Stock Quantity</label>
              <input className="form-input" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="50" />
            </div>
            <div>
              <label className="form-label">SKU</label>
              <input className="form-input" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="SP-GFT-001" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Image URL</label>
              <input className="form-input" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Save size={16} /> {editingId ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No products found</td></tr>
              ) : filtered.map(product => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={product.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{product.sku || '-'}</td>
                  <td><span className="badge badge-gold">{product.category}</span></td>
                  <td>
                    <div style={{ fontWeight: 700 }}>₹{product.price.toLocaleString()}</div>
                    {product.originalPrice && <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</div>}
                  </td>
                  <td style={{ fontWeight: 600, color: (product.stock || 0) > 0 ? '#6ee7b7' : '#fca5a5' }}>
                    {product.stock ?? 'N/A'}
                  </td>
                  <td>
                    <span className={`badge ${product.inStock ? 'badge-green' : 'badge-red'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => handleEdit(product)} className="btn-secondary btn-sm" title="Edit"><Edit3 size={14} /></button>
                      <button onClick={() => deleteProduct(activeVertical, product.id)} className="btn-danger btn-sm" title="Delete"><Trash2 size={14} /></button>
                    </div>
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

export default Products;
