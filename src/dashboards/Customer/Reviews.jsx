import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
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

  return <CustomerLayout title="My Reviews" subtitle="Manage feedback you have shared with providers.">
    <section className="panel">
      <div className="panel-heading"><div><h2>Your reviews</h2><p>Help others choose great local providers.</p></div><button className="primary-button">Write a review</button></div>
      <div className="review-list">
        {loading ? <p>Loading...</p> :
         reviews.length === 0 ? <p>No reviews yet.</p> :
         reviews.map(r => <article className="review-item" key={r.id}>
           <div>
             <strong>{r.provider?.businessName || r.provider?.name || 'Provider'}</strong>
             <p>{r.service?.title || 'Service'} · <span className="stars">{'?'.repeat(r.rating)}</span> · {new Date(r.createdAt).toLocaleDateString()}</p>
             <q>{r.comment}</q>
           </div>
           <button className="text-button">Edit</button>
         </article>)}
      </div>
    </section>
  </CustomerLayout>
}
export default Reviews