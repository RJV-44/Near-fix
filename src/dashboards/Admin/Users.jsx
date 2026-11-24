import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { userAPI } from '../../api.js'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    userAPI.getAll()
      .then(data => setUsers(data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredUsers = users.filter((user) => {
    const searchValue = query.trim().toLowerCase()
    if (!searchValue) return true

    return [user.name, user.email, user.role, user.phone]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchValue))
  })

  return <AdminLayout title="Users" subtitle="Manage customer accounts and account status.">
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>All users</h2>
          <p>{filteredUsers.length} of {users.length} users shown</p>
        </div>
        <div className="table-search-wrap">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users"
            aria-label="Search users"
          />
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5">Loading...</td></tr> :
              filteredUsers.length === 0 ? <tr><td colSpan="5">No users found.</td></tr> :
              filteredUsers.map((u) => <tr key={u.id}>
                <td><strong>{u.name || 'Unnamed user'}</strong></td>
                <td>{u.email || '—'}</td>
                <td><span className="badge badge-soft">{u.role || 'customer'}</span></td>
                <td><span className={`status status-${u.isActive ? 'active' : 'suspended'}`}>{u.isActive ? 'Active' : 'Suspended'}</span></td>
                <td><button className="text-button" onClick={async () => { try { await userAPI.toggleStatus(u.id); setUsers(users.map(x => x.id === u.id ? { ...x, isActive: !x.isActive } : x)) } catch (e) { alert(e.message) } }}>{u.isActive ? 'Suspend' : 'Activate'}</button></td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </section>
  </AdminLayout>
}
export default Users