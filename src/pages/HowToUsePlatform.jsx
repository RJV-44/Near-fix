import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const customerSteps = [
  ['01', 'Search for a service', 'Browse categories or search for the kind of local help you need.'],
  ['02', 'Compare your options', 'Review provider details, prices, ratings, and availability before choosing.'],
  ['03', 'Book a time', 'Select a convenient slot and confirm your booking in a few clicks.'],
]

const providerSteps = [
  ['01', 'Create your profile', 'Tell customers what you do, where you work, and what makes your service useful.'],
  ['02', 'List your services', 'Add clear descriptions, pricing, availability, and images for each service.'],
  ['03', 'Manage your work', 'Keep track of bookings, messages, earnings, and reviews from your dashboard.'],
]

function StepList({ title, steps }) {
  return <article className="how-to-card"><h2>{title}</h2>{steps.map(([number, heading, text]) => <div className="how-to-step" key={number}><span>{number}</span><div><h3>{heading}</h3><p>{text}</p></div></div>)}</article>
}

function HowToUsePlatform() {
  return (
    <div className="public-page">
      <Navbar onLogin={() => { window.location.hash = '#login' }} onRegister={() => { window.location.hash = '#register' }} />
      <main>
        <section className="how-to-hero">
          <p className="hero-eyebrow">HOW TO USE THE PLATFORM</p>
          <h1>Everything you need, in a few simple steps.</h1>
          <p>Whether you need a hand or provide one, NEAr FiX keeps the journey clear from first search to finished work.</p>
        </section>
        <section className="public-section how-to-section">
          <div className="how-to-grid"><StepList title="For customers" steps={customerSteps} /><StepList title="For providers" steps={providerSteps} /></div>
        </section>
        <section className="public-cta"><div><p>YOUR NEXT TASK STARTS HERE</p><h2>Find trusted help near you.</h2></div><a href="#services">Explore services</a></section>
      </main>
      <Footer />
    </div>
  )
}

export default HowToUsePlatform