import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit3, Package, Gift, Droplets, Wrench, X, Save, Search, Upload, Image as ImageIcon, CheckCircle2, AlertCircle, UploadCloud, Database } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

const Products = () => {
  const {
    gifts, water, appliances,
    addProduct, updateProduct, deleteProduct,
    cloudConnected, pushAllToCloud
  } = useAdminData();
  const [activeVertical, setActiveVertical] = useState('gifts');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({ name: '', price: '', originalPrice: '', category: '', stock: '', image: '', sku: '' });
  const [imageFileName, setImageFileName] = useState('');
  const [imageError, setImageError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
    setImageFileName('');
    setImageError('');
    setIsCompressing(false);
    setDragActive(false);
    setShowAddForm(false);
    setEditingId(null);
  };

  // Process and compress image from user's system
  const processImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 900;
          let width = img.width;
          let height = img.height;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => reject(new Error('Invalid image file'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    setImageError('');
    setIsCompressing(true);
    try {
      const compressedDataUrl = await processImageFile(file);
      setForm(prev => ({ ...prev, image: compressedDataUrl }));
      setImageFileName(file.name);
    } catch (err) {
      console.error(err);
      setImageError('Failed to process image. Please try another image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
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
    setImageFileName(product.image ? 'Current Image' : '');
    setImageError('');
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
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {cloudConnected ? (
            <button onClick={pushAllToCloud} className="btn-outline" style={{ gap: '0.4rem', fontSize: '0.85rem' }}>
              <UploadCloud size={16} /> Sync All to Website
            </button>
          ) : (
            <Link to="/settings" style={{ textDecoration: 'none' }}>
              <span className="badge badge-gold" style={{ padding: '0.45rem 0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Database size={13} /> Cloud Sync: Setup in Settings
              </span>
            </Link>
          )}
          <button onClick={() => { resetForm(); setShowAddForm(true); }} className="btn-primary">
            <Plus size={16} /> Add Product
          </button>
        </div>
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
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ImageIcon size={15} color="#34d399" /> Product Image (Upload from Computer)
                </span>
                {form.image && (
                  <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={13} /> Image Ready
                  </span>
                )}
              </label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg,image/svg+xml"
                style={{ display: 'none' }}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {form.image ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={form.image}
                      alt="Product preview"
                      style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'cover',
                        border: '2px solid rgba(16, 185, 129, 0.5)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {imageFileName || 'Selected Product Image'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Loaded from your device &amp; optimized for catalog display
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                      >
                        <Upload size={13} /> Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setForm(prev => ({ ...prev, image: '' }));
                          setImageFileName('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="btn-danger btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragActive ? '#34d399' : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.75rem 1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: dragActive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Upload size={20} />
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                      {isCompressing ? 'Processing Image...' : 'Click to upload or drag & drop from your system'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Supports PNG, JPG, JPEG, WEBP from your local computer
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    style={{
                      marginTop: '0.25rem',
                      borderColor: 'rgba(16, 185, 129, 0.4)',
                      color: '#6ee7b7',
                      pointerEvents: 'none'
                    }}
                  >
                    Browse Files
                  </button>
                </div>
              )}

              {imageError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  <AlertCircle size={14} />
                  <span>{imageError}</span>
                </div>
              )}
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
