import { useState, useEffect } from 'react'
import ProviderLayout from '../components/ProviderLayout.jsx'
import { notificationAPI } from '../../api.js'

function Notifications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationAPI.getAll()
      .then(data => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      setItems(items.map(n => ({ ...n, isRead: true })))
    } catch (e) {}
  }

  const markRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id)
      setItems(items.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (e) {}
  }

  const unreadCount = items.filter(n => !n.isRead).length

  return <ProviderLayout title="Notifications" subtitle="Keep up with bookings, earnings, and customer activity.">
    <section className="panel">
      <div className="panel-heading"><div><h2>Recent notifications</h2><p>{unreadCount} unread notifications</p></div><button className="text-button" onClick={markAllRead}>Mark all as read</button></div>
      <div className="notification-list">
        {loading ? <p>Loading...</p> :
         items.length === 0 ? <p>No notifications yet.</p> :
         items.map(item => <article className={`notification-item ${!item.isRead ? 'unread' : ''}`} key={item.id} onClick={() => markRead(item.id)}>
           <span>??</span>
           <div>
             <strong>{item.title}</strong>
             <p>{item.message}</p>
             <small>{new Date(item.createdAt).toLocaleDateString()}</small>
           </div>
         </article>)}
      </div>
    </section>
  </ProviderLayout>
}
export default Notifications