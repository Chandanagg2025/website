import { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Trash2, Edit3, Gift, Droplets, Wrench, X, Save, Search,
  Upload, Image as ImageIcon, CheckCircle2, AlertCircle, UploadCloud,
  Database, ExternalLink, LayoutGrid, List, Minus
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

const PRESET_IMAGES = {
  gifts: [
    { label: 'Gold Hamper', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop' },
    { label: 'Wedding Box', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop' },
    { label: 'Celebration Set', url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=800&auto=format&fit=crop' },
    { label: 'Brass Collection', url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=800&auto=format&fit=crop' },
    { label: 'Chocolates Chest', url: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?q=80&w=800&auto=format&fit=crop' }
  ],
  water: [
    { label: '20L Mineral Jar', url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=800&auto=format&fit=crop' },
    { label: 'Water Dispenser', url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop' },
    { label: 'Bottled Pack 500ml', url: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?q=80&w=800&auto=format&fit=crop' },
    { label: '1L Mineral Bottles', url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=800&auto=format&fit=crop' },
    { label: 'Commercial RO Plant', url: 'https://images.unsplash.com/photo-1584771145729-0bd9fda6529b?q=80&w=800&auto=format&fit=crop' }
  ],
  appliances: [
    { label: 'Commercial Deep Freezer', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800&auto=format&fit=crop' },
    { label: 'Glass Display Chiller', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=800&auto=format&fit=crop' },
    { label: '4-Burner Gas Range', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop' },
    { label: 'Spiral Dough Mixer', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop' }
  ]
};

const DEFAULT_FORM = {
  name: '',
  price: '',
  originalPrice: '',
  category: '',
  stock: '25',
  image: '',
  sku: '',
  description: '',
  // Vertical specific
  isCustomizable: true,
  tags: 'Best Seller',
  type: 'Jar',
  deposit: '150',
  purity: 'TDS 90-120 PPM • pH 8.2 Alkaline',
  subscriptionEligible: true,
  capacity: '500 Litres',
  tempRange: '-18°C to -26°C',
  power: '280 Watts • 230V / 50Hz',
  material: 'Food Grade SS 304',
  warranty: '2 Years Comprehensive Commercial Warranty',
  energyRating: '5 Star Commercial Inverter'
};

const Products = () => {
  const {
    gifts, water, appliances,
    addProduct, updateProduct, deleteProduct, updateStock, toggleProductStockStatus,
    cloudConnected, pushAllToCloud
  } = useAdminData();

  const [activeVertical, setActiveVertical] = useState('gifts');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const [form, setForm] = useState(DEFAULT_FORM);
  const [imageFileName, setImageFileName] = useState('');
  const [imageError, setImageError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const verticals = [
    { id: 'gifts', name: 'Gift Gallery', icon: Gift, data: gifts, path: '/gifts', accent: '#f59e0b' },
    { id: 'water', name: 'Drinking Water', icon: Droplets, data: water, path: '/water', accent: '#38bdf8' },
    { id: 'appliances', name: 'Industrial Appliances', icon: Wrench, data: appliances, path: '/appliances', accent: '#818cf8' },
  ];

  const getStorefrontLink = (path) => {
    if (typeof window !== 'undefined' && window.location.port === '5174') {
      return `http://localhost:5173${path}`;
    }
    return path;
  };

  const current = verticals.find(v => v.id === activeVertical);

  // Extract unique categories for current vertical
  const availableCategories = useMemo(() => {
    const cats = new Set(current.data.map(p => p.category || p.type).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [current]);

  // Filtered products list
  const filtered = useMemo(() => {
    return current.data.filter(p => {
      const matchSearch =
        (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.type || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.sku || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(search.toLowerCase());

      const itemCat = p.category || p.type || '';
      const matchCat = categoryFilter === 'All' || itemCat.toLowerCase() === categoryFilter.toLowerCase();

      let matchStock = true;
      const stockNum = p.stock !== undefined ? p.stock : (p.inStock ? 20 : 0);
      if (stockFilter === 'in') matchStock = p.inStock && stockNum > 0;
      else if (stockFilter === 'low') matchStock = p.inStock && stockNum > 0 && stockNum <= 10;
      else if (stockFilter === 'out') matchStock = !p.inStock || stockNum === 0;

      return matchSearch && matchCat && matchStock;
    });
  }, [current, search, categoryFilter, stockFilter]);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setImageFileName('');
    setImageError('');
    setIsCompressing(false);
    setDragActive(false);
    setShowAddForm(false);
    setEditingId(null);
  };

  // Image processing & canvas compression
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
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
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

    const parsedPrice = parseFloat(form.price);
    const parsedOriginal = parseFloat(form.originalPrice || (parsedPrice * 1.25).toFixed(0));
    const parsedStock = parseInt(form.stock || '25', 10);
    const defaultImg = PRESET_IMAGES[activeVertical][0].url;

    let payload = {
      name: form.name.trim(),
      price: parsedPrice,
      originalPrice: parsedOriginal,
      stock: parsedStock,
      inStock: parsedStock > 0,
      image: form.image || defaultImg,
      sku: form.sku || `SP-${activeVertical.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      rating: 4.9,
      reviews: Math.floor(20 + Math.random() * 80)
    };

    if (activeVertical === 'gifts') {
      payload = {
        ...payload,
        category: form.category || 'Corporate',
        description: form.description || 'Bespoke luxury gift set handcrafted with premium materials and signature packaging.',
        isCustomizable: Boolean(form.isCustomizable),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : ['Best Seller'],
        personalizationOptions: ['Name Engraving', 'Custom Note']
      };
    } else if (activeVertical === 'water') {
      const wType = form.type || form.category || 'Jar';
      payload = {
        ...payload,
        type: wType,
        category: wType,
        deposit: parseInt(form.deposit || '150', 10),
        description: form.description || 'Pure alkaline mineral water micro-filtered and sterilized for optimal hydration.',
        purity: form.purity || 'TDS 90-120 PPM • pH 8.2 Alkaline',
        subscriptionEligible: Boolean(form.subscriptionEligible)
      };
    } else if (activeVertical === 'appliances') {
      payload = {
        ...payload,
        category: form.category || 'Refrigeration',
        description: form.description || 'Commercial heavy-duty equipment built for continuous industrial and food operations.',
        specs: {
          capacity: form.capacity || '500 Litres',
          tempRange: form.tempRange || '-18°C to -26°C',
          power: form.power || '280 Watts • 230V / 50Hz',
          material: form.material || 'Food Grade SS 304',
          warranty: form.warranty || '2 Years Comprehensive Warranty',
          energyRating: form.energyRating || '5 Star Commercial Inverter'
        }
      };
    }

    addProduct(activeVertical, payload);
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      price: String(product.price || ''),
      originalPrice: String(product.originalPrice || ''),
      category: product.category || product.type || '',
      stock: String(product.stock !== undefined ? product.stock : 25),
      image: product.image || '',
      sku: product.sku || '',
      description: product.description || '',
      isCustomizable: product.isCustomizable ?? true,
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || 'Best Seller'),
      type: product.type || product.category || 'Jar',
      deposit: String(product.deposit || 150),
      purity: product.purity || 'TDS 90-120 PPM • pH 8.2 Alkaline',
      subscriptionEligible: product.subscriptionEligible ?? true,
      capacity: product.specs?.capacity || '500 Litres',
      tempRange: product.specs?.tempRange || '-18°C to -26°C',
      power: product.specs?.power || '280 Watts • 230V / 50Hz',
      material: product.specs?.material || 'Food Grade SS 304',
      warranty: product.specs?.warranty || '2 Years Comprehensive Commercial Warranty',
      energyRating: product.specs?.energyRating || '5 Star Commercial Inverter'
    });
    setImageFileName(product.image ? 'Existing Image Loaded' : '');
    setImageError('');
    setShowAddForm(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    const parsedPrice = parseFloat(form.price);
    const parsedOriginal = parseFloat(form.originalPrice || (parsedPrice * 1.25).toFixed(0));
    const parsedStock = parseInt(form.stock || '0', 10);

    let updates = {
      name: form.name.trim(),
      price: parsedPrice,
      originalPrice: parsedOriginal,
      stock: parsedStock,
      inStock: parsedStock > 0,
      image: form.image,
      sku: form.sku,
      description: form.description
    };

    if (activeVertical === 'gifts') {
      updates = {
        ...updates,
        category: form.category || 'Corporate',
        isCustomizable: Boolean(form.isCustomizable),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : ['Best Seller']
      };
    } else if (activeVertical === 'water') {
      const wType = form.type || form.category || 'Jar';
      updates = {
        ...updates,
        type: wType,
        category: wType,
        deposit: parseInt(form.deposit || '150', 10),
        purity: form.purity,
        subscriptionEligible: Boolean(form.subscriptionEligible)
      };
    } else if (activeVertical === 'appliances') {
      updates = {
        ...updates,
        category: form.category || 'Refrigeration',
        specs: {
          capacity: form.capacity,
          tempRange: form.tempRange,
          power: form.power,
          material: form.material,
          warranty: form.warranty,
          energyRating: form.energyRating
        }
      };
    }

    updateProduct(activeVertical, editingId, updates);
    resetForm();
  };

  return (
    <div>
      {/* Top Banner / Breadcrumb & Status */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Product Catalog Management</h1>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="status-dot" style={{ background: '#10b981', margin: 0 }} /> Live Storefront Linked
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            Manage and publish inventory across Shree Pratham's 3 retail verticals. Updates reflect immediately on the website storefront.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Quick link to live customer storefront */}
          <Link
            to={getStorefrontLink(current.path)}
            target="_blank"
            className="btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
            title="Open customer storefront page in new tab"
          >
            <ExternalLink size={14} /> View Storefront ↗
          </Link>

          {/* Cloud Sync Status / Button */}
          {cloudConnected ? (
            <button onClick={pushAllToCloud} className="btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <UploadCloud size={15} color="#34d399" /> Sync to Cloud
            </button>
          ) : (
            <Link to="settings" style={{ textDecoration: 'none' }}>
              <span className="badge badge-gold" style={{ padding: '0.45rem 0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Database size={13} /> Cloud Sync: Setup in Settings
              </span>
            </Link>
          )}

          {/* Add Product CTA */}
          <button
            onClick={() => { resetForm(); setShowAddForm(true); }}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={17} /> Add Product
          </button>
        </div>
      </div>

      {/* Vertical Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.75rem'
      }}>
        {verticals.map(v => {
          const Icon = v.icon;
          const isActive = activeVertical === v.id;
          return (
            <button
              key={v.id}
              onClick={() => {
                setActiveVertical(v.id);
                setSearch('');
                setCategoryFilter('All');
                setStockFilter('All');
                setShowAddForm(false);
              }}
              style={{
                padding: '0.65rem 1.35rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 700,
                background: isActive ? `${v.accent}20` : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${isActive ? v.accent : 'var(--border-subtle)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                boxShadow: isActive ? `0 0 15px ${v.accent}30` : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} color={isActive ? v.accent : 'currentColor'} />
              <span>{v.name}</span>
              <span style={{
                background: isActive ? v.accent : 'rgba(255,255,255,0.1)',
                color: isActive ? '#080c14' : 'var(--text-muted)',
                borderRadius: '9999px',
                padding: '0.1rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {v.data.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
            <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="form-input"
              placeholder={`Search ${current.name}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Category Filter */}
          <select
            className="form-input"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            className="form-input"
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="All">All Stock Levels</option>
            <option value="in">In Stock Only</option>
            <option value="low">Low Stock (≤10)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* View Switcher & Result Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
            Showing <strong>{filtered.length}</strong> of {current.data.length} products
          </span>

          <div style={{ display: 'flex', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '0.45rem 0.75rem',
                background: viewMode === 'table' ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: viewMode === 'table' ? '#6ee7b7' : 'var(--text-muted)'
              }}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.45rem 0.75rem',
                background: viewMode === 'grid' ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: viewMode === 'grid' ? '#6ee7b7' : 'var(--text-muted)'
              }}
              title="Card Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal Form */}
      {showAddForm && (
        <div className="glass-card" style={{
          padding: '1.75rem',
          marginBottom: '2rem',
          border: '1px solid var(--border-emerald)',
          boxShadow: '0 10px 35px rgba(0,0,0,0.6), 0 0 25px rgba(16, 185, 129, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {editingId ? <Edit3 size={16} color="#34d399" /> : <Plus size={18} color="#34d399" />}
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                {editingId ? `Edit Product in ${current.name}` : `Add New Product to ${current.name}`}
              </h3>
            </div>
            <button onClick={resetForm} style={{ background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
          </div>

          <form onSubmit={editingId ? handleUpdate : handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              {/* Product Name */}
              <div style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Product / Equipment Title *</label>
                <input
                  className="form-input"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder={`e.g. ${activeVertical === 'gifts' ? 'Executive Gold Crest Gift Set' : activeVertical === 'water' ? '20L Alkaline Mineral Bubble Jar' : 'Commercial Deep Freezer 500L'}`}
                />
              </div>

              {/* Selling Price */}
              <div>
                <label className="form-label">Store Selling Price (₹) *</label>
                <input
                  className="form-input"
                  type="number"
                  required
                  min="1"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="1899"
                />
              </div>

              {/* Original MRP */}
              <div>
                <label className="form-label">Original / Strikethrough Price (₹)</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={form.originalPrice}
                  onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                  placeholder="2499"
                />
              </div>

              {/* Category / Type based on vertical */}
              {activeVertical === 'gifts' && (
                <div>
                  <label className="form-label">Gifting Category</label>
                  <select
                    className="form-input"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Corporate">Corporate</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Festive">Festive</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              )}

              {activeVertical === 'water' && (
                <>
                  <div>
                    <label className="form-label">Water Supply Category / Type</label>
                    <select
                      className="form-input"
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value, category: e.target.value })}
                    >
                      <option value="Jar">20L Jar</option>
                      <option value="Bottled">Packaged Bottles Case</option>
                      <option value="RO Purified">Industrial RO Plant</option>
                      <option value="Dispenser">Dispenser / Cooler</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Bottle Deposit (₹ refundable)</label>
                    <input
                      className="form-input"
                      type="number"
                      value={form.deposit}
                      onChange={e => setForm({ ...form, deposit: e.target.value })}
                      placeholder="150"
                    />
                  </div>
                  <div>
                    <label className="form-label">Purity / Mineral Spec</label>
                    <input
                      className="form-input"
                      value={form.purity}
                      onChange={e => setForm({ ...form, purity: e.target.value })}
                      placeholder="TDS 90-120 PPM • pH 8.2 Alkaline"
                    />
                  </div>
                </>
              )}

              {activeVertical === 'appliances' && (
                <>
                  <div>
                    <label className="form-label">Equipment Category</label>
                    <select
                      className="form-input"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="Refrigeration">Commercial Refrigeration</option>
                      <option value="Cooking">Cooking & Ranges</option>
                      <option value="Processing">Food Processing</option>
                      <option value="Display">Display Chillers</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Capacity Spec</label>
                    <input
                      className="form-input"
                      value={form.capacity}
                      onChange={e => setForm({ ...form, capacity: e.target.value })}
                      placeholder="550 Litres / 30 KG"
                    />
                  </div>
                  <div>
                    <label className="form-label">Operating Temp / Range</label>
                    <input
                      className="form-input"
                      value={form.tempRange}
                      onChange={e => setForm({ ...form, tempRange: e.target.value })}
                      placeholder="-18°C to -26°C Rapid Freeze"
                    />
                  </div>
                  <div>
                    <label className="form-label">Power Spec</label>
                    <input
                      className="form-input"
                      value={form.power}
                      onChange={e => setForm({ ...form, power: e.target.value })}
                      placeholder="280 Watts • 230V / 50Hz"
                    />
                  </div>
                  <div>
                    <label className="form-label">Construction Material</label>
                    <input
                      className="form-input"
                      value={form.material}
                      onChange={e => setForm({ ...form, material: e.target.value })}
                      placeholder="Food Grade SS 304 Inner Liner"
                    />
                  </div>
                  <div>
                    <label className="form-label">Warranty Spec</label>
                    <input
                      className="form-input"
                      value={form.warranty}
                      onChange={e => setForm({ ...form, warranty: e.target.value })}
                      placeholder="3 Years Comprehensive + 5 Yrs Compressor"
                    />
                  </div>
                </>
              )}

              {/* Stock Quantity */}
              <div>
                <label className="form-label">Initial Inventory Stock *</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                  placeholder="25"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="form-label">SKU / Item Identifier</label>
                <input
                  className="form-input"
                  value={form.sku}
                  onChange={e => setForm({ ...form, sku: e.target.value })}
                  placeholder={`SP-${activeVertical.slice(0,3).toUpperCase()}-001`}
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Product Description (Displayed to customers on website)</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Detailed description of features, materials, and benefits..."
              />
            </div>

            {/* Image Selector & Uploader Section */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ImageIcon size={16} color="#34d399" /> Product Media & Image
                </span>
                {form.image && (
                  <span style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={14} /> Image Attached
                  </span>
                )}
              </div>

              {/* Preset Image Options for Convenience */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Quick Preset Images:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {PRESET_IMAGES[activeVertical].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setForm(prev => ({ ...prev, image: preset.url }));
                        setImageFileName(preset.label);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: form.image === preset.url ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${form.image === preset.url ? '#10b981' : 'var(--border-subtle)'}`,
                        color: form.image === preset.url ? '#6ee7b7' : 'var(--text-muted)',
                        fontSize: '0.78rem'
                      }}
                    >
                      <img src={preset.url} alt="" style={{ width: '18px', height: '18px', borderRadius: '3px', objectFit: 'cover' }} />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0]);
                }}
              />

              {/* Upload Drag/Drop Zone or Preview */}
              {form.image ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  flexWrap: 'wrap'
                }}>
                  <img
                    src={form.image}
                    alt="Product preview"
                    style={{
                      width: '75px',
                      height: '75px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover',
                      border: '1px solid rgba(16, 185, 129, 0.5)'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff', marginBottom: '0.2rem' }}>
                      {imageFileName || 'Selected Product Image'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Optimized for fast rendering across all customer screens
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
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
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
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
                    border: `2px dashed ${dragActive ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.75rem 1rem',
                    textAlign: 'center',
                    background: dragActive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)', margin: '0 auto 0.75rem auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399'
                  }}>
                    <Upload size={20} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                    {isCompressing ? 'Compressing and optimizing...' : 'Click to upload or drag & drop image'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    PNG, JPG, WEBP from your local computer
                  </div>
                </div>
              )}

              {/* Direct Image URL input as fallback */}
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Or paste direct image URL:</span>
                <input
                  className="form-input"
                  style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}
                  value={form.image}
                  onChange={e => {
                    setForm({ ...form, image: e.target.value });
                    setImageFileName('Direct Image URL');
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              {imageError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  <AlertCircle size={14} /> <span>{imageError}</span>
                </div>
              )}
            </div>

            {/* Submit Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ minWidth: '160px' }}>
                <Save size={16} /> {editingId ? 'Update & Sync to Store' : 'Publish to Storefront'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Display (Table View) */}
      {viewMode === 'table' ? (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ minWidth: '260px' }}>Product</th>
                  <th>Category</th>
                  <th>Pricing</th>
                  <th style={{ minWidth: '140px' }}>Stock Control</th>
                  <th>Status</th>
                  <th>SKU</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                      <AlertCircle size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>No products found</div>
                      <div style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>Try clearing filters or add your first product above.</div>
                    </td>
                  </tr>
                ) : filtered.map(product => {
                  const currentStock = product.stock !== undefined ? product.stock : (product.inStock ? 25 : 0);
                  const discountPct = product.originalPrice && product.originalPrice > product.price
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : null;

                  return (
                    <tr key={product.id}>
                      {/* Product Thumbnail & Name */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={product.image}
                            alt=""
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid var(--border-subtle)',
                              flexShrink: 0
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{product.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {product.description || (product.purity || product.specs?.capacity || 'Ready for dispatch')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                          {product.category || product.type || 'General'}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-gold-light)' }}>
                          ₹{product.price.toLocaleString()}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem' }}>
                            <span style={{ color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                            {discountPct && <span style={{ color: '#10b981', fontWeight: 600 }}>{discountPct}% off</span>}
                          </div>
                        )}
                      </td>

                      {/* Inline Stock Control (+ / - / input) */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <button
                            onClick={() => updateStock(activeVertical, product.id, Math.max(0, currentStock - 1))}
                            className="btn-secondary"
                            style={{ padding: '0.2rem 0.45rem', fontSize: '0.8rem', borderRadius: '4px' }}
                            title="Decrease stock"
                          >
                            <Minus size={12} />
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={currentStock}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val >= 0) {
                                updateStock(activeVertical, product.id, val);
                              }
                            }}
                            style={{
                              width: '52px',
                              textAlign: 'center',
                              background: 'rgba(15,23,42,0.8)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '4px',
                              color: currentStock > 10 ? '#6ee7b7' : currentStock > 0 ? '#fbbf24' : '#fca5a5',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              padding: '0.2rem 0.1rem'
                            }}
                          />

                          <button
                            onClick={() => updateStock(activeVertical, product.id, currentStock + 1)}
                            className="btn-secondary"
                            style={{ padding: '0.2rem 0.45rem', fontSize: '0.8rem', borderRadius: '4px' }}
                            title="Increase stock"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>

                      {/* Clickable In-Stock / Out-of-Stock Switch */}
                      <td>
                        <button
                          onClick={() => toggleProductStockStatus(activeVertical, product.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0
                          }}
                          title="Click to toggle stock status"
                        >
                          <span className={`badge ${product.inStock ? 'badge-green' : 'badge-red'}`} style={{ cursor: 'pointer' }}>
                            <span className="status-dot" style={{ background: product.inStock ? '#10b981' : '#ef4444' }} />
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </button>
                      </td>

                      {/* SKU */}
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>
                        {product.sku || '-'}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleEdit(product)}
                            className="btn-secondary btn-sm"
                            style={{ padding: '0.4rem 0.6rem' }}
                            title="Edit Product"
                          >
                            <Edit3 size={14} color="#6ee7b7" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                deleteProduct(activeVertical, product.id);
                              }
                            }}
                            className="btn-danger btn-sm"
                            style={{ padding: '0.4rem 0.6rem' }}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Products Display (Grid Cards View) */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
          gap: '1.25rem'
        }}>
          {filtered.map(product => {
            const currentStock = product.stock !== undefined ? product.stock : (product.inStock ? 25 : 0);
            return (
              <div
                key={product.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                  border: product.inStock ? '1px solid var(--border-subtle)' : '1px solid rgba(239, 68, 68, 0.4)'
                }}
              >
                {/* Image Banner */}
                <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className="badge badge-gold" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    {product.category || product.type || 'General'}
                  </span>
                  <button
                    onClick={() => toggleProductStockStatus(activeVertical, product.id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    <span className={`badge ${product.inStock ? 'badge-green' : 'badge-red'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </button>
                </div>

                {/* Card Content */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#fff' }}>{product.name}</h3>
                  </div>

                  <p style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1
                  }}>
                    {product.description || (product.purity || product.specs?.capacity || 'Pan-India Delivery Available')}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Selling Price:</div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                        ₹{product.price.toLocaleString()}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Stock:</div>
                      <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: currentStock > 10 ? '#6ee7b7' : currentStock > 0 ? '#fbbf24' : '#fca5a5'
                      }}>
                        {currentStock} units
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn-secondary btn-sm"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${product.name}"?`)) {
                          deleteProduct(activeVertical, product.id);
                        }
                      }}
                      className="btn-danger btn-sm"
                      style={{ padding: '0.45rem 0.75rem' }}
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
