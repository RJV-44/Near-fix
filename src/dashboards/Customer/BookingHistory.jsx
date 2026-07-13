import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
import { bookingAPI } from '../../api.js'

function BookingHistory() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingAPI.getAll()
      .then(data => setBookings(data.filter(b => b.status === 'completed' || b.status === 'cancelled')))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return <CustomerLayout title="Booking History" subtitle="See all services you have booked.">
    <section className="panel">
      <div className="panel-heading"><div><h2>Past bookings</h2><p>{bookings.length} completed or cancelled services.</p></div><button className="secondary-button">Download history</button></div>
      <div className="table-wrap"><table><thead><tr><th>Service</th><th>Provider</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="5">Loading...</td></tr> :
         bookings.length === 0 ? <tr><td colSpan="5">No past bookings.</td></tr> :
         bookings.map(b => <tr key={b.id}>
           <td>{b.service?.title || 'Service'}</td>
           <td>{b.provider?.businessName || b.provider?.name || 'Provider'}</td>
           <td>{b.date}</td>
           <td>${parseFloat(b.totalPrice || 0).toFixed(2)}</td>
           <td><span className={`status status-${b.status?.toLowerCase() || 'completed'}`}>{b.status || 'Completed'}</span></td>
         </tr>)}
      </tbody></table></div>
    </section>
  </CustomerLayout>
}
export default BookingHistory