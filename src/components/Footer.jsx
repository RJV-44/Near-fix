function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <a className="site-brand" href="#home" style={{ fontSize: '1.4rem' }}>Local<span style={{ fontStyle: 'italic' }}>Services</span></a>
        <p>Trusted local professionals for every task — book with confidence.</p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <span style={{ color: '#64748b', fontSize: '1.25rem', cursor: 'pointer' }}>🐦</span>
          <span style={{ color: '#64748b', fontSize: '1.25rem', cursor: 'pointer' }}>📘</span>
          <span style={{ color: '#64748b', fontSize: '1.25rem', cursor: 'pointer' }}>📸</span>
        </div>
      </div>
      <div>
        <h4>Explore</h4>
        <a href="#services">Find Services</a>
        <a href="#about">About Us</a>
        <a href="#contact">Contact</a>
        <a href="#home">Homepage</a>
      </div>
      <div>
        <h4>For Providers</h4>
        <a href="#provider-register">Become a Provider</a>
        <a href="#provider-dashboard">Provider Dashboard</a>
        <a href="#provider-add-service">Add a Service</a>
      </div>
      <div>
        <h4>Support</h4>
        <a href="#contact">Help Center</a>
        <a href="#contact">Report Issue</a>
        <a href="#admin-login">Admin Login</a>
      </div>
      <small>© 2026 LocalServices · Built with ❤️ for local communities · <a href="#home" style={{ color: 'inherit' }}>Privacy Policy</a></small>
    </footer>
  )
}

export default Footer