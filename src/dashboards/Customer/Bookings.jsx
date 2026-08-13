import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
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

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await bookingAPI.updateStatus(id, { status: 'cancelled' })
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    } catch (e) {
      alert(e.message)
    }
  }

  return <CustomerLayout title="My Bookings" subtitle="Review and manage your upcoming services.">
    <section className="booking-list customer-booking-list">
      {loading ? <p>Loading...</p> :
       bookings.length === 0 ? <p>No bookings yet. <a href="#services">Browse services</a> to book one!</p> :
       bookings.map(b => <article className="booking-card customer-booking-card" key={b.id}>
         <div className="booking-icon">📋</div>
         <div>
           <strong>{b.service?.title || 'Service'}</strong>
           <p>{b.provider?.businessName || b.provider?.name || 'Provider'}</p>
           <small>{b.date} {b.time || ''} · ${parseFloat(b.totalPrice || 0).toFixed(2)}</small>
         </div>
         <div>
           <span className={`status status-${b.status?.toLowerCase() || 'pending'}`}>{b.status || 'Pending'}</span>
           {b.status === 'pending' && <button className="text-button danger" onClick={() => cancelBooking(b.id)}>Cancel</button>}
         </div>
       </article>)}
    </section>
  </CustomerLayout>
}
export default Bookings