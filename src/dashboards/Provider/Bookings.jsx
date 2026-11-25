import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import { bookingAPI } from '../../api.js'
import { useAuth } from '../../context/AuthContext'

function Bookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    bookingAPI.getAll()
      .then(data => setBookings(data.filter(booking =>
        String(booking.providerId || booking.provider?.id) === String(user?.id) ||
        String(booking.service?.providerId) === String(user?.id),
      )))
      .catch(err => setError(`Could not load bookings: ${err.message}`))
      .finally(() => setLoading(false))
  }, [user?.id])

  const updateStatus = async (id, status) => {
    setUpdating({ id: String(id), status })
    setError('')
    setNotice('')
    try {
      const updatedBooking = await bookingAPI.updateStatus(id, { status })
      setBookings(current => current.map(booking =>
        String(booking.id) === String(updatedBooking.id) ? { ...booking, ...updatedBooking } : booking,
      ))
      if (updatedBooking.notificationWarning) setNotice(updatedBooking.notificationWarning)
    } catch (err) {
      setError(`Could not ${status === 'confirmed' ? 'accept' : status === 'cancelled' ? 'decline' : 'update'} booking: ${err.message}`)
    } finally {
      setUpdating(null)
    }
  }

  return <ProviderLayout title="Bookings" subtitle="Accept requests and manage upcoming appointments.">
    <section className="panel">
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-error" role="status">{notice}</p>}
      <div className="panel-heading"><div><h2>Booking requests</h2><p>{bookings.length} total bookings</p></div><button className="secondary-button">Calendar view</button></div>
      <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Service</th><th>Date & time</th><th>Amount</th><th>Status</th><th /></tr></thead><tbody>
        {loading ? <tr><td colSpan="6">Loading...</td></tr> :
         bookings.length === 0 ? <tr><td colSpan="6">No bookings yet.</td></tr> :
         bookings.map(b => {
           const status = String(b.status || 'pending').toLowerCase()
           const isUpdating = updating && updating.id === String(b.id)
           return <tr key={b.id}>
             <td><strong>{b.customer?.name || 'Customer'}</strong></td>
             <td>{b.service?.title || 'Service'}</td>
             <td>{b.date} {b.time}</td>
             <td>₹{parseFloat(b.totalPrice || 0).toFixed(2)}</td>
             <td><span className={`status status-${status}`}>{status}</span></td>
             <td>
               {status === 'pending' && <>
                 <button className="text-button" disabled={Boolean(updating)} onClick={() => updateStatus(b.id, 'confirmed')}>{isUpdating && updating.status === 'confirmed' ? 'Accepting...' : 'Accept'}</button>
                 <button className="text-button danger" disabled={Boolean(updating)} onClick={() => updateStatus(b.id, 'cancelled')}>{isUpdating && updating.status === 'cancelled' ? 'Declining...' : 'Decline'}</button>
               </>}
               {status === 'confirmed' && <button className="text-button" disabled={Boolean(updating)} onClick={() => updateStatus(b.id, 'completed')}>{isUpdating ? 'Updating...' : 'Complete'}</button>}
             </td>
           </tr>
         })}
      </tbody></table></div>
    </section>
  </ProviderLayout>
}
export default Bookings