import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, BarChart3, ShoppingCart, CreditCard,
  MessageSquare, LifeBuoy, Settings, LogOut, Menu, X, Sparkles, ChevronRight,
  ExternalLink, Home
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminData } from '../context/AdminDataContext';

const navItems = [
  { name: 'Dashboard', path: '', icon: LayoutDashboard },
  { name: 'Products & Catalog', path: 'products', icon: Package },
  { name: 'Stock Management', path: 'stock', icon: BarChart3 },
  { name: 'Orders & Tracking', path: 'orders', icon: ShoppingCart },
  { name: 'Payments & Revenue', path: 'payments', icon: CreditCard },
  { name: 'Customer Inquiries', path: 'queries', icon: MessageSquare },
  { name: 'IT Support Tickets', path: 'tickets', icon: LifeBuoy },
  { name: 'Settings & Cloud Sync', path: 'settings', icon: Settings },
];

const AdminLayout = () => {
  const { logout } = useAdminAuth();
  const { toast } = useAdminData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 49
          }}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div style={{ padding: '1.25rem 1.15rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#ffffff', border: '2px solid rgba(245, 158, 11, 0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '3px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', flexShrink: 0
            }}>
              <img src="/logo.png" alt="SP" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#fff', lineHeight: 1.1 }}>SHREE PRATHAM</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent-emerald-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Control Center</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ''}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{item.name}</span>
                <ChevronRight size={14} style={{ opacity: 0.3 }} />
              </NavLink>
            );
          })}
        </nav>

        {/* Storefront Jump & Logout */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <Link
            to="/"
            target="_blank"
            className="sidebar-item"
            style={{ color: 'var(--accent-gold-light)' }}
            title="Open customer storefront in new tab"
          >
            <Home size={17} />
            <span style={{ flex: 1 }}>Customer Storefront</span>
            <ExternalLink size={13} style={{ opacity: 0.6 }} />
          </Link>

          <button onClick={logout} className="sidebar-item" style={{ width: '100%', color: '#fca5a5' }}>
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Top Sticky Header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(8, 12, 20, 0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.75rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none', alignItems: 'center', justifyContent: 'center',
                width: '38px', height: '38px', borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)',
                color: '#fff', cursor: 'pointer'
              }}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="var(--accent-emerald-light)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Operations Console • Multi-Vertical Control
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/"
              target="_blank"
              className="btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
              title="Open storefront"
            >
              <ExternalLink size={14} /> View Storefront ↗
            </Link>

            <span className="badge badge-green" style={{ padding: '0.3rem 0.75rem' }}>
              <span className="status-dot" style={{ background: '#10b981', margin: 0, marginRight: '0.35rem' }} /> System Live
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '1.5rem' }}>
          <Outlet />
        </main>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          background: toast.type === 'success' ? '#0d2818' : toast.type === 'error' ? '#2d0a0a' : '#131d31',
          border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'var(--border-gold)'}`,
          color: '#fff', padding: '0.85rem 1.3rem', borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.7)', fontSize: '0.9rem', maxWidth: '400px',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {toast.message}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-main {
            margin-left: 0 !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
