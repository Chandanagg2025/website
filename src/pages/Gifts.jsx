import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Gift, Search, Sparkles, Star,
  SlidersHorizontal, ShoppingBag, RefreshCw, Palette, Check
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import PersonalizationModal from '../components/PersonalizationModal';

const CATEGORIES = ['All', 'Personalized Studio', 'Birthday', 'Corporate', 'Wedding', 'Festive'];

const Gifts = () => {
  const { giftProducts, addToCart } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const [personalizingProduct, setPersonalizingProduct] = useState(null);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Find the 5 dedicated customizable products
  const customStudioItems = useMemo(() => {
    return giftProducts.filter(item =>
      item.isPersonalizable ||
      (item.category || '').toLowerCase().includes('personalized') ||
      ['custom-mug', 'custom-tshirt', 'custom-pillow', 'custom-keychain', 'custom-god-dress'].includes(item.id)
    );
  }, [giftProducts]);

  // Standard or filtered catalog
  const filteredProducts = useMemo(() => {
    return giftProducts
      .filter(item => {
        const matchesCategory = selectedCategory === 'All' ||
          (item.category || '').toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === 'Personalized Studio' && item.isPersonalizable);

        const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPrice = item.price <= maxPrice;
        const matchesRating = (item.rating || 5) >= minRating;
        const matchesStock = onlyInStock ? item.inStock : true;

        return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // featured default
      });
  }, [giftProducts, selectedCategory, searchQuery, maxPrice, minRating, onlyInStock, sortBy]);

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* 1. Page Header */}
      <section style={{
        padding: '3.5rem 0 2.5rem 0',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(245, 158, 11, 0.12) 0%, rgba(8, 12, 20, 1) 80%)',
        borderBottom: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="badge-gold" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Shree Pratham Gift Gallery
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '0.75rem' }}>
            Bespoke Luxury Hampers, Gifts & Custom Studio
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Curated artisan hampers, festive pooja treasures, and our bespoke customization studio for personalized mugs, t-shirts, cushions, keychains, and sacred deity poshak dresses.
          </p>

          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.6rem',
            marginTop: '2rem'
          }}>
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    padding: '0.6rem 1.4rem',
                    borderRadius: '9999px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    background: isSelected
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#080c14' : '#fff',
                    border: isSelected
                      ? '1px solid var(--accent-gold)'
                      : '1px solid var(--border-subtle)',
                    boxShadow: isSelected ? 'var(--gold-glow)' : 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {cat === 'All' ? '✨ All Collections' : cat === 'Personalized Studio' ? '🎨 Personalized Studio' : cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. DEDICATED PERSONALIZED & CUSTOM STUDIO SECTION */}
      {selectedCategory === 'All' && (
        <section style={{
          padding: '3.5rem 0 3rem 0',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(8, 12, 20, 0.8) 100%)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div className="container">
            <div className="flex justify-between items-end" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge-gold" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Palette size={14} /> 100% Bespoke Customization Studio
                </span>
                <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', margin: '0 0 0.4rem 0' }}>
                  Custom Print, Keepsakes & Divine Poshak
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '650px' }}>
                  Add your photos, names, company branding, and custom sacred embroidery to our 5 signature personalized items.
                </p>
              </div>

              <button
                onClick={() => handleCategoryChange('Personalized Studio')}
                className="btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                View Full Studio Collection →
              </button>
            </div>

            {/* 5 Dedicated Custom Items Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem'
            }}>
              {customStudioItems.slice(0, 5).map(item => {
                const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

                return (
                  <div
                    key={item.id}
                    className="glass-card-interactive"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 13, 22, 0.95) 100%)'
                    }}
                  >
                    {/* Visual Preview */}
                    <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="badge-gold" style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}>
                        ✨ Customizable
                      </span>
                      {discount > 0 && (
                        <span className="badge-green" style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.72rem' }}>
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#fbbf24', marginBottom: '0.35rem' }}>
                        <Star size={13} fill="#fbbf24" />
                        <strong style={{ color: '#fff' }}>{item.rating}</strong>
                        <span style={{ color: 'var(--text-subtle)' }}>({item.reviews})</span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                        {item.name}
                      </h4>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
                        {item.description.slice(0, 85)}...
                      </p>

                      {/* Pricing & CTA */}
                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
                          <div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                              ₹{item.price}
                            </span>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-subtle)', fontSize: '0.82rem', marginLeft: '0.35rem' }}>
                              ₹{item.originalPrice}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>Ready to Personalize</span>
                        </div>

                        <button
                          className="btn-gold"
                          onClick={() => setPersonalizingProduct(item)}
                          style={{ width: '100%', padding: '0.65rem', justifyContent: 'center', fontSize: '0.85rem' }}
                        >
                          <Sparkles size={15} /> Customize & Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. Main Catalog Section (Standard + Filtered Grid) */}
      <section style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          {/* Controls Bar */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              alignItems: 'center'
            }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search gifts, mugs, shirts, hampers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  <span>Max Budget:</span>
                  <strong style={{ color: 'var(--accent-gold-light)' }}>₹{maxPrice.toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="50"
                  value={maxPrice}
                  onChange={e => setMaxPrice(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                />
              </div>

              {/* Sort By */}
              <div>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="featured">Sort: Featured & Best Sellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating (Highest)</option>
                </select>
              </div>

              {/* In-Stock Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', color: '#fff' }}>
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={e => setOnlyInStock(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)' }}
                  />
                  In Stock Only
                </label>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Showing <strong style={{ color: '#fff' }}>{filteredProducts.length}</strong> collections</span>
            {(searchQuery || selectedCategory !== 'All' || maxPrice < 5000) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setMaxPrice(5000);
                  searchParams.delete('category');
                  setSearchParams(searchParams);
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-gold-light)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
              >
                <RefreshCw size={14} /> Reset Filters
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <Gift size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Gifts Found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Try adjusting your price filter or selecting another category like Personalized Studio or Corporate.
              </p>
              <button className="btn-gold" onClick={() => handleCategoryChange('All')}>
                View All Gifts
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(310px, 100%), 1fr))',
              gap: '1.5rem'
            }}>
              {filteredProducts.map(product => {
                const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                const isCustomizable = product.isPersonalizable || product.category === 'Personalized Studio';

                return (
                  <div
                    key={product.id}
                    className="glass-card-interactive"
                    style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                  >
                    {/* Image Area */}
                    <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="badge-gold" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                        {product.category}
                      </span>
                      {discount > 0 && (
                        <span className="badge-green" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Details Area */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.78rem', color: isCustomizable ? 'var(--accent-gold-light)' : 'var(--text-subtle)', fontWeight: 600 }}>
                          {isCustomizable ? '✨ 100% PERSONALIZABLE' : (product.tags?.[0] || 'PREMIUM COLLECTION')}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#fbbf24' }}>
                          <Star size={14} fill="#fbbf24" />
                          <strong style={{ color: '#fff' }}>{product.rating || 5.0}</strong>
                          <span style={{ color: 'var(--text-subtle)' }}>({product.reviews || 50})</span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: '#fff' }}>{product.name}</h3>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>
                        {product.description}
                      </p>

                      {/* Price & Action */}
                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                          <div>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                              ₹{product.price.toLocaleString()}
                            </span>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-subtle)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: product.inStock ? '#6ee7b7' : '#ef4444' }}>
                            {product.inStock ? 'Ready to Ship' : 'Out of Stock'}
                          </span>
                        </div>

                        {/* If product is personalizable (mug, tshirt, pillow, keychain, god dress), show Personalize button. Otherwise, standard Add to Cart! */}
                        {isCustomizable ? (
                          <button
                            className="btn-gold"
                            onClick={() => setPersonalizingProduct(product)}
                            style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
                          >
                            <Sparkles size={16} /> Personalize & Order
                          </button>
                        ) : (
                          <button
                            className="btn-gold"
                            disabled={!product.inStock}
                            onClick={() => addToCart(product, 1)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              justifyContent: 'center',
                              opacity: product.inStock ? 1 : 0.6,
                              cursor: product.inStock ? 'pointer' : 'not-allowed'
                            }}
                          >
                            <ShoppingBag size={16} /> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Personalization Modal */}
      <PersonalizationModal
        product={personalizingProduct}
        isOpen={!!personalizingProduct}
        onClose={() => setPersonalizingProduct(null)}
      />
    </div>
  );
};

export default Gifts;
