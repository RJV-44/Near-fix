import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { paymentAPI } from '../../api.js'
import { downloadCsv } from '../../utils/downloadCsv.js'

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
  const exportPayments = () => downloadCsv(
    'payments.csv',
    ['Payment ID', 'Booking ID', 'Customer', 'Provider', 'Method', 'Transaction ID', 'Amount', 'Date', 'Status'],
    payments.map(payment => ({
      'Payment ID': payment.id,
      'Booking ID': payment.bookingId || payment.booking?.id || 'N/A',
      Customer: payment.customer?.name || 'N/A',
      Provider: payment.provider?.businessName || payment.provider?.name || 'N/A',
      Method: payment.method || 'N/A',
      'Transaction ID': payment.transactionId || 'N/A',
      Amount: Number(payment.amount || 0).toFixed(2),
      Date: payment.paidAt ? new Date(payment.paidAt).toISOString() : payment.createdAt || '',
      Status: payment.status || 'paid',
    })),
  )

  return <AdminLayout title="Payments" subtitle="Review payments, provider payouts, and refunds.">
    <section className="stat-grid compact">
      <article className="stat-card"><p>Revenue</p><h2>₹{totalRevenue.toFixed(2)}</h2></article>
      <article className="stat-card"><p>Pending payouts</p><h2>₹{pendingPayouts.toFixed(2)}</h2></article>
      <article className="stat-card"><p>Refunds issued</p><h2>₹{refunded.toFixed(2)}</h2></article>
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>Payment history</h2><p>{payments.length} transactions</p></div><button className="secondary-button" onClick={exportPayments} disabled={loading}>Export CSV</button></div>
      <div className="table-wrap"><table><thead><tr><th># / UTR</th><th>Customer</th><th>Method</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="6">Loading...</td></tr> :
         payments.length === 0 ? <tr><td colSpan="6">No payments yet.</td></tr> :
         payments.map(p => <tr key={p.id}>
           <td>
             <strong>#{p.id}</strong>
             {p.transactionId && <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>UTR: {p.transactionId}</div>}
           </td>
           <td>{p.customer?.name || 'N/A'}</td>
           <td>
             <span style={{
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
           <td>₹{parseFloat(p.amount || 0).toFixed(2)}</td>
           <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : p.createdAt?.split('T')[0] || '—'}</td>
           <td><span className={`status status-${p.status?.toLowerCase() || 'pending'}`}>{p.status || 'Pending'}</span></td>
         </tr>)}
      </tbody></table></div>
    </section>
  </AdminLayout>
}
export default Payments