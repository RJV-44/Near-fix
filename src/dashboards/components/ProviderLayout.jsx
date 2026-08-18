import LogoutButton from '../../components/LogoutButton.jsx'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { label: 'Dashboard', icon: '🏠', hash: 'provider-dashboard' },
  { label: 'My Services', icon: '🛠️', hash: 'provider-my-services' },
  { label: 'Add Service', icon: '➕', hash: 'provider-add-service' },
  { label: 'Bookings', icon: '📋', hash: 'provider-bookings' },
  { label: 'Earnings', icon: '💰', hash: 'provider-earnings' },
  { label: 'Reviews', icon: '⭐', hash: 'provider-reviews' },
  { label: 'Notifications', icon: '🔔', hash: 'provider-notifications' },
  { label: 'Profile', icon: '👤', hash: 'provider-profile' },
  { label: 'Settings', icon: '⚙️', hash: 'provider-settings' },
]

function ProviderLayout({ title, subtitle, children }) {
  const { user } = useAuth()
  const currentHash = window.location.hash

  return (
    <div className="dashboard-layout provider-layout">
      <aside className="dashboard-sidebar">
        <a className="dashboard-brand" href="#provider-dashboard">Local<span style={{fontStyle:'italic'}}>Services</span></a>
        <p className="dashboard-role">⚡ Provider Portal</p>
        <nav>
          {navLinks.map(({ label, icon, hash }) => (
            <a
              key={hash}
              href={`#${hash}`}
              className={currentHash === `#${hash}` ? 'active' : ''}
            >
              <span>{icon}</span> {label}
            </a>
          ))}
        </nav>
        <a className="sidebar-profile" href="#provider-profile">
          <span className="sidebar-avatar">{(user?.businessName || user?.name || 'P')[0].toUpperCase()}</span>
          <div>
            <div style={{ color: '#e2e8f0', fontSize: '0.88rem', fontWeight: 600 }}>{user?.businessName || user?.name || 'My Business'}</div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Service Provider</div>
          </div>
        </a>
        <div className="sidebar-logout"><LogoutButton /></div>
      </aside>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="dashboard-header-actions">
            <a className="notification-button" href="#provider-notifications" aria-label="Notifications" title="Notifications">🔔</a>
            <a className="primary-button" href="#provider-add-service" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>+ Add Service</a>
            <LogoutButton />
          </div>
        </header>
        <main className="dashboard-main">{children}</main>
        <footer className="dashboard-footer">© 2026 LocalServices · <a href="#home" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Back to Home</a></footer>
      </div>
    </div>
  )
}

export default ProviderLayout