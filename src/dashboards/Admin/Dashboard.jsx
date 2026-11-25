import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import StatCard from '../components/StatCard.jsx'
import BookingCard from '../components/BookingCard.jsx'
import { bookingAPI, contactAPI, paymentAPI, serviceAPI, userAPI } from '../../api.js'

function Dashboard() {
  const [stats, setStats] = useState({ users: 0, providers: 0, bookings: 0, revenue: 0 })
  const [recentBookings, setRecentBookings] = useState([])
  const [recentContactMessages, setRecentContactMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, providers, bookings, payments, services, contactMessages] = await Promise.all([
          userAPI.getAll(),
          userAPI.getAll({ role: 'provider' }),
          bookingAPI.getAll(),
          paymentAPI.getAll(),
          serviceAPI.getAll(),
          contactAPI.getAll(),
        ])

        const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
        const activeProviders = providers.filter(p => p.isActive !== false).length

        setRecentBookings(bookings.slice(0, 5))
        setRecentContactMessages(contactMessages.slice(0, 3))
        setStats({
          users: users.length,
          providers: activeProviders,
          bookings: bookings.length,
          revenue: totalRevenue,
          services: services.length,
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
      <StatCard icon="👥" label="Total users" value={stats.users.toLocaleString()} trend="Active accounts" />
      <StatCard icon="🏆" label="Active providers" value={stats.providers.toString()} trend="Service providers" />
      <StatCard icon="📅" label="Bookings" value={stats.bookings.toString()} trend="Total bookings" />
      <StatCard icon="💰" label="Revenue" value={`₹${stats.revenue.toFixed(2)}`} trend="All time" />
    </section>
    <section className="panel"><div className="panel-heading"><div><h2>Recent bookings</h2><p>Latest service requests from customers.</p></div><a className="text-button" href="#admin-bookings">View all</a></div><div className="booking-list">{loading ? <p>Loading...</p> : recentBookings.length === 0 ? <p>No bookings yet.</p> : recentBookings.map(b => <BookingCard key={b.id} customer={b.customer?.name || 'Customer'} service={b.service?.title || 'Service'} time={`${b.date} ${b.time}`} status={b.status} />)}</div></section>
    <section className="panel"><div className="panel-heading"><div><h2>Recent contact messages</h2><p>Latest questions sent through the contact form.</p></div><a className="text-button" href="#admin-contact-messages">View inbox</a></div>
      {loading ? <p>Loading...</p> : recentContactMessages.length === 0 ? <p>No contact messages yet.</p> :
       <div className="contact-message-list">{recentContactMessages.map(message => <article className={`contact-message-card${message.isRead ? '' : ' unread'}`} key={message.id}>
         <div className="contact-message-heading"><div><h3>{message.subject}</h3><p><strong>{message.name}</strong> · {message.email}</p></div><span className={`status status-${message.isRead ? 'active' : 'pending'}`}>{message.isRead ? 'Read' : 'New'}</span></div>
         <p className="contact-message-body">{message.message}</p>
       </article>)}</div>}
    </section>
  </AdminLayout>
}
export default Dashboard