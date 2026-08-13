import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { bookingAPI } from '../../api.js'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingAPI.getAll()
      .then(data => setBookings(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return <AdminLayout title="Bookings" subtitle="Track, update, and resolve customer bookings.">
    <section className="panel">
      <div className="panel-heading"><div><h2>All bookings</h2><p>{bookings.length} bookings total</p></div><button className="secondary-button">Export</button></div>
      <div className="table-wrap"><table><thead><tr><th>#</th><th>Customer</th><th>Service</th><th>Date</th><th>Status</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="5">Loading...</td></tr> :
         bookings.length === 0 ? <tr><td colSpan="5">No bookings found.</td></tr> :
         bookings.map(b => <tr key={b.id}>
           <td>#{b.id}</td>
           <td>{b.customer?.name || 'N/A'}</td>
           <td>{b.service?.title || 'N/A'}</td>
           <td>{b.date} {b.time}</td>
           <td><span className={`status status-${b.status?.toLowerCase() || 'pending'}`}>{b.status || 'Pending'}</span></td>
         </tr>)}
      </tbody></table></div>
    </section>
  </AdminLayout>
}
export default Bookings