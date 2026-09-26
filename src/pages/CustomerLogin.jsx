import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CustomerLogin = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const { loginCustomer, loginDemoCustomer, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/account';

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCustomer(email, phone, name);
    navigate(redirectPath);
  };

  const handleDemoLogin = () => {
    loginDemoCustomer();
    navigate(redirectPath);
  };

  return (
    <div style={{ padding: '4rem 1.5rem 6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2.5rem',
        border: '1px solid var(--border-gold)',
        boxShadow: 'var(--shadow-lg), var(--gold-glow)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            padding: '10px 24px',
            borderRadius: '16px',
            border: '2px solid rgba(245, 158, 11, 0.6)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(245, 158, 11, 0.25)',
            margin: '0 auto 1.25rem auto'
          }}>
            <img
              src="/logo.png"
              alt="Shree Pratham"
              style={{
                height: '70px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>
            {isRegister ? 'Create Shree Pratham Account' : 'Welcome to Shree Pratham'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isRegister ? 'Register for retail orders, subscriptions, and quotes' : 'Sign in to access orders, subscriptions, and tickets'}
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px dashed var(--accent-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.75rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold-light)', fontWeight: 600, marginBottom: '0.4rem' }}>
            ⚡ Instant 1-Click Evaluator Access:
          </div>
          <button
            type="button"
            className="btn-gold btn-sm"
            onClick={handleDemoLogin}
            style={{ width: '100%' }}
          >
            <Sparkles size={15} /> Sign In As Demo Customer (Rajesh Sharma)
          </button>
        </div>

        {/* Tab switch between Sign In and Register */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.9rem',
              background: !isRegister ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: !isRegister ? 'var(--accent-gold-light)' : 'var(--text-muted)'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.9rem',
              background: isRegister ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: isRegister ? 'var(--accent-gold-light)' : 'var(--text-muted)'
            }}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
            <div>
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="name@company.com"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Mobile Number *</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="tel"
                required
                placeholder="+91 88519 XXXXX"
                className="form-input"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}>
            {isRegister ? 'Complete Registration' : 'Sign In to Dashboard'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Are you a system administrator? </span>
          <Link to="/admin/login" style={{ color: 'var(--accent-gold-light)', fontWeight: 600 }}>
            Admin Portal Access →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
