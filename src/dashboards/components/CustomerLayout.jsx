import LogoutButton from '../../components/LogoutButton.jsx'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { label: 'Dashboard', icon: '🏠', hash: 'customer-dashboard' },
  { label: 'My Bookings', icon: '📅', hash: 'customer-bookings' },
  { label: 'Booking History', icon: '🕐', hash: 'customer-booking-history' },
  { label: 'Favorites', icon: '❤️', hash: 'customer-favorites' },
  { label: 'Reviews', icon: '⭐', hash: 'customer-reviews' },
  { label: 'Payments', icon: '💳', hash: 'customer-payments' },
  { label: 'Notifications', icon: '🔔', hash: 'customer-notifications' },
  { label: 'Profile', icon: '👤', hash: 'customer-profile' },
  { label: 'Settings', icon: '⚙️', hash: 'customer-settings' },
]

function CustomerLayout({ title, subtitle, children }) {
  const { user } = useAuth()
  const currentHash = window.location.hash

  return (
    <div className="dashboard-layout customer-layout">
      <aside className="dashboard-sidebar">
        <a className="dashboard-brand" href="#customer-dashboard">Local<span style={{fontStyle:'italic'}}>Services</span></a>
        <p className="dashboard-role">✦ Customer Portal</p>
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
        <a className="sidebar-profile" href="#customer-profile">
          <span className="sidebar-avatar">{(user?.name || 'C')[0].toUpperCase()}</span>
          <div>
            <div style={{ color: '#e2e8f0', fontSize: '0.88rem', fontWeight: 600 }}>{user?.name || 'My Account'}</div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Customer</div>
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
            <a className="notification-button" href="#customer-notifications" aria-label="Notifications" title="Notifications">🔔</a>
            <a className="secondary-button" href="#services" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>🔍 Browse Services</a>
            <LogoutButton />
          </div>
        </header>
        <main className="dashboard-main">{children}</main>
        <footer className="dashboard-footer">© 2026 LocalServices · <a href="#home" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Back to Home</a></footer>
      </div>
    </div>
  )
}

export default CustomerLayout