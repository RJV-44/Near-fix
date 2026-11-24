import { useState } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../api.js'
import { compressImage } from '../../utils/compressImage.js'

function Profile() {
  const { user, login } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const storedAvatar = user?.avatar && (!user.avatar.startsWith('data:') || user.avatar.length < 200000) ? user.avatar : ''
  const [profileImage, setProfileImage] = useState(storedAvatar || 'https://i.pravatar.cc/240?img=12')
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CU'
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

  return <CustomerLayout title="My Profile" subtitle="Keep your contact details up to date.">
    <div className="profile-page">
      <section className="panel profile-hero-card">
        <div className="profile-photo-wrap"><div className="profile-photo"><img src={profileImage} alt={`${user?.name || 'Customer'} profile`} onError={event => { event.currentTarget.style.display = 'none' }} /><span>{initials}</span></div><label className="profile-photo-edit">Edit photo<input type="file" accept="image/*" onChange={handleProfileImage} /></label></div>
        <div className="profile-identity"><p className="profile-kicker">CUSTOMER ACCOUNT</p><h2>{user?.name || 'Customer'}</h2><p>{user?.email || 'Add your email address'} · Member since {memberSince}</p></div>
        <span className="profile-status">Active account</span>
      </section>
      <div className="profile-content-grid">
        <section className="panel profile-form-card">
          <div className="panel-heading"><div><p className="profile-kicker">YOUR DETAILS</p><h2>Personal information</h2><p>Update the details used for bookings and notifications.</p></div></div>
          {message && <small className={message.startsWith('Error') ? 'form-error' : 'form-success'}>{message}</small>}
          <form className="profile-form" onSubmit={handleSave}>
            <label><span>Full name</span><input name="name" defaultValue={user?.name || ''} required /><small>Use the name you want on your bookings.</small></label>
            <label><span>Email address</span><input name="email" type="email" defaultValue={user?.email || ''} required /><small>We will send booking updates here.</small></label>
            <label><span>Phone number</span><input name="phone" defaultValue={user?.phone || ''} placeholder="Add a phone number" /><small>Optional, but useful for appointment updates.</small></label>
            <div className="profile-form-actions"><button className="primary-button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button></div>
          </form>
        </section>
        <aside className="panel profile-summary-card"><p className="profile-kicker">ACCOUNT OVERVIEW</p><h2>Your Local Services account</h2><table className="profile-details-table"><tbody><tr><th>Bookings</th><td>Manage from dashboard</td></tr><tr><th>Notifications</th><td>Stay up to date</td></tr><tr><th>Member since</th><td>{memberSince}</td></tr></tbody></table><a className="secondary-button" href="#customer-settings">Open settings</a></aside>
      </div>
    </div>
  </CustomerLayout>
}
export default Profile