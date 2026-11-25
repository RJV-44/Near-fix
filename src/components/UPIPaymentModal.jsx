import { useState, useEffect } from 'react'
import { generateQRCodeSvg, buildUpiUri } from '../utils/qrCode.js'
import { paymentAPI } from '../api.js'

function UPIPaymentModal({ isOpen, onClose, onPaymentSuccess, booking, amount, serviceTitle }) {
  const [upiConfig, setUpiConfig] = useState({
    upiId: 'nearfix@okaxis',
    payeeName: 'NearFix Services',
    currency: 'INR',
  })
  const [utrNumber, setUtrNumber] = useState('')
  const [copied, setCopied] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [paymentDone, setPaymentDone] = useState(false)
  const [confirmedPayment, setConfirmedPayment] = useState(null)

  useEffect(() => {
    if (!isOpen) {
      setUtrNumber('')
      setError('')
      setPaymentDone(false)
      setVerifying(false)
      setConfirmedPayment(null)
      return
    }

    // Fetch UPI configuration if available
    paymentAPI.getUpiConfig()
      .then(config => {
        if (config && config.upiId) setUpiConfig(config)
      })
      .catch(() => {
        // Fallback to default config
      })
  }, [isOpen])

  if (!isOpen) return null

  const payableAmount = parseFloat(amount || booking?.totalPrice || 0)
  const note = `Booking ${booking?.id ? '#' + booking.id : (serviceTitle || 'NearFix')}`
  const txnRef = `NF${booking?.id || Date.now().toString().slice(-6)}`

  const upiUri = buildUpiUri({
    pa: upiConfig.upiId,
    pn: upiConfig.payeeName,
    am: payableAmount,
    cu: 'INR',
    tn: note,
    tr: txnRef,
  })

  const qrSvg = generateQRCodeSvg(upiUri, { size: 210, margin: 2 })

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiConfig.upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFillTestUtr = () => {
    // Generate a realistic 12-digit UPI UTR number
    const random12Digit = '4' + Math.floor(10000000000 + Math.random() * 90000000000).toString()
    setUtrNumber(random12Digit)
    setError('')
  }

  const handleVerifyPayment = async (e) => {
    e.preventDefault()
    const cleanUtr = utrNumber.trim()
    if (!cleanUtr) {
      setError('Please enter the 12-digit UPI Reference Number (UTR).')
      return
    }
    if (cleanUtr.length < 8) {
      setError('UPI Reference / UTR must be at least 8 digits.')
      return
    }

    setVerifying(true)
    setError('')

    try {
      // Simulate bank/UPI gateway verification delay
      await new Promise(r => setTimeout(r, 1200))

      const paymentRecord = await paymentAPI.create({
        bookingId: booking?.id || null,
        providerId: booking?.providerId || booking?.service?.providerId || null,
        customerId: booking?.customerId || null,
        amount: payableAmount,
        method: 'upi',
        transactionId: cleanUtr,
        upiId: upiConfig.upiId,
      })

      setConfirmedPayment(paymentRecord)
      setPaymentDone(true)

      if (onPaymentSuccess) {
        onPaymentSuccess(paymentRecord)
      }
    } catch (err) {
      setError(err.message || 'Payment verification failed. Please check the UTR and try again.')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="upi-modal-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem',
    }}>
      <div
        className="upi-modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '1.25rem',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '1.75rem',
          position: 'relative',
          color: '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '2.2rem',
            height: '2.2rem',
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {!paymentDone ? (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#e0e7ff',
                color: '#4338ca',
                padding: '0.3rem 0.8rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}>
                <span style={{ fontSize: '1rem' }}>⚡</span> Direct UPI Payment
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0.2rem 0' }}>Scan & Pay with Any UPI App</h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
                {serviceTitle ? `For: ${serviceTitle}` : 'Quick, zero-fee direct bank transfer'}
              </p>
            </div>

            {/* Amount Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
              color: '#ffffff',
              borderRadius: '1rem',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)',
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', opacity: 0.85, letterSpacing: '0.05em' }}>Total Amount</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  ₹{payableAmount.toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.85, display: 'block' }}>Recipient</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{upiConfig.payeeName} ✔</span>
              </div>
            </div>

            {/* Dynamic QR Code Card */}
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '1rem',
              padding: '1.25rem',
              textAlign: 'center',
              marginBottom: '1.25rem',
            }}>
              <div
                style={{ display: 'inline-block', margin: '0 auto', cursor: 'pointer' }}
                dangerouslySetInnerHTML={{ __html: qrSvg }}
                title="Scan with GPay, PhonePe, Paytm, or BHIM"
              />
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.6rem', marginBottom: '0.6rem' }}>
                Scan using <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, or <strong>BHIM</strong>
              </p>

              {/* UPI ID Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '0.6rem',
                padding: '0.45rem 0.75rem',
                fontSize: '0.85rem',
                color: '#334155',
              }}>
                <span>UPI ID: <strong>{upiConfig.upiId}</strong></span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  style={{
                    background: copied ? '#10b981' : '#e2e8f0',
                    color: copied ? '#ffffff' : '#1e293b',
                    border: 'none',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* UTR / Reference ID Verification Form */}
            <form onSubmit={handleVerifyPayment} style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label htmlFor="utr-input" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                  UPI Reference / UTR Number
                </label>
                <button
                  type="button"
                  onClick={handleFillTestUtr}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4f46e5',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Auto-fill Test UTR
                </button>
              </div>

              <input
                id="utr-input"
                type="text"
                placeholder="Enter 12-digit UTR from your UPI app receipt"
                value={utrNumber}
                onChange={e => {
                  setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))
                  setError('')
                }}
                maxLength={24}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  border: error ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                  borderRadius: '0.6rem',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: error ? '0.4rem' : '0.9rem',
                }}
                required
              />

              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 500 }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={verifying}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  background: verifying ? '#94a3b8' : 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.65rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: verifying ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                {verifying ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                    Verifying UTR...
                  </>
                ) : (
                  'Confirm & Complete Payment'
                )}
              </button>
            </form>
          </>
        ) : (
          /* Payment Success State */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 1rem',
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534', margin: '0 0 0.35rem' }}>
              UPI Payment Confirmed!
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Your payment has been successfully recorded and linked to your booking.
            </p>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              padding: '1rem',
              textAlign: 'left',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>Amount Paid:</span>
                <strong style={{ color: '#0f172a' }}>₹{payableAmount.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>Method:</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>UPI Transfer</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>UTR / Reference:</span>
                <span style={{ color: '#0f172a', fontWeight: 600, fontFamily: 'monospace' }}>
                  {confirmedPayment?.transactionId || utrNumber}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Status:</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>PAID / CONFIRMED</span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.65rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Done & Return to Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UPIPaymentModal
