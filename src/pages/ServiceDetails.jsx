import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { serviceAPI, favoriteAPI } from '../api.js'
import { useAuth } from '../context/AuthContext'

function ServiceDetails() {
  const { isCustomer, user } = useAuth()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteBusy, setFavoriteBusy] = useState(false)
  const [wishlistError, setWishlistError] = useState('')

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

  useEffect(() => {
    if (!isCustomer || !service?.id) {
      setIsFavorite(false)
      return
    }
    favoriteAPI.getAll()
      .then(favorites => setIsFavorite(favorites.some(favorite => String(favorite.serviceId || favorite.service?.id) === String(service.id))))
      .catch(err => setWishlistError(`Could not load your wishlist: ${err.message}`))
  }, [isCustomer, user?.id, service?.id])

  const toggleFavorite = async () => {
    if (!service?.id) return
    setFavoriteBusy(true)
    setWishlistError('')
    try {
      if (isFavorite) await favoriteAPI.remove(service.id)
      else await favoriteAPI.add(service.id)
      setIsFavorite(!isFavorite)
    } catch (err) {
      setWishlistError(`Could not update your wishlist: ${err.message}`)
    } finally {
      setFavoriteBusy(false)
    }
  }

  if (loading) return <div className="public-page"><Navbar /><main className="public-section details-page"><p>Loading service details...</p></main><Footer /></div>
  if (error) return <div className="public-page"><Navbar /><main className="public-section details-page"><p className="form-error">{error}</p><a className="back-link" href="#services">← All services</a></main><Footer /></div>
  if (!service) return null

  const provider = service.provider || {}

  return <div className="public-page"><Navbar onLogin={() => { window.location.hash = '#login' }} />
    <main className="public-section details-page">
      <a className="back-link" href="#services">← All services</a>
      <div className="details-grid">
        <div className="details-image">{service.image || '🛠️'}</div>
        <div>
          <p className="hero-eyebrow">{service.category?.toUpperCase()}</p>
          <h1>{service.title}</h1>
          <p className="service-rating">⭐ {service.rating || '0.0'} <small>({service.reviewCount || 0} reviews)</small></p>
          <p>{service.description}</p>
          {service.duration && <p><strong>Duration:</strong> {service.duration}</p>}
          <div className="details-price">
            <strong>From ₹{parseFloat(service.price).toFixed(2)}</strong>
            {service.duration && <span>Estimated duration: {service.duration}</span>}
          </div>
          {isCustomer && <div className="details-wishlist">
            <button className={`wishlist-button${isFavorite ? ' is-saved' : ''}`} onClick={toggleFavorite} disabled={favoriteBusy} aria-pressed={isFavorite}>
              {favoriteBusy ? 'Saving...' : isFavorite ? '♥ Saved to wishlist' : '♡ Add service to wishlist'}
            </button>
            {wishlistError && <p className="form-error" role="alert">{wishlistError}</p>}
          </div>}
          <a className="primary-button" href={`#booking?serviceId=${service.id}`} style={{ display: 'inline-block', padding: '0.75rem 1.5rem', textDecoration: 'none' }}>Book this service now</a>
        </div>
      </div>
      {provider.name && <section className="panel" style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
        <h2>About {provider.businessName || provider.name}</h2>
        <p>Trusted local service provider with verified credentials.</p>
        {provider.email && <p><strong>Email:</strong> {provider.email}</p>}
        {provider.phone && <p><strong>Phone:</strong> {provider.phone}</p>}
      </section>}
    </main>
  <Footer /></div>
}
export default ServiceDetails