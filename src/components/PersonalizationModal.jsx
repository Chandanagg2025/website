import { useState } from 'react';
import { X, Sparkles, Check, Gift } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const WRAP_OPTIONS = [
  { id: 'gold', name: 'Royal Gold & Velvet', color: '#f59e0b', price: 0 },
  { id: 'maroon', name: 'Imperial Maroon & Silk', color: '#991b1b', price: 50 },
  { id: 'emerald', name: 'Emerald Forest Elegance', color: '#065f46', price: 50 },
  { id: 'black', name: 'Obsidian Noir & Silver', color: '#1e293b', price: 75 }
];

const RIBBON_OPTIONS = ['Classic Gold Satin', 'Crimson Red Ribbon', 'Champagne Lace', 'Silver Shimmer'];

const PersonalizationModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useProducts();

  const [engravingText, setEngravingText] = useState('');
  const [greetingNote, setGreetingNote] = useState('');
  const [selectedWrap, setSelectedWrap] = useState('gold');
  const [selectedRibbon, setSelectedRibbon] = useState('Classic Gold Satin');
  const [includeWaxSeal, setIncludeWaxSeal] = useState(true);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const currentWrapObj = WRAP_OPTIONS.find(w => w.id === selectedWrap);
  const wrapCost = currentWrapObj ? currentWrapObj.price : 0;
  const waxSealCost = includeWaxSeal ? 40 : 0;
  const unitPrice = product.price + wrapCost + waxSealCost;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const customization = {
      engravingText: engravingText.trim() || 'No Custom Engraving',
      greetingNote: greetingNote.trim() || 'No Greeting Note Included',
      wrapName: currentWrapObj.name,
      ribbonName: selectedRibbon,
      waxSeal: includeWaxSeal
    };

    addToCart(product, quantity, customization);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
        {/* Header */}
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <div className="badge-gold" style={{ marginBottom: '0.5rem' }}>
              <Sparkles size={13} /> Bespoke Personalization Studio
            </div>
            <h3 style={{ fontSize: '1.4rem' }}>{product.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: '#94a3b8' }}>
            <X size={22} />
          </button>
        </div>

        {/* Live Preview Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          position: 'relative'
        }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-gold-light)', fontWeight: 600, marginBottom: '0.5rem' }}>
            ✨ Live Preview • Personalized Keepsake
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                background: '#090d16',
                border: '1px dashed var(--accent-gold)',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                display: 'inline-block',
                marginBottom: '0.4rem'
              }}>
                <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                  Embossed Name: <span style={{ color: 'var(--accent-gold-light)', fontStyle: 'italic' }}>{engravingText || 'Your Name / Company'}</span>
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Wrap: <strong style={{ color: '#fff' }}>{currentWrapObj.name}</strong> • Ribbon: <strong style={{ color: '#fff' }}>{selectedRibbon}</strong>
                {includeWaxSeal && ' • Royal Wax Stamped'}
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
          {/* Engraving */}
          <div>
            <label className="form-label">
              1. Custom Laser Engraving / Name Embossing (Free)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Rajesh Sharma | Best Wishes From Infosys Team"
              maxLength={45}
              value={engravingText}
              onChange={e => setEngravingText(e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginTop: '0.25rem' }}>
              Precision laser engraved in gold foil typography. Max 45 characters.
            </span>
          </div>

          {/* Personal Greeting Card */}
          <div>
            <label className="form-label">
              2. Handwritten Golden Greeting Note Message
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Write your personal heartfelt message to be printed on heavy linen cardstock..."
              maxLength={250}
              value={greetingNote}
              onChange={e => setGreetingNote(e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textAlign: 'right', display: 'block' }}>
              {greetingNote.length}/250 characters
            </span>
          </div>

          {/* Gift Wrap Selector */}
          <div>
            <label className="form-label">3. Select Luxury Hamper Gift Wrap</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {WRAP_OPTIONS.map(wrap => (
                <div
                  key={wrap.id}
                  onClick={() => setSelectedWrap(wrap.id)}
                  style={{
                    border: selectedWrap === wrap.id ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    background: selectedWrap === wrap.id ? 'rgba(245, 158, 11, 0.1)' : 'rgba(15, 23, 42, 0.6)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    transition: 'var(--transition)'
                  }}
                >
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: wrap.color, display: 'inline-block' }} />
                  <div style={{ fontSize: '0.85rem', flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{wrap.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {wrap.price === 0 ? 'Complimentary' : `+₹${wrap.price}`}
                    </div>
                  </div>
                  {selectedWrap === wrap.id && <Check size={16} color="var(--accent-gold)" />}
                </div>
              ))}
            </div>
          </div>

          {/* Ribbon & Wax Seal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Ribbon Accent</label>
              <select
                className="form-select"
                value={selectedRibbon}
                onChange={e => setSelectedRibbon(e.target.value)}
              >
                {RIBBON_OPTIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Keepsake Wax Seal (+₹40)</label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: '#fff'
              }}>
                <input
                  type="checkbox"
                  checked={includeWaxSeal}
                  onChange={e => setIncludeWaxSeal(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)' }}
                />
                Official Shree Pratham Royal Seal
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Calculated Total ({quantity} item{quantity > 1 ? 's' : ''})</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
              ₹{totalPrice.toLocaleString()}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-sm)' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: 'transparent', color: '#fff', padding: '0.5rem 0.8rem', fontSize: '1.1rem' }}
              >
                -
              </button>
              <span style={{ padding: '0 0.5rem', fontWeight: 600 }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ background: 'transparent', color: '#fff', padding: '0.5rem 0.8rem', fontSize: '1.1rem' }}
              >
                +
              </button>
            </div>

            <button className="btn-gold" onClick={handleAddToCart}>
              <Gift size={18} /> Confirm & Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationModal;
