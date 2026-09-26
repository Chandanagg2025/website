import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Gift, Search, Filter, Sparkles, Star, CheckCircle2,
  SlidersHorizontal, Heart, Shield, RefreshCw
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import PersonalizationModal from '../components/PersonalizationModal';

const CATEGORIES = ['All', 'Birthday', 'Corporate', 'Wedding', 'Festive'];

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

  const filteredProducts = useMemo(() => {
    return giftProducts
      .filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = item.price <= maxPrice;
        const matchesRating = item.rating >= minRating;
        const matchesStock = onlyInStock ? item.inStock : true;

        return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [giftProducts, selectedCategory, searchQuery, maxPrice, minRating, onlyInStock, sortBy]);

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Page Header */}
      <section style={{
        padding: '3.5rem 0 2.5rem 0',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(245, 158, 11, 0.1) 0%, rgba(8, 12, 20, 1) 80%)',
        borderBottom: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="badge-gold" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Shree Pratham Gift Gallery
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '0.75rem' }}>
            Bespoke Luxury Hampers & Custom Keepsakes
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem' }}>
            Every gift is customized with precision laser engraving, handcrafted satin packaging, and personalized notes for weddings, milestones, and high-impact corporate relationships.
          </p>

          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.6rem',
            marginTop: '2rem'
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory.toLowerCase() === cat.toLowerCase() ? '#080c14' : '#fff',
                  border: selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? '1px solid var(--accent-gold)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: selectedCategory.toLowerCase() === cat.toLowerCase() ? 'var(--gold-glow)' : 'none'
                }}
              >
                {cat === 'All' ? '✨ All Collections' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area: Filters + Grid */}
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
                  placeholder="Search gifts, pens, hampers..."
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
                  min="800"
                  max="5000"
                  step="100"
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
                  In Stock Ready to Dispatch
                </label>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Showing <strong style={{ color: '#fff' }}>{filteredProducts.length}</strong> handcrafted gift collections</span>
            {(searchQuery || selectedCategory !== 'All' || maxPrice < 5000) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setMaxPrice(5000);
                  searchParams.delete('category');
                  setSearchParams(searchParams);
                }}
                style={{ background: 'transparent', color: 'var(--accent-gold-light)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
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
                Try adjusting your price filter or selecting another category like Corporate or Wedding.
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
                        <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)', fontWeight: 600 }}>
                          ✨ FREE LASER ENGRAVING
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#fbbf24' }}>
                          <Star size={14} fill="#fbbf24" />
                          <strong style={{ color: '#fff' }}>{product.rating}</strong>
                          <span style={{ color: 'var(--text-subtle)' }}>({product.reviews})</span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: '#fff' }}>{product.name}</h3>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>
                        {product.description}
                      </p>

                      {/* Personalization Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                        {product.personalizationOptions?.map((opt, i) => (
                          <span
                            key={i}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '4px',
                              padding: '0.2rem 0.5rem',
                              fontSize: '0.72rem',
                              color: 'var(--text-muted)'
                            }}
                          >
                            ✓ {opt}
                          </span>
                        ))}
                      </div>

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
                          <span style={{ fontSize: '0.78rem', color: '#6ee7b7' }}>Ready to Ship</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
                          <button
                            className="btn-gold"
                            onClick={() => setPersonalizingProduct(product)}
                            style={{ padding: '0.7rem' }}
                          >
                            <Sparkles size={16} /> Personalize & Add
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => addToCart(product, 1)}
                            title="Quick Add Without Personalization"
                            style={{ padding: '0.7rem' }}
                          >
                            Quick Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Personalization Modal */}
      <PersonalizationModal
        product={personalizingProduct}
        isOpen={!!personalizingProduct}
        onClose={() => setPersonalizingProduct(null)}
      />
    </div>
  );
};

export default Gifts;
