import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Wrench, Layers, FileText, CheckCircle2, ShieldCheck,
  Zap, Star, ChevronRight, Sparkles, Plus, Check
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import CompareDrawer from '../components/CompareDrawer';
import QuoteModal from '../components/QuoteModal';

const CATEGORIES = ['All Equipment', 'Refrigeration', 'Cooking', 'Processing'];

const IndustrialAppliances = () => {
  const { appliances, compareList, addToCompare, removeFromCompare, clearCompare } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCatParam = searchParams.get('cat') || 'All Equipment';
  const [selectedCategory, setSelectedCategory] = useState(activeCatParam);

  const [quoteAppliance, setQuoteAppliance] = useState(null);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All Equipment') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat });
    }
  };

  const filteredAppliances = appliances.filter(item => {
    if (selectedCategory === 'All Equipment') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const isInCompare = (id) => compareList.some(item => item.id === id);

  return (
    <div style={{ paddingBottom: '7rem' }}>
      {/* 1. Header / Hero */}
      <section style={{
        padding: '3.5rem 0 3rem 0',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(99, 102, 241, 0.15) 0%, rgba(8, 12, 20, 1) 80%)',
        borderBottom: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="badge-gold" style={{ background: 'rgba(99, 102, 241, 0.15)', borderColor: '#6366f1', color: '#a5b4fc', marginBottom: '0.75rem' }}>
            <Wrench size={14} /> Shree Pratham Foodservice Engineering
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '0.75rem' }}>
            Heavy-Duty Commercial Kitchen & Processing Equipment
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
            Engineered for cloud kitchens, banquet hotels, bakeries, and industrial food processing plants. Built with non-magnetic food-grade SS 304, high-efficiency Emerson compressors, and 2-year on-site commercial warranty.
          </p>

          {/* Category Navigation Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '1.5rem'
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                style={{
                  padding: '0.7rem 1.6rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  background: selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  border: selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? '1px solid #818cf8'
                    : '1px solid var(--border-subtle)',
                  boxShadow: selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? '0 0 20px rgba(99, 102, 241, 0.4)'
                    : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Compare Notice Floating Bar (if compare items selected) */}
      {compareList.length > 0 && (
        <div style={{
          position: 'sticky',
          top: '75px',
          zIndex: 80,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-gold)',
          padding: '0.75rem 0'
        }}>
          <div className="container flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Layers size={18} color="var(--accent-gold)" />
              <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                {compareList.length} of 3 Appliances Selected for Spec Comparison
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Scroll down to view comparison drawer
              </span>
              <button onClick={clearCompare} className="btn-secondary btn-sm">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Appliance Catalog Grid */}
      <section style={{ paddingTop: '3rem' }}>
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase' }}>
                Engineering Specifications
              </span>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>
                {selectedCategory === 'All Equipment' ? 'All Industrial Machines' : `${selectedCategory} Equipment`}
              </h2>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {filteredAppliances.length} certified models
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {filteredAppliances.map(app => {
              const inCompare = isInCompare(app.id);

              return (
                <div
                  key={app.id}
                  className="glass-card-interactive"
                  style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img
                      src={app.image}
                      alt={app.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span className="badge-gold" style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(99, 102, 241, 0.2)', borderColor: '#6366f1', color: '#a5b4fc' }}>
                      {app.category}
                    </span>

                    {/* Compare Toggle Button */}
                    <button
                      onClick={() => inCompare ? removeFromCompare(app.id) : addToCompare(app)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: inCompare ? '#10b981' : 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid ' + (inCompare ? '#10b981' : 'var(--border-subtle)'),
                        color: '#fff',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: 'pointer'
                      }}
                    >
                      {inCompare ? <Check size={14} /> : <Plus size={14} />}
                      {inCompare ? 'Comparing' : 'Compare'}
                    </button>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 600 }}>
                        {app.specs?.energyRating || 'Heavy Duty Commercial'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', color: '#fbbf24' }}>
                        <Star size={14} fill="#fbbf24" />
                        <strong style={{ color: '#fff' }}>{app.rating}</strong>
                        <span style={{ color: 'var(--text-subtle)' }}>({app.reviews})</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>{app.name}</h3>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {app.description}
                    </p>

                    {/* Technical Specs Pill Matrix */}
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      fontSize: '0.82rem',
                      marginBottom: '1.5rem',
                      flex: 1
                    }}>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-subtle)' }}>Capacity:</span>
                        <strong style={{ color: '#fff' }}>{app.specs?.capacity}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-subtle)' }}>Operating Temp:</span>
                        <strong style={{ color: 'var(--accent-gold-light)' }}>{app.specs?.tempRange}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-subtle)' }}>Power Supply:</span>
                        <strong style={{ color: '#fff' }}>{app.specs?.power}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-subtle)' }}>Construction:</span>
                        <strong style={{ color: '#fff' }}>{app.specs?.material}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-subtle)' }}>Warranty:</span>
                        <strong style={{ color: '#6ee7b7' }}>{app.specs?.warranty}</strong>
                      </div>
                    </div>

                    {/* Pricing & Bulk Quote CTA */}
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                      <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Unit MSRP:</div>
                          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                            ₹{app.price.toLocaleString()}
                          </span>
                        </div>
                        <span className="badge-green" style={{ fontSize: '0.72rem' }}>
                          Bulk Discounts up to 22%
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
                        <button
                          className="btn-gold"
                          onClick={() => setQuoteAppliance(app)}
                          style={{ padding: '0.75rem' }}
                        >
                          <FileText size={16} /> Request Bulk Quote
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => inCompare ? removeFromCompare(app.id) : addToCompare(app)}
                          style={{ padding: '0.75rem' }}
                          title="Toggle Comparison Matrix"
                        >
                          <Layers size={16} color={inCompare ? '#10b981' : '#fff'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Turnkey Commercial Kitchen Consultation Banner */}
      <section style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <span className="badge-gold" style={{ background: 'rgba(99, 102, 241, 0.2)', borderColor: '#6366f1', color: '#a5b4fc', marginBottom: '0.5rem' }}>
                  Turnkey Engineering
                </span>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                  Setting Up a New Commercial Kitchen or Banquet?
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  Our senior food service architects provide end-to-end 3D CAD kitchen layouts, exhaust hood ventilation designs, gas piping compliance, and wholesale equipment commissioning.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button
                  className="btn-gold"
                  onClick={() => setQuoteAppliance(appliances[0])}
                  style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                >
                  Consult Kitchen Projects Team <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide-Up Technical Comparison Drawer */}
      <CompareDrawer onOpenQuoteModal={(item) => setQuoteAppliance(item)} />

      {/* Bulk Quote RFQ Modal */}
      <QuoteModal
        appliance={quoteAppliance}
        isOpen={!!quoteAppliance}
        onClose={() => setQuoteAppliance(null)}
      />
    </div>
  );
};

export default IndustrialAppliances;
