import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { authAPI, categoryAPI } from '../api.js'

function ProviderRegister() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ businessName: '', name: '', email: '', phone: '', password: '', serviceCategory: '', yearsOfExperience: '' })
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    categoryAPI.getAll().then(data => setCategories(data)).catch(() => {})
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    setError('')
    try {
      const data = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'provider',
        phone: form.phone,
        businessName: form.businessName,
        serviceCategory: form.serviceCategory,
        yearsOfExperience: form.yearsOfExperience,
      })
      localStorage.setItem('auth_token', data.token)
      window.location.hash = '#login'
    } catch (err) {
      setError(err.message)
      setSubmitted(false)
    }
  }

  return <div className="public-page"><Navbar onLogin={() => { window.location.hash = '#login' }} />
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <a href="#register" className="back-link">? Back to registration</a>
        <h1>Register as a provider</h1>
        <p>Start offering your services on Local Services.</p>
        {error && <small className="form-error">{error}</small>}
        <label>Business name
          <input placeholder="Your business or trade name" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} required />
        </label>
        <label>Full name
          <input placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </label>
        <label>Email address
          <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </label>
        <label>Phone number
          <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
        </label>
        <label>Password
          <input type="password" placeholder="Create a secure password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        </label>
        <label>Service category
          <select value={form.serviceCategory} onChange={e => setForm({...form, serviceCategory: e.target.value})} required>
            <option value="" disabled>Select a category</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            <option>Other</option>
          </select>
        </label>
        <label>Years of experience
          <select value={form.yearsOfExperience} onChange={e => setForm({...form, yearsOfExperience: e.target.value})} required>
            <option value="" disabled>Select experience</option>
            <option>Less than 1 year</option>
            <option>1–2 years</option>
            <option>3–5 years</option>
            <option>6–10 years</option>
            <option>10+ years</option>
          </select>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" required /> I agree to the terms and provider agreement.
        </label>
        <button className="primary-button" type="submit" disabled={submitted}>
          {submitted ? 'Creating account...' : 'Create provider account'}
        </button>
        {submitted && !error && <small className="form-success">Provider account created. Redirecting to login...</small>}
        <p className="auth-switch">Already have an account? <a href="#login">Log in</a> | <a href="#register">Register as customer</a></p>
      </form>
    </main>
  <Footer /></div>
}
export default ProviderRegister