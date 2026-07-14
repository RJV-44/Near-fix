import { useState } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../api.js'

function Profile() {
  const { user, login } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CU'
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Recently'

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const form = e.target
      const updated = await userAPI.update(user.id, {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
      })
      login({ ...user, ...updated })
      setMessage('Profile updated successfully!')
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return <CustomerLayout title="My Profile" subtitle="Keep your contact details up to date.">
    <section className="panel profile-panel">
      <div className="avatar">{initials}</div>
      <div><h2>{user?.name || 'Customer'}</h2><p>Customer since {memberSince}</p></div>
      <hr />
      {message && <small className={message.startsWith('Error') ? 'form-error' : 'form-success'}>{message}</small>}
      <form className="profile-form" onSubmit={handleSave}>
        <label>Full name<input name="name" defaultValue={user?.name || ''} required /></label>
        <label>Email address<input name="email" type="email" defaultValue={user?.email || ''} required /></label>
        <label>Phone number<input name="phone" defaultValue={user?.phone || ''} /></label>
        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </section>
  </CustomerLayout>
}
export default Profile