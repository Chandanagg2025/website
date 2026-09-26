import { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const Login = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAdminAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(loginId, password);
    if (!success) {
      setError('Invalid Admin Login ID or Password. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(16, 185, 129, 0.08) 0%, #080c14 80%)',
      margin: '0 auto'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem',
        margin: '0 auto',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(16, 185, 129, 0.15)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            padding: '8px 18px',
            borderRadius: '14px',
            border: '2px solid rgba(245, 158, 11, 0.5)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
            margin: '0 auto 1.25rem auto'
          }}>
            <img src="/logo.png" alt="Shree Pratham" style={{ height: '52px', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Restricted access for Shree Pratham operations, inventory, and financial management.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Admin Login ID</label>
            <div style={{ position: 'relative' }}>
              <User
                size={16}
                color="var(--text-subtle)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                required
                autoFocus
                placeholder="Enter Admin ID"
                className="form-input"
                value={loginId}
                onChange={e => { setLoginId(e.target.value); setError(''); }}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Admin Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="var(--text-subtle)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter Admin Password"
                className="form-input"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.25rem', fontSize: '0.95rem' }}
          >
            Sign In to Control Center <ArrowRight size={16} />
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          color: 'var(--text-subtle)',
          fontSize: '0.75rem'
        }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>256-bit Encrypted Admin Session</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
