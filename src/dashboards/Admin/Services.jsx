import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
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
      <div className="table-wrap"><table><thead><tr><th>Service</th><th>Provider</th><th>Category</th><th>Price</th><th>Status</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="5">Loading...</td></tr> :
         services.length === 0 ? <tr><td colSpan="5">No services yet.</td></tr> :
         services.map(s => <tr key={s.id}>
           <td><strong>{s.title}</strong></td>
           <td>{s.provider?.businessName || s.provider?.name || 'Provider'}</td>
           <td>{s.category || 'General'}</td>
           <td>${parseFloat(s.price || 0).toFixed(2)}</td>
           <td><span className={`status status-${s.isActive ? 'active' : 'suspended'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
         </tr>)}
      </tbody></table></div>
    </section>
  </AdminLayout>
}
export default Services