import { useState } from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const QuoteModal = ({ appliance, isOpen, onClose }) => {
  const { submitQuoteRequest } = useProducts();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(2);
  const [company, setCompany] = useState(user?.company || '');
  const [contactPerson, setContactPerson] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gstin, setGstin] = useState(user?.gstin || '');
  const [installationRequired, setInstallationRequired] = useState(true);
  const [notes, setNotes] = useState('');
  const [submittedQuoteId, setSubmittedQuoteId] = useState(null);

  if (!isOpen || !appliance) return null;

  // Calculate discount tier
  let discountPercent = 0;
  if (quantity >= 20) discountPercent = 22;
  else if (quantity >= 6) discountPercent = 15;
  else if (quantity >= 3) discountPercent = 8;

  const baseTotal = appliance.price * quantity;
  const discountedTotal = Math.round(baseTotal * (1 - discountPercent / 100));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactPerson || !email || !phone) return;

    const newQuote = submitQuoteRequest({
      applianceName: appliance.name,
      quantity,
      company: company.trim() || 'Private Enterprise',
      contactPerson,
      email,
      phone,
      gstin: gstin.trim() || 'N/A',
      installationRequired,
      estimatedTotal: `₹${discountedTotal.toLocaleString()} (${discountPercent}% Tier Discount Applied)`
    });

    setSubmittedQuoteId(newQuote.id);
  };

  const handleClose = () => {
    setSubmittedQuoteId(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
        {submittedQuoteId ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <CheckCircle2 size={36} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Bulk Quote Request Submitted!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Your official request has been logged with reference number:
            </p>
            <div style={{
              background: '#0a0f1d',
              border: '1px solid var(--border-gold)',
              padding: '0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '1.3rem',
              fontWeight: 800,
              color: 'var(--accent-gold-light)',
              letterSpacing: '0.05em',
              marginBottom: '1.5rem'
            }}>
              {submittedQuoteId}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
              Our Senior Commercial Projects Consultant will email you the stamped pro-forma invoice with GST breakdown and schedule on-site MEP feasibility within 2 business hours.
            </p>
            <button className="btn-gold" onClick={handleClose} style={{ width: '100%' }}>
              Return to Appliance Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid var(--border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold)'
                }}>
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Request Enterprise Bulk Quote</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold-light)' }}>
                    B2B Institutional Supply & Commercial Kitchen Equipment
                  </span>
                </div>
              </div>
              <button type="button" onClick={handleClose} style={{ background: 'transparent', color: '#94a3b8' }}>
                <X size={22} />
              </button>
            </div>

            {/* Selected Appliance Card */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <img
                src={appliance.image}
                alt={appliance.name}
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#fff' }}>{appliance.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  MSRP: ₹{appliance.price.toLocaleString()} • {appliance.specs?.capacity || appliance.category}
                </div>
              </div>
            </div>

            {/* Quantity and Discount Calculator */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Required Quantity: <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{quantity} Units</strong></label>
                {discountPercent > 0 && (
                  <span className="badge-green">
                    Tier Discount: {discountPercent}% OFF
                  </span>
                )}
              </div>

              <input
                type="range"
                min="1"
                max="50"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-gold)', marginBottom: '0.75rem' }}
              />

              <div className="flex justify-between" style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginBottom: '0.75rem' }}>
                <span>1-2 Units (Standard)</span>
                <span>3-5 Units (8% off)</span>
                <span>6-19 Units (15% off)</span>
                <span>20+ Units (22% off)</span>
              </div>

              <div className="flex justify-between items-center" style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Commercial Total:</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                  ₹{discountedTotal.toLocaleString()}
                  {discountPercent > 0 && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                      ₹{baseTotal.toLocaleString()}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                />
              </div>
              <div>
                <label className="form-label">Company / Institution Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Apex Cloud Kitchens Pvt Ltd"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Business Email *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="procurement@company.com"
                />
              </div>
              <div>
                <label className="form-label">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="form-label">GSTIN (For 18% Input Credit)</label>
                <input
                  type="text"
                  className="form-input"
                  value={gstin}
                  onChange={e => setGstin(e.target.value)}
                  placeholder="27XXXXX0000X1Z5"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#fff', marginTop: '1.2rem' }}>
                  <input
                    type="checkbox"
                    checked={installationRequired}
                    onChange={e => setInstallationRequired(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)' }}
                  />
                  Include On-site Commissioning & Testing
                </label>
              </div>
            </div>

            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '0.9rem' }}>
              <FileText size={18} /> Generate Formal Commercial Quote
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuoteModal;
