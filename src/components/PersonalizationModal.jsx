import { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Check, Upload, Image as ImageIcon, Shirt, Heart, Key } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const MUG_STYLES = [
  { id: 'white', name: 'Classic White Ceramic (330ml)', extra: 0 },
  { id: 'magic', name: 'Heat-Activated Magic Color Reveal', extra: 100 },
  { id: 'gold', name: 'Gold Rim Executive Edition (450ml)', extra: 150 }
];

const TSHIRT_SIZES = ['S (38)', 'M (40)', 'L (42)', 'XL (44)', 'XXL (46)'];
const TSHIRT_COLORS = [
  { name: 'Jet Black', hex: '#111827' },
  { name: 'Pure White', hex: '#f8fafc' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Crimson Maroon', hex: '#7f1d1d' }
];

const PILLOW_STYLES = [
  { id: 'satin', name: '16x16 Square Plush Satin', extra: 0 },
  { id: 'sequin', name: 'Magic Reversible Gold Sequin', extra: 100 },
  { id: 'heart', name: 'Luxury Velvet Heart Cushion', extra: 150 }
];

const KEYCHAIN_STYLES = [
  { id: 'metal', name: 'Brushed Stainless Metal Bar', extra: 0 },
  { id: 'leather', name: 'Handcrafted Wood & Genuine Leather', extra: 50 },
  { id: 'acrylic', name: 'Dual-Sided Clear Acrylic Photo Tag', extra: 30 },
  { id: 'gold', name: '24K Gold PVD Laser Plaque', extra: 90 }
];

const DEITY_OPTIONS = [
  { id: 'laddu-gopal', name: 'Laddu Gopal Ji' },
  { id: 'radha-krishna', name: 'Radha Krishna Pair' },
  { id: 'mata-rani', name: 'Mata Rani / Durga Maa' },
  { id: 'hanuman-ram', name: 'Shree Ram / Hanuman Ji' }
];

const POSHAK_SIZES = [
  'Size 0 (2" Deity)',
  'Size 1 (3" Deity)',
  'Size 2 (4" Deity)',
  'Size 3 (5" Deity)',
  'Size 4 (6" Deity)',
  'Size 5 (7" Deity)',
  'Size 6 (8" Deity)'
];

const POSHAK_COLORS = [
  { name: 'Auspicious Crimson Red & Zari', color: '#dc2626' },
  { name: 'Peacock Yellow & Kesari Silk', color: '#f59e0b' },
  { name: 'Royal Rani Pink & Pearl Brocade', color: '#db2777' },
  { name: 'Sacred Emerald Green & Silver', color: '#059669' }
];

const PersonalizationModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useProducts();
  const fileInputRef = useRef(null);

  // Determine item type
  const itemType = (product?.customizationType || product?.type || '').toLowerCase();
  const isMug = itemType === 'mug' || (product?.name || '').toLowerCase().includes('mug');
  const isTshirt = itemType === 'tshirt' || (product?.name || '').toLowerCase().includes('t-shirt');
  const isPillow = itemType === 'pillow' || (product?.name || '').toLowerCase().includes('pillow');
  const isKeychain = itemType === 'keychain' || (product?.name || '').toLowerCase().includes('keychain');
  const isGodDress = itemType === 'god-dress' || (product?.name || '').toLowerCase().includes('poshak') || (product?.name || '').toLowerCase().includes('god dress');

  // Form states
  const [customText, setCustomText] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Specific states
  const [mugStyle, setMugStyle] = useState(MUG_STYLES[0].name);
  const [mugExtra, setMugExtra] = useState(0);

  const [tshirtSize, setTshirtSize] = useState('L (42)');
  const [tshirtColor, setTshirtColor] = useState('Jet Black');

  const [pillowStyle, setPillowStyle] = useState(PILLOW_STYLES[0].name);
  const [pillowExtra, setPillowExtra] = useState(0);

  const [keychainStyle, setKeychainStyle] = useState(KEYCHAIN_STYLES[0].name);
  const [keychainBackText, setKeychainBackText] = useState('');
  const [keychainExtra, setKeychainExtra] = useState(0);

  const [selectedDeity, setSelectedDeity] = useState(DEITY_OPTIONS[0].name);
  const [poshakSize, setPoshakSize] = useState(POSHAK_SIZES[2]);
  const [poshakColor, setPoshakColor] = useState(POSHAK_COLORS[0].name);
  const [devoteeDedication, setDevoteeDedication] = useState('');

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setCustomText('');
      setPhotoPreview(null);
      setQuantity(1);
      setMugExtra(0);
      setPillowExtra(0);
      setKeychainExtra(0);
      setKeychainBackText('');
      setDevoteeDedication('');
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Extra cost additions
  let extraCharge = 0;
  if (isMug) extraCharge = mugExtra;
  if (isPillow) extraCharge = pillowExtra;
  if (isKeychain) extraCharge = keychainExtra;

  const unitPrice = (product.price || 0) + extraCharge;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    let customizationData = {
      itemType: isMug ? 'mug' : isTshirt ? 'tshirt' : isPillow ? 'pillow' : isKeychain ? 'keychain' : isGodDress ? 'god-dress' : 'general',
      photoUploaded: !!photoPreview,
      photoUrl: photoPreview || null
    };

    if (isMug) {
      customizationData = {
        ...customizationData,
        customText: customText.trim() || 'Custom Photo Mug',
        style: mugStyle
      };
    } else if (isTshirt) {
      customizationData = {
        ...customizationData,
        customText: customText.trim() || 'Custom Print T-Shirt',
        size: tshirtSize,
        color: tshirtColor
      };
    } else if (isPillow) {
      customizationData = {
        ...customizationData,
        customText: customText.trim() || 'Personalized Memory Cushion',
        style: pillowStyle
      };
    } else if (isKeychain) {
      customizationData = {
        ...customizationData,
        customText: customText.trim() || 'Custom Name / Plate',
        backText: keychainBackText.trim() || null,
        style: keychainStyle
      };
    } else if (isGodDress) {
      customizationData = {
        ...customizationData,
        deity: selectedDeity,
        size: poshakSize,
        color: poshakColor,
        customText: devoteeDedication.trim() || `Devotional Poshak for ${selectedDeity}`
      };
    } else {
      customizationData = {
        ...customizationData,
        customText: customText.trim() || 'Bespoke Keepsake'
      };
    }

    addToCart(product, quantity, customizationData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 120 }}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          padding: '2rem',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div>
            <div className="badge-gold" style={{ marginBottom: '0.4rem' }}>
              <Sparkles size={13} /> {isGodDress ? '🛕 Devotional Deity Shringar Studio' : '✨ Custom Print & Personalization Studio'}
            </div>
            <h3 style={{ fontSize: '1.35rem', margin: 0 }}>{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            title="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Live Interactive Preview */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          position: 'relative'
        }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold-light)', fontWeight: 700, marginBottom: '0.75rem' }}>
            ⚡ Live Interactive Mockup Preview
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            {/* Visual Thumbnail with Overlay */}
            <div style={{
              position: 'relative',
              width: '110px',
              height: '110px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '2px solid var(--border-gold)',
              flexShrink: 0,
              background: '#0a0e17'
            }}>
              <img
                src={photoPreview || product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {photoPreview && (
                <span style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  background: '#10b981',
                  color: '#fff',
                  fontSize: '0.65rem',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: 700
                }}>
                  Photo Added
                </span>
              )}
            </div>

            {/* Customization Details Preview */}
            <div style={{ flex: 1 }}>
              <div style={{
                background: 'rgba(8, 12, 20, 0.9)',
                border: '1px dashed var(--accent-gold)',
                borderRadius: '8px',
                padding: '0.6rem 0.85rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Embossed Text / Print:</div>
                <div style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 700, fontStyle: customText ? 'normal' : 'italic' }}>
                  {customText || (isGodDress ? (devoteeDedication || `Poshak for ${selectedDeity}`) : 'Enter custom text / name below')}
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {isMug && <span>Style: <strong style={{ color: '#fff' }}>{mugStyle}</strong></span>}
                {isTshirt && (
                  <>
                    <span>Size: <strong style={{ color: 'var(--accent-gold-light)' }}>{tshirtSize}</strong></span>
                    <span>• Color: <strong style={{ color: '#fff' }}>{tshirtColor}</strong></span>
                  </>
                )}
                {isPillow && <span>Style: <strong style={{ color: '#fff' }}>{pillowStyle}</strong></span>}
                {isKeychain && <span>Finish: <strong style={{ color: '#fff' }}>{keychainStyle}</strong></span>}
                {isGodDress && (
                  <>
                    <span>Deity: <strong style={{ color: 'var(--accent-gold-light)' }}>{selectedDeity}</strong></span>
                    <span>• {poshakSize}</span>
                    <span>• {poshakColor}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Controls based on Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
          {/* 1. MUG CONTROLS */}
          {isMug && (
            <>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ImageIcon size={15} color="var(--accent-gold)" /> 1. Upload Your Custom High-Resolution Photo
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Upload size={14} /> Choose Image from Device
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  {photoPreview && (
                    <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Check size={14} /> Photo loaded successfully
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block', marginTop: '0.25rem' }}>
                  Supports JPG, PNG (Min 1000x1000px recommended for HD sublimation ceramic heat-press).
                </span>
              </div>

              <div>
                <label className="form-label">2. Custom Printed Message / Recipient Name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. World's Best Dad • Happy 25th Anniversary • Aditi"
                  maxLength={40}
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">3. Select Mug Finish & Ceramic Variant</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.6rem' }}>
                  {MUG_STYLES.map(style => (
                    <div
                      key={style.id}
                      onClick={() => {
                        setMugStyle(style.name);
                        setMugExtra(style.extra);
                      }}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: mugStyle === style.name ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        background: mugStyle === style.name ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                        cursor: 'pointer',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#fff' }}>{style.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold-light)', marginTop: '2px' }}>
                        {style.extra === 0 ? 'Included' : `+₹${style.extra}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 2. T-SHIRT CONTROLS */}
          {isTshirt && (
            <>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shirt size={15} color="var(--accent-gold)" /> 1. Select T-Shirt Size
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {TSHIRT_SIZES.map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setTshirtSize(sz)}
                      style={{
                        padding: '0.5rem 0.9rem',
                        borderRadius: '6px',
                        border: tshirtSize === sz ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        background: tshirtSize === sz ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.05)',
                        color: tshirtSize === sz ? '#090d16' : '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">2. Fabric Color</label>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {TSHIRT_COLORS.map(col => (
                    <div
                      key={col.name}
                      onClick={() => setTshirtColor(col.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                        border: tshirtColor === col.name ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        background: tshirtColor === col.name ? 'rgba(245, 158, 11, 0.1)' : 'rgba(15, 23, 42, 0.6)',
                        cursor: 'pointer',
                        fontSize: '0.82rem'
                      }}
                    >
                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: col.hex, border: '1px solid #64748b' }} />
                      <span style={{ color: '#fff' }}>{col.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">3. Custom Slogan, Company Logo or Printed Text</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Innovate or Die • TCS Tech Summit 2026 • Born to Ride"
                  maxLength={50}
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">4. Upload Photo / Logo Graphic File (Optional)</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Upload size={14} /> Upload Custom Graphic / Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                {photoPreview && (
                  <span style={{ fontSize: '0.8rem', color: '#10b981', marginLeft: '0.75rem' }}>
                    ✓ Graphic Uploaded
                  </span>
                )}
              </div>
            </>
          )}

          {/* 3. PILLOW CONTROLS */}
          {isPillow && (
            <>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Heart size={15} color="var(--accent-gold)" /> 1. Upload Centerpiece Photo for Pillow
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Upload size={14} /> Upload Family / Couple Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  {photoPreview && (
                    <span style={{ fontSize: '0.8rem', color: '#10b981' }}>✓ Photo Loaded</span>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">2. Pillow Style & Fabric Finish</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.6rem' }}>
                  {PILLOW_STYLES.map(style => (
                    <div
                      key={style.id}
                      onClick={() => {
                        setPillowStyle(style.name);
                        setPillowExtra(style.extra);
                      }}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: pillowStyle === style.name ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        background: pillowStyle === style.name ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                        cursor: 'pointer',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#fff' }}>{style.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold-light)', marginTop: '2px' }}>
                        {style.extra === 0 ? 'Standard Price' : `+₹${style.extra}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">3. Heartfelt Message or Names to Print (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Happy 10th Anniversary Rohit & Pooja • Forever & Always"
                  maxLength={60}
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                />
              </div>
            </>
          )}

          {/* 4. KEYCHAIN CONTROLS */}
          {isKeychain && (
            <>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Key size={15} color="var(--accent-gold)" /> 1. Custom Name / Vehicle Number Plate (Front Side)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. MH 02 CZ 9999 • AARAV • S & P"
                  maxLength={30}
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">2. Backside Laser Engraving (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Drive Safe My Love • +91 98201 12345 • Date: 24.08.2025"
                  maxLength={30}
                  value={keychainBackText}
                  onChange={e => setKeychainBackText(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">3. Keychain Material & Finish</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                  {KEYCHAIN_STYLES.map(style => (
                    <div
                      key={style.id}
                      onClick={() => {
                        setKeychainStyle(style.name);
                        setKeychainExtra(style.extra);
                      }}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: keychainStyle === style.name ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        background: keychainStyle === style.name ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                        cursor: 'pointer',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#fff' }}>{style.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold-light)', marginTop: '2px' }}>
                        {style.extra === 0 ? 'Standard' : `+₹${style.extra}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 5. GOD DRESSES (POSHAK) CONTROLS */}
          {isGodDress && (
            <>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🛕 1. Select Deity / Vigraha
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.6rem' }}>
                  {DEITY_OPTIONS.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDeity(d.name)}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '6px',
                        border: selectedDeity === d.name ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        background: selectedDeity === d.name ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        color: selectedDeity === d.name ? 'var(--accent-gold-light)' : '#fff',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">2. Select Poshak Size</label>
                <select
                  className="form-select"
                  value={poshakSize}
                  onChange={e => setPoshakSize(e.target.value)}
                >
                  {POSHAK_SIZES.map(sz => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">3. Sacred Color & Fabric Theme</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                  {POSHAK_COLORS.map(col => (
                    <div
                      key={col.name}
                      onClick={() => setPoshakColor(col.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '6px',
                        border: poshakColor === col.name ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        background: poshakColor === col.name ? 'rgba(245, 158, 11, 0.1)' : 'rgba(15, 23, 42, 0.6)',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: col.color, flexShrink: 0 }} />
                      <span style={{ color: '#fff', fontWeight: 600 }}>{col.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">4. Devotee Name / Mandir Dedication (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bhet by Agarwal Family • In memory of Grandmother"
                  maxLength={50}
                  value={devoteeDedication}
                  onChange={e => setDevoteeDedication(e.target.value)}
                />
              </div>
            </>
          )}

          {/* FALLBACK FOR OTHER PERSONALIZED GIFTS */}
          {!isMug && !isTshirt && !isPillow && !isKeychain && !isGodDress && (
            <>
              <div>
                <label className="form-label">Custom Laser Engraving / Name Embossing</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Best Wishes From Shree Pratham"
                  maxLength={45}
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Unit Price: ₹{unitPrice.toLocaleString()} • Total ({quantity} item{quantity > 1 ? 's' : ''})
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
              ₹{totalPrice.toLocaleString()}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-sm)' }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.5rem 0.85rem', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ padding: '0 0.5rem', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.5rem 0.85rem', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                +
              </button>
            </div>

            <button className="btn-gold" onClick={handleAddToCart} style={{ padding: '0.75rem 1.4rem' }}>
              <Sparkles size={17} /> Confirm & Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationModal;
