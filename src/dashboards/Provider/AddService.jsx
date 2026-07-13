import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import { serviceAPI, categoryAPI } from '../../api.js'

function AddService() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: '', category: '', price: '', duration: '', description: '', serviceArea: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    categoryAPI.getAll().then(data => setCategories(data)).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setError('')
    try {
      await serviceAPI.create({
        title: form.title,
        category: form.category,
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

  return <ProviderLayout title="Add Service" subtitle="Create a new service for customers to book.">
    <form className="panel service-form" onSubmit={handleSubmit}>
      {error && <small className="form-error">{error}</small>}
      <label>Service name
        <input placeholder="e.g. Deep home cleaning" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
      </label>
      <label>Category
        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
          <option value="" disabled>Select a category</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </label>
      <div className="form-row">
        <label>Starting price
          <input type="number" placeholder="89" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        </label>
        <label>Duration
          <input placeholder="e.g. 3 hours" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
        </label>
      </div>
      <label>Service description
        <textarea placeholder="Describe what is included in this service." value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
      </label>
      <button className="primary-button" type="submit" disabled={submitted}>
        {submitted ? 'Publishing...' : 'Publish service'}
      </button>
    </form>
 </ProviderLayout>
}
export default AddService