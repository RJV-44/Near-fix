import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { reviewAPI } from '../../api.js'

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reviewAPI.getAll()
      .then(data => setReviews(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return <AdminLayout title="Reviews" subtitle="Moderate customer feedback and provider responses.">
    <section className="panel">
      <div className="panel-heading"><div><h2>Recent reviews</h2><p>{reviews.length} reviews total</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Provider</th><th>Rating</th><th>Comment</th><th>Status</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="5">Loading...</td></tr> :
         reviews.length === 0 ? <tr><td colSpan="5">No reviews yet.</td></tr> :
         reviews.map(r => <tr key={r.id}>
           <td>{r.customer?.name || 'Customer'}</td>
           <td>{r.provider?.businessName || r.provider?.name || 'Provider'}</td>
           <td><span className="stars">{'★'.repeat(Math.round(r.rating || 0))}{'☆'.repeat(Math.max(0, 5 - Math.round(r.rating || 0)))}</span></td>
           <td>{r.comment || '—'}</td>
           <td><span className={`status status-${r.isApproved ? 'active' : 'pending'}`}>{r.isApproved ? 'Approved' : 'Pending'}</span></td>
         </tr>)}
      </tbody></table></div>
    </section>
  </AdminLayout>
}
export default Reviews