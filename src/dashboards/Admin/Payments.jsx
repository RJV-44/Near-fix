import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { paymentAPI } from '../../api.js'

function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    paymentAPI.getAll()
      .then(data => setPayments(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  const pendingPayouts = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  const refunded = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  return <AdminLayout title="Payments" subtitle="Review payments, provider payouts, and refunds.">
    <section className="stat-grid compact">
      <article className="stat-card"><p>Revenue</p><h2>${totalRevenue.toFixed(2)}</h2></article>
      <article className="stat-card"><p>Pending payouts</p><h2>${pendingPayouts.toFixed(2)}</h2></article>
      <article className="stat-card"><p>Refunds issued</p><h2>${refunded.toFixed(2)}</h2></article>
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>Payment history</h2><p>{payments.length} transactions</p></div><button className="secondary-button">Download report</button></div>
      <div className="table-wrap"><table><thead><tr><th>#</th><th>Customer</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="5">Loading...</td></tr> :
         payments.length === 0 ? <tr><td colSpan="5">No payments yet.</td></tr> :
         payments.map(p => <tr key={p.id}>
           <td>#{p.id}</td>
           <td>{p.customer?.name || 'N/A'}</td>
           <td>${parseFloat(p.amount || 0).toFixed(2)}</td>
           <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : p.createdAt?.split('T')[0] || '—'}</td>
           <td><span className={`status status-${p.status?.toLowerCase() || 'pending'}`}>{p.status || 'Pending'}</span></td>
         </tr>)}
      </tbody></table></div>
    </section>
  </AdminLayout>
}
export default Payments