import { useState } from 'react'
import SearchBar from './SearchBar.jsx'

function Hero({ onSearch }) {
  const [query, setQuery] = useState('')

  const stats = [
    { value: '10K+', label: 'Verified Providers' },
    { value: '50K+', label: 'Bookings Completed' },
    { value: '4.9★', label: 'Average Rating' },
  ]

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="hero-eyebrow">SERVICES, SIMPLIFIED</p>
        <h1>Good help is closer than you think.</h1>
        <p>Book reliable local professionals for home, business, and everyday tasks. Clear choices, verified providers, and simple scheduling.</p>
        <SearchBar value={query} onChange={setQuery} onSearch={onSearch} />
        <div className="hero-trust">
          <span>Verified providers</span>
          <span>Highly rated</span>
          <span>Easy booking</span>
          <span>Secure payments</span>
        </div>
        <div className="hero-stats">
          {stats.map(({ value, label }) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
        </div>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="hero-art-icon">LOCAL<br />HELP</div>
        <span>Trusted local pros</span>
        <div style={{
          position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem',
          background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
          borderRadius: '0.75rem', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem',
        }}>
          <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'grid', placeItems: 'center', fontSize: '1.1rem' }}>⭐</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>Sarah just booked</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Deep Home Cleaning · 2 min ago</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero