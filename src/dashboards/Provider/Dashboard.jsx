import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import StatCard from '../components/StatCard.jsx'
import BookingCard from '../components/BookingCard.jsx'
import { useAuth } from '../../context/AuthContext'
import { bookingAPI, paymentAPI, reviewAPI, serviceAPI } from '../../api.js'

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ requests: 0, completed: 0, earnings: 0, rating: 0, services: 0 })
  const [schedule, setSchedule] = useState([])
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
        const done = bookings.filter(b => b.status === 'completed')
        const totalEarnings = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
        const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0
        setStats({
          requests: pending.length,
          completed: done.length,
          earnings: totalEarnings,
          rating: Math.round(avgRating * 10) / 10,
          services: services.length,
        })
        setSchedule(bookings.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const greeting = `Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, ${user?.name?.split(' ')[0] || 'Provider'}`
  return <ProviderLayout title={greeting} subtitle="Here is an overview of your business today.">
    <section className="stat-grid">
      <StatCard icon="📋" label="New booking requests" value={stats.requests.toString()} trend="Pending requests" />
      <StatCard icon="✅" label="Completed" value={stats.completed.toString()} trend="All time" />
      <StatCard icon="💰" label="Earnings" value={`$${stats.earnings.toFixed(0)}`} trend="Total earned" />
      <StatCard icon="⭐" label="Average rating" value={stats.rating > 0 ? stats.rating.toFixed(1) : '—'} trend="From customer reviews" />
      <StatCard icon="🔧" label="Active services" value={stats.services.toString()} trend="In your catalogue" />
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>Schedule</h2><p>Your upcoming appointments.</p></div><a className="text-button" href="#provider-bookings">View all</a></div>
      <div className="booking-list">
        {loading ? <p>Loading...</p> :
         schedule.length === 0 ? <p>No bookings yet. When customers book your services, they will appear here.</p> :
         schedule.map(b => <BookingCard key={b.id} customer={b.customer?.name || 'Customer'} service={`${b.service?.title || 'Service'} · ${b.time || ''}`} time={b.address || b.date} status={b.status} />)}
      </div>
    </section>
  </ProviderLayout>
}
export default Dashboard