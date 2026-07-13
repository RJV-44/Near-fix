import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api.js'

function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Customer')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    setError('')
    try {
      const data = await authAPI.login(email, password)
      localStorage.setItem('auth_token', data.token)
      login({ id: data.id, name: data.name, email: data.email, role: data.role })
      const dash = data.role === 'admin' ? '#admin-dashboard' : data.role === 'provider' ? '#provider-dashboard' : '#customer-dashboard'
      setTimeout(() => { window.location.hash = dash }, 100)
    } catch (err) {
      setError(err.message)
      setSubmitted(false)
    }
  }

  return <div className="public-page"><Navbar onRegister={() => { window.location.hash = '#register' }} />
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <a href="#home" className="back-link">? Back to home</a>
        <h1>Welcome back</h1>
        <p>Log in to manage your bookings and account.</p>
        {error && <small className="form-error">{error}</small>}
        <label>Email address
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" placeholder="••" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <label>I am a
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Customer</option>
            <option>Provider</option>
          </select>
        </label>
        <div className="auth-row">
          <label className="checkbox-label"><input type="checkbox" /> Remember me</label>
          <a href="#login">Forgot password?</a>
        </div>
        <button className="primary-button" type="submit" disabled={submitted}>
          {submitted ? 'Logging in...' : 'Log in'}
        </button>
        {submitted && !error && <small className="form-success">Logging you in as {role}...</small>}
        <p className="auth-switch">New to Local Services? <a href="#register">Create an account</a></p>
        <p className="auth-switch"><a href="#admin-login">Admin login ?</a></p>
      </form>
    </main>
 <Footer /></div>
}
export default Login