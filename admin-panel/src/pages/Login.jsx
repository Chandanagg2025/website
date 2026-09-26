import { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginDemo } = useAdminAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError('Invalid admin credentials. Use "admin123" or click the demo button below.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(16, 185, 129, 0.08) 0%, #080c14 80%)'
    }}>
      <div className="glass-card" style={{
        width: '100%', maxWidth: '440px', padding: '2.5rem',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(16, 185, 129, 0.15)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#ffffff', padding: '8px 18px', borderRadius: '14px',
            border: '2px solid rgba(245, 158, 11, 0.5)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)', margin: '0 auto 1.25rem auto'
          }}>
            <img src="/logo.png" alt="Shree Pratham" style={{ height: '52px', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Restricted access for Shree Pratham operations, inventory, and financial management.
          </p>
        </div>

        {/* Demo Access */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px dashed rgba(16, 185, 129, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem', marginBottom: '1.5rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#6ee7b7', fontWeight: 600, marginBottom: '0.4rem' }}>
            ⚡ 1-Click Administrator Access:
          </div>
          <button onClick={loginDemo} className="btn-primary" style={{ width: '100%' }}>
            <Sparkles size={15} /> Sign In As Admin Director
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5', padding: '0.7rem', borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem', marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Master Admin Security Key</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="Enter admin password"
                className="form-input"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.25rem', display: 'block' }}>
              Default: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>admin123</code>
            </span>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Access Control Center <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
