import { useState } from 'react';
import { Lock } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.id === 'admin' && credentials.password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid ID or Password.');
    }
  };

  return (
    <div className="container pt-32 animate-fade-in mb-8 flex justify-center items-center" style={{ minHeight: '60vh' }}>
      <div className="card card-content" style={{ maxWidth: '400px', width: '100%', background: 'linear-gradient(135deg, #111, #1a1a1a)' }}>
        <div className="text-center mb-6">
          <div style={{ display: 'inline-block', padding: '1rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%', color: 'var(--secondary-color)', marginBottom: '1rem' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', letterSpacing: '0.05em' }}>Admin Access</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}
          
          <div className="mb-4">
            <label style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin ID</label>
            <input 
              type="text" 
              value={credentials.id} 
              onChange={e => setCredentials({...credentials, id: e.target.value})} 
              required 
              style={{ background: 'transparent', borderBottom: '1px solid #333', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, paddingLeft: 0 }}
            />
          </div>
          
          <div className="mb-6">
            <label style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
            <input 
              type="password" 
              value={credentials.password} 
              onChange={e => setCredentials({...credentials, password: e.target.value})} 
              required 
              style={{ background: 'transparent', borderBottom: '1px solid #333', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, paddingLeft: 0 }}
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full" style={{ width: '100%', borderRadius: '0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
