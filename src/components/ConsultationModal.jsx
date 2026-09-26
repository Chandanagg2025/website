import { useState } from 'react';
import { X, Calendar, Clock, Video, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const TIME_SLOTS = [
  '10:30 AM - 11:15 AM',
  '12:00 PM - 12:45 PM',
  '02:30 PM - 03:15 PM',
  '04:00 PM - 04:45 PM',
  '05:30 PM - 06:15 PM'
];

const ConsultationModal = ({ initialService, isOpen, onClose }) => {
  const { bookConsultation } = useProducts();
  const { user } = useAuth();

  const [service, setService] = useState(initialService || 'High-ROAS Paid Performance Ads');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [clientName, setClientName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !email || !phone) return;

    const booking = bookConsultation({
      service,
      date,
      time,
      clientName,
      email,
      phone,
      website,
      notes
    });

    setConfirmedBooking(booking);
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
        {confirmedBooking ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '2px solid #3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <CheckCircle2 size={36} color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Strategy Session Confirmed!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Your 1-on-1 Growth Blueprint meeting has been scheduled:
            </p>

            <div style={{
              background: '#090d16',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)', fontWeight: 600, marginBottom: '0.3rem' }}>
                Booking ID: {confirmedBooking.id}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>
                {confirmedBooking.service}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <Calendar size={16} color="var(--accent-gold)" /> Date: <strong style={{ color: '#fff' }}>{confirmedBooking.date}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <Clock size={16} color="var(--accent-gold)" /> Slot: <strong style={{ color: '#fff' }}>{confirmedBooking.time}</strong>
              </div>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: '#93c5fd'
              }}>
                <Video size={16} /> Google Meet Video Room: meet.google.com/shp-mkt-session
              </div>
            </div>

            <button className="btn-gold" onClick={handleClose} style={{ width: '100%' }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <div className="badge-blue" style={{ marginBottom: '0.4rem' }}>
                  <Video size={13} /> 45-Min Complimentary Growth Audit
                </div>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Book Marketing Strategy Session</h3>
              </div>
              <button type="button" onClick={handleClose} style={{ background: 'transparent', color: '#94a3b8' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="form-label">Selected Strategy Focus</label>
                <select
                  className="form-select"
                  value={service}
                  onChange={e => setService(e.target.value)}
                >
                  <option value="SEO Domination & Organic Pipeline">SEO Domination & Organic Search</option>
                  <option value="Social Media Mastery & Virality">Social Media Content & Community</option>
                  <option value="High-ROAS Paid Performance Ads">High-ROAS Google & Meta Ads</option>
                  <option value="360° Omnichannel Growth Engine">360° Omnichannel Growth Engine</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Preferred Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Preferred Time Slot</label>
                  <select
                    className="form-select"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Ananya Deshmukh"
                  />
                </div>
                <div>
                  <label className="form-label">Work Email *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ananya@brand.com"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                <div>
                  <label className="form-label">Company Website / Social URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://yourbrand.com"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Primary Growth Objective / Current Bottleneck</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. Currently spending ₹1.5L/mo on Meta ads with 1.4x ROAS, want to scale to 3.5x ROAS..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '0.9rem' }}>
              Confirm Calendar Reservation
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;
