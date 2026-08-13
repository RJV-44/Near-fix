import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api.js'

function AdminLogin() {
  const { login, getDashboardHash } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    setError('')
    try {
      const data = await authAPI.login(email, password, 'admin')
      if (data.role !== 'admin') {
        throw new Error('Access denied. Admin credentials required.')
      }
      localStorage.setItem('auth_token', data.token)
      login({ id: data.id, name: data.name, email: data.email, role: data.role })
      const target = getDashboardHash(data.role)
      setTimeout(() => {
        window.location.hash = target
      }, 0)
    } catch (err) {
      setError(err.message)
      setSubmitted(false)
    }
  }

  return <div className="public-page"><Navbar />
    <main className="auth-page">
      <form className="auth-card admin-auth-card" onSubmit={handleSubmit}>
        <a href="#home" className="back-link">? Back to home</a>
        <div className="admin-badge">? Admin</div>
        <h1>Admin login</h1>
        <p>Sign in to manage platform operations.</p>
        {error && <small className="form-error">{error}</small>}
        <label>Admin email
          <input type="email" placeholder="admin@localservices.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button className="primary-button admin-button" type="submit" disabled={submitted}>
          {submitted ? 'Signing in...' : 'Sign in as admin'}
        </button>
        {submitted && !error && <small className="form-success">Admin authenticated. Redirecting to admin dashboard...</small>}
        <p className="auth-switch"><a href="#login">Back to user login</a></p>
      </form>
    </main>
  <Footer /></div>
}
export default AdminLogin