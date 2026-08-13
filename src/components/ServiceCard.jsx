function ServiceCard({ title, category, rating, reviews, price, image = '??', onBook }) {
  return (
    <article className="public-service-card">
      <div className="service-image" aria-hidden="true">{image}</div>
      <div className="service-card-body"><span>{category}</span><h3>{title}</h3><p className="service-rating">? {rating} <small>({reviews} reviews)</small></p><div><strong>From {price}</strong><button onClick={onBook}>View service</button></div></div>
    </article>
  )
}

export default ServiceCard