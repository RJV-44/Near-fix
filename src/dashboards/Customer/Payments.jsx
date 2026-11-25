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

  const totalSpent = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  return <CustomerLayout title="Payments" subtitle="View your payment methods and transaction history.">
    <section className="stat-grid customer-payment-stats">
      <article className="stat-card"><p>Total spent</p><h2>₹{totalSpent.toFixed(2)}</h2></article>
      <article className="stat-card"><p>Transactions</p><h2>{payments.length}</h2></article>
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>Payment history</h2><p>{payments.length} transactions</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>Ref / UTR</th><th>Method</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="6">Loading...</td></tr> :
         payments.length === 0 ? <tr><td colSpan="6">No payments yet.</td></tr> :
         payments.map(p => <tr key={p.id}>
           <td>
             <strong>#{p.id}</strong>
             {p.transactionId && <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>UTR: {p.transactionId}</div>}
           </td>
           <td>
             <span style={{
               display: 'inline-flex',
               alignItems: 'center',
               gap: '0.25rem',
               padding: '0.2rem 0.5rem',
               borderRadius: '4px',
               fontSize: '0.78rem',
               fontWeight: 600,
               background: p.method === 'upi' ? '#eff6ff' : '#f1f5f9',
               color: p.method === 'upi' ? '#1d4ed8' : '#334155'
             }}>
               {p.method === 'upi' ? '⚡ UPI' : (p.method || 'Card').toUpperCase()}
             </span>
           </td>
           <td>{p.booking?.id ? `Booking #${p.booking.id}` : 'Service'}</td>
           <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : p.createdAt?.split('T')[0] || '—'}</td>
           <td><strong>₹{parseFloat(p.amount || 0).toFixed(2)}</strong></td>
           <td><span className={`status status-${p.status?.toLowerCase() || 'paid'}`}>{p.status || 'Paid'}</span></td>
         </tr>)}
      </tbody></table></div>
    </section>
  </CustomerLayout>
}
export default Payments