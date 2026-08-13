import { useState } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { useAuth } from '../../context/AuthContext'

function AdminProfile() {
  const { user } = useAuth()
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD'

  return <AdminLayout title="Admin Profile" subtitle="Manage your administrator profile and security preferences.">
    <section className="panel profile-panel">
      <div className="avatar">{initials}</div>
      <div><h2>{user?.name || 'Admin'}</h2><p>Platform administrator · {user?.email || 'admin@localservices.com'}</p></div>
      <hr />
      <form className="profile-form">
        <label>Full name<input defaultValue={user?.name || 'Admin'} /></label>
        <label>Email address<input type="email" defaultValue={user?.email || 'admin@localservices.com'} /></label>
        <label>Phone number<input defaultValue={user?.phone || '+1 555 010 0248'} /></label>
        <button className="primary-button" type="button">Save changes</button>
      </form>
    </section>
  </AdminLayout>
}
export default AdminProfile