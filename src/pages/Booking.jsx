import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import UPIPaymentModal from '../components/UPIPaymentModal.jsx'
import { serviceAPI, bookingAPI } from '../api.js'
import { useAuth } from '../context/AuthContext'

function Booking() {
  const { isAuthenticated } = useAuth()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ date: '', time: '', address: '', notes: '', paymentMethod: 'upi' })
  const [showUpiModal, setShowUpiModal] = useState(false)
  const [createdBooking, setCreatedBooking] = useState(null)
  const [upiPaymentData, setUpiPaymentData] = useState(null)

  // Today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const serviceId = params.get('serviceId')
    if (!serviceId) { setLoading(false); return }

    const fetchService = async () => {
      try {
        const data = await serviceAPI.getById(serviceId)
        setService(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [])

  const parseSlotTime = (dateStr, timeSlot) => {
    if (!dateStr || !timeSlot) return null
    // timeSlot format: "9:00 AM - 10:00 AM" or similar
    const startPart = timeSlot.split('-')[0].trim()
    const match = startPart.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (!match) return null
    let hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    const meridian = match[3].toUpperCase()
    if (meridian === 'PM' && hours < 12) hours += 12
    if (meridian === 'AM' && hours === 12) hours = 0

    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day, hours, minutes, 0, 0)
  }

  const validateBookingDateTime = (dateStr, timeSlot) => {
    if (!dateStr || !timeSlot) return null
    const slotDate = parseSlotTime(dateStr, timeSlot)
    if (!slotDate || isNaN(slotDate.getTime())) {
      return 'Invalid date or time selected.'
    }
    const now = new Date()
    if (slotDate <= now) {
      return 'Invalid date and time: You cannot select a past date or time slot.'
    }
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isAuthenticated) {
      window.location.hash = '#login'
      return
    }
    if (!service) return

    const validationError = validateBookingDateTime(form.date, form.time)
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const newBooking = await bookingAPI.create({
        providerId: service.providerId,
        serviceId: service.id,
        date: form.date,
        time: form.time,
        address: form.address,
        notes: form.notes,
        paymentMethod: form.paymentMethod,
        totalPrice: parseFloat(service.price),
      })
      setCreatedBooking(newBooking)

      if (form.paymentMethod === 'upi') {
        setShowUpiModal(true)
      } else {
        setConfirmed(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="public-page"><Navbar /><main className="auth-page booking-page"><p>Loading booking details...</p></main><Footer /></div>

  return <div className="public-page"><Navbar onLogin={() => { window.location.hash = '#login' }} />
    <main className="auth-page booking-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <a href={service ? `#service-details?id=${service.id}` : '#services'} className="back-link">← Back to service</a>
        <h1>Book {service?.title || 'a service'}</h1>
        <p>Provider: <strong>{service?.provider?.businessName || service?.provider?.name || 'Local Professional'}</strong></p>
        
        {error && <small className="form-error">{error}</small>}
        
        {!confirmed ? (
          <>
            <label>Preferred date
              <input
                type="date"
                min={todayStr}
                value={form.date}
                onChange={e => {
                  const newDate = e.target.value
                  setForm({...form, date: newDate})
                  if (form.time) {
                    const err = validateBookingDateTime(newDate, form.time)
                    setError(err || '')
                  }
                }}
                required
              />
            </label>
            <label>Preferred time slot
              <select
                value={form.time}
                onChange={e => {
                  const newTime = e.target.value
                  setForm({...form, time: newTime})
                  if (form.date) {
                    const err = validateBookingDateTime(form.date, newTime)
                    setError(err || '')
                  }
                }}
                required
              >
                <option value="" disabled>Select a time slot</option>
                <option>9:00 AM - 10:00 AM</option>
                <option>10:00 AM - 11:00 AM</option>
                <option>11:00 AM - 12:00 PM</option>
                <option>1:00 PM - 2:00 PM</option>
                <option>2:00 PM - 3:00 PM</option>
                <option>3:00 PM - 4:00 PM</option>
                <option>4:00 PM - 5:00 PM</option>
              </select>
            </label>
            <label>Service address
              <input placeholder="Enter full service address (street, apt, city)" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
            </label>
            <label>Payment method
              <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}>
                <option value="cash">Pay after service (Cash / Card on delivery)</option>
                <option value="online">Online Payment (Credit / Debit card)</option>
                <option value="upi">UPI / Instant Mobile Transfer</option>
              </select>
            </label>
            <label>Special instructions for provider
              <textarea placeholder="Any parking details, gate code, or specific requests?" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </label>
            <div className="booking-total">
              <span>Service total</span>
              <strong>{service ? `₹${parseFloat(service.price).toFixed(2)}` : '—'}</strong>
            </div>
            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? 'Confirming booking...' : isAuthenticated ? 'Confirm Booking Request' : 'Log in to Confirm Booking'}
            </button>
          </>
        ) : (
          <div className="booking-success-box">
            <div className="success-icon" style={{ fontSize: '3rem', margin: '0.5rem 0', textAlign: 'center' }}>✅</div>
            <h2 style={{ textAlign: 'center', color: '#166534' }}>Booking Confirmed!</h2>
            <p>Your appointment for <strong>{service?.title}</strong> on <strong>{form.date} ({form.time})</strong> has been scheduled.</p>

            {upiPaymentData ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.65rem', padding: '0.85rem', margin: '1rem 0', fontSize: '0.88rem', color: '#166534' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>⚡ UPI Payment Verified & Linked</p>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem' }}>
                  Transaction Ref / UTR: <strong style={{ fontFamily: 'monospace' }}>{upiPaymentData.transactionId}</strong>
                </p>
              </div>
            ) : form.paymentMethod === 'upi' ? (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.65rem', padding: '0.85rem', margin: '1rem 0', fontSize: '0.88rem' }}>
                <p style={{ margin: 0, color: '#1e40af' }}>UPI payment pending.</p>
                <button
                  type="button"
                  className="primary-button-sm"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => setShowUpiModal(true)}
                >
                  Pay Now via UPI
                </button>
              </div>
            ) : null}

            <p>The provider will review your request shortly. You can track this booking in your customer dashboard.</p>
            <div className="success-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <a className="primary-button" href="#customer-bookings" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>View My Bookings</a>
              <a className="secondary-button" href="#services" style={{ textDecoration: 'none', textAlign: 'center', flex: 1, padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '0.45rem', color: '#334155' }}>Browse Services</a>
            </div>
          </div>
        )}
      </form>

      <UPIPaymentModal
        isOpen={showUpiModal}
        onClose={() => {
          setShowUpiModal(false)
          setConfirmed(true)
        }}
        onPaymentSuccess={(payment) => {
          setUpiPaymentData(payment)
          setShowUpiModal(false)
          setConfirmed(true)
        }}
        booking={createdBooking}
        amount={service ? parseFloat(service.price) : 0}
        serviceTitle={service?.title}
      />
    </main>
  <Footer /></div>
}
export default Booking