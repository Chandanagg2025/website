import { useState } from 'react';
import { LifeBuoy, Send, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

const Tickets = () => {
  const { tickets, replyToTicket, updateTicketStatus } = useAdminData();
  const [replyText, setReplyText] = useState('');
  const [replyingId, setReplyingId] = useState(null);
  const [expandedTicket, setExpandedTicket] = useState(null);

  const handleReply = (ticketId) => {
    if (!replyText.trim()) return;
    replyToTicket(ticketId, replyText.trim());
    setReplyText('');
    setReplyingId(null);
  };

  const getPriorityColor = (p) => p === 'Critical' ? '#ef4444' : p === 'High' ? '#f59e0b' : p === 'Medium' ? '#3b82f6' : '#10b981';

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Support Tickets</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>IT helpdesk, product support, and customer service tickets</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-red" style={{ padding: '0.3rem 0.8rem', fontSize: '0.78rem' }}>
          <AlertTriangle size={12} /> {tickets.filter(t => t.status === 'Open').length} Open
        </span>
        <span className="badge badge-gold" style={{ padding: '0.3rem 0.8rem', fontSize: '0.78rem' }}>
          <Clock size={12} /> {tickets.filter(t => t.status === 'In Progress').length} In Progress
        </span>
        <span className="badge badge-green" style={{ padding: '0.3rem 0.8rem', fontSize: '0.78rem' }}>
          <CheckCircle2 size={12} /> {tickets.filter(t => t.status === 'Resolved').length} Resolved
        </span>
      </div>

      {/* Tickets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tickets.map(ticket => (
          <div key={ticket.id} className="glass-card" style={{ overflow: 'hidden' }}>
            {/* Header */}
            <div
              style={{
                padding: '1rem 1.25rem', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '0.5rem'
              }}
              onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <LifeBuoy size={16} color={getPriorityColor(ticket.priority)} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ticket.subject}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {ticket.id} • {ticket.customerName} • {ticket.date}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-purple">{ticket.category}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: getPriorityColor(ticket.priority) }}>{ticket.priority}</span>
                <span className={`badge ${ticket.status === 'Open' ? 'badge-red' : ticket.status === 'In Progress' ? 'badge-gold' : 'badge-green'}`}>
                  {ticket.status}
                </span>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedTicket === ticket.id && (
              <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.15)' }}>
                {/* Conversation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {ticket.replies.map((reply, i) => (
                    <div key={i} style={{
                      padding: '0.75rem', borderRadius: 'var(--radius-md)',
                      background: reply.sender === 'Admin Support' || reply.sender === 'Support Team' ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${reply.sender === 'Admin Support' || reply.sender === 'Support Team' ? 'rgba(16,185,129,0.2)' : 'var(--border-subtle)'}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: reply.sender === 'Admin Support' || reply.sender === 'Support Team' ? '#6ee7b7' : '#fff' }}>{reply.sender}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{reply.time}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{reply.text}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                {replyingId === ticket.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input className="form-input" placeholder="Type your reply..." value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleReply(ticket.id); }}
                      style={{ flex: 1 }} />
                    <button onClick={() => handleReply(ticket.id)} className="btn-primary btn-sm"><Send size={14} /> Send</button>
                    <button onClick={() => { setReplyingId(null); setReplyText(''); }} className="btn-secondary btn-sm">Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setReplyingId(ticket.id)} className="btn-primary btn-sm">
                      <Send size={13} /> Reply
                    </button>
                    {ticket.status !== 'Resolved' && (
                      <button onClick={() => updateTicketStatus(ticket.id, 'Resolved')} className="btn-outline btn-sm">
                        <CheckCircle2 size={13} /> Mark Resolved
                      </button>
                    )}
                    {ticket.status === 'Resolved' && (
                      <button onClick={() => updateTicketStatus(ticket.id, 'Open')} className="btn-secondary btn-sm">
                        Reopen
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tickets;
