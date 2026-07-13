import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
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

  const updateStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, { status })
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b))
    } catch (e) {
      alert(e.message)
    }
  }

  return <ProviderLayout title="Bookings" subtitle="Accept requests and manage upcoming appointments.">
    <section className="panel">
      <div className="panel-heading"><div><h2>Booking requests</h2><p>{bookings.length} total bookings</p></div><button className="secondary-button">Calendar view</button></div>
      <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Service</th><th>Date & time</th><th>Amount</th><th>Status</th><th /></tr></thead><tbody>
        {loading ? <tr><td colSpan="6">Loading...</td></tr> :
         bookings.length === 0 ? <tr><td colSpan="6">No bookings yet.</td></tr> :
         bookings.map(b => <tr key={b.id}>
           <td><strong>{b.customer?.name || 'Customer'}</strong></td>
           <td>{b.service?.title || 'Service'}</td>
           <td>{b.date} {b.time}</td>
           <td>${parseFloat(b.totalPrice || 0).toFixed(2)}</td>
           <td><span className={`status status-${b.status?.toLowerCase() || 'pending'}`}>{b.status || 'Pending'}</span></td>
           <td>
             {b.status === 'pending' && <><button className="text-button" onClick={() => updateStatus(b.id, 'confirmed')}>Accept</button><button className="text-button danger" onClick={() => updateStatus(b.id, 'cancelled')}>Decline</button></>}
             {b.status === 'confirmed' && <button className="text-button" onClick={() => updateStatus(b.id, 'completed')}>Complete</button>}
           </td>
         </tr>)}
      </tbody></table></div>
    </section>
  </ProviderLayout>
}
export default Bookings