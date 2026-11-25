import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
import { bookingAPI, reviewAPI } from '../../api.js'

function Reviews() {
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    Promise.all([bookingAPI.getAll(), reviewAPI.getAll()])
      .then(([bookingData, reviewData]) => {
        setBookings(bookingData)
        setReviews(reviewData)
      })
      .catch(err => setError(`Could not load reviews: ${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  const reviewedBookingIds = new Set(reviews.map(review => String(review.bookingId)))
  const reviewableBookings = bookings.filter(
    booking => booking.status === 'completed' && !reviewedBookingIds.has(String(booking.id)),
  )

  const submitReview = async (event) => {
    event.preventDefault()
    if (!selectedBooking) return
    setSubmitting(true)
    setError('')
    try {
      const review = await reviewAPI.create({
        bookingId: selectedBooking.id,
        rating: Number(rating),
        comment,
      })
      setReviews(current => [review, ...current])
      setSelectedBooking(null)
      setRating('5')
      setComment('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteReview = async (id) => {
    setRemovingId(id)
    setError('')
    try {
      await reviewAPI.delete(id)
      setReviews(current => current.filter(review => String(review.id) !== String(id)))
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  return <CustomerLayout title="My Reviews" subtitle="Share feedback on completed services and manage your reviews.">
    {error && <p className="form-error" role="alert">{error}</p>}
    <section className="panel">
      <div className="panel-heading"><div><h2>Bookings ready for a review</h2><p>{reviewableBookings.length} completed booking{reviewableBookings.length === 1 ? '' : 's'} not yet reviewed</p></div></div>
      {loading ? <p>Loading...</p> :
       reviewableBookings.length === 0 ? <p>Completed bookings that have not been reviewed will appear here.</p> :
       <div className="review-list">
         {reviewableBookings.map(booking => <article className="review-item" key={booking.id}>
           <div className="review-item-content">
             <strong>{booking.service?.title || 'Service'}</strong>
             <p>{booking.provider?.businessName || booking.provider?.name || 'Provider'} · {booking.date}</p>
             {selectedBooking?.id === booking.id ? <form className="review-form" onSubmit={submitReview}>
               <label>Rating
                 <select value={rating} onChange={event => setRating(event.target.value)} required>
                   <option value="5">5 - Excellent</option>
                   <option value="4">4 - Good</option>
                   <option value="3">3 - Average</option>
                   <option value="2">2 - Poor</option>
                   <option value="1">1 - Very poor</option>
                 </select>
               </label>
               <label>Your review
                 <textarea value={comment} onChange={event => setComment(event.target.value)} maxLength={2000} required placeholder="Tell others about your experience." />
               </label>
               <div className="review-form-actions">
                 <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit review'}</button>
                 <button className="secondary-button" type="button" onClick={() => setSelectedBooking(null)} disabled={submitting}>Cancel</button>
               </div>
             </form> : <button className="secondary-button review-write-button" onClick={() => { setSelectedBooking(booking); setError('') }}>Write a review</button>}
           </div>
         </article>)}
       </div>}
    </section>

    <section className="panel">
      <div className="panel-heading"><div><h2>Your reviews</h2><p>{reviews.length} review{reviews.length === 1 ? '' : 's'} written</p></div></div>
      <div className="review-list">
        {loading ? <p>Loading...</p> :
         reviews.length === 0 ? <p>You have not written a review yet.</p> :
         reviews.map(review => <article className="review-item" key={review.id}>
           <div className="review-item-content">
             <strong>{review.provider?.businessName || review.provider?.name || 'Provider'}</strong>
             <p>{review.service?.title || 'Service'} · <span className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span> · {new Date(review.createdAt).toLocaleDateString()}</p>
             {review.comment && <q>{review.comment}</q>}
             <span className={`status status-${review.isApproved ? 'active' : 'pending'}`}>{review.isApproved ? 'Published' : 'Awaiting moderation'}</span>
           </div>
           <button className="text-button danger" onClick={() => deleteReview(review.id)} disabled={removingId === review.id}>{removingId === review.id ? 'Removing...' : 'Delete'}</button>
         </article>)}
      </div>
    </section>
  </CustomerLayout>
}

export default Reviews
