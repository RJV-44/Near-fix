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

  return (
    <div className="public-page">
      <Navbar onLogin={() => { window.location.hash = '#login' }} onRegister={() => { window.location.hash = '#register' }} />
      <main>
        <Hero onSearch={search} />
        <section className="home-trust-bar" aria-label="Local Services highlights">
          <div><strong>10K+</strong><span>verified providers</span></div>
          <div><strong>50K+</strong><span>bookings completed</span></div>
          <div><strong>4.9/5</strong><span>average customer rating</span></div>
          <div><strong>24/7</strong><span>easy online booking</span></div>
        </section>
        {categories.length > 0 && <section className="public-section home-categories"><div className="section-heading"><div><p>START HERE</p><h2>What do you need help with?</h2></div><a href="#services">View all services &rarr;</a></div><div className="category-grid">{categories.map(cat => <a key={cat.id} href={`#providers?category=${encodeURIComponent(cat.name)}`} className="category-card"><span className="category-icon">{cat.icon || '?'}</span><span>{cat.name}</span><small>Find providers</small></a>)}</div></section>}
        <section className="public-section home-services"><div className="section-heading"><div><p>POPULAR RIGHT NOW</p><h2>Reliable help for every task.</h2></div><a href="#services">Browse all services &rarr;</a></div><div className="public-service-grid">{loading ? <p>Loading services...</p> : services.map(s => <ServiceCard key={s.id} id={s.id} title={s.title} category={s.category} description={s.description} duration={s.duration} provider={s.provider} rating={s.rating || '0.0'} reviews={s.reviewCount || 0} price={`$${parseFloat(s.price || 0).toFixed(0)}`} image={s.image || '🛠️'} onView={() => { window.location.hash = `#service-details?id=${s.id}` }} onBook={() => { window.location.hash = `#booking?serviceId=${s.id}` }} />)}</div></section>
        <section className="public-cta"><div><p>ARE YOU A LOCAL PROFESSIONAL?</p><h2>Grow your business with Local Services.</h2></div><a className="nav-register" href="#register">Become a provider</a></section>
      </main>
      <Footer />
    </div>
  )
}
export default Home