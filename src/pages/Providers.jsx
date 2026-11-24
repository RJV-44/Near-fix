import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { serviceAPI } from '../api.js'

function Providers() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const category = new URLSearchParams(window.location.hash.split('?')[1] || '').get('category') || ''

  useEffect(() => {
    setLoading(true)
    serviceAPI.getAll(category ? { category } : {})
      .then(setServices)
      .catch(err => setError(err.message || 'Unable to load providers'))
      .finally(() => setLoading(false))
  }, [category])

  const providers = useMemo(() => {
    const uniqueProviders = new Map()
    services.forEach(service => {
      const provider = service.provider
      if (!provider) return
      const id = provider.id || service.providerId
      if (!uniqueProviders.has(String(id))) {
        uniqueProviders.set(String(id), {
          ...provider,
          id,
          serviceTitle: service.title,
          category: service.category,
          rating: service.rating || '0.0',
          reviewCount: service.reviewCount || 0,
          price: service.price,
        })
      }
    })
    return [...uniqueProviders.values()]
  }, [services])

  return (
    <div className="public-page">
      <Navbar onLogin={() => { window.location.hash = '#login' }} onRegister={() => { window.location.hash = '#register' }} />
      <main className="public-section providers-page">
        <p className="hero-eyebrow">LOCAL PROFESSIONALS</p>
        <h1>{category ? `Providers for ${category}` : 'Find a trusted provider.'}</h1>
        <p className="providers-lead">Compare local professionals offering reliable services in your area.</p>
        <a className="back-link" href="#home">&larr; Back to categories</a>
        <div className="provider-grid">
          {loading ? <p>Loading providers...</p> : error ? <p className="form-error">{error}</p> : providers.length === 0 ? <p>No providers found for this category yet.</p> : providers.map(provider => (
            <article className="provider-card" key={provider.id}>
              <div className="provider-card-avatar">{(provider.businessName || provider.name || 'P')[0].toUpperCase()}</div>
              <div className="provider-card-content">
                <p className="card-category-tag">{provider.category}</p>
                <h2>{provider.businessName || provider.name || 'Local provider'}</h2>
                <p className="provider-name">{provider.name || 'Professional provider'}</p>
                <p className="provider-service">{provider.serviceTitle}</p>
                <div className="provider-card-meta"><span>Rating {provider.rating}</span><span>{provider.reviewCount} reviews</span></div>
                <a className="primary-button" href={`#services?category=${encodeURIComponent(provider.category)}`}>View services</a>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Providers
