import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { serviceAPI, bookingAPI } from '../api.js'
import { useAuth } from '../context/AuthContext'

function Booking() {
  const { isAuthenticated } = useAuth()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ date: '', time: '', address: '', notes: '', paymentMethod: 'cash' })

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isAuthenticated) {
      window.location.hash = '#login'
      return
    }
    if (!service) return

    setSubmitting(true)
    setError('')
    try {
      await bookingAPI.create({
        providerId: service.providerId,
        serviceId: service.id,
        date: form.date,
        time: form.time,
        address: form.address,
        notes: form.notes,
        paymentMethod: form.paymentMethod,
        totalPrice: parseFloat(service.price),
      })
      setConfirmed(true)
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
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
            </label>
            <label>Preferred time slot
              <select value={form.time} onChange={e => setForm({...form, time: e.target.value})} required>
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
              <strong>{service ? `$${parseFloat(service.price).toFixed(2)}` : '—'}</strong>
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
            <p>The provider will review your request shortly. You can track this booking in your customer dashboard.</p>
            <div className="success-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <a className="primary-button" href="#customer-bookings" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>View My Bookings</a>
              <a className="secondary-button" href="#services" style={{ textDecoration: 'none', textAlign: 'center', flex: 1, padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '0.45rem', color: '#334155' }}>Browse Services</a>
            </div>
          </div>
        )}
      </form>
    </main>
  <Footer /></div>
}
export default Booking