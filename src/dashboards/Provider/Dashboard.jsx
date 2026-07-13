import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import StatCard from '../components/StatCard.jsx'
import BookingCard from '../components/BookingCard.jsx'
import { useAuth } from '../../context/AuthContext'
import { bookingAPI, paymentAPI } from '../../api.js'

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ requests: 0, completed: 0, earnings: 0, rating: 0 })
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, payments] = await Promise.all([
          bookingAPI.getAll(),
          paymentAPI.getAll(),
        ])
        const pending = bookings.filter(b => b.status === 'pending')
        const done = bookings.filter(b => b.status === 'completed')
        const totalEarnings = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
        setStats({
          requests: pending.length,
          completed: done.length,
          earnings: totalEarnings,
          rating: 4.9,
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
      <StatCard icon="??" label="New booking requests" value={stats.requests.toString()} trend="Pending requests" />
      <StatCard icon="?" label="Completed" value={stats.completed.toString()} trend="All time" />
      <StatCard icon="??" label="Earnings" value={`$${stats.earnings.toFixed(0)}`} trend="Total earned" />
      <StatCard icon="?" label="Average rating" value={stats.rating.toString()} trend="From customer reviews" />
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>Schedule</h2><p>Your upcoming appointments.</p></div><button className="text-button">View calendar</button></div>
      <div className="booking-list">
        {loading ? <p>Loading...</p> :
         schedule.length === 0 ? <p>No bookings yet.</p> :
         schedule.map(b => <BookingCard key={b.id} customer={b.customer?.name || 'Customer'} service={`${b.service?.title || 'Service'} · ${b.time}`} time={b.address || b.date} status={b.status} />)}
      </div>
    </section>
  </ProviderLayout>
}
export default Dashboard