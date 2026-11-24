import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
import UPIPaymentModal from '../../components/UPIPaymentModal.jsx'
import { bookingAPI } from '../../api.js'

function BookingHistory() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed', 'cancelled'
  const [loading, setLoading] = useState(true)
  const [payingBooking, setPayingBooking] = useState(null)

  useEffect(() => {
    bookingAPI.getAll()
      .then(data => setBookings(data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true
    if (filter === 'active') return b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress'
    if (filter === 'completed') return b.status === 'completed'
    if (filter === 'cancelled') return b.status === 'cancelled'
    return true
  })

  const handlePaymentSuccess = (payment) => {
    if (payingBooking) {
      setBookings(bookings.map(b =>
        b.id === payingBooking.id
          ? { ...b, paymentStatus: 'paid', transactionId: payment.transactionId }
          : b
      ))
    }
  }

  return <CustomerLayout title="Booking History" subtitle="See all services you have booked.">
    <section className="panel">
      <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>All Bookings</h2>
          <p>{filteredBookings.length} {filter === 'all' ? 'total' : filter} service booking{filteredBookings.length === 1 ? '' : 's'}.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'active', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                border: '1px solid var(--border, #cbd5e1)',
                background: filter === f ? 'var(--brand, #2563eb)' : '#f8fafc',
                color: filter === f ? '#fff' : 'var(--text-primary, #1e293b)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.82rem',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="table-wrap"><table><thead><tr><th>Service</th><th>Provider</th><th>Date & Time</th><th>Amount</th><th>Status</th><th>Payment</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="6">Loading...</td></tr> :
         filteredBookings.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No bookings found. <a href="#services">Book a service</a></td></tr> :
         filteredBookings.map(b => {
           const isPaid = b.paymentStatus === 'paid'
           return (
             <tr key={b.id}>
               <td><strong>{b.service?.title || 'Service'}</strong></td>
               <td>{b.provider?.businessName || b.provider?.name || 'Provider'}</td>
               <td>{b.date} {b.time ? `(${b.time})` : ''}</td>
               <td>₹{parseFloat(b.totalPrice || 0).toFixed(2)}</td>
               <td><span className={`status status-${b.status?.toLowerCase() || 'pending'}`}>{b.status || 'Pending'}</span></td>
               <td>
                 {isPaid ? (
                   <span style={{ fontSize: '0.78rem', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                     ⚡ Paid (UPI)
                   </span>
                 ) : b.status !== 'cancelled' ? (
                   <button
                     className="primary-button-sm"
                     style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                     onClick={() => setPayingBooking(b)}
                   >
                     ⚡ Pay UPI
                   </button>
                 ) : (
                   <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>
                 )}
               </td>
             </tr>
           )
         })}
      </tbody></table></div>
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
export default BookingHistory