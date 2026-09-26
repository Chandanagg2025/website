import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Gift, Droplets, Wrench, TrendingUp, Monitor, ArrowRight,
  ShieldCheck, Truck, Star, Award, Sparkles, CheckCircle2,
  Users, ChevronRight, ChevronDown, Zap, Clock
} from 'lucide-react';
import { testimonials } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import PersonalizationModal from '../components/PersonalizationModal';
import QuoteModal from '../components/QuoteModal';

const Home = () => {
  const { giftProducts, waterProducts, appliances, addToCart } = useProducts();
  const [selectedGift, setSelectedGift] = useState(null);
  const [selectedApplianceForQuote, setSelectedApplianceForQuote] = useState(null);

  const verticals = [
    {
      id: 'gifts',
      name: 'Gift Gallery',
      subtitle: 'Luxury Bespoke Gifting & Keepsakes',
      icon: Gift,
      accent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#f59e0b',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
      features: ['Laser Name Engraving', 'Corporate Bulk Hampers', 'Wedding Favors & Keepsakes', 'Velvet & Satin Packaging'],
      link: '/gifts',
      cta: 'Explore Gift Gallery'
    },
    {
      id: 'water',
      name: 'Drinking Water Supply',
      subtitle: 'Pure Alkaline & Micro-Filtered Hydration',
      icon: Droplets,
      accent: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      color: '#38bdf8',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=800&auto=format&fit=crop',
      features: ['20L Mineral Bubble Jars', 'Packaged 500ml/1L Cases', 'Weekly/Monthly Subscriptions', 'Express Pincode Delivery'],
      link: '/water',
      cta: 'Order Water & Subscriptions'
    },
    {
      id: 'appliances',
      name: 'Industrial Appliances',
      subtitle: 'Commercial Foodservice & Kitchen Engineering',
      icon: Wrench,
      accent: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      color: '#818cf8',
      image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800&auto=format&fit=crop',
      features: ['Deep Freezers & Display Chillers', 'Heavy 4-Burner Gas Ranges', 'Spiral Dough Mixers 30KG', 'Side-by-Side Spec Comparison'],
      link: '/appliances',
      cta: 'View Equipment & RFQs'
    },
    {
      id: 'marketing',
      name: 'Digital Marketing',
      subtitle: 'Performance Revenue Acceleration & Social Brand',
      icon: TrendingUp,
      accent: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      color: '#f472b6',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      features: ['High-Intent SEO Keyword Rank', 'Viral Reels & Community', 'High-ROAS Meta & Google Ads', 'Free 45-Min Growth Audit'],
      link: '/marketing',
      cta: 'Scale Your Brand Revenue'
    },
    {
      id: 'it',
      name: 'IT Services & Cloud',
      subtitle: 'Enterprise Software, DevOps & 24/7 Managed NOC',
      icon: Monitor,
      accent: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#34d399',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
      features: ['Custom Web & React Native Apps', 'AWS/Azure Cloud Migration', '15-Min Emergency SLA Helpdesk', 'Cybersecurity Auditing'],
      link: '/it-services',
      cta: 'Explore IT Solutions'
    }
  ];

  return (
    <div>
      {/* 1. HERO SECTION WITH BRAND PROMISE */}
      <section className="fullscreen-hero" style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(2rem, 5vw, 3rem) 0 clamp(1.5rem, 4vw, 2.5rem) 0',
        background: 'radial-gradient(ellipse at 50% 25%, rgba(245, 158, 11, 0.16) 0%, rgba(8, 12, 20, 1) 85%)',
        overflow: 'hidden'
      }}>
        {/* Glow ambient background elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '850px',
          height: '500px',
          background: 'rgba(245, 158, 11, 0.1)',
          filter: 'blur(130px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
          {/* Top Brand Tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="badge-gold">
              <Sparkles size={14} /> The Gold Standard in Multi-Sector Excellence
            </span>
          </div>

          {/* Primary Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.2vw, 4.4rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            marginBottom: '1.25rem',
            maxWidth: '1100px',
            margin: '0 auto 1.25rem auto'
          }}>
            One Conglomerate. <br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Five Pillars of Uncompromising Quality.
            </span>
          </h1>

          {/* Brand Promise Description */}
          <p style={{
            fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: '820px',
            margin: '0 auto 2.25rem auto',
            lineHeight: 1.7
          }}>
            From bespoke luxury gifts and pure mineral drinking water to commercial industrial kitchen appliances, high-ROAS digital marketing funnels, and enterprise-grade 24/7 IT services.
          </p>

          {/* Hero CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <a href="#verticals" className="btn-gold" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
              Explore Our 5 Verticals <ArrowRight size={18} />
            </a>
            <Link to="/gifts" className="btn-outline" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
              Browse Gift Gallery
            </Link>
            <Link to="/water" className="btn-secondary" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}>
              Drinking Water Delivery
            </Link>
          </div>

          {/* Statistics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.75rem',
            maxWidth: '1150px',
            margin: '0 auto 1.5rem auto',
            width: '100%'
          }}>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-gold-light)', lineHeight: 1 }}>50,000+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Fulfilled Orders & Clients</div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>99.8%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>On-Time Pan-India Dispatch</div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>15 Mins</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Emergency IT NOC SLA</div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>4.9 / 5.0</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Client Satisfaction Score</div>
            </div>
          </div>

          {/* Scroll Down to Verticals Indicator */}
          <div style={{ marginTop: '1rem' }}>
            <a
              href="#verticals"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-subtle)',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
              title="Scroll to explore 5 verticals"
            >
              <span>Explore 5 Divisions</span>
              <ChevronDown size={16} className="bounce-animation" color="var(--accent-gold)" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. THE 5 VERTICAL CARDS SECTION */}
      <section id="verticals" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>Multi-Vertical Ecosystem</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '0.75rem' }}>
              Specialized Divisions Under Shree Pratham
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
              Each vertical operates with dedicated domain specialists, modern infrastructure, and stringent quality assurance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' }}>
            {verticals.map((vert, idx) => {
              const Icon = vert.icon;
              return (
                <div
                  key={vert.id}
                  className="glass-card-interactive"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                    gridColumn: idx === 0 || idx === 1 ? 'span 1' : 'span 1'
                  }}
                >
                  {/* Card Image Banner */}
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={vert.image}
                      alt={vert.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.2) 100%)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-sm)',
                        background: vert.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#080c14',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                      }}>
                        <Icon size={20} />
                      </div>
                      <h3 style={{ fontSize: '1.3rem', margin: 0, color: '#fff' }}>{vert.name}</h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: vert.color, fontWeight: 600, marginBottom: '0.75rem' }}>
                      {vert.subtitle}
                    </div>

                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', flex: 1 }}>
                      {vert.features.map((feat, fIdx) => (
                        <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                          <CheckCircle2 size={15} color={vert.color} />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <Link to={vert.link} className="btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
                      <span>{vert.cta}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED / CROSS-SELLING SECTION */}
      <section style={{ padding: '5rem 0', background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge-gold" style={{ marginBottom: '0.4rem' }}>Curated Highlights</span>
              <h2 style={{ fontSize: '2.2rem', margin: 0 }}>Featured Across Our 5 Verticals</h2>
            </div>
            <Link to="/gifts" className="btn-outline btn-sm">
              View All Catalogs <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1.5rem' }}>
            {/* Highlight 1: Gift Gallery */}
            {giftProducts.slice(0, 1).map(gift => (
              <div key={gift.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem' }}>
                  <img src={gift.image} alt={gift.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="badge-gold" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    Gift Gallery
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{gift.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', flex: 1, marginBottom: '1rem' }}>
                  {gift.description.slice(0, 95)}...
                </p>
                <div className="flex justify-between items-center" style={{ marginTop: 'auto', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>₹{gift.price}</span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-subtle)', fontSize: '0.85rem', marginLeft: '0.4rem' }}>₹{gift.originalPrice}</span>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', color: '#fbbf24' }}>
                    <Star size={14} fill="#fbbf24" /> {gift.rating}
                  </span>
                </div>
                <button
                  className="btn-gold btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => setSelectedGift(gift)}
                >
                  <Sparkles size={14} /> Personalize & Add
                </button>
              </div>
            ))}

            {/* Highlight 2: Drinking Water */}
            {waterProducts.slice(0, 1).map(water => (
              <div key={water.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem' }}>
                  <img src={water.image} alt={water.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="badge-blue" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    Drinking Water
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{water.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', flex: 1, marginBottom: '1rem' }}>
                  {water.purity} • {water.description.slice(0, 80)}...
                </p>
                <div className="flex justify-between items-center" style={{ marginTop: 'auto', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>₹{water.price}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginLeft: '0.3rem' }}>/ unit</span>
                  </div>
                  <span className="badge-green" style={{ fontSize: '0.75rem' }}>Daily Routes</span>
                </div>
                <Link to="/water" className="btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  <Droplets size={14} /> Subscribe / Order
                </Link>
              </div>
            ))}

            {/* Highlight 3: Industrial Appliances */}
            {appliances.slice(0, 1).map(app => (
              <div key={app.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem' }}>
                  <img src={app.image} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="badge-gold" style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', borderColor: '#6366f1' }}>
                    Industrial Kitchen
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{app.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', flex: 1, marginBottom: '1rem' }}>
                  {app.specs?.capacity} • {app.specs?.tempRange}
                </p>
                <div className="flex justify-between items-center" style={{ marginTop: 'auto', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>₹{app.price.toLocaleString()}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>In Stock</span>
                </div>
                <button
                  className="btn-gold btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => setSelectedApplianceForQuote(app)}
                >
                  <Wrench size={14} /> Request Bulk Quote
                </button>
              </div>
            ))}

            {/* Highlight 4: Digital & IT */}
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop"
                  alt="Enterprise Services"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="badge-blue" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  Digital & Tech
                </span>
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Growth SEO & Cloud Ops</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', flex: 1, marginBottom: '1rem' }}>
                Turn your digital funnel into an automated customer engine with guaranteed SLA & performance KPIs.
              </p>
              <div className="flex justify-between items-center" style={{ marginTop: 'auto', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>From ₹14,999</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>/mo</span>
                </div>
                <span className="badge-green" style={{ fontSize: '0.75rem' }}>Free Audit</span>
              </div>
              <Link to="/marketing" className="btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <TrendingUp size={14} /> Free Strategy Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST SIGNALS & TESTIMONIALS */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge-gold" style={{ marginBottom: '0.4rem' }}>Verified Reputation</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', marginBottom: '0.75rem' }}>
              Trusted by 50,000+ Indian Businesses & Families
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Here is what enterprise directors, hospitality groups, and corporate leaders have to say about partnering with Shree Pratham.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {testimonials.map(item => (
              <div key={item.id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1rem' }}>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginLeft: '0.5rem' }}>({item.vertical})</span>
                </div>

                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.7, fontStyle: 'italic', flex: 1, marginBottom: '1.5rem' }}>
                  {item.content}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <img
                    src={item.avatar}
                    alt={item.name}
                    style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-gold)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges Bar */}
          <div className="glass-card" style={{
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={32} color="var(--accent-gold)" />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>ISO 9001:2015 Certified</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Audited international management standards</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={32} color="#38bdf8" />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Express Pan-India Logistics</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time GPS tracking & Blue Dart shipping</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={32} color="#34d399" />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>100% Genuine Guarantee</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Food grade SS 304 & lab tested mineral water</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={32} color="#fbbf24" />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>24/7 Dedicated Support</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Human account managers & NOC engineers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals for Interactivity */}
      <PersonalizationModal
        product={selectedGift}
        isOpen={!!selectedGift}
        onClose={() => setSelectedGift(null)}
      />

      <QuoteModal
        appliance={selectedApplianceForQuote}
        isOpen={!!selectedApplianceForQuote}
        onClose={() => setSelectedApplianceForQuote(null)}
      />
    </div>
  );
};

export default Home;
