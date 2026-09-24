import { X, Layers, Trash2, ArrowRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const CompareDrawer = ({ onOpenQuoteModal }) => {
  const { compareList, removeFromCompare, clearCompare } = useProducts();

  if (compareList.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(10, 15, 26, 0.98)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '2px solid var(--border-gold)',
      boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8)',
      zIndex: 900,
      padding: '1.25rem 0',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <div className="container">
        {/* Drawer Header */}
        <div className="flex justify-between items-center" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div className="flex items-center gap-2">
            <Layers size={20} color="var(--accent-gold)" />
            <h4 style={{ fontSize: '1.1rem', margin: 0 }}>
              Technical Specification Comparison ({compareList.length}/3 Appliances Selected)
            </h4>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Trash2 size={14} /> Clear All
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', width: '180px' }}>Parameters</th>
                {compareList.map(item => (
                  <th key={item.id} style={{ padding: '0.75rem', minWidth: '240px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{item.name}</div>
                          <div style={{ color: 'var(--accent-gold-light)', fontWeight: 800 }}>₹{item.price.toLocaleString()}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        style={{ background: 'transparent', color: '#94a3b8', padding: '2px' }}
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category</td>
                {compareList.map(item => (
                  <td key={item.id} style={{ padding: '0.75rem', color: '#fff' }}>{item.category}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Capacity / Volume</td>
                {compareList.map(item => (
                  <td key={item.id} style={{ padding: '0.75rem', color: 'var(--accent-gold-light)', fontWeight: 600 }}>
                    {item.specs?.capacity || 'Standard Commercial'}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Operating Temp Range</td>
                {compareList.map(item => (
                  <td key={item.id} style={{ padding: '0.75rem', color: '#fff' }}>
                    {item.specs?.tempRange || 'N/A'}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Power Rating</td>
                {compareList.map(item => (
                  <td key={item.id} style={{ padding: '0.75rem', color: '#fff' }}>
                    {item.specs?.power || 'Single Phase 230V'}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Material & Construction</td>
                {compareList.map(item => (
                  <td key={item.id} style={{ padding: '0.75rem', color: '#fff' }}>
                    {item.specs?.material || 'Heavy Gauge SS 304'}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dimensions</td>
                {compareList.map(item => (
                  <td key={item.id} style={{ padding: '0.75rem', color: '#fff' }}>
                    {item.specs?.dimensions || 'Custom footprint'}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Commercial Warranty</td>
                {compareList.map(item => (
                  <td key={item.id} style={{ padding: '0.75rem', color: '#6ee7b7' }}>
                    {item.specs?.warranty || '2 Years Comprehensive'}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Action</td>
                {compareList.map(item => (
                  <td key={item.id} style={{ padding: '0.75rem' }}>
                    <button
                      className="btn-gold btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => onOpenQuoteModal(item)}
                    >
                      Request Bulk Quote <ArrowRight size={14} />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareDrawer;
