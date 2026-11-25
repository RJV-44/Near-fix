import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
import { favoriteAPI } from '../../api.js'

function Favorites() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    favoriteAPI.getAll()
      .then(setItems)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const removeFavorite = async (serviceId) => {
    setRemovingId(serviceId)
    setError('')
    try {
      await favoriteAPI.remove(serviceId)
      setItems(current => current.filter(item => String(item.serviceId || item.service?.id) !== String(serviceId)))
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  const savedItems = items.filter(item => item.service)

  return <CustomerLayout title="Wishlist" subtitle="Keep track of the services you want to book.">
    {error && <p className="form-error" role="alert">{error}</p>}
    <section className="provider-grid">
      {loading ? <p>Loading...</p> :
       savedItems.length === 0 ? <p>No saved services yet. <a href="#services">Browse services</a> to add one.</p> :
       savedItems.map(item => {
         const service = item.service
         const provider = service.provider || {}
         const serviceId = item.serviceId || service.id
         return <article className="provider-card" key={item.id}>
           <div className="booking-icon">{service.image || '🛠️'}</div>
           <button className="favorite-button" aria-label={`Remove ${service.title} from wishlist`} onClick={() => removeFavorite(serviceId)} disabled={String(removingId) === String(serviceId)}>{String(removingId) === String(serviceId) ? '…' : '❤️'}</button>
           <h2>{service.title}</h2>
           <p>{service.category || provider.businessName || provider.name || 'Service'}</p>
           <p>By {provider.businessName || provider.name || 'Local provider'}</p>
           <p className="stars">⭐ {service.rating || '0.0'} · {service.reviewCount || 0} reviews</p>
           <div className="wishlist-card-actions">
             <a className="secondary-button" href={`#service-details?id=${serviceId}`}>View details</a>
             <a className="primary-button" href={`#booking?serviceId=${serviceId}`}>Book now</a>
           </div>
         </article>
       })}
    </section>
  </CustomerLayout>
}

export default Favorites
