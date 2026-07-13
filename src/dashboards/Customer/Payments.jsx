import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
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

  return <CustomerLayout title="Payments" subtitle="View your payment methods and transaction history.">
    <section className="payment-method">
      <div><span>??</span><strong>Visa ending in 4242</strong><small>Expires 08/28</small></div>
      <button className="text-button">Manage</button>
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>Payment history</h2><p>{payments.length} transactions</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>Reference</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="5">Loading...</td></tr> :
         payments.length === 0 ? <tr><td colSpan="5">No payments yet.</td></tr> :
         payments.map(p => <tr key={p.id}>
           <td>#{p.id}</td>
           <td>{p.booking?.id ? `Booking #${p.booking.id}` : 'Service'}</td>
           <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : p.createdAt?.split('T')[0] || '—'}</td>
           <td>${parseFloat(p.amount || 0).toFixed(2)}</td>
           <td><span className={`status status-${p.status?.toLowerCase() || 'pending'}`}>{p.status || 'Pending'}</span></td>
         </tr>)}
      </tbody></table></div>
    </section>
  </CustomerLayout>
}
export default Payments