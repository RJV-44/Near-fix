import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
import StatCard from '../components/StatCard.jsx'
import { useAuth } from '../../context/AuthContext'
import { bookingAPI, favoriteAPI } from '../../api.js'

function Dashboard() {
  const { user } = useAuth()
  const [upcoming, setUpcoming] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [favorites, setFavorites] = useState(0)
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, favoritesData] = await Promise.all([
          bookingAPI.getAll(),
          favoriteAPI.getAll(),
        ])
        const upcomingB = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed')
        const completedB = bookings.filter(b => b.status === 'completed')
        setUpcoming(upcomingB.length)
        setCompleted(completedB.length)
        setFavorites(favoritesData.length)
        setRecentBookings(bookings.slice(0, 4))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? '☀️ Good morning' : hour < 17 ? '🌤️ Good afternoon' : '🌙 Good evening'

  return (
    <CustomerLayout
      title={`${greeting}, ${user?.name?.split(' ')[0] || 'there'}!`}
      subtitle="Here's what's happening with your bookings today."
    >
      <section className="stat-grid customer-stats" style={{ marginBottom: '1.75rem' }}>
        <StatCard icon="📅" label="Upcoming Bookings" value={upcoming.toString()} trend={upcoming > 0 ? 'Active' : undefined} color="#eff6ff" />
        <StatCard icon="✅" label="Completed Services" value={completed.toString()} color="#f0fdf4" />
        <StatCard icon="❤️" label="Saved Providers" value={favorites.toString()} color="#fff1f2" />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Recent Bookings */}
        <section className="panel">
          <div className="panel-heading">
            <div><h2>Recent Bookings</h2><p>Your latest service activity.</p></div>
            <a className="text-button" href="#customer-bookings">View all →</a>
          </div>
          <div className="booking-list">
            {loading ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
            ) : recentBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No bookings yet!</p>
                <a className="primary-button" href="#services" style={{ textDecoration: 'none', display: 'inline-flex' }}>Browse Services</a>
              </div>
            ) : (
              recentBookings.map(b => (
                <div className="booking-card" key={b.id}>
                  <div className="booking-icon">
                    {b.service?.category?.includes('Clean') ? '🧹' : b.service?.category?.includes('Plumb') ? '🚰' : '🛠️'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ fontSize: '0.9rem' }}>{b.service?.title || 'Service'}</strong>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.15rem' }}>{b.provider?.businessName || b.provider?.name || 'Provider'} · {b.date}</p>
                  </div>
                  <span className={`status status-${b.status || 'pending'}`}>{b.status || 'Pending'}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="panel">
          <div className="panel-heading">
            <div><h2>Quick Actions</h2><p>Jump to common tasks.</p></div>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              { icon: '🔍', label: 'Browse Services', sub: 'Find and book local pros', href: '#services', primary: true },
              { icon: '📋', label: 'My Bookings', sub: 'View all upcoming appointments', href: '#customer-bookings', primary: false },
              { icon: '❤️', label: 'Saved Favorites', sub: 'Quickly rebook trusted providers', href: '#customer-favorites', primary: false },
              { icon: '💳', label: 'Payments', sub: 'View payment history', href: '#customer-payments', primary: false },
            ].map(({ icon, label, sub, href, primary }) => (
              <a key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', textDecoration: 'none', transition: 'all 0.2s', background: primary ? 'var(--brand-bg)' : 'var(--bg)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-light)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{label}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{sub}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </CustomerLayout>
  )
}

export default Dashboard