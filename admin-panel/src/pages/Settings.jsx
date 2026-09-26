import { useState } from 'react';
import {
  Save, Key, Mail, Truck, CreditCard, Shield, Lock, CheckCircle2,
  Database, CloudLightning, UploadCloud, ExternalLink, HelpCircle
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getFirebaseConfig } from '../services/firebase';

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
      // Handle both pure JSON or JS object format
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
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>System Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Configure live website cloud database sync, administrator credentials, payment gateways, and logistics.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '750px' }}>

        {/* 1. Firebase Live Cloud Sync */}
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.45)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={22} color="var(--accent-emerald-light)" />
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Live Website Cloud Database (Firebase)</h3>
            </div>
            {cloudConnected ? (
              <span className="badge badge-green" style={{ padding: '0.3rem 0.8rem', fontSize: '0.78rem' }}>
                <span className="status-dot" style={{ background: '#10b981' }} /> Live Connected
              </span>
            ) : (
              <span className="badge badge-gold" style={{ padding: '0.3rem 0.8rem', fontSize: '0.78rem' }}>
                <span className="status-dot" style={{ background: '#f59e0b' }} /> Offline / Local Storage
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
            Because the Admin Panel and your Main Website run on different domains, browsers isolate local data.
            Connecting a free <strong>Firebase Firestore</strong> database allows every product change you make here to
            instantly sync to your live website for all visitors in real-time.
          </p>

          {fbStatusMsg && (
            <div style={{
              background: fbStatusMsg.includes('success') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${fbStatusMsg.includes('success') ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              color: fbStatusMsg.includes('success') ? '#6ee7b7' : '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              {fbStatusMsg}
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Firebase Configuration (Paste JSON from Firebase Console)</span>
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <HelpCircle size={13} /> {showGuide ? 'Hide instructions' : 'How to get free Firebase config (1 min)'}
              </button>
            </label>

            {showGuide && (
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                fontSize: '0.82rem',
                color: '#cbd5e1',
                marginBottom: '1rem',
                lineHeight: 1.6
              }}>
                <div style={{ fontWeight: 700, color: '#93c5fd', marginBottom: '0.5rem' }}>Quick 60-Second Setup (100% Free Forever):</div>
                <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>console.firebase.google.com <ExternalLink size={12} style={{ display: 'inline' }} /></a> and click <strong>Create a project</strong>.</li>
                  <li>In your project home, click the Web icon <code>&lt;/&gt;</code> to register app and copy the <code>firebaseConfig</code> object.</li>
                  <li>In the left sidebar, click <strong>Build &gt; Firestore Database</strong> &gt; <strong>Create database</strong> &gt; choose <strong>Start in test mode</strong> &gt; Enable.</li>
                  <li>Paste the configuration JSON below and click <strong>Save &amp; Connect</strong>!</li>
                </ol>
              </div>
            )}

            <textarea
              className="form-textarea"
              rows={6}
              value={fbJson}
              onChange={e => { setFbJson(e.target.value); setFbStatusMsg(''); }}
              placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "shree-pratham.firebaseapp.com",\n  "projectId": "shree-pratham",\n  "storageBucket": "shree-pratham.appspot.com",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
              style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSaveFirebase}
              className="btn-primary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
            >
              <CloudLightning size={16} /> Save &amp; Connect Cloud Database
            </button>

            {cloudConnected && (
              <button
                type="button"
                onClick={handlePushAll}
                disabled={isSyncing}
                className="btn-gold"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
              >
                <UploadCloud size={16} /> {isSyncing ? 'Syncing...' : 'Sync All Products to Live Website Now'}
              </button>
            )}
          </div>
        </div>

        {/* 2. Admin Login Credentials */}
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Lock size={20} color="var(--accent-emerald-light)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Admin Login ID &amp; Password</h3>
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

        {/* 3. Gateways & Logistics Settings */}
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
            <span>Credentials are securely encrypted and saved in your browser storage.</span>
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
