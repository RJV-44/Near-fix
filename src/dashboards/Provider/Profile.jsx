import { useState } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../api.js'

function Profile() {
  const { user, login } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'PR'

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
        businessName: form.businessName.value,
      })
      login({ ...user, ...updated })
      setMessage('Profile updated successfully!')
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return <ProviderLayout title="Business Profile" subtitle="Manage how customers see your business.">
    <section className="panel profile-panel">
      <div className="avatar">{initials}</div>
      <div><h2>{user?.businessName || user?.name || 'Provider'}</h2><p>Verified provider · {user?.serviceCategory || 'Service provider'}</p></div>
      <hr />
      {message && <small className={message.startsWith('Error') ? 'form-error' : 'form-success'}>{message}</small>}
      <form className="profile-form" onSubmit={handleSave}>
        <label>Business name<input name="businessName" defaultValue={user?.businessName || ''} /></label>
        <label>Full name<input name="name" defaultValue={user?.name || ''} required /></label>
        <label>Business email<input name="email" type="email" defaultValue={user?.email || ''} required /></label>
        <label>Phone number<input name="phone" defaultValue={user?.phone || ''} /></label>
        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </section>
  </ProviderLayout>
}
export default Profile