function ServiceCard({ id, title, category, rating, reviews, price, image = '🛠️', onBook, onView }) {
  const handleView = onView || (() => { window.location.hash = `#service-details?id=${id}` })
  const handleBook = onBook || (() => { window.location.hash = `#booking?serviceId=${id}` })

  return (
    <article className="public-service-card">
      <div className="service-image" aria-hidden="true">{image}</div>
      <div className="service-card-body">
        <span className="card-category-tag">{category}</span>
        <h3>{title}</h3>
        <p className="service-rating">⭐ {rating} <small>({reviews} reviews)</small></p>
        <div className="service-card-footer">
          <strong className="service-price-tag">From {price}</strong>
          <div className="service-card-buttons">
            <button className="secondary-button-sm" onClick={handleView}>View</button>
            <button className="primary-button-sm" onClick={handleBook}>Book now</button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ServiceCard