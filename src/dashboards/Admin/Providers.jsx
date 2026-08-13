import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { userAPI } from '../../api.js'

function Providers() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userAPI.getAll({ role: 'provider' })
      .then(data => setProviders(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return <AdminLayout title="Providers" subtitle="Review service provider profiles and verification.">
    <section className="panel">
      <div className="panel-heading"><div><h2>Service providers</h2><p>{providers.length} providers registered</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>Provider</th><th>Category</th><th>Business</th><th>Status</th><th /></tr></thead><tbody>
        {loading ? <tr><td colSpan="5">Loading...</td></tr> :
         providers.length === 0 ? <tr><td colSpan="5">No providers found.</td></tr> :
         providers.map(p => <tr key={p.id}>
           <td><strong>{p.name}</strong></td>
           <td>{p.serviceCategory || '—'}</td>
           <td>{p.businessName || '—'}</td>
           <td><span className={`status status-${p.isActive ? 'verified' : 'suspended'}`}>{p.isActive ? 'Active' : 'Suspended'}</span></td>
           <td><button className="text-button" onClick={async () => { try { await userAPI.toggleStatus(p.id); setProviders(providers.map(x => x.id === p.id ? {...x, isActive: !x.isActive} : x)) } catch(e) { alert(e.message) } }}>{p.isActive ? 'Suspend' : 'Activate'}</button></td>
         </tr>)}
      </tbody></table></div>
    </section>
  </AdminLayout>
}
export default Providers