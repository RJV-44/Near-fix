import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { serviceAPI, categoryAPI, favoriteAPI } from '../api.js'
import { useAuth } from '../context/AuthContext'

function Services() {
  const { isCustomer, user } = useAuth()
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const initialParams = new URLSearchParams(window.location.hash.split('?')[1] || '')
  const [searchQuery, setSearchQuery] = useState(initialParams.get('q') || '')
  const initialCategory = initialParams.get('category') || ''
  const [providerId, setProviderId] = useState(initialParams.get('provider') || '')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [favoriteServiceIds, setFavoriteServiceIds] = useState([])
  const [favoriteBusyIds, setFavoriteBusyIds] = useState([])
  const [wishlistError, setWishlistError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = {}
        if (selectedCategory) params.category = selectedCategory
        if (providerId) params.provider = providerId
        const [servicesData, categoriesData] = await Promise.all([
          serviceAPI.getAll(params),
          categoryAPI.getAll(),
        ])
        setServices(servicesData)
        setCategories(categoriesData)
      } catch (err) {
        console.error('Failed to load services:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedCategory, providerId])

  useEffect(() => {
    if (!isCustomer) {
      setFavoriteServiceIds([])
      return
    }
    favoriteAPI.getAll()
      .then(favorites => setFavoriteServiceIds(favorites.map(favorite => String(favorite.serviceId || favorite.service?.id))))
      .catch(error => setWishlistError(`Could not load your wishlist: ${error.message}`))
  }, [isCustomer, user?.id])

  const toggleFavorite = async (id) => {
    const saved = favoriteServiceIds.includes(String(id))
    setFavoriteBusyIds(current => [...current, String(id)])
    setWishlistError('')
    try {
      if (saved) {
        await favoriteAPI.remove(id)
        setFavoriteServiceIds(current => current.filter(service => service !== String(id)))
      } else {
        await favoriteAPI.add(id)
        setFavoriteServiceIds(current => current.includes(String(id)) ? current : [...current, String(id)])
      }
    } catch (error) {
      setWishlistError(`Could not update your wishlist: ${error.message}`)
    } finally {
      setFavoriteBusyIds(current => current.filter(provider => provider !== String(id)))
    }
  }

  const filtered = (services || []).filter(s => {
    const title = String(s?.title || '').toLowerCase()
    const category = String(s?.category || '').toLowerCase()
    const query = String(searchQuery || '').toLowerCase()
    return !query || title.includes(query) || category.includes(query)
  })

  return <div className="public-page"><Navbar onLogin={() => { window.location.hash = '#login' }} onRegister={() => { window.location.hash = '#register' }} />
    <main className="public-section services-page">
      <section className="services-intro"><div><p className="hero-eyebrow">LOCAL SERVICE CATALOG</p><h1>Find the right help for every task.</h1><p>Browse trusted local professionals, compare services, and book a time that works for you.</p></div><div className="services-intro-mark" aria-hidden="true">{loading ? '...' : filtered.length}</div></section>
      <section className="service-toolbar" aria-label="Service filters">
        <div className="service-filters">
          <input type="search" placeholder="Search by service or category" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          {(searchQuery || selectedCategory || providerId) && <button className="secondary-button" onClick={() => { setSearchQuery(''); setSelectedCategory(''); setProviderId('') }}>Clear filters</button>}
        </div>
        <div className="service-result-bar"><strong>{loading ? 'Loading catalog...' : `${filtered.length} service${filtered.length === 1 ? '' : 's'} available`}</strong><span>{selectedCategory ? `Showing ${selectedCategory}` : providerId ? 'Showing this provider' : 'Showing all services'}</span></div>
        {wishlistError && <p className="form-error" role="alert">{wishlistError}</p>}
      </section>
      <div className="service-provider-links"><strong>Looking for a professional first?</strong><div>{categories.map(category => <a key={category.id} href={`#providers?category=${encodeURIComponent(category.name)}`}><span>{category.icon || '?'}</span>{category.name}</a>)}</div></div>
      <div className="public-service-grid">{loading ? <p>Loading services...</p> : filtered.length === 0 ? <div className="service-empty"><h2>No services found</h2><p>Try another search or clear the filters to see the full catalog.</p><button className="secondary-button" onClick={() => { setSearchQuery(''); setSelectedCategory(''); setProviderId('') }}>Show all services</button></div> : filtered.map(s => <ServiceCard key={s.id} id={s.id} title={s.title} category={s.category} description={s.description} duration={s.duration} provider={s.provider} canFavorite={isCustomer} isFavorite={favoriteServiceIds.includes(String(s.id))} favoriteBusy={favoriteBusyIds.includes(String(s.id))} onToggleFavorite={toggleFavorite} rating={s.rating || '0.0'} reviews={s.reviewCount || 0} price={`₹${parseFloat(s.price || 0).toFixed(0)}`} image={s.image || '🛠️'} onView={() => { window.location.hash = `#service-details?id=${s.id}` }} onBook={() => { window.location.hash = `#booking?serviceId=${s.id}` }} />)}</div>
    </main>
  <Footer /></div>
}
export default Services