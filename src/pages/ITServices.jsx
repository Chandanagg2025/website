import { useState } from 'react';
import {
  Monitor, Cloud, Shield, Headphones, Code2, CheckCircle2,
  Clock, ArrowRight, LifeBuoy, Server, Cpu, FileCheck
} from 'lucide-react';
import { itServicesCatalog, itPricingTiers } from '../data/mockData';
import TicketModal from '../components/TicketModal';

const ITServices = () => {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState(null);

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* 1. Header / Hero */}
      <section style={{
        padding: '3.5rem 0 3rem 0',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(16, 185, 129, 0.15) 0%, rgba(8, 12, 20, 1) 80%)',
        borderBottom: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="badge-green" style={{ marginBottom: '0.75rem' }}>
            <Monitor size={14} /> Shree Pratham IT Division & NOC
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '0.75rem' }}>
            Mission-Critical Enterprise IT, Cloud & App Engineering
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
            From high-scale React/Next.js web applications and AWS cloud migration to round-the-clock helpdesk and proactive cybersecurity audits with a 15-minute emergency SLA guarantee.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn-gold"
              onClick={() => setIsTicketModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', padding: '0.9rem 2rem' }}
            >
              <LifeBuoy size={18} /> Open IT Support Ticket
            </button>
            <a href="#pricing-tiers" className="btn-outline" style={{ borderColor: '#10b981', color: '#6ee7b7' }}>
              View IT Support Tiers
            </a>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            maxWidth: '900px',
            margin: '3rem auto 0 auto'
          }}>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>15 Min</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emergency SLA Response</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa' }}>99.99%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cloud Uptime Guaranteed</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>24/7/365</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Continuous NOC Monitoring</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a78bfa' }}>ISO 27001</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>InfoSec Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Service Catalog (Web Dev, Cloud, Support, Cybersecurity) */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge-blue" style={{ marginBottom: '0.4rem' }}>Capabilities</span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Comprehensive IT Service Catalog</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              High-throughput software engineering and managed IT services backed by certified engineers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {itServicesCatalog.map(service => (
              <div
                key={service.id}
                className="glass-card-interactive"
                style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge-green">{service.category}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)', fontWeight: 700 }}>
                    Starts at {service.startingPrice}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#fff' }}>{service.title}</h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {service.description}
                </p>

                {/* Tech Stack Pills */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, marginBottom: '0.4rem' }}>
                    TECH STACK & TOOLS:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {service.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          padding: '0.2rem 0.6rem',
                          fontSize: '0.75rem',
                          color: '#e2e8f0'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div style={{ marginBottom: '1.75rem', flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, marginBottom: '0.4rem' }}>
                    KEY DELIVERABLES:
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {service.deliverables.map((d, dIdx) => (
                      <li key={dIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <CheckCircle2 size={14} color="#10b981" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className="btn-outline"
                  onClick={() => setIsTicketModalOpen(true)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Request Technical Proposal <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Pricing Tiers (Starter, Growth, Enterprise) */}
      <section id="pricing-tiers" style={{ padding: '4rem 0', background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge-gold" style={{ marginBottom: '0.4rem' }}>Managed Support Plans</span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>IT Infrastructure & Support Tiers</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
              Predictable monthly pricing with dedicated helpdesk engineers, endpoint antivirus, and cloud backups.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '2rem' }}>
            {itPricingTiers.map(tier => (
              <div
                key={tier.id}
                className="glass-card-interactive"
                style={{
                  padding: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: tier.popular ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                  background: tier.popular ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)' : 'var(--bg-card)'
                }}
              >
                {tier.popular && (
                  <span className="badge-green" style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#10b981',
                    color: '#080c14',
                    fontWeight: 800
                  }}>
                    ★ {tier.badge}
                  </span>
                )}

                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.35rem', color: '#fff' }}>{tier.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  {tier.description}
                </p>

                {/* Price */}
                <div style={{
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '1.25rem 0',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-gold-light)', lineHeight: 1 }}>
                    ₹{tier.price.toLocaleString()}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 500, marginLeft: '0.4rem' }}>
                      {tier.period}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, marginTop: '0.5rem' }}>
                    SLA: {tier.sla}
                  </div>
                </div>

                {/* Features */}
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
                  {tier.features.map((f, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className="btn-gold"
                  style={{
                    width: '100%',
                    background: tier.popular ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.08)',
                    color: tier.popular ? '#fff' : '#fff',
                    borderColor: tier.popular ? 'transparent' : 'var(--border-subtle)'
                  }}
                  onClick={() => setIsTicketModalOpen(true)}
                >
                  <Monitor size={16} /> {tier.actionText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Support Ticket / Helpdesk NOC Contact Section */}
      <section style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: '3rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <span className="badge-green" style={{ marginBottom: '0.5rem' }}>
                  24/7 Rapid Helpdesk Response
                </span>
                <h3 style={{ fontSize: '1.9rem', marginBottom: '0.75rem' }}>
                  Experiencing an IT Incident or Cloud Problem?
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Open a tracked ticket immediately. Our automated NOC dispatcher routes your incident to an on-call Level-2 systems engineer within 15 minutes.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#fff' }}>
                  <div>📞 Emergency Escalation Line: <strong>+91 (022) 6982-5000</strong></div>
                  <div>✉️ Direct NOC Dispatch: <strong>noc@shreepratham.com</strong></div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  className="btn-gold"
                  onClick={() => setIsTicketModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    padding: '1.1rem 2.5rem',
                    fontSize: '1.05rem',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <LifeBuoy size={20} /> Open Tracked Support Ticket
                </button>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.75rem' }}>
                  Tickets appear live in both your Customer Portal and the Admin Console
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Creation Modal */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
      />
    </div>
  );
};

export default ITServices;
