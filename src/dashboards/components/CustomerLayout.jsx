import LogoutButton from '../../components/LogoutButton.jsx'
import { useAuth } from '../../context/AuthContext'

const links = ['Dashboard', 'Profile', 'Bookings', 'Booking History', 'Favorites', 'Reviews', 'Notifications', 'Payments', 'Settings']

function CustomerLayout({ title, subtitle, children }) {
  const { user } = useAuth()
  return (
    <div className="dashboard-layout customer-layout">
      <aside className="dashboard-sidebar">
        <a className="dashboard-brand" href="#customer-dashboard">Local<span>Services</span></a>
        <p className="dashboard-role">CUSTOMER PORTAL</p>
        <nav>{links.map((link) => <a key={link} href={`#customer-${link.toLowerCase().replaceAll(' ', '-')}`}>{link}</a>)}</nav>
        <a className="sidebar-profile" href="#customer-profile">?? {user?.name || 'My account'}</a>
        <div className="sidebar-logout"><LogoutButton /></div>
      </aside>
      <div className="dashboard-content">
        <header className="dashboard-header"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="dashboard-header-actions"><a className="notification-button" href="#customer-notifications" aria-label="Notifications">??</a><LogoutButton /></div></header>
        <main className="dashboard-main">{children}</main>
        <footer className="dashboard-footer">© 2026 Local Services · Customer Portal</footer>
      </div>
    </div>
  )
}

export default CustomerLayout