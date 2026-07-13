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
      <div className="review-list">
        {loading ? <p>Loading...</p> :
         reviews.length === 0 ? <p>No reviews yet.</p> :
         reviews.map(r => <article className="review-item" key={r.id}>
           <div>
             <strong>{r.customer?.name || 'Customer'}</strong>
             <p>for {r.provider?.businessName || r.provider?.name || 'Provider'} · <span className="stars">{'?'.repeat(r.rating)}</span></p>
             <q>{r.comment}</q>
           </div>
           <div>
             <span className={`status status-${r.isApproved ? 'active' : 'pending'}`}>{r.isApproved ? 'Approved' : 'Pending'}</span>
           </div>
         </article>)}
      </div>
    </section>
  </AdminLayout>
}
export default Reviews