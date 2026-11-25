import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const values = [
  {
    icon: 'M12 3 4.5 6v5.3c0 4.7 3.2 8.9 7.5 10.2 4.3-1.3 7.5-5.5 7.5-10.2V6L12 3Zm-1.1 12.2-3-3 1.4-1.4 1.6 1.6 3.8-3.8 1.4 1.4-5.2 5.2Z',
    title: 'Choose with confidence',
    description: 'Clear service details and customer reviews help you decide what works for you.',
  },
  {
    icon: 'M7 2v3M17 2v3M4 8h16M6 4h12a2 2 0 0 1 2 2v13H4V6a2 2 0 0 1 2-2Zm2 8h3m-3 4h8',
    title: 'Booking made simple',
    description: 'Find a service, share what you need, and keep track of your booking in one place.',
  },
  {
    icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m16-11a4 4 0 0 1 0 8m-3-12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    title: 'Rooted in community',
    description: 'We make it easier for local professionals to share their skills with nearby customers.',
  },
]

const steps = [
  { number: '01', title: 'Explore', description: 'Browse services and compare the details that matter to you.' },
  { number: '02', title: 'Connect', description: 'Choose a provider and send a booking request for the service you need.' },
  { number: '03', title: 'Get it done', description: 'Follow your booking and stay in touch as your service is arranged.' },
]

function About() {
  return (
    <div className="public-page">
      <Navbar onLogin={() => { window.location.hash = '#login' }} onRegister={() => { window.location.hash = '#register' }} />
      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero-copy">
            <p className="hero-eyebrow"><span className="about-eyebrow-dot" /> LOCAL HELP, THOUGHTFULLY CONNECTED</p>
            <h1>The right help,<br /><span>closer to home.</span></h1>
            <p className="about-hero-lead">NEAr FiX brings customers and skilled local professionals together, making it easier to find help for the things that matter.</p>
            <div className="about-hero-actions">
              <a className="primary-button" href="#services">Explore services <span aria-hidden="true">→</span></a>
              <a className="secondary-button" href="#how-to-use">How it works</a>
            </div>
            <div className="about-hero-note"><span aria-hidden="true">✦</span> A simpler way to get things done locally</div>
          </div>

          <div className="about-visual" aria-label="Illustration of local services available in one place">
            <div className="about-visual-orbit about-visual-orbit-one" />
            <div className="about-visual-orbit about-visual-orbit-two" />
            <div className="about-visual-spark about-visual-spark-one">✦</div>
            <div className="about-visual-spark about-visual-spark-two">✳</div>
            <div className="about-service-panel">
              <div className="about-panel-top">
                <div>
                  <span className="about-panel-label">YOUR NEIGHBOURHOOD</span>
                  <h2>Help for every day</h2>
                </div>
                <span className="about-panel-pin" aria-hidden="true">⌖</span>
              </div>
              <div className="about-panel-search"><span aria-hidden="true">⌕</span> What can we help with?</div>
              <div className="about-service-row">
                <span className="about-service-icon about-service-icon-blue" aria-hidden="true">⌂</span>
                <span><strong>Home repairs</strong><small>Find a helping hand</small></span>
                <span className="about-service-arrow" aria-hidden="true">→</span>
              </div>
              <div className="about-service-row">
                <span className="about-service-icon about-service-icon-teal" aria-hidden="true">✧</span>
                <span><strong>Cleaning</strong><small>Make room for what matters</small></span>
                <span className="about-service-arrow" aria-hidden="true">→</span>
              </div>
              <div className="about-service-row">
                <span className="about-service-icon about-service-icon-amber" aria-hidden="true">↗</span>
                <span><strong>Moving help</strong><small>Get your next chapter started</small></span>
                <span className="about-service-arrow" aria-hidden="true">→</span>
              </div>
            </div>
            <div className="about-floating-note"><span className="about-floating-check" aria-hidden="true">✓</span><span><strong>All in one place</strong><small>Browse, book, and keep track</small></span></div>
          </div>
        </section>

        <section className="about-intro public-section">
          <div>
            <p className="section-kicker">WHY NEAr FiX</p>
            <h2>Good work starts with a good connection.</h2>
          </div>
          <p>Finding someone to help shouldn’t feel like another chore. We built NEAr FiX to bring useful service information, simple booking, and local expertise together—so customers can find the right help and professionals can focus on doing what they do best.</p>
        </section>

        <section className="about-values-section">
          <div className="public-section">
            <div className="about-section-heading">
              <div>
                <p className="section-kicker">WHAT MATTERS TO US</p>
                <h2>Local service, with people at the heart.</h2>
              </div>
              <p>Everything we build comes back to making local services easier to discover, arrange, and trust.</p>
            </div>
            <div className="values-grid">
              {values.map((value) => (
                <article key={value.title} className="about-value-card">
                  <span className="about-value-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d={value.icon} /></svg>
                  </span>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="public-section about-steps-section">
          <div className="about-section-heading">
            <div>
              <p className="section-kicker">A BETTER WAY TO GET STARTED</p>
              <h2>From “I need a hand” to sorted.</h2>
            </div>
            <a className="about-steps-link" href="#services">Find a service <span aria-hidden="true">→</span></a>
          </div>
          <div className="about-steps-grid">
            {steps.map((step) => (
              <article className="about-step-card" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-cta about-cta">
          <div>
            <p>ARE YOU A LOCAL PROFESSIONAL?</p>
            <h2>Good at what you do? Let more people find you.</h2>
            <span>Bring your services to a community looking for local expertise.</span>
          </div>
          <a href="#provider-register">Become a provider <span aria-hidden="true">→</span></a>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default About
