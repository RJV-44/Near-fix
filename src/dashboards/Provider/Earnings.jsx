import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import { paymentAPI, payoutAPI } from '../../api.js'

function Earnings() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    paymentAPI.getAll()
      .then(data => setPayments(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalEarnings = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  const thisMonth = payments.filter(p => {
    const d = new Date(p.paidAt || p.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const monthEarnings = thisMonth.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  return <ProviderLayout title="Earnings" subtitle="Track your income and payout activity.">
    <section className="stat-grid provider-earnings">
      <article className="stat-card">
        <p>Available balance</p>
        <h2>${(totalEarnings * 0.7).toFixed(0)}</h2>
        <button className="primary-button" onClick={async () => {
          try {
            await payoutAPI.request({ amount: totalEarnings * 0.7, method: 'bank', accountDetails: 'Bank transfer' })
            alert('Payout requested successfully!')
          } catch(e) { alert(e.message) }
        }}>Request payout</button>
      </article>
      <article className="stat-card">
        <p>Earnings this month</p>
        <h2>${monthEarnings.toFixed(0)}</h2>
        <small className="positive">? From completed bookings</small>
      </article>
      <article className="stat-card">
        <p>Total earnings</p>
        <h2>${totalEarnings.toFixed(0)}</h2>
        <small>All time</small>
      </article>
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>Recent earnings</h2><p>Completed booking payments.</p></div><button className="secondary-button">Download statement</button></div>
      <div className="table-wrap"><table><thead><tr><th>Date</th><th>Service</th><th>Customer</th><th>Amount</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="4">Loading...</td></tr> :
         payments.length === 0 ? <tr><td colSpan="4">No earnings yet.</td></tr> :
         payments.map(p => <tr key={p.id}>
           <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : p.createdAt?.split('T')[0] || '—'}</td>
           <td>{p.booking?.id ? `Booking #${p.booking.id}` : 'Service'}</td>
           <td>{p.customer?.name || 'Customer'}</td>
           <td>${parseFloat(p.amount || 0).toFixed(2)}</td>
         </tr>)}
      </tbody></table></div>
    </section>
  </ProviderLayout>
}
export default Earnings