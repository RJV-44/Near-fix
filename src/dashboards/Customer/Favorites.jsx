import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
import { favoriteAPI } from '../../api.js'

function Favorites() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    favoriteAPI.getAll()
      .then(data => setProviders(data.map(f => f.provider).filter(Boolean)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return <CustomerLayout title="Favorites" subtitle="Quickly book the providers you trust.">
    <section className="provider-grid">
      {loading ? <p>Loading...</p> :
       providers.length === 0 ? <p>No favorite providers yet.</p> :
       providers.map(p => <article className="provider-card" key={p.id}>
         <div className="booking-icon">??</div>
         <button className="favorite-button" aria-label={`Remove ${p.name} from favorites`} onClick={async () => { try { await favoriteAPI.remove(p.id); setProviders(providers.filter(x => x.id !== p.id)) } catch(e) { alert(e.message) } }}>?</button>
         <h2>{p.businessName || p.name}</h2>
         <p>{p.serviceCategory || 'Service provider'}</p>
         <p className="stars">? {p.rating || '0.0'}</p>
         <button className="primary-button" onClick={() => window.location.hash = `#services?provider=${p.id}`}>Book again</button>
       </article>)}
    </section>
  </CustomerLayout>
}
export default Favorites