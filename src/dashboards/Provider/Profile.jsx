import ProviderLayout from '../components/ProviderLayout.jsx'
import { useAuth } from '../../context/AuthContext'

function Profile() {
  const { user } = useAuth()
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'PR'

  return <ProviderLayout title="Business Profile" subtitle="Manage how customers see your business.">
    <section className="panel profile-panel">
      <div className="avatar">{initials}</div>
      <div><h2>{user?.businessName || user?.name || 'Provider'}</h2><p>Verified provider · {user?.serviceCategory || 'Service provider'}</p></div>
      <hr />
      <form className="profile-form">
        <label>Business name<input defaultValue={user?.businessName || ''} /></label>
        <label>Business email<input type="email" defaultValue={user?.email || ''} /></label>
        <label>Phone number<input defaultValue={user?.phone || ''} /></label>
        <label>Business description<textarea defaultValue="Reliable, professional service provider." /></label>
        <button className="primary-button" type="button">Save profile</button>
      </form>
    </section>
  </ProviderLayout>
}
export default Profile