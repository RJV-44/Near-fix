import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { authAPI } from '../api.js'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Customer' })
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    setError('')
    try {
      const roleKey = form.role === 'Service provider' ? 'provider' : 'customer'
      const data = await authAPI.register({ name: form.name, email: form.email, password: form.password, role: roleKey })
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
        <a href="#home" className="back-link">? Back to home</a>
        <h1>Create your account</h1>
        <p>Join thousands of people who book trusted local help.</p>
        {error && <small className="form-error">{error}</small>}
        <label>Full name
          <input placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </label>
        <label>Email address
          <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </label>
        <label>Password
          <input type="password" placeholder="Create a password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        </label>
        <label>I want to join as
          <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
            <option>Customer</option>
            <option>Service provider</option>
          </select>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" required /> I agree to the terms and privacy policy.
        </label>
        <button className="primary-button" type="submit" disabled={submitted}>
          {submitted ? 'Creating account...' : 'Create account'}
        </button>
        {submitted && !error && <small className="form-success">Account created. Redirecting to login...</small>}
        <p className="auth-switch">Already have an account? <a href="#login">Log in</a></p>
      </form>
    </main>
  <Footer /></div>
}
export default Register