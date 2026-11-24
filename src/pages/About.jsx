import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const values = [
	{ number: '01', title: 'Trusted providers', text: 'We make it easier to compare experienced local professionals and choose with confidence.' },
	{ number: '02', title: 'Simple booking', text: 'Find the right service, pick a time, and keep every booking detail in one place.' },
	{ number: '03', title: 'Better communities', text: 'We help neighbourhood businesses grow while customers get more done locally.' },
]

function About() {
	return (
		<div className="public-page">
			<Navbar onLogin={() => { window.location.hash = '#login' }} onRegister={() => { window.location.hash = '#register' }} />
			<main>
				<section className="about-hero">
					<p className="hero-eyebrow">ABOUT LOCAL SERVICES</p>
					<h1>Local help should feel easy to trust.</h1>
					<p>Local Services brings customers and skilled professionals together in one clear, dependable place.</p>
					<div className="about-hero-actions">
						<a className="primary-button" href="#services">Explore services</a>
						<a className="secondary-button" href="#how-to-use">See how it works</a>
					</div>
				</section>
				<section className="public-section about-intro">
					<div><p className="section-kicker">OUR PURPOSE</p><h2>A more human way to get things done.</h2></div>
					<p>Finding help should not mean sorting through uncertainty. We give customers useful service details, transparent pricing, and a straightforward way to book. Providers get a practical space to share their work and build lasting relationships in the communities they serve.</p>
				</section>
				<section className="public-section about-values">
					<div className="section-heading"><div><p>WHAT WE VALUE</p><h2>Built around confidence.</h2></div></div>
					<div className="values-grid">{values.map(value => <article key={value.number}><span>{value.number}</span><h3>{value.title}</h3><p>{value.text}</p></article>)}</div>
				</section>
				<section className="public-cta about-cta"><div><p>READY TO GET STARTED?</p><h2>Find the right help for today.</h2></div><a href="#services">Browse services</a></section>
			</main>
			<Footer />
		</div>
	)
}

export default About