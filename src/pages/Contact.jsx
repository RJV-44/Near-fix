import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { contactAPI } from '../api.js'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Booking question', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSent(false)
    setSubmitting(true)

    try {
      await contactAPI.submit(form)
      setSent(true)
      setForm({ name: '', email: '', subject: 'Booking question', message: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="public-page"><Navbar onLogin={() => { window.location.hash = '#login' }} onRegister={() => { window.location.hash = '#register' }} />
    <main className="public-section contact-grid">
      <div>
        <p className="hero-eyebrow">CONTACT US</p>
        <h1>How can we help?</h1>
        <p>Questions about a booking, provider account, or NEAr FiX? Send us a message and our team will respond.</p>
        <div className="contact-details">
          <p><strong>Email</strong><br />support@localservices.com</p>
          <p><strong>Support hours</strong><br />Monday–Friday, 9:00 AM–6:00 PM</p>
        </div>
      </div>
      <form className="panel contact-form" onSubmit={handleSubmit}>
        {error && <small className="form-error" role="alert">{error}</small>}
        <label>Name
          <input placeholder="Your name" maxLength={100} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </label>
        <label>Email
          <input type="email" maxLength={254} placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </label>
        <label>Subject
          <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
            <option>Booking question</option>
            <option>Provider support</option>
            <option>Payments</option>
            <option>General enquiry</option>
          </select>
        </label>
        <label>Message
          <textarea placeholder="How can we help?" maxLength={5000} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
        </label>
        <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send message'}</button>
        {sent && <small className="form-success" role="status">Thanks! Your message has been sent.</small>}
      </form>
    </main>
  <Footer /></div>
}
export default Contact