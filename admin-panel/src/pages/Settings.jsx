import { useState } from 'react';
import { Save, Key, Mail, Truck, CreditCard, Shield } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

const Settings = () => {
  const { settings, updateSettings } = useAdminData();
  const [form, setForm] = useState({ ...settings });

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>System Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Configure payment gateways, logistics, and notification settings</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
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
          <span>All credentials are stored locally in your browser's localStorage. For production, integrate with a secure backend vault.</span>
        </div>

        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
          <Save size={16} /> Save All Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
