import { useState } from 'react';
import { MessageSquare, Phone, Mail, Clock, CheckCircle2, Search, FileText } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

const Queries = () => {
  const { queries, updateQueryStatus, bulkQuotes, updateQuoteStatus } = useAdminData();
  const [activeTab, setActiveTab] = useState('inquiries');
  const [search, setSearch] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  const filteredQueries = queries.filter(q =>
    (q.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (q.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (q.vertical || '').toLowerCase().includes(search.toLowerCase()) ||
    (q.message || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Queries & Inquiries</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Manage customer contact inquiries and bulk quotation requests</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button onClick={() => setActiveTab('inquiries')}
          style={{
            padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem', fontWeight: 600,
            background: activeTab === 'inquiries' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
            color: activeTab === 'inquiries' ? '#6ee7b7' : 'var(--text-muted)',
            border: `1px solid ${activeTab === 'inquiries' ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
            cursor: 'pointer'
          }}>
          <MessageSquare size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
          Contact Inquiries ({queries.length})
        </button>
        <button onClick={() => setActiveTab('quotes')}
          style={{
            padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem', fontWeight: 600,
            background: activeTab === 'quotes' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
            color: activeTab === 'quotes' ? '#6ee7b7' : 'var(--text-muted)',
            border: `1px solid ${activeTab === 'quotes' ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
            cursor: 'pointer'
          }}>
          <FileText size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
          Bulk Quotes ({bulkQuotes.length})
        </button>
      </div>

      {activeTab === 'inquiries' && (
        <>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '350px', marginBottom: '1rem' }}>
            <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input className="form-input" placeholder="Search inquiries..." value={search}
              onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
          </div>

          {/* Inquiries List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredQueries.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No contact inquiries found.
              </div>
            ) : filteredQueries.map(q => (
              <div key={q.id} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{q.name}</span>
                      <span className="badge badge-purple">{q.vertical}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={12} /> {q.email}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={12} /> {q.phone}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{q.date}</span>
                    <span className={`badge ${q.status === 'Pending' ? 'badge-gold' : q.status === 'Contacted' ? 'badge-blue' : 'badge-green'}`}>
                      {q.status}
                    </span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  {q.message}
                </p>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', alignSelf: 'center', marginRight: '0.5rem' }}>
                    <Clock size={12} style={{ verticalAlign: 'middle' }} /> Preferred: {q.preferredTime || 'Anytime'}
                  </span>
                  {['Pending', 'Contacted', 'Resolved'].map(status => (
                    <button key={status} onClick={() => updateQueryStatus(q.id, status)}
                      disabled={q.status === status}
                      className={q.status === status ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
                      style={{ opacity: q.status === status ? 1 : 0.7, cursor: 'pointer' }}>
                      {status === 'Resolved' && <CheckCircle2 size={12} />} {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'quotes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {bulkQuotes.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No bulk quote requests received yet.
            </div>
          ) : bulkQuotes.map(quote => (
            <div key={quote.id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent-emerald-light)' }}>{quote.id}</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff', marginTop: '0.2rem' }}>
                    {quote.applianceName || quote.equipmentName} × {quote.quantity || 1} units
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    <strong>{quote.company || quote.contactPerson}</strong> • {quote.email} • {quote.phone}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>{quote.estimatedTotal || '₹--'}</div>
                  <span className={`badge ${quote.status === 'Quote Sent' ? 'badge-green' : 'badge-gold'}`}>{quote.status}</span>
                </div>
              </div>

              {quote.notes && (
                <div style={{ fontSize: '0.82rem', color: '#6ee7b7', background: 'rgba(16,185,129,0.08)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                  <strong>Notes:</strong> {quote.notes}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Under Review', 'Quote Sent', 'Closed Won', 'Closed Lost'].map(st => (
                  <button
                    key={st}
                    onClick={() => updateQuoteStatus(quote.id, st)}
                    className={quote.status === st ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
                    style={{ fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Queries;
