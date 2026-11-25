import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../components/Hero.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { serviceAPI, categoryAPI } from '../api.js'

function Home() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, categoriesData] = await Promise.all([
          serviceAPI.getAll(),
          categoryAPI.getAll(),
        ])
        setServices(servicesData.slice(0, 6))
        setCategories(categoriesData)
      } catch (err) {
        console.error('Failed to load home data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const search = (query) => { window.location.hash = query ? `#services?q=${encodeURIComponent(query)}` : '#services' }

  return <div className="public-page"><Navbar onLogin={() => { window.location.hash = '#login' }} onRegister={() => { window.location.hash = '#register' }} /><Hero onSearch={search} />
    {categories.length > 0 && <section className="public-section"><div className="section-heading"><div><p>CATEGORIES</p><h2>Browse by category</h2></div><a href="#services">Browse all categories ?</a></div><div className="category-grid">{categories.map(cat => <a key={cat.id} href={`#services?category=${encodeURIComponent(cat.name)}`} className="category-card"><span className="category-icon">{cat.icon || '?'}</span><span>{cat.name}</span></a>)}</div></section>}
    <section className="public-section"><div className="section-heading"><div><p>POPULAR SERVICES</p><h2>Help for every task</h2></div><a href="#services">Browse all services ?</a></div><div className="public-service-grid">{loading ? <p>Loading services...</p> : services.map(s => <ServiceCard key={s.id} id={s.id} title={s.title} category={s.category} rating={s.rating || '0.0'} reviews={s.reviewCount || 0} price={`$${parseFloat(s.price || 0).toFixed(0)}`} image={s.image || '🛠️'} onView={() => { window.location.hash = `#service-details?id=${s.id}` }} onBook={() => { window.location.hash = `#booking?serviceId=${s.id}` }} />)}</div></section>

    <section className="public-cta"><div><p>ARE YOU A LOCAL PROFESSIONAL?</p><h2>Grow your business with Local Services.</h2></div><a className="nav-register" href="#register">Become a provider</a></section><Footer /></div>
}
export default Home