import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
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

  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'

  return <ProviderLayout title="Reviews" subtitle="See what customers are saying about your services.">
    <section className="stat-grid provider-review-stats">
      <article className="stat-card"><p>Average rating</p><h2>{avgRating} ?</h2></article>
      <article className="stat-card"><p>Total reviews</p><h2>{reviews.length}</h2></article>
      <article className="stat-card"><p>Response rate</p><h2>96%</h2></article>
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>Customer feedback</h2><p>Recent reviews for your business.</p></div></div>
      <div className="review-list">
        {loading ? <p>Loading...</p> :
         reviews.length === 0 ? <p>No reviews yet.</p> :
         reviews.map(r => <article className="review-item" key={r.id}>
           <div>
             <strong>{r.customer?.name || 'Customer'}</strong>
             <p>{r.service?.title || 'Service'} · <span className="stars">{'?'.repeat(r.rating)}</span></p>
             <q>{r.comment}</q>
           </div>
           <button className="text-button">Reply</button>
         </article>)}
      </div>
    </section>
  </ProviderLayout>
}
export default Reviews