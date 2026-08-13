import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { isAuthenticated, user } = useAuth()

  const dashboards = [
    ['Admin portal', 'Manage users, providers, bookings, and platform reports.', '#admin-dashboard', '???'],
    ['Customer portal', 'Manage your profile, bookings, payments, and favorite providers.', '#customer-dashboard', '??'],
    ['Provider portal', 'Manage services, schedule, earnings, and customer reviews.', '#provider-dashboard', '??'],
  ]

  return <div className="public-page"><Navbar onLogin={() => { window.location.hash = '#login' }} />
    <main className="public-section dashboard-selector">
      <p className="hero-eyebrow">DASHBOARDS</p>
      <h1>Choose your portal</h1>
      <p>Explore the role-specific pages created for Local Services.</p>
      {isAuthenticated && <p className="form-success">Logged in as <strong>{user?.name}</strong> ({user?.role})</p>}
      <div className="portal-grid">
        {dashboards.map(([title, text, route, icon]) =>
          <article key={title}>
            <span>{icon}</span>
            <h2>{title}</h2>
            <p>{text}</p>
            <a className="primary-button" href={route}>Open portal</a>
          </article>
        )}
      </div>
    </main>
  <Footer /></div>
}
export default Dashboard