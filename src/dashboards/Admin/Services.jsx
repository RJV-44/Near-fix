import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { serviceAPI } from '../../api.js'

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    serviceAPI.getAll()
      .then(data => setServices(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return <AdminLayout title="Services" subtitle="Monitor the services available on your platform.">
    <section className="panel">
      <div className="panel-heading"><div><h2>Published services</h2><p>{services.length} services listed</p></div><a className="primary-button" href="#provider-add-service">+ Add service</a></div>
      <div className="service-grid">
        {loading ? <p>Loading...</p> :
         services.length === 0 ? <p>No services yet.</p> :
         services.map(s => <ServiceCard key={s.id} name={s.title} category={s.category} provider={s.provider?.businessName || s.provider?.name || 'Provider'} />)}
      </div>
    </section>
  </AdminLayout>
}
export default Services