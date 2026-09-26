import { useState } from 'react';
import { Save, Key, Mail, Truck, CreditCard, Shield, Lock, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';

const Settings = () => {
  const { settings, updateSettings, showToast } = useAdminData();
  const { adminId, updateCredentials } = useAdminAuth();
  const [form, setForm] = useState({ ...settings });

  const [credForm, setCredForm] = useState({
    loginId: adminId || 'admin',
    newPassword: '',
    confirmPassword: ''
  });
  const [credMsg, setCredMsg] = useState({ text: '', type: '' });

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
  };

  const handleUpdateCreds = (e) => {
    e.preventDefault();
    if (!credForm.loginId.trim()) {
      setCredMsg({ text: 'Admin Login ID cannot be empty.', type: 'error' });
      return;
    }
    if (!credForm.newPassword) {
      setCredMsg({ text: 'Please enter a new password.', type: 'error' });
      return;
    }
    if (credForm.newPassword !== credForm.confirmPassword) {
      setCredMsg({ text: 'Passwords do not match.', type: 'error' });
      return;
    }
    if (credForm.newPassword.length < 4) {
      setCredMsg({ text: 'Password must be at least 4 characters long.', type: 'error' });
      return;
    }

    const success = updateCredentials(credForm.loginId.trim(), credForm.newPassword);
    if (success) {
      setCredMsg({ text: 'Admin credentials updated successfully!', type: 'success' });
      showToast('Admin ID & Password updated successfully!');
      setCredForm(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>System Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Configure administrator credentials, payment gateways, logistics, and notification settings</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
        {/* Admin Login Credentials */}
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Lock size={20} color="var(--accent-emerald-light)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Admin Login ID & Password</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Update the ID and password used to sign in to this Admin Control Center.
          </p>

          {credMsg.text && (
            <div style={{
              background: credMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${credMsg.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              color: credMsg.type === 'success' ? '#6ee7b7' : '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {credMsg.type === 'success' && <CheckCircle2 size={16} />}
              {credMsg.text}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Admin Login ID</label>
              <input
                className="form-input"
                value={credForm.loginId}
                onChange={e => { setCredForm({ ...credForm, loginId: e.target.value }); setCredMsg({ text: '', type: '' }); }}
                placeholder="e.g. admin or director"
              />
            </div>
            <div>
              <label className="form-label">New Password</label>
              <input
                className="form-input"
                type="password"
                value={credForm.newPassword}
                onChange={e => { setCredForm({ ...credForm, newPassword: e.target.value }); setCredMsg({ text: '', type: '' }); }}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                type="password"
                value={credForm.confirmPassword}
                onChange={e => { setCredForm({ ...credForm, confirmPassword: e.target.value }); setCredMsg({ text: '', type: '' }); }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpdateCreds}
            className="btn-primary"
            style={{ marginTop: '1.25rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
          >
            Update Login Credentials
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Razorpay */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CreditCard size={20} color="var(--accent-emerald-light)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Razorpay Payment Gateway</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label"><Key size={12} style={{ verticalAlign: 'middle' }} /> Razorpay API Key</label>
                <input className="form-input" value={form.razorpayKey}
                  onChange={e => setForm({ ...form, razorpayKey: e.target.value })}
                  placeholder="rzp_live_xxxxx" />
              </div>
              <div>
                <label className="form-label">Merchant UPI ID</label>
                <input className="form-input" value={form.merchantUpi}
                  onChange={e => setForm({ ...form, merchantUpi: e.target.value })}
                  placeholder="business@upi" />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Mail size={20} color="#60a5fa" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Email Configuration</h3>
            </div>
            <div>
              <label className="form-label">Official Sales Email</label>
              <input className="form-input" type="email" value={form.salesEmail}
                onChange={e => setForm({ ...form, salesEmail: e.target.value })}
                placeholder="sales@shreepratham.com" />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.25rem', display: 'block' }}>
                Used for order confirmations and invoice dispatch.
              </span>
            </div>
          </div>

          {/* Shiprocket */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Truck size={20} color="#fbbf24" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Shiprocket Logistics</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Shiprocket Email</label>
                <input className="form-input" value={form.shiprocketEmail}
                  onChange={e => setForm({ ...form, shiprocketEmail: e.target.value })}
                  placeholder="logistics@shreepratham.com" />
              </div>
              <div>
                <label className="form-label">Pickup Pincode</label>
                <input className="form-input" value={form.shiprocketPickupPin}
                  onChange={e => setForm({ ...form, shiprocketPickupPin: e.target.value })}
                  placeholder="400050" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Pickup Location Name</label>
                <input className="form-input" value={form.shiprocketPickupLocation}
                  onChange={e => setForm({ ...form, shiprocketPickupLocation: e.target.value })}
                  placeholder="Mumbai Central Hub" />
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div style={{
            padding: '1rem', borderRadius: 'var(--radius-md)',
            background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)',
            display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)'
          }}>
            <Shield size={18} color="#8b5cf6" />
            <span>All credentials are encrypted and stored locally in your browser's localStorage.</span>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save size={16} /> Save All Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
