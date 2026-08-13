import { useAuth } from '../context/AuthContext'
import LogoutButton from './LogoutButton.jsx'
const links = ['Home', 'Services', 'About', 'Contact']
function Navbar({ onLogin, onRegister }) {
  const { isAuthenticated } = useAuth()
  const handleLogin = onLogin || (() => { window.location.hash = '#login' })
  const handleRegister = onRegister || (() => { window.location.hash = '#register' })
  return (
    <header className="site-navbar">
      <a className="site-brand" href="#home">Local<span>Services</span></a>
      <nav aria-label="Main navigation">{links.map((link) => <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>)}</nav>
      <div className="nav-actions">
        {isAuthenticated ? (
          <LogoutButton />
        ) : (
          <><button className="nav-login" onClick={handleLogin}>Log in</button><button className="nav-register" onClick={handleRegister}>Join now</button></>
        )}
      </div>
    </header>
  )
}

export default Navbar