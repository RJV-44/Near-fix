import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import { serviceAPI, categoryAPI } from '../../api.js'

function EditService() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: '', category: '', price: '', duration: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const id = params.get('id')
    if (!id) { setLoading(false); setError('No service ID specified'); return }

    Promise.all([
      serviceAPI.getById(id),
      categoryAPI.getAll(),
    ]).then(([service, cats]) => {
      setForm({
        title: service.title,
        category: service.category,
        price: service.price.toString(),
        duration: service.duration || '',
        description: service.description,
      })
      setCategories(cats)
    }).catch(err => setError(err.message))
    .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const id = params.get('id')
    if (!id) return

    setSubmitted(true)
    setError('')
    try {
      const selectedCat = categories.find(c => c.name === form.category)
      await serviceAPI.update(id, {
        title: form.title,
        category: form.category,
        categoryId: selectedCat?.id || null,
        description: form.description,
        price: parseFloat(form.price),
        duration: form.duration,
      })
      window.location.hash = '#provider-my-services'
    } catch (err) {
      setError(err.message)
      setSubmitted(false)
    }
  }

  if (loading) return <ProviderLayout title="Edit Service" subtitle="Loading..."><p>Loading service details...</p></ProviderLayout>

  return <ProviderLayout title="Edit Service" subtitle={`Update the details of your ${form.title || 'service'}.`}>
    <form className="panel service-form" onSubmit={handleSubmit}>
      {error && <small className="form-error">{error}</small>}
      <label>Service name
        <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
      </label>
      <label>Category
        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </label>
      <div className="form-row">
        <label>Starting price ($)
          <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        </label>
        <label>Duration
          <input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
        </label>
      </div>
      <label>Service description
        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
      </label>
      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={submitted}>
          {submitted ? 'Saving...' : 'Save changes'}
        </button>
        <button className="text-button danger" type="button" onClick={async () => {
          const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
          const id = params.get('id')
          if (id && confirm(`Delete "${form.title}"? This cannot be undone.`)) {
            try { await serviceAPI.delete(id); window.location.hash = '#provider-my-services' } catch(e) { alert(e.message) }
          }
        }}>Delete service</button>
      </div>
    </form>
  </ProviderLayout>
}
export default EditService