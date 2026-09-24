import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginAdmin, loginDemoAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid admin credentials. Use "admin123" or click the demo button below.');
    }
  };

  const handleDemoAdmin = () => {
    loginDemoAdmin();
    navigate('/admin');
  };

  return (
    <div style={{ padding: '5rem 1.5rem 6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.5rem',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(16, 185, 129, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            padding: '8px 20px',
            borderRadius: '14px',
            border: '2px solid rgba(245, 158, 11, 0.6)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
            margin: '0 auto 1.25rem auto'
          }}>
            <img
              src="/logo.png"
              alt="Shree Pratham"
              style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Restricted access for Shree Pratham operations, orders, water routes, and ticket management.
          </p>
        </div>

        {/* 1-Click Demo Admin Access */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px dashed #10b981',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.75rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 600, marginBottom: '0.4rem' }}>
            ⚡ 1-Click Administrator Access:
          </div>
          <button
            type="button"
            className="btn-gold btn-sm"
            onClick={handleDemoAdmin}
            style={{ width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}
          >
            <Sparkles size={15} /> Sign In As Admin Director
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label className="form-label">Master Admin Security Key</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="Enter admin password (e.g. admin123)"
                className="form-input"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.3rem', display: 'block' }}>
              Default credential: <code>admin123</code>
            </span>
          </div>

          <button
            type="submit"
            className="btn-gold"
            style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}
          >
            Access Operations Console <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
