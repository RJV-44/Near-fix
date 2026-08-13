import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { serviceAPI } from '../api.js'

function ServiceDetails() {
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const id = params.get('id')
    if (!id) { setError('No service selected'); setLoading(false); return }

    const fetchService = async () => {
      try {
        const data = await serviceAPI.getById(id)
        setService(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [])

  if (loading) return <div className="public-page"><Navbar /><main className="public-section details-page"><p>Loading service details...</p></main><Footer /></div>
  if (error) return <div className="public-page"><Navbar /><main className="public-section details-page"><p className="form-error">{error}</p><a className="back-link" href="#services">? All services</a></main><Footer /></div>
  if (!service) return null

  const provider = service.provider || {}

  return <div className="public-page"><Navbar onLogin={() => { window.location.hash = '#login' }} />
    <main className="public-section details-page">
      <a className="back-link" href="#services">? All services</a>
      <div className="details-grid">
        <div className="details-image">{service.image || '??'}</div>
        <div>
          <p className="hero-eyebrow">{service.category?.toUpperCase()}</p>
          <h1>{service.title}</h1>
          <p className="service-rating">? {service.rating || '0.0'} <small>({service.reviewCount || 0} reviews)</small></p>
          <p>{service.description}</p>
          {service.duration && <p><strong>Duration:</strong> {service.duration}</p>}
          <div className="details-price">
            <strong>From ${parseFloat(service.price).toFixed(2)}</strong>
            {service.duration && <span>Estimated duration: {service.duration}</span>}
          </div>
          <a className="primary-button" href={`#booking?serviceId=${service.id}`}>Book this service</a>
        </div>
      </div>
      {provider.name && <section className="panel">
        <h2>About {provider.businessName || provider.name}</h2>
        <p>Trusted provider with verified credentials.</p>
        {provider.email && <p>Email: {provider.email}</p>}
        {provider.phone && <p>Phone: {provider.phone}</p>}
      </section>}
    </main>
  <Footer /></div>
}
export default ServiceDetails