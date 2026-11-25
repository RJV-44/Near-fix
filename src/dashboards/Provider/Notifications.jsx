import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import { notificationAPI } from '../../api.js'

function Notifications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    notificationAPI.getAll()
      .then(data => setItems(data))
      .catch(err => setError(`Could not load notifications: ${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  const markAllRead = async () => {
    setError('')
    try {
      await notificationAPI.markAllAsRead()
      setItems(current => current.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      setError(`Could not mark notifications as read: ${err.message}`)
    }
  }

  const markRead = async (id) => {
    setError('')
    try {
      await notificationAPI.markAsRead(id)
      setItems(current => current.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      setError(`Could not mark notification as read: ${err.message}`)
    }
  }

  const unreadCount = items.filter(n => !n.isRead).length

  return <ProviderLayout title="Notifications" subtitle="Keep up with bookings, earnings, and customer activity.">
    <section className="panel">
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="panel-heading"><div><h2>Recent notifications</h2><p>{unreadCount} unread notifications</p></div><button className="text-button" onClick={markAllRead} disabled={unreadCount === 0}>Mark all as read</button></div>
      <div className="notification-list">
        {loading ? <p>Loading...</p> :
         items.length === 0 ? <p>No notifications yet.</p> :
         items.map(item => <article className={`notification-item ${!item.isRead ? 'unread' : ''}`} key={item.id}>
           <span>🔔</span>
           <div>
             <strong>{item.title}</strong>
             <p>{item.message}</p>
             <small>{new Date(item.createdAt).toLocaleDateString()}</small>
             {!item.isRead && <button className="text-button" onClick={() => markRead(item.id)}>Mark as read</button>}
           </div>
         </article>)}
      </div>
    </section>
  </ProviderLayout>
}
export default Notifications