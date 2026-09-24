import { useState } from 'react';
import {
  TrendingUp, Search, Share2, Target, CheckCircle2,
  Calendar, Clock, Video, ArrowRight, Star, Sparkles, BarChart3,
  Award, ShieldCheck
} from 'lucide-react';
import { marketingPackages, marketingCaseStudies } from '../data/mockData';
import ConsultationModal from '../components/ConsultationModal';

const DigitalMarketing = () => {
  const [selectedServiceForConsultation, setSelectedServiceForConsultation] = useState(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const handleOpenBooking = (serviceName) => {
    setSelectedServiceForConsultation(serviceName);
    setIsConsultationOpen(true);
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* 1. Header / Hero */}
      <section style={{
        padding: '3.5rem 0 3rem 0',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(236, 72, 153, 0.15) 0%, rgba(8, 12, 20, 1) 80%)',
        borderBottom: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div className="container">
          <span className="badge-gold" style={{ background: 'rgba(236, 72, 153, 0.15)', borderColor: '#ec4899', color: '#f472b6', marginBottom: '0.75rem' }}>
            <TrendingUp size={14} /> Shree Pratham Growth Marketing
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '0.75rem' }}>
            Engineered For High ROAS, Viral Reach & Organic Dominance
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
            We do not sell vanity impressions. We architect high-converting acquisition funnels combining technical Google SEO, high-retention short-form video creative, and profit-driven Meta & Google Ads.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn-gold"
              onClick={() => handleOpenBooking('High-ROAS Paid Performance Ads')}
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: '#fff', padding: '0.9rem 2rem' }}
            >
              <Calendar size={18} /> Book Free 45-Min Growth Audit
            </button>
            <a href="#case-studies" className="btn-outline" style={{ borderColor: '#ec4899', color: '#f472b6' }}>
              View Verified Case Studies
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            maxWidth: '900px',
            margin: '3rem auto 0 auto'
          }}>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f472b6' }}>4.8x</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Client ROAS</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>₹40+ Cr</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tracked Client Revenue</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>150+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Google #1 Keyword Ranks</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6ee7b7' }}>100%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transparent Live Dashboards</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Service Packages (SEO, Social, PPC, 360 Full-Funnel) */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge-blue" style={{ marginBottom: '0.4rem' }}>Turnkey Execution</span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Performance Marketing Packages</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Choose a focused growth sprint or our end-to-end 360° CMO-level department.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2rem' }}>
            {marketingPackages.map(pkg => (
              <div
                key={pkg.id}
                className="glass-card-interactive"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: pkg.popular ? '2px solid #ec4899' : '1px solid var(--border-subtle)',
                  background: pkg.popular ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)' : 'var(--bg-card)'
                }}
              >
                {pkg.popular && (
                  <span className="badge-gold" style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#ec4899',
                    color: '#fff',
                    borderColor: '#f472b6'
                  }}>
                    ★ High Demand
                  </span>
                )}

                <div style={{ fontSize: '0.82rem', color: '#f472b6', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {pkg.category} Specialization
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#fff' }}>{pkg.name}</h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {pkg.tagline}
                </p>

                {/* Price Display */}
                <div style={{
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '1rem 0',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold-light)', lineHeight: 1 }}>
                    ₹{pkg.price.toLocaleString()}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 500, marginLeft: '0.4rem' }}>
                      {pkg.period}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: '0.4rem' }}>
                    Timeline: {pkg.timeline}
                  </div>
                </div>

                {/* Features List */}
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={16} color="#ec4899" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className="btn-gold"
                  style={{
                    width: '100%',
                    background: pkg.popular ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' : 'rgba(255, 255, 255, 0.08)',
                    color: pkg.popular ? '#fff' : 'var(--text-main)',
                    borderColor: pkg.popular ? 'transparent' : 'var(--border-subtle)'
                  }}
                  onClick={() => handleOpenBooking(pkg.name)}
                >
                  <Calendar size={16} /> Book Strategy Call
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Case Studies / Portfolio */}
      <section id="case-studies" style={{ padding: '4rem 0', background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge-gold" style={{ marginBottom: '0.4rem' }}>Proven Track Record</span>
            <h2 style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}>Real Client Transformations</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
              We partner with ambitious Indian and global brands to build sustained market leadership.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {marketingCaseStudies.map(cs => (
              <div key={cs.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '200px' }}>
                  <img src={cs.image} alt={cs.client} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="badge-blue" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    {cs.industry}
                  </span>
                </div>

                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#fff' }}>{cs.client}</h3>

                  {/* Metrics Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    textAlign: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    {cs.metrics.map((m, mIdx) => (
                      <div key={mIdx}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                          {m.value}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#fff' }}>Challenge:</strong> {cs.challenge}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    <strong style={{ color: '#6ee7b7' }}>Solution:</strong> {cs.solution}
                  </div>

                  <div style={{
                    marginTop: 'auto',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '1rem',
                    fontStyle: 'italic',
                    fontSize: '0.85rem',
                    color: '#94a3b8'
                  }}>
                    {cs.testimonial}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Consultation Booking Banner */}
      <section style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: '3rem',
            textAlign: 'center',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(236, 72, 153, 0.4)'
          }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
              Ready to Accelerate Your Brand's Online Acquisition?
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 2rem auto', fontSize: '1rem' }}>
              Reserve a complimentary 45-minute growth review with our Senior Strategist. We will analyze your website UX, Google rankings, and ad accounts live on screen.
            </p>
            <button
              className="btn-gold"
              onClick={() => handleOpenBooking('360° Omnichannel Growth Engine')}
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: '#fff', padding: '1rem 2.5rem', fontSize: '1rem' }}
            >
              <Video size={18} /> Schedule Strategy Zoom Call
            </button>
          </div>
        </div>
      </section>

      {/* Consultation Booking Modal */}
      <ConsultationModal
        initialService={selectedServiceForConsultation}
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
};

export default DigitalMarketing;
