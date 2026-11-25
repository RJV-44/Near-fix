import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
import { notificationAPI } from '../../api.js'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    notificationAPI.getAll()
      .then(data => setNotifications(data))
      .catch(err => setError(`Could not load notifications: ${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  const readAll = async () => {
    setError('')
    try {
      await notificationAPI.markAllAsRead()
      setNotifications(current => current.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      setError(`Could not mark notifications as read: ${err.message}`)
    }
  }

  const markRead = async (id) => {
    setError('')
    try {
      await notificationAPI.markAsRead(id)
      setNotifications(current => current.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      setError(`Could not mark notification as read: ${err.message}`)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return <CustomerLayout title="Notifications" subtitle="Stay up to date with your services and account.">
    <section className="panel">
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="panel-heading"><div><h2>Recent notifications</h2><p>{unreadCount} unread notifications</p></div><button className="text-button" onClick={readAll} disabled={unreadCount === 0}>Mark all as read</button></div>
      <div className="notification-list">
        {loading ? <p>Loading...</p> :
         notifications.length === 0 ? <p>No notifications yet.</p> :
         notifications.map(n => <article className={`notification-item ${!n.isRead ? 'unread' : ''}`} key={n.id}>
           <span>🔔</span>
           <div>
             <strong>{n.title}</strong>
             <p>{n.message}</p>
             <small>{new Date(n.createdAt).toLocaleDateString()}</small>
             {!n.isRead && <button className="text-button" onClick={() => markRead(n.id)}>Mark as read</button>}
           </div>
         </article>)}
      </div>
    </section>
  </CustomerLayout>
}
export default Notifications