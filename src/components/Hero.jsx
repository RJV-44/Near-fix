import { useState } from 'react'
import SearchBar from './SearchBar.jsx'

function Hero({ onSearch }) {
  const [query, setQuery] = useState('')
  return (
    <section className="hero-section">
      <div className="hero-copy"><p className="hero-eyebrow">SERVICES, SIMPLIFIED</p><h1>Find trusted help <span>near you.</span></h1><p>Book reliable local professionals for every task around your home and business.</p><SearchBar value={query} onChange={setQuery} onSearch={onSearch} /><div className="hero-trust"><span>? Verified providers</span><span>? Highly rated</span><span>? Easy booking</span></div></div>
      <div className="hero-art" aria-hidden="true"><div>???</div><span>Trusted local pros</span></div>
    </section>
  )
}

export default Hero