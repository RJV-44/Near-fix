import { useState } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../api.js'
import { compressImage } from '../../utils/compressImage.js'

function AdminProfile() {
  const { user, login } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const storedAvatar = user?.avatar && (!user.avatar.startsWith('data:') || user.avatar.length < 200000) ? user.avatar : ''
  const [profileImage, setProfileImage] = useState(storedAvatar || 'https://i.pravatar.cc/240?img=44')
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD'
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Recently'

  const handleProfileImage = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage('Error: Please choose an image file.')
      return
    }

    try {
      setProfileImage(await compressImage(file))
      setMessage('')
    } catch (err) {
      setMessage('Error: ' + err.message)
    }
  }

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
        avatar: profileImage,
      })
      login({ ...user, ...updated })
      setMessage('Profile updated successfully!')
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return <AdminLayout title="Admin Profile" subtitle="Manage your administrator profile and security preferences.">
    <div className="profile-page">
      <section className="panel profile-hero-card">
        <div className="profile-photo-wrap">
          <div className="profile-photo">
            <img src={profileImage} alt={`${user?.name || 'Admin'} profile`} onError={(event) => { event.currentTarget.style.display = 'none' }} />
            <span>{initials}</span>
          </div>
          <label className="profile-photo-edit">Edit photo<input type="file" accept="image/*" onChange={handleProfileImage} /></label>
        </div>
        <div className="profile-identity">
          <p className="profile-kicker">ADMIN ACCOUNT</p>
          <h2>{user?.name || 'Admin'}</h2>
          <p>{user?.email || 'admin@localservices.com'} · Platform administrator</p>
        </div>
        <span className="profile-status">Active account</span>
      </section>

      <div className="profile-content-grid">
        <section className="panel profile-form-card">
          <div className="panel-heading">
            <div>
              <p className="profile-kicker">PROFILE DETAILS</p>
              <h2>Admin information</h2>
              <p>Keep your account details up to date for platform access and notifications.</p>
            </div>
          </div>
          {message && <small className={message.startsWith('Error') ? 'form-error' : 'form-success'}>{message}</small>}
          <form className="profile-form" onSubmit={handleSave}>
            <label><span>Full name</span><input name="name" defaultValue={user?.name || ''} required /><small>Display name used across the dashboard.</small></label>
            <label><span>Email address</span><input name="email" type="email" defaultValue={user?.email || ''} required /><small>Primary admin contact.</small></label>
            <label><span>Phone number</span><input name="phone" defaultValue={user?.phone || ''} placeholder="Add a phone number" /><small>Optional number for account verification.</small></label>
            <div className="profile-form-actions"><button className="primary-button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button></div>
          </form>
        </section>

        <aside className="panel profile-summary-card">
          <p className="profile-kicker">ADMIN OVERVIEW</p>
          <h2>Platform management</h2>
          <table className="profile-details-table">
            <tbody>
              <tr><th>Access</th><td>Full admin</td></tr>
              <tr><th>Member since</th><td>{memberSince}</td></tr>
              <tr><th>Status</th><td>Verified</td></tr>
            </tbody>
          </table>
          <a className="secondary-button" href="#admin-dashboard">Back to dashboard</a>
        </aside>
      </div>
    </div>
  </AdminLayout>
}
export default AdminProfile