import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { bookingAPI, paymentAPI, userAPI } from '../../api.js'

function Reports() {
  const [stats, setStats] = useState({ completion: 0, avgRating: 0, newUsers: 0, revenue: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, payments, users] = await Promise.all([
          bookingAPI.getAll(),
          paymentAPI.getAll(),
          userAPI.getAll(),
        ])
        const completed = bookings.filter(b => b.status === 'completed').length
        const completion = bookings.length ? ((completed / bookings.length) * 100).toFixed(1) : 0
        const newUsers = users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
        const monthlyRevenue = [0, 0, 0, 0, 0, 0]
        payments.forEach(p => {
          const d = new Date(p.paidAt || p.createdAt)
          const monthsAgo = 5 - Math.floor((Date.now() - d.getTime()) / (30 * 24 * 60 * 60 * 1000))
          if (monthsAgo >= 0 && monthsAgo < 6) monthlyRevenue[monthsAgo] += parseFloat(p.amount || 0)
        })
        setStats({ completion, avgRating: 4.7, newUsers, revenue: monthlyRevenue })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  const maxRev = Math.max(...stats.revenue, 1)

  return <AdminLayout title="Reports" subtitle="Understand platform growth, bookings, and revenue.">
    <section className="stat-grid compact">
      <article className="stat-card"><p>Booking completion</p><h2>{stats.completion}%</h2><small className="positive">? Platform average</small></article>
      <article className="stat-card"><p>Average rating</p><h2>{stats.avgRating} / 5</h2><small className="positive">? Across all services</small></article>
      <article className="stat-card"><p>New users (30d)</p><h2>{stats.newUsers}</h2><small className="positive">? Recent signups</small></article>
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>Revenue overview</h2><p>Monthly revenue for the last six months.</p></div><button className="secondary-button">Export CSV</button></div>
      <div className="bar-chart">{loading ? <p>Loading...</p> : months.map((month, i) => <div key={month}><span style={{height: `${(stats.revenue[i] / maxRev) * 100}%`}} /><small>{month}</small></div>)}</div>
    </section>
  </AdminLayout>
}
export default Reports