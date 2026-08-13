import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { userAPI } from '../../api.js'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userAPI.getAll()
      .then(data => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return <AdminLayout title="Users" subtitle="Manage customer accounts and account status.">
    <section className="panel">
      <div className="panel-heading"><div><h2>All users</h2><p>{users.length} users total</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead><tbody>
        {loading ? <tr><td colSpan="5">Loading...</td></tr> :
         users.length === 0 ? <tr><td colSpan="5">No users found.</td></tr> :
         users.map(u => <tr key={u.id}>
           <td><strong>{u.name}</strong></td>
           <td>{u.email}</td>
           <td>{u.role}</td>
           <td><span className={`status status-${u.isActive ? 'active' : 'suspended'}`}>{u.isActive ? 'Active' : 'Suspended'}</span></td>
           <td><button className="text-button" onClick={async () => { try { await userAPI.toggleStatus(u.id); setUsers(users.map(x => x.id === u.id ? {...x, isActive: !x.isActive} : x)) } catch(e) { alert(e.message) } }}>{u.isActive ? 'Suspend' : 'Activate'}</button></td>
         </tr>)}
      </tbody></table></div>
    </section>
  </AdminLayout>
}
export default Users