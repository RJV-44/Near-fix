import { useState, useEffect } from 'react'
import CustomerLayout from '../components/CustomerLayout.jsx'
import { notificationAPI } from '../../api.js'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationAPI.getAll()
      .then(data => setNotifications(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const readAll = async () => {
    try {
      await notificationAPI.markAllAsRead()
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (e) {}
  }

  const markRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id)
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (e) {}
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return <CustomerLayout title="Notifications" subtitle="Stay up to date with your services and account.">
    <section className="panel">
      <div className="panel-heading"><div><h2>Recent notifications</h2><p>{unreadCount} unread notifications</p></div><button className="text-button" onClick={readAll}>Mark all as read</button></div>
      <div className="notification-list">
        {loading ? <p>Loading...</p> :
         notifications.length === 0 ? <p>No notifications yet.</p> :
         notifications.map(n => <article className={`notification-item ${!n.isRead ? 'unread' : ''}`} key={n.id} onClick={() => markRead(n.id)}>
           <span>🔔</span>
           <div>
             <strong>{n.title}</strong>
             <p>{n.message}</p>
             <small>{new Date(n.createdAt).toLocaleDateString()}</small>
           </div>
         </article>)}
      </div>
    </section>
  </CustomerLayout>
}
export default Notifications