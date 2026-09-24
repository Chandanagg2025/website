import { useState } from 'react';
import { X, Headphones, AlertTriangle, CheckCircle2, LifeBuoy } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const TicketModal = ({ isOpen, onClose }) => {
  const { createTicket } = useProducts();
  const { user } = useAuth();

  const [category, setCategory] = useState('Web & App Development');
  const [priority, setPriority] = useState('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [contactPerson, setContactPerson] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [createdTicketId, setCreatedTicketId] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !description || !email) return;

    const ticket = createTicket({
      category,
      priority,
      subject,
      description,
      contactPerson,
      email,
      phone
    });

    setCreatedTicketId(ticket.id);
  };

  const handleClose = () => {
    setCreatedTicketId(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
        {createdTicketId ? (
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
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Support Ticket Created!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Your technical ticket has been queued in our Helpdesk NOC:
            </p>

            <div style={{
              background: '#090d16',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--accent-gold-light)',
              marginBottom: '1.25rem'
            }}>
              #{createdTicketId}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
              Priority: <strong style={{ color: '#fff' }}>{priority}</strong>. Our Level-2 engineer will respond within the SLA window directly via email and in your Customer Dashboard.
            </p>

            <button className="btn-gold" onClick={handleClose} style={{ width: '100%' }}>
              View in My Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa'
                }}>
                  <LifeBuoy size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Open IT Support Ticket</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold-light)' }}>
                    24/7 SLA Backed Engineering Response
                  </span>
                </div>
              </div>
              <button type="button" onClick={handleClose} style={{ background: 'transparent', color: '#94a3b8' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Category / Domain *</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="Web & App Development">Web & App Development</option>
                    <option value="Cloud & DevOps">Cloud & DevOps (AWS/Azure)</option>
                    <option value="24/7 Helpdesk & Hardware">24/7 Helpdesk & Hardware</option>
                    <option value="Cybersecurity & Network">Cybersecurity & Network</option>
                    <option value="Email & Google/Microsoft 365">Email & Google/Microsoft 365</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Urgency Priority *</label>
                  <select
                    className="form-select"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  >
                    <option value="Low">Low (General Query / Request)</option>
                    <option value="Medium">Medium (Standard Ticket • 4h SLA)</option>
                    <option value="High">High (Business Degraded • 1h SLA)</option>
                    <option value="Urgent">Critical (Outage / Production Down • 15m SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Subject / Issue Summary *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Database connection timeouts after traffic spike on checkout page"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Contact Email *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Detailed Description & Error Logs *</label>
                <textarea
                  required
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe step-by-step what happened, paste relevant stack traces, URLs, and screenshots..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '0.9rem' }}>
              <Headphones size={18} /> Submit Ticket to NOC Dispatch
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketModal;
