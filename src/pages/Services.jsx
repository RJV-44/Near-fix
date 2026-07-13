import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { serviceAPI, categoryAPI } from '../api.js'

function Services() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {}
        if (selectedCategory) params.category = selectedCategory
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
  }, [selectedCategory])

  const filtered = services.filter(s =>
    !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase())
  )
  return <div className="public-page"><Navbar onLogin={() => { window.location.hash = '#login' }} onRegister={() => { window.location.hash = '#register' }} />
    <main className="public-section services-page">
      <p className="hero-eyebrow">LOCAL PROFESSIONALS</p>
      <h1>Find the service you need.</h1>
      <div className="service-filters">
        <input type="search" placeholder="Search services" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <button className="primary-button" onClick={() => setSelectedCategory(selectedCategory)}>Search</button>
      </div>
      <div className="public-service-grid">
        {loading ? <p>Loading services...</p> :
          filtered.length === 0 ? <p>No services found.</p> :
          filtered.map(s => <ServiceCard key={s.id} id={s.id} title={s.title} category={s.category} rating={s.rating || '0.0'} reviews={s.reviewCount || 0} price={`$${parseFloat(s.price).toFixed(0)}`} image={s.image || '??'} onBook={() => { window.location.hash = `#service-details?id=${s.id}` }} />)}
      </div>
    </main>
  <Footer /></div>
}
export default Services