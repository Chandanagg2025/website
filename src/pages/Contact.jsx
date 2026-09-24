import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, Sparkles, MessageSquare } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const Contact = () => {
  const { submitContactInquiry } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vertical: 'General Inquiry',
    preferredTime: 'Immediate / ASAP (Within 15 mins)',
    contactMethod: 'WhatsApp',
    message: ''
  });

  const [submittedInquiry, setSubmittedInquiry] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) return;

    const created = submitContactInquiry(formData);
    setSubmittedInquiry(created);
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="badge-gold" style={{ marginBottom: '0.75rem' }}>
          <Sparkles size={13} /> Nationwide Enterprise Desk
        </span>
        <h1 style={{
          fontSize: 'clamp(2.4rem, 4vw, 3.5rem)',
          fontWeight: 800,
          marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #fcd34d 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Get in Touch with Shree Pratham
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Have a bespoke gifting requirement, drinking water supply request, commercial appliance quotation, or enterprise IT inquiry? Our executive team is available 24/7.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Contact Info Card */}
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              background: '#ffffff',
              padding: '8px 18px',
              borderRadius: '12px',
              border: '2px solid rgba(245, 158, 11, 0.6)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
              flexShrink: 0
            }}>
              <img
                src="/logo.png"
                alt="Shree Pratham"
                style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', margin: 0 }}>Corporate Headquarters</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Pan-India Operations
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Shree Pratham Conglomerate delivers certified quality products and services across Maharashtra, Gujarat, Delhi NCR, Karnataka, and pan-India distribution hubs.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold-light)'
              }}>
                <Phone size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Central Telephone</div>
                <div style={{ color: '#fff', fontWeight: 600 }}>+91 (022) 6982-5000 / +91 98765 43210</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa'
              }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Official Corporate & Sales Desks</div>
                <div style={{ color: '#fff', fontWeight: 600 }}>sales@shreepratham.com <span className="badge-gold" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', marginLeft: '0.4rem' }}>Orders & Fulfillment</span></div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.15rem' }}>contact@shreepratham.com (General Inquiries)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Corporate Office</div>
                <div style={{ color: '#fff', fontWeight: 600 }}>Shree Pratham Towers, Nariman Point, Mumbai 400021</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <a
              href="https://wa.me/919876543210?text=Hello%20Shree%20Pratham,%20I%20would%20like%20to%20connect%20with%20your%20team."
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#25D366',
                color: '#fff',
                fontWeight: 700,
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem'
              }}
            >
              <MessageSquare size={17} /> Direct WhatsApp
            </a>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          {submittedInquiry ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '2px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <CheckCircle2 size={38} color="var(--accent-gold-light)" />
              </div>
              <span className="badge-gold" style={{ marginBottom: '0.75rem' }}>
                Ref #{submittedInquiry.id}
              </span>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Thank You, {submittedInquiry.name}!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem auto' }}>
                Your inquiry has been registered in our routing system. Our vertical specialist will contact you via {submittedInquiry.contactMethod} shortly.
              </p>
              <button
                onClick={() => setSubmittedInquiry(null)}
                className="btn-secondary"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Send Us a Message</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Ramesh Patel"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Service / Division</label>
                  <select
                    className="form-select"
                    value={formData.vertical}
                    onChange={e => setFormData({ ...formData, vertical: e.target.value })}
                  >
                    <option value="Gift Gallery">🎁 Gift Gallery (Hampers & Favors)</option>
                    <option value="Drinking Water">💧 Drinking Water Supply</option>
                    <option value="Industrial Appliances">🍳 Industrial Kitchen Appliances</option>
                    <option value="Digital Marketing">📈 Digital Marketing & Ads</option>
                    <option value="IT Services">💻 IT & Cloud Solutions</option>
                    <option value="General Inquiry">🏢 General Enterprise Partnership</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Your Requirement / Message</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  required
                  placeholder="Tell us what you're looking for..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-gold" style={{ width: '100%', padding: '0.85rem' }}>
                <Send size={16} /> Submit Contact Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
