import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Menu, X, ShoppingCart, User, Gift, Droplets,
  Wrench, TrendingUp, Monitor, ChevronRight, Phone, Mail,
  Sparkles, PhoneCall
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';
import ContactModal from './ContactModal';
import WhatsAppButton from './WhatsAppButton';

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const location = useLocation();

  const { getCartItemCount } = useProducts();
  const { user } = useAuth();
  const cartCount = getCartItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/', icon: null },
    { name: 'Gift Gallery', path: '/gifts', icon: Gift },
    { name: 'Drinking Water', path: '/water', icon: Droplets },
    { name: 'Industrial Appliances', path: '/appliances', icon: Wrench },
    { name: 'Digital Marketing', path: '/marketing', icon: TrendingUp },
    { name: 'IT Services', path: '/it-services', icon: Monitor }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Toast />

      {/* Contact Us Popup Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* Floating WhatsApp Button on every page */}
      <WhatsAppButton />

      {/* Top Ticker Bar */}
      <div className="ticker-bar" style={{
        background: 'linear-gradient(90deg, #090d16 0%, #17223b 50%, #090d16 100%)',
        borderBottom: '1px solid var(--border-gold)',
        padding: '0.45rem 1rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        width: '100%'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-gold-light)', fontWeight: 600 }}>
              <Sparkles size={13} /> SHREE PRATHAM CONGLOMERATE
            </span>
            <span className="ticker-tagline" style={{ color: 'var(--text-subtle)' }}>
              • Pan-India Enterprise & Retail Fulfillment
            </span>
          </div>

          <div className="ticker-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem' }}>
            <button
              onClick={() => setContactModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-gold-light)',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
              title="Click to request a callback"
            >
              <Phone size={12} color="var(--accent-gold)" /> +91 (022) 6982-5000
            </button>

            <button
              onClick={() => setContactModalOpen(true)}
              className="ticker-mail"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.78rem'
              }}
              title="Click to contact us"
            >
              <Mail size={12} color="var(--accent-gold)" /> contact@shreepratham.com
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isScrolled ? 'rgba(8, 12, 20, 0.96)' : 'rgba(8, 12, 20, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '2px solid ' + (isScrolled ? 'var(--border-gold)' : 'var(--border-subtle)'),
        transition: 'var(--transition)',
        width: '100%'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem' }}>
          {/* Brand Logo with Official SP Emblem */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid rgba(245, 158, 11, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4), 0 0 16px rgba(245, 158, 11, 0.3)',
              flexShrink: 0
            }}>
              <img
                src="/logo.png"
                alt="Shree Pratham"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="brand-text">
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '1.3rem',
                letterSpacing: '0.04em',
                background: 'linear-gradient(90deg, #ffffff 0%, #fcd34d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1
              }}>
                SHREE PRATHAM
              </div>
              <div className="brand-subtitle" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)', fontWeight: 600 }}>
                Enterprise & Lifestyle Multi-Vertical
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  style={({ isActive }) => ({
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--accent-gold-light)' : 'var(--text-main)',
                    background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                    border: isActive ? '1px solid var(--border-gold)' : '1px solid transparent',
                    transition: 'var(--transition)',
                    whiteSpace: 'nowrap'
                  })}
                >
                  {Icon && <Icon size={15} />}
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Contact Us Button */}
            <button
              onClick={() => setContactModalOpen(true)}
              className="btn-gold btn-sm nav-contact-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.52rem 1.05rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Open Contact Form & Request Callback"
            >
              <PhoneCall size={14} /> <span className="contact-btn-text">Contact Us</span>
            </button>

            {/* Cart Link */}
            <Link
              to="/cart"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff'
              }}
              title="Cart / Checkout"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#080c14',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account / Login */}
            {user ? (
              <Link
                to="/account"
                className="btn-outline btn-sm user-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.52rem 0.85rem' }}
                title="Customer Dashboard"
              >
                <User size={14} />
                <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link to="/login" className="btn-secondary btn-sm user-btn" style={{ padding: '0.52rem 0.9rem' }}>
                <User size={14} /> Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#fff'
              }}
              className="mobile-toggle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            background: 'rgba(8, 12, 20, 0.98)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}>
            {/* Quick Contact Button inside mobile menu */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setContactModalOpen(true);
              }}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', padding: '0.75rem' }}
            >
              <PhoneCall size={17} /> Contact Us & Request Callback
            </button>

            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--accent-gold-light)' : '#fff',
                    background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: isActive ? '1px solid var(--border-gold)' : '1px solid transparent',
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  })}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {Icon && <Icon size={18} color="var(--accent-gold)" />}
                    {link.name}
                  </span>
                  <ChevronRight size={16} color="var(--text-subtle)" />
                </NavLink>
              );
            })}

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {user ? (
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-outline"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}
                >
                  <User size={16} /> My Account & Orders
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-outline"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}
                >
                  <User size={16} /> Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        background: '#05080f',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '4rem',
        paddingBottom: '2.5rem',
        marginTop: '4rem',
        width: '100%'
      }}>
        <div className="container">
          {/* Multi-Vertical Columns Grid */}
          <div className="footer-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3.5rem'
          }}>
            {/* Brand Column with Official Logo */}
            <div className="footer-brand-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '2px solid rgba(245, 158, 11, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4), 0 0 16px rgba(245, 158, 11, 0.25)',
                  flexShrink: 0
                }}>
                  <img
                    src="/logo.png"
                    alt="Shree Pratham"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', margin: 0, letterSpacing: '0.02em' }}>SHREE PRATHAM</h3>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-gold-light)', fontWeight: 600 }}>
                    Enterprise & Lifestyle Conglomerate
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '440px' }}>
                A multi-disciplinary conglomerate providing integrated retail excellence, industrial kitchen equipment, commercial drinking water delivery, digital marketing acceleration, and 24/7 enterprise IT services.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span className="badge-gold">ISO 9001:2015</span>
                <span className="badge-blue">FSSAI Certified</span>
                <span className="badge-green">MSME Registered</span>
              </div>

              <button
                onClick={() => setContactModalOpen(true)}
                className="btn-gold btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.3rem' }}
              >
                <PhoneCall size={15} /> Contact Us & Request Callback
              </button>
            </div>

            {/* Vertical 1: Gift Gallery */}
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--accent-gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Gift size={16} /> Gift Gallery
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <li><Link to="/gifts?category=Corporate" style={{ color: 'inherit' }}>Corporate Gifting Hampers</Link></li>
                <li><Link to="/gifts?category=Wedding" style={{ color: 'inherit' }}>Royal Wedding Favors</Link></li>
                <li><Link to="/gifts?category=Birthday" style={{ color: 'inherit' }}>Birthday Keepsake Boxes</Link></li>
                <li><Link to="/gifts?category=Festive" style={{ color: 'inherit' }}>Festive & Diwali Collections</Link></li>
                <li><Link to="/gifts" style={{ color: 'inherit' }}>Laser Engraving & Personalization</Link></li>
              </ul>
            </div>

            {/* Vertical 2: Drinking Water */}
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--accent-gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Droplets size={16} /> Drinking Water
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <li><Link to="/water" style={{ color: 'inherit' }}>20L Alkaline Jars</Link></li>
                <li><Link to="/water" style={{ color: 'inherit' }}>Bottled Cases (500ml & 1L)</Link></li>
                <li><Link to="/water" style={{ color: 'inherit' }}>Commercial RO Purifiers</Link></li>
                <li><Link to="/water" style={{ color: 'inherit' }}>Weekly & Monthly Subscriptions</Link></li>
                <li><Link to="/water" style={{ color: 'inherit' }}>Pincode Service Area Checker</Link></li>
              </ul>
            </div>

            {/* Vertical 3: Industrial Appliances */}
            <div className="footer-hide-mobile">
              <h4 style={{ fontSize: '1rem', color: 'var(--accent-gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Wrench size={16} /> Industrial Appliances
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <li><Link to="/appliances?cat=Refrigeration" style={{ color: 'inherit' }}>Commercial Deep Freezers</Link></li>
                <li><Link to="/appliances?cat=Refrigeration" style={{ color: 'inherit' }}>Glass Display Chillers</Link></li>
                <li><Link to="/appliances?cat=Cooking" style={{ color: 'inherit' }}>Heavy-Duty 4-Burner Ranges</Link></li>
                <li><Link to="/appliances?cat=Processing" style={{ color: 'inherit' }}>Spiral Dough Kneaders</Link></li>
                <li><Link to="/appliances" style={{ color: 'inherit' }}>Bulk Quotation & Comparison</Link></li>
              </ul>
            </div>

            {/* Vertical 4 & 5: Digital & IT */}
            <div className="footer-hide-mobile">
              <h4 style={{ fontSize: '1rem', color: 'var(--accent-gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <TrendingUp size={16} /> Digital & IT
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <li><Link to="/marketing" style={{ color: 'inherit' }}>SEO Domination Packages</Link></li>
                <li><Link to="/marketing" style={{ color: 'inherit' }}>High-ROAS Paid Ads & Social</Link></li>
                <li><Link to="/it-services" style={{ color: 'inherit' }}>Custom Web & App Dev</Link></li>
                <li><Link to="/it-services" style={{ color: 'inherit' }}>Cloud Infrastructure & DevOps</Link></li>
                <li><Link to="/it-services" style={{ color: 'inherit' }}>24/7 Managed NOC Support</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-subtle)'
          }}>
            <div>
              © 2026 SHREE PRATHAM Group. All rights reserved. Pan-India Operations.
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setContactModalOpen(true)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', fontSize: 'inherit', fontWeight: 600 }}
              >
                Contact Us
              </button>
              <Link to="/cart" style={{ color: 'inherit' }}>Shopping Cart</Link>
              <Link to="/account" style={{ color: 'inherit' }}>Order Tracking</Link>
              <Link to="/login" style={{ color: 'inherit' }}>Customer Login</Link>
              <Link to="/admin/login" style={{ color: 'inherit' }}>Admin Panel</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Media query styling for responsive desktop nav and elements */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .desktop-nav {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .ticker-tagline, .ticker-mail {
            display: none !important;
          }
          .user-btn {
            display: none !important;
          }
          .brand-subtitle {
            display: none !important;
          }
          .footer-brand-col {
            grid-column: span 1 !important;
          }
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .footer-hide-mobile {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .nav-contact-btn {
            padding: 0.45rem 0.6rem !important;
          }
          .contact-btn-text {
            display: none !important;
          }
          .ticker-bar {
            padding: 0.35rem 0.5rem !important;
          }
          .ticker-actions {
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
