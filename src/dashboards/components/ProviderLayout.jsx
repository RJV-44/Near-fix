import LogoutButton from '../../components/LogoutButton.jsx'
import { useAuth } from '../../context/AuthContext'

const links = ['Dashboard', 'Profile', 'My Services', 'Add Service', 'Bookings', 'Earnings', 'Reviews', 'Notifications', 'Settings']

function ProviderLayout({ title, subtitle, children }) {
  const { user } = useAuth()
  return (
    <div className="dashboard-layout provider-layout">
      <aside className="dashboard-sidebar">
        <a className="dashboard-brand" href="#provider-dashboard">Local<span>Services</span></a>
        <p className="dashboard-role">PROVIDER PORTAL</p>
        <nav>{links.map((link) => <a key={link} href={`#provider-${link.toLowerCase().replaceAll(' ', '-')}`}>{link}</a>)}</nav>
        <a className="sidebar-profile" href="#provider-profile">?? {user?.businessName || user?.name || 'Provider profile'}</a>
        <div className="sidebar-logout"><LogoutButton /></div>
      </aside>
      <div className="dashboard-content">
        <header className="dashboard-header"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="dashboard-header-actions"><a className="notification-button" href="#provider-notifications" aria-label="Notifications">??</a><LogoutButton /></div></header>
        <main className="dashboard-main">{children}</main>
        <footer className="dashboard-footer">© 2026 Local Services · Provider Portal</footer>
      </div>
    </div>
  )
}

export default ProviderLayout