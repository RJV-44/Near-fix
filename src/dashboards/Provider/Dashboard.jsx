import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import StatCard from '../components/StatCard.jsx'
import { useAuth } from '../../context/AuthContext'
import { bookingAPI, paymentAPI, reviewAPI, serviceAPI } from '../../api.js'

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ requests: 0, confirmed: 0, completed: 0, earnings: 0, rating: 0, services: 0 })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, payments, reviews, services] = await Promise.all([
          bookingAPI.getAll(),
          paymentAPI.getAll(),
          reviewAPI.getAll({ mine: 'true' }),
          serviceAPI.getAll({ mine: 'true' }),
        ])
        const pending = bookings.filter(b => b.status === 'pending')
        const confirmed = bookings.filter(b => b.status === 'confirmed')
        const done = bookings.filter(b => b.status === 'completed')
        const totalEarnings = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
        const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0
        setStats({
          requests: pending.length,
          confirmed: confirmed.length,
          completed: done.length,
          earnings: totalEarnings,
          rating: Math.round(avgRating * 10) / 10,
          services: services.length,
        })
        setRecentBookings(bookings.slice(0, 5))
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
    <ProviderLayout
      title={`${greeting}, ${user?.businessName || user?.name?.split(' ')[0] || 'Provider'}!`}
      subtitle="Here's an overview of your business activity today."
    >
      <section className="stat-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)', marginBottom: '1.75rem' }}>
        <StatCard icon="📋" label="New Requests" value={stats.requests.toString()} trend={stats.requests > 0 ? 'Action needed' : undefined} color="#fff7ed" />
        <StatCard icon="🔵" label="Confirmed" value={stats.confirmed.toString()} color="#eff6ff" />
        <StatCard icon="✅" label="Completed" value={stats.completed.toString()} color="#f0fdf4" />
        <StatCard icon="💰" label="Total Earnings" value={`$${stats.earnings.toFixed(0)}`} color="#fefce8" />
        <StatCard icon="⭐" label="Avg Rating" value={stats.rating > 0 ? stats.rating.toFixed(1) : '—'} color="#fdf4ff" />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1.25rem' }}>
        {/* Recent Bookings */}
        <section className="panel">
          <div className="panel-heading">
            <div><h2>Recent Bookings</h2><p>Pending and upcoming appointments.</p></div>
            <a className="text-button" href="#provider-bookings">View all →</a>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Customer</th><th>Service</th><th>Date & Time</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Loading...</td></tr>
                ) : recentBookings.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No bookings yet. Add services for customers to book!</td></tr>
                ) : (
                  recentBookings.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.customer?.name || 'Customer'}</strong><div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{b.customer?.email || ''}</div></td>
                      <td>{b.service?.title || 'Service'}</td>
                      <td>{b.date}<div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{b.time}</div></td>
                      <td><strong>${parseFloat(b.totalPrice || 0).toFixed(0)}</strong></td>
                      <td><span className={`status status-${b.status || 'pending'}`}>{b.status || 'Pending'}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Summary panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <section className="panel">
            <div className="panel-heading"><div><h2>My Services</h2><p>{stats.services} listed</p></div><a className="text-button" href="#provider-my-services">Manage →</a></div>
            <a className="primary-button" href="#provider-add-service" style={{ textDecoration: 'none', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>+ Add New Service</a>
          </section>
          <section className="panel">
            <div className="panel-heading"><div><h2>Rating & Reviews</h2></div></div>
            <div style={{ textAlign: 'center', padding: '0.5rem 0 0.75rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--brand)', letterSpacing: '-0.04em' }}>
                {stats.rating > 0 ? stats.rating.toFixed(1) : '—'}
              </div>
              <div style={{ color: 'var(--warning)', fontSize: '1.25rem', margin: '0.3rem 0' }}>★★★★★</div>
              <a className="text-button" href="#provider-reviews">View all reviews →</a>
            </div>
          </section>
        </div>
      </div>
    </ProviderLayout>
  )
}

export default Dashboard