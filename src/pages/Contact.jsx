import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Booking question', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSent(false)

    try {
      const res = await fetch('http://localhost:5000/api/notifications/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to send')
      setSent(true)
      setForm({ name: '', email: '', subject: 'Booking question', message: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  return <div className="public-page"><Navbar onLogin={() => { window.location.hash = '#login' }} onRegister={() => { window.location.hash = '#register' }} />
    <main className="public-section contact-grid">
      <div>
        <p className="hero-eyebrow">CONTACT US</p>
        <h1>How can we help?</h1>
        <p>Questions about a booking, provider account, or Local Services? Send us a message and our team will respond.</p>
        <div className="contact-details">
          <p><strong>Email</strong><br />support@localservices.com</p>
          <p><strong>Support hours</strong><br />Monday–Friday, 9:00 AM–6:00 PM</p>
        </div>
      </div>
      <form className="panel contact-form" onSubmit={handleSubmit}>
        {error && <small className="form-error">{error}</small>}
        <label>Name
          <input placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </label>
        <label>Email
          <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
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
          <textarea placeholder="How can we help?" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
        </label>
        <button className="primary-button" type="submit">Send message</button>
        {sent && <small className="form-success">Thanks! Your message has been sent.</small>}
      </form>
    </main>
  <Footer /></div>
}
export default Contact