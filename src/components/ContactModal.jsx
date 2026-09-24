import { useState, useEffect } from 'react';
import { X, PhoneCall, Mail, User, Phone, Send, CheckCircle2, MessageSquare, Clock, Building2, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const VERTICAL_OPTIONS = [
  { value: 'Gift Gallery', label: '🎁 Gift Gallery (Corporate Hampers & Wedding Favors)' },
  { value: 'Drinking Water', label: '💧 Drinking Water Supply (20L Jars & Subscriptions)' },
  { value: 'Industrial Appliances', label: '🍳 Industrial Appliances (Commercial Kitchen Equipment)' },
  { value: 'Digital Marketing', label: '📈 Digital Marketing (SEO, Meta & Google Ads)' },
  { value: 'IT Services', label: '💻 IT & Cloud Services (Web/App Dev & 24/7 NOC)' },
  { value: 'General Inquiry', label: '🏢 General Corporate / Enterprise Partnership' }
];

const TIME_PREFERENCES = [
  'Immediate / ASAP (Within 15 mins)',
  'Morning (10:00 AM - 01:00 PM)',
  'Afternoon (02:00 PM - 05:00 PM)',
  'Evening (05:00 PM - 08:00 PM)'
];

const ContactModal = ({ isOpen, onClose, initialVertical = 'General Inquiry' }) => {
  const { submitContactInquiry } = useProducts();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vertical: initialVertical,
    preferredTime: TIME_PREFERENCES[0],
    contactMethod: 'WhatsApp',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState(null);

  // Autofill user info if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  // Update initialVertical if prop changes
  useEffect(() => {
    if (initialVertical) {
      setFormData(prev => ({ ...prev, vertical: initialVertical }));
    }
  }, [initialVertical]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setSubmittedInquiry(null);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = submitContactInquiry(formData);
      setIsSubmitting(false);
      setSubmittedInquiry(created);
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '95%',
          padding: '2.2rem',
          border: '1px solid var(--border-gold-bright)',
          background: 'linear-gradient(180deg, #0e1526 0%, #080c14 100%)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          title="Close dialog"
        >
          <X size={18} />
        </button>

        {submittedInquiry ? (
          /* Confirmation View */
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
              border: '2px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              boxShadow: 'var(--gold-glow)'
            }}>
              <CheckCircle2 size={40} color="var(--accent-gold-light)" />
            </div>

            <span className="badge-gold" style={{ marginBottom: '0.75rem' }}>
              Inquiry Ref #{submittedInquiry.id}
            </span>

            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.75rem' }}>
              Thank You, {submittedInquiry.name.split(' ')[0]}!
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
              Your inquiry for <strong style={{ color: 'var(--accent-gold-light)' }}>{submittedInquiry.vertical}</strong> has been logged in our priority routing queue. Our executive will reach out to you via <strong style={{ color: '#fff' }}>{submittedInquiry.contactMethod}</strong> ({submittedInquiry.phone}).
            </p>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              maxWidth: '480px',
              margin: '0 auto 2rem auto',
              textAlign: 'left',
              fontSize: '0.88rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Preferred Callback Time:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{submittedInquiry.preferredTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Contact Email:</span>
                <span style={{ color: 'var(--text-main)' }}>{submittedInquiry.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Status:</span>
                <span className="badge-green" style={{ padding: '0.15rem 0.6rem' }}>Queued for Callback</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello Shree Pratham, I just submitted inquiry #${submittedInquiry.id} regarding ${submittedInquiry.vertical}. My name is ${submittedInquiry.name}.`)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#25D366',
                  color: '#ffffff',
                  fontWeight: 700,
                  padding: '0.75rem 1.4rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.35)',
                  fontSize: '0.92rem'
                }}
              >
                <MessageSquare size={17} /> Fast-Track on WhatsApp
              </a>

              <button onClick={handleClose} className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Contact Form View */
          <div>
            {/* Modal Header */}
            <div style={{ marginBottom: '1.75rem', paddingRight: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span className="badge-gold">
                  <Sparkles size={13} /> Direct Connect
                </span>
                <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
                  • Typical Response &lt; 15 mins
                </span>
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                Contact Shree Pratham
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Fill out the form below. Whether you require corporate gifting, commercial water delivery, kitchen equipment, marketing funnels, or IT infrastructure, our team is ready to assist.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* Full Name */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={14} color="var(--accent-gold)" /> Your Name <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Ramesh Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} color="var(--accent-gold)" /> Phone / WhatsApp <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* Email Address */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={14} color="var(--accent-gold)" /> Email Address <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Division of Interest */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building2 size={14} color="var(--accent-gold)" /> Service / Division
                  </label>
                  <select
                    className="form-select"
                    value={formData.vertical}
                    onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                  >
                    {VERTICAL_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* Preferred Callback Time */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} color="var(--accent-gold)" /> Preferred Callback Window
                  </label>
                  <select
                    className="form-select"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  >
                    {TIME_PREFERENCES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Contact Mode */}
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MessageSquare size={14} color="var(--accent-gold)" /> Preferred Contact Channel
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                    {['WhatsApp', 'Phone Call', 'Email'].map((method) => {
                      const selected = formData.contactMethod === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setFormData({ ...formData, contactMethod: method })}
                          style={{
                            flex: 1,
                            padding: '0.65rem 0.5rem',
                            fontSize: '0.82rem',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: selected ? 700 : 500,
                            background: selected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                            border: selected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                            color: selected ? 'var(--accent-gold-light)' : 'var(--text-muted)',
                            transition: 'var(--transition)'
                          }}
                        >
                          {method}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Requirement Details */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">
                  Requirement Details / Message
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Tell us about your requirements (e.g., number of water jars, gifting quantity, equipment specs, marketing goals)..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <PhoneCall size={13} color="var(--accent-gold)" /> Pan-India Direct Line: +91 (022) 6982-5000
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-secondary btn-sm"
                    style={{ padding: '0.7rem 1.25rem' }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold"
                    style={{ padding: '0.7rem 1.6rem', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send size={16} /> Request Callback
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
