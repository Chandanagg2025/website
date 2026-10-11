import { useState } from 'react';
import {
  Save, Key, Mail, Truck, CreditCard, Shield, Lock, CheckCircle2,
  Database, CloudLightning, UploadCloud, ExternalLink, HelpCircle
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getFirebaseConfig } from '../../services/firebase';

const Settings = () => {
  const {
    settings, updateSettings, showToast,
    cloudConnected, pushAllToCloud, configureFirebase
  } = useAdminData();
  const { adminId, updateCredentials } = useAdminAuth();
  const [form, setForm] = useState({ ...settings });

  // Admin credentials state
  const [credForm, setCredForm] = useState({
    loginId: adminId || 'admin',
    newPassword: '',
    confirmPassword: ''
  });
  const [credMsg, setCredMsg] = useState({ text: '', type: '' });

  // Firebase config state
  const [fbJson, setFbJson] = useState(() => {
    const existing = getFirebaseConfig();
    return existing ? JSON.stringify(existing, null, 2) : '';
  });
  const [fbStatusMsg, setFbStatusMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

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

  const handleSaveFirebase = (e) => {
    e.preventDefault();
    try {
      let parsed;
      const cleaned = fbJson.trim().replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
      try {
        parsed = JSON.parse(fbJson);
      } catch {
        parsed = JSON.parse(cleaned);
      }

      if (!parsed.projectId || !parsed.apiKey) {
        setFbStatusMsg('Config must include at least "apiKey" and "projectId".');
        return;
      }

      const ok = configureFirebase(parsed);
      if (ok) {
        setFbStatusMsg('Firebase Cloud Database connected successfully!');
      }
    } catch (err) {
      setFbStatusMsg('Invalid JSON format. Please paste valid Firebase config JSON.');
    }
  };

  const handlePushAll = async () => {
    setIsSyncing(true);
    await pushAllToCloud();
    setIsSyncing(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Platform Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Configure cloud database synchronization, admin credentials, payment gateways, and logistics
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))', gap: '1.5rem' }}>
        {/* Firebase Cloud Sync Card */}
        <div className="glass-card" style={{ padding: '1.5rem', border: cloudConnected ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: cloudConnected ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Database size={18} color={cloudConnected ? '#10b981' : '#f59e0b'} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Firebase Cloud Sync</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time cross-device database</span>
              </div>
            </div>
            <span className={`badge ${cloudConnected ? 'badge-green' : 'badge-gold'}`}>
              <span className="status-dot" style={{ background: cloudConnected ? '#10b981' : '#f59e0b' }} />
              {cloudConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
            {cloudConnected
              ? 'Firebase Firestore is active. All product additions and updates automatically sync to the cloud database.'
              : 'Local storage and cross-tab sync are active. To enable cloud database sync across different devices, paste your Firebase config below.'}
          </p>

          <form onSubmit={handleSaveFirebase} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Firebase Config JSON</span>
                <button
                  type="button"
                  onClick={() => setShowGuide(!showGuide)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-gold-light)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <HelpCircle size={12} /> {showGuide ? 'Hide Guide' : 'How to get this?'}
                </button>
              </label>
              <textarea
                className="form-textarea"
                rows={4}
                value={fbJson}
                onChange={e => { setFbJson(e.target.value); setFbStatusMsg(''); }}
                placeholder='{\n  "apiKey": "AIzaSy...",\n  "projectId": "your-project-id"\n}'
                style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}
              />
            </div>

            {fbStatusMsg && (
              <div style={{
                fontSize: '0.8rem',
                color: fbStatusMsg.includes('success') ? '#6ee7b7' : '#fca5a5',
                padding: '0.4rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: fbStatusMsg.includes('success') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'
              }}>
                {fbStatusMsg}
              </div>
            )}

            <button type="submit" className="btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
              <Save size={14} /> Connect Firebase Database
            </button>
          </form>

          {showGuide && (
            <div style={{
              background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontSize: '0.78rem',
              color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem'
            }}>
              <strong>Quick 2-minute Firebase setup:</strong>
              <ol style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold-light)' }}>console.firebase.google.com ↗</a></li>
                <li>Create free project &gt; Add Web App &gt; Copy <code>firebaseConfig</code> object.</li>
                <li>Under "Build" &gt; click "Firestore Database" &gt; Create Database (Start in test mode).</li>
                <li>Paste the JSON object above and click Connect!</li>
              </ol>
            </div>
          )}

          {cloudConnected && (
            <button
              onClick={handlePushAll}
              disabled={isSyncing}
              className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
            >
              <UploadCloud size={16} />
              {isSyncing ? 'Syncing Catalog to Cloud...' : 'Sync All Products to Cloud Now'}
            </button>
          )}
        </div>

        {/* Admin Credentials Card */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Shield size={18} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Admin Credentials</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Change your login ID and password</span>
            </div>
          </div>

          <form onSubmit={handleUpdateCreds} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Admin Login ID</label>
              <input
                className="form-input"
                value={credForm.loginId}
                onChange={e => setCredForm({ ...credForm, loginId: e.target.value })}
                placeholder="admin"
              />
            </div>

            <div>
              <label className="form-label">New Password</label>
              <input
                className="form-input"
                type="password"
                value={credForm.newPassword}
                onChange={e => setCredForm({ ...credForm, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="form-label">Confirm New Password</label>
              <input
                className="form-input"
                type="password"
                value={credForm.confirmPassword}
                onChange={e => setCredForm({ ...credForm, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
              />
            </div>

            {credMsg.text && (
              <div style={{
                fontSize: '0.8rem',
                color: credMsg.type === 'success' ? '#6ee7b7' : '#fca5a5',
                padding: '0.4rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: credMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'
              }}>
                {credMsg.text}
              </div>
            )}

            <button type="submit" className="btn-secondary" style={{ marginTop: '0.25rem' }}>
              <Lock size={14} /> Update Credentials
            </button>
          </form>
        </div>

        {/* Payment Gateways Card */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CreditCard size={18} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Payment Gateway Configuration</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Razorpay & Merchant UPI details</span>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Razorpay Key ID</label>
              <input
                className="form-input"
                value={form.razorpayKey || ''}
                onChange={e => setForm({ ...form, razorpayKey: e.target.value })}
                placeholder="rzp_test_51ShreePrathamKey"
              />
            </div>

            <div>
              <label className="form-label">Merchant UPI ID</label>
              <input
                className="form-input"
                value={form.merchantUpi || ''}
                onChange={e => setForm({ ...form, merchantUpi: e.target.value })}
                placeholder="shreepratham@upi"
              />
            </div>

            <div>
              <label className="form-label">Official Sales Notification Email</label>
              <input
                className="form-input"
                type="email"
                value={form.salesEmail || ''}
                onChange={e => setForm({ ...form, salesEmail: e.target.value })}
                placeholder="sales@shreepratham.com"
              />
            </div>

            <button type="submit" className="btn-secondary" style={{ marginTop: '0.25rem' }}>
              <Save size={14} /> Save Payment Settings
            </button>
          </form>
        </div>

        {/* Shiprocket Logistics Card */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Truck size={18} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Shiprocket Logistics & Courier</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automated AWB & shipping labels</span>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Shiprocket Account Email</label>
              <input
                className="form-input"
                type="email"
                value={form.shiprocketEmail || ''}
                onChange={e => setForm({ ...form, shiprocketEmail: e.target.value })}
                placeholder="logistics@shreepratham.com"
              />
            </div>

            <div>
              <label className="form-label">Pickup Hub Location</label>
              <input
                className="form-input"
                value={form.shiprocketPickupLocation || ''}
                onChange={e => setForm({ ...form, shiprocketPickupLocation: e.target.value })}
                placeholder="Mumbai Central Fulfillment Hub"
              />
            </div>

            <div>
              <label className="form-label">Pickup Hub PIN Code</label>
              <input
                className="form-input"
                value={form.shiprocketPickupPin || ''}
                onChange={e => setForm({ ...form, shiprocketPickupPin: e.target.value })}
                placeholder="400050"
              />
            </div>

            <button type="submit" className="btn-secondary" style={{ marginTop: '0.25rem' }}>
              <Save size={14} /> Save Logistics Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
