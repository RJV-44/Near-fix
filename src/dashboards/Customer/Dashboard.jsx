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
  const [nextBooking, setNextBooking] = useState(null)
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
        if (upcomingB.length > 0) setNextBooking(upcomingB[0])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return <CustomerLayout title={`Welcome back, ${user?.name || 'Customer'}`} subtitle="Manage your services and upcoming bookings.">
    <section className="stat-grid customer-stats">
      <StatCard icon="📅" label="Upcoming bookings" value={upcoming.toString()} />
      <StatCard icon="✅" label="Completed services" value={completed.toString()} />
      <StatCard icon="❤️" label="Favorite providers" value={favorites.toString()} />
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>Upcoming booking</h2><p>Your next confirmed service.</p></div><a className="primary-button" href="#customer-bookings">View all bookings</a></div>
      {loading ? <p>Loading...</p> : nextBooking ? <article className="customer-booking"><div className="booking-icon">📋</div><div><strong>{nextBooking.service?.title || 'Service'}</strong><p>{nextBooking.provider?.businessName || nextBooking.provider?.name || 'Provider'} · {nextBooking.date} {nextBooking.time || ''}</p><span className={`status status-${nextBooking.status?.toLowerCase() || 'pending'}`}>{nextBooking.status || 'Pending'}</span></div></article> : <p>No upcoming bookings. <a href="#services">Browse services</a> to book one!</p>}
    </section>
  </CustomerLayout>
}
export default Dashboard