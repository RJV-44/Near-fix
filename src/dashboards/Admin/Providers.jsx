import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { userAPI } from '../../api.js'

function Providers() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    userAPI.getAll({ role: 'provider' })
      .then(data => setProviders(data))
      .catch(() => setProviders([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredProviders = providers.filter((provider) => {
    const searchValue = query.trim().toLowerCase()
    if (!searchValue) return true

    return [provider.name, provider.businessName, provider.email, provider.serviceCategory, provider.phone]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchValue))
  })

  return <AdminLayout title="Providers" subtitle="Review service provider profiles and verification.">
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Service providers</h2>
          <p>{filteredProviders.length} of {providers.length} providers shown</p>
        </div>
        <div className="table-search-wrap">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search providers"
            aria-label="Search providers"
          />
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Business</th>
              <th>Category</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5">Loading...</td></tr> :
              filteredProviders.length === 0 ? <tr><td colSpan="5">No providers found.</td></tr> :
              filteredProviders.map((p) => <tr key={p.id}>
                <td>
                  <strong>{p.name || 'Unnamed provider'}</strong><br />
                  <small>{p.email || '—'}</small>
                </td>
                <td>{p.businessName || '—'}</td>
                <td>{p.serviceCategory || '—'}</td>
                <td><span className={`status status-${p.isActive ? 'verified' : 'suspended'}`}>{p.isActive ? 'Active' : 'Suspended'}</span></td>
                <td><button className="text-button" onClick={async () => { try { await userAPI.toggleStatus(p.id); setProviders(providers.map(x => x.id === p.id ? { ...x, isActive: !x.isActive } : x)) } catch (e) { alert(e.message) } }}>{p.isActive ? 'Suspend' : 'Activate'}</button></td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </section>
  </AdminLayout>
}
export default Providers