import { useState } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import { categoryAPI } from '../../api.js'

function AddCategory() {
  const [form, setForm] = useState({ name: '', description: '', icon: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    setError('')
    try {
      await categoryAPI.create({
        name: form.name.trim(),
        slug: form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: form.description.trim(),
        icon: form.icon.trim() || '🛠️',
      })
      window.location.hash = '#provider-add-service'
    } catch (err) {
      setError(err.message || 'Unable to add category')
      setSubmitted(false)
    }
  }

  return <ProviderLayout title="Add Category" subtitle="Create a category for the services you offer.">
    <div className="add-category-layout">
      <form className="panel service-form add-category-form" onSubmit={handleSubmit}>
        <div className="panel-heading"><div><p className="profile-kicker">SERVICE ORGANIZATION</p><h2>New service category</h2><p>Use a clear name so customers can find your services easily.</p></div></div>
        {error && <small className="form-error">{error}</small>}
        <label>Category name<input placeholder="e.g. Garden maintenance" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required /></label>
        <label>Icon or emoji<input placeholder="e.g. 🌿" value={form.icon} onChange={event => setForm({ ...form, icon: event.target.value })} maxLength="4" /></label>
        <label>Description<textarea placeholder="Describe the type of services in this category." value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} required /></label>
        <div className="form-actions"><a className="secondary-button" href="#provider-add-service">Cancel</a><button className="primary-button" type="submit" disabled={submitted}>{submitted ? 'Adding category...' : 'Add category'}</button></div>
      </form>
      <aside className="panel add-category-help"><span className="add-category-icon">{form.icon || '🛠️'}</span><p className="profile-kicker">PREVIEW</p><h2>{form.name || 'Your category'}</h2><p>{form.description || 'Your category description will appear here.'}</p></aside>
    </div>
  </ProviderLayout>
}

export default AddCategory
