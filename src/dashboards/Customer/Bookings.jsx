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

  return <CustomerLayout title="My Bookings" subtitle="Review and manage your upcoming services.">
    <section className="booking-list customer-booking-list">
      {loading ? <p>Loading...</p> :
       bookings.length === 0 ? <p>No bookings yet.</p> :
       bookings.map(b => <article className="booking-card customer-booking-card" key={b.id}>
         <div className="booking-icon">??</div>
         <div>
           <strong>{b.service?.title || 'Service'}</strong>
           <p>{b.provider?.businessName || b.provider?.name || 'Provider'}</p>
           <small>{b.date} {b.time}</small>
         </div>
         <div>
           <span className={`status status-${b.status?.toLowerCase() || 'pending'}`}>{b.status || 'Pending'}</span>
           <button className="text-button">Manage</button>
         </div>
       </article>)}
    </section>
  </CustomerLayout>
}
export default Bookings