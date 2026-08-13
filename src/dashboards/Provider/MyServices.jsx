import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import { serviceAPI } from '../../api.js'

function MyServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchServices = () => {
    setLoading(true)
    serviceAPI.getAll({ mine: 'true' })
      .then(data => setServices(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await serviceAPI.delete(id)
      setServices(services.filter(s => s.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  return <ProviderLayout title="My Services" subtitle="Create and manage the services you offer.">
    <section className="panel">
      <div className="panel-heading"><div><h2>Service listings</h2><p>{services.length} services in your catalogue.</p></div><a className="primary-button" href="#provider-add-service">+ Add service</a></div>
      <div className="service-grid">
        {loading ? <p>Loading...</p> :
         services.length === 0 ? <p>No services yet. <a href="#provider-add-service">Add your first service</a></p> :
         services.map(s => <article className="service-card" key={s.id}>
           <span className={`status status-${s.isActive ? 'active' : 'draft'}`}>{s.isActive ? 'Active' : 'Draft'}</span>
           <h3>{s.title}</h3>
           <p className="service-category">{s.category}</p>
           <p>From ${parseFloat(s.price).toFixed(0)} · {s.duration || '—'}</p>
           <div className="service-card-actions">
             <a className="text-button" href={`#provider-edit-service?id=${s.id}`}>Edit</a>
             <button className="text-button danger" onClick={() => handleDelete(s.id, s.title)}>Delete</button>
           </div>
         </article>)}
      </div>
    </section>
  </ProviderLayout>
}
export default MyServices