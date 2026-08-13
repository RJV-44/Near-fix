import { useState } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'

function Settings() {
  const [settings, setSettings] = useState({
    requests: true,
    payout: true,
    marketing: false,
  })

  const toggle = (key) => {
    setSettings((state) => ({ ...state, [key]: !state[key] }))
  }

  const options = [
    ['requests', 'Booking requests', 'Receive a notification as soon as a customer requests a booking.'],
    ['payout', 'Payout updates', 'Receive confirmation when a payout is sent to your bank.'],
    ['marketing', 'Marketing tips', 'Receive tips to help grow your local business.'],
  ]

  return (
    <ProviderLayout title="Settings" subtitle="Manage business and notification preferences.">
      <section className="panel settings-panel">
        <h2>Notification preferences</h2>
        <p>Choose the updates that are important for your business.</p>
        {options.map(([key, title, description]) => (
          <label className="setting-row" key={key}>
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} />
          </label>
        ))}
      </section>
      <section className="panel settings-panel danger-zone">
        <h2>Business visibility</h2>
        <p>Pausing your business hides your services from new customers.</p>
        <button className="secondary-button">Pause business</button>
      </section>
    </ProviderLayout>
  )
}

export default Settings