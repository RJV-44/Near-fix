import CustomerLayout from '../components/CustomerLayout.jsx'
import { useAuth } from '../../context/AuthContext'

function Profile() {
  const { user } = useAuth()
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CU'
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Recently'

  return <CustomerLayout title="My Profile" subtitle="Keep your contact details up to date.">
    <section className="panel profile-panel">
      <div className="avatar">{initials}</div>
      <div><h2>{user?.name || 'Customer'}</h2><p>Customer since {memberSince}</p></div>
      <hr />
      <form className="profile-form">
        <label>Full name<input defaultValue={user?.name || ''} /></label>
        <label>Email address<input type="email" defaultValue={user?.email || ''} /></label>
        <label>Phone number<input defaultValue={user?.phone || ''} /></label>
        <label>Address<input defaultValue="Your address" /></label>
        <button className="primary-button" type="button">Save changes</button>
      </form>
    </section>
  </CustomerLayout>
}
export default Profile