import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
import UPIPaymentModal from '../../components/UPIPaymentModal.jsx'
import { bookingAPI } from '../../api.js'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [payingBooking, setPayingBooking] = useState(null)

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

  const handlePaymentSuccess = (payment) => {
    if (payingBooking) {
      setBookings(bookings.map(b => 
        b.id === payingBooking.id 
          ? { ...b, paymentStatus: 'paid', transactionId: payment.transactionId } 
          : b
      ))
    }
  }

  return <CustomerLayout title="My Bookings" subtitle="Review and manage your upcoming services.">
    <section className="booking-list customer-booking-list">
      {loading ? <p>Loading...</p> :
       bookings.length === 0 ? <p>No bookings yet. <a href="#services">Browse services</a> to book one!</p> :
       bookings.map(b => {
         const isPaid = b.paymentStatus === 'paid'
         return (
           <article className="booking-card customer-booking-card" key={b.id}>
             <div className="booking-icon">📋</div>
             <div style={{ flex: 1 }}>
               <strong>{b.service?.title || 'Service'}</strong>
               <p>{b.provider?.businessName || b.provider?.name || 'Provider'}</p>
               <small>{b.date} {b.time || ''} · ₹{parseFloat(b.totalPrice || 0).toFixed(2)}</small>
               {isPaid && (
                 <div style={{ marginTop: '0.35rem' }}>
                   <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                     ⚡ Paid via UPI {b.transactionId ? `· UTR: ${b.transactionId}` : ''}
                   </span>
                 </div>
               )}
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
               <span className={`status status-${b.status?.toLowerCase() || 'pending'}`}>{b.status || 'Pending'}</span>
               {!isPaid && b.status !== 'cancelled' && (
                 <button
                   className="primary-button-sm"
                   style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                   onClick={() => setPayingBooking(b)}
                 >
                   ⚡ Pay with UPI
                 </button>
               )}
               {b.status === 'pending' && <button className="text-button danger" onClick={() => cancelBooking(b.id)}>Cancel</button>}
             </div>
           </article>
         )
       })}
    </section>

    <UPIPaymentModal
      isOpen={!!payingBooking}
      onClose={() => setPayingBooking(null)}
      onPaymentSuccess={handlePaymentSuccess}
      booking={payingBooking}
      amount={payingBooking?.totalPrice}
      serviceTitle={payingBooking?.service?.title}
    />
  </CustomerLayout>
}
export default Bookings