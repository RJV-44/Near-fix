import { useState } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../api.js'
import { compressImage } from '../../utils/compressImage.js'

function Profile() {
  const { user, login } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const storedAvatar = user?.avatar && (!user.avatar.startsWith('data:') || user.avatar.length < 200000) ? user.avatar : ''
  const [profileImage, setProfileImage] = useState(storedAvatar || 'https://i.pravatar.cc/240?img=33')
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'PR'

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
        businessName: form.businessName.value,
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

  return <ProviderLayout title="Business Profile" subtitle="Manage how customers see your business.">
    <div className="profile-page">
      <section className="panel profile-hero-card">
        <div className="profile-photo-wrap"><div className="profile-photo"><img src={profileImage} alt={`${user?.businessName || user?.name || 'Provider'} profile`} onError={event => { event.currentTarget.style.display = 'none' }} /><span>{initials}</span></div><label className="profile-photo-edit">Edit photo<input type="file" accept="image/*" onChange={handleProfileImage} /></label></div>
        <div className="profile-identity"><p className="profile-kicker">PROVIDER ACCOUNT</p><h2>{user?.businessName || user?.name || 'Provider'}</h2><p>{user?.email || 'Add your business email'} · {user?.serviceCategory || 'Service provider'}</p></div>
        <span className="profile-status">Verified provider</span>
      </section>
      <div className="profile-content-grid">
        <section className="panel profile-form-card">
          <div className="panel-heading"><div><p className="profile-kicker">PUBLIC PROFILE</p><h2>Business information</h2><p>Keep your public provider details accurate and current.</p></div></div>
          {message && <small className={message.startsWith('Error') ? 'form-error' : 'form-success'}>{message}</small>}
          <form className="profile-form" onSubmit={handleSave}>
            <label><span>Business name</span><input name="businessName" defaultValue={user?.businessName || ''} placeholder="Your business name" /><small>This name is shown to customers.</small></label>
            <label><span>Full name</span><input name="name" defaultValue={user?.name || ''} required /><small>Your main contact name.</small></label>
            <label><span>Business email</span><input name="email" type="email" defaultValue={user?.email || ''} required /><small>Used for booking notifications.</small></label>
            <label><span>Phone number</span><input name="phone" defaultValue={user?.phone || ''} placeholder="Add a phone number" /><small>Optional contact number for customers.</small></label>
            <div className="profile-form-actions"><button className="primary-button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button></div>
          </form>
        </section>
        <aside className="panel profile-summary-card"><p className="profile-kicker">PROVIDER SNAPSHOT</p><h2>Build trust with complete details.</h2><table className="profile-details-table"><tbody><tr><th>Category</th><td>{user?.serviceCategory || 'Add a service category'}</td></tr><tr><th>Experience</th><td>{user?.yearsOfExperience || 'Add your experience'}</td></tr><tr><th>Profile</th><td>Verified provider</td></tr></tbody></table><a className="secondary-button" href="#provider-my-services">Manage services</a></aside>
      </div>
    </div>
  </ProviderLayout>
}
export default Profile