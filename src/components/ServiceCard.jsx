function ServiceCard({ id, title, category, rating, reviews, price, image = '🛠️', description, duration, provider, canFavorite = false, isFavorite = false, favoriteBusy = false, onToggleFavorite, onBook, onView }) {
  const handleView = onView || (() => { window.location.hash = `#service-details?id=${id}` })
  const handleBook = onBook || (() => { window.location.hash = `#booking?serviceId=${id}` })
  const imageIsUrl = typeof image === 'string' && image.startsWith('http')

  return (
    <article className="public-service-card">
      <div className="service-image" aria-hidden="true">{imageIsUrl ? <img src={image} alt="" /> : <span>{image}</span>}<span className="service-image-label">Local service</span></div>
      <div className="service-card-body">
        <span className="card-category-tag">{category}</span>
        <h3>{title}</h3>
        {description && <p className="service-description">{description}</p>}
        <p className="service-rating">⭐ {rating} <small>({reviews} reviews)</small></p>
        <div className="service-card-meta">{provider && <span>By {provider.businessName || provider.name}</span>}{duration && <span>{duration}</span>}</div>
        <div className="service-card-footer">
          <strong className="service-price-tag">From {price}</strong>
          <div className="service-card-buttons">
            {canFavorite && id && <button className={`wishlist-button${isFavorite ? ' is-saved' : ''}`} onClick={() => onToggleFavorite?.(id)} disabled={favoriteBusy} aria-pressed={isFavorite} aria-label={`${isFavorite ? 'Remove' : 'Add'} ${title} ${isFavorite ? 'from' : 'to'} wishlist`}>
              {favoriteBusy ? 'Saving...' : isFavorite ? '♥ Saved' : '♡ Save'}
            </button>}
            <button className="secondary-button-sm" onClick={handleView}>View</button>
            <button className="primary-button-sm" onClick={handleBook}>Book now</button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ServiceCard