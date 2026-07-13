import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import StatCard from '../components/StatCard.jsx'
import BookingCard from '../components/BookingCard.jsx'
import { bookingAPI, paymentAPI } from '../../api.js'

function Dashboard() {
  const [stats, setStats] = useState({ users: 0, providers: 0, bookings: 0, revenue: 0 })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, payments] = await Promise.all([
          bookingAPI.getAll(),
          paymentAPI.getAll(),
        ])
        setRecentBookings(bookings.slice(0, 5))
        const today = new Date().toISOString().split('T')[0]
        const todayBookings = bookings.filter(b => b.date === today)
        const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
        setStats({
          users: 1248,
          providers: 186,
          bookings: todayBookings.length || bookings.length,
          revenue: totalRevenue,
        })
      } catch (err) {
        console.error('Failed to load admin dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return <AdminLayout title="Dashboard" subtitle="Here is what is happening across your platform.">
    <section className="stat-grid">
      <StatCard icon="??" label="Total users" value={stats.users.toLocaleString()} trend="Active accounts" />
      <StatCard icon="??" label="Active providers" value={stats.providers.toString()} trend="Service providers" />
      <StatCard icon="??" label="Bookings" value={stats.bookings.toString()} trend="Total bookings" />
      <StatCard icon="??" label="Revenue" value={`$${stats.revenue.toFixed(2)}`} trend="All time" />
    </section>
    <section className="panel"><div className="panel-heading"><div><h2>Recent bookings</h2><p>Latest service requests from customers.</p></div><a className="text-button" href="#admin-bookings">View all</a></div><div className="booking-list">{loading ? <p>Loading...</p> : recentBookings.length === 0 ? <p>No bookings yet.</p> : recentBookings.map(b => <BookingCard key={b.id} customer={b.customer?.name || 'Customer'} service={b.service?.title || 'Service'} time={`${b.date} ${b.time}`} status={b.status} />)}</div></section>
  </AdminLayout>
}
export default Dashboard