import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { serviceAPI, bookingAPI } from '../api.js'
import { useAuth } from '../context/AuthContext'

function Booking() {
  const { isAuthenticated, user } = useAuth()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ date: '', time: '', address: '', notes: '' })
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
        totalPrice: parseFloat(service.price),
      })
      setConfirmed(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="public-page"><Navbar /><main className="auth-page booking-page"><p>Loading...</p></main><Footer /></div>

  return <div className="public-page"><Navbar onLogin={() => { window.location.hash = '#login' }} />
    <main className="auth-page booking-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <a href={service ? `#service-details?id=${service.id}` : '#services'} className="back-link">? Back to service</a>
        <h1>Book {service?.title || 'a service'}</h1>
        <p>Choose a date and share the details for your appointment.</p>
        {error && <small className="form-error">{error}</small>}
        <label>Preferred date
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
        </label>
        <label>Preferred time
          <select value={form.time} onChange={e => setForm({...form, time: e.target.value})} required>
            <option value="" disabled>Select a time</option>
            <option>9:00 AM</option><option>10:00 AM</option><option>11:00 AM</option>
            <option>1:00 PM</option><option>2:00 PM</option><option>3:00 PM</option><option>4:00 PM</option>
          </select>
        </label>
        <label>Service address
          <input placeholder="Enter your address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
        </label>
        <label>Notes for the provider
          <textarea placeholder="Anything the provider should know?" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
        </label>
        <div className="booking-total">
          <span>Service total</span>
          <strong>{service ? `$${parseFloat(service.price).toFixed(2)}` : '—'}</strong>
        </div>
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? 'Booking...' : isAuthenticated ? 'Confirm booking' : 'Log in to book'}
        </button>
        {confirmed && <small className="form-success">Booking confirmed! View it in your customer dashboard. <a href="#customer-dashboard">Go to dashboard</a></small>}
      </form>
    </main>
  <Footer /></div>
}
export default Booking