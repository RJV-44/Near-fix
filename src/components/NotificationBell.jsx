import { useEffect, useState } from 'react'
import { notificationAPI } from '../api.js'
import { useAuth } from '../context/AuthContext'

function NotificationBell({ href }) {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let active = true
    const refreshCount = () => {
      notificationAPI.getUnreadCount()
        .then(data => {
          if (active) setUnreadCount(Math.max(0, Number(data.count) || 0))
        })
        .catch(error => console.error('Failed to load unread notification count:', error))
    }

    refreshCount()
    const intervalId = window.setInterval(refreshCount, 30000)
    window.addEventListener('focus', refreshCount)
    window.addEventListener('notifications:changed', refreshCount)

    return () => {
      active = false
      window.clearInterval(intervalId)
      window.removeEventListener('focus', refreshCount)
      window.removeEventListener('notifications:changed', refreshCount)
    }
  }, [user?.id])

  const label = unreadCount
    ? `Notifications, ${unreadCount} unread`
    : 'Notifications'

  return <a className="notification-button" href={href} aria-label={label} title={label}>
    <span aria-hidden="true">🔔</span>
    {unreadCount > 0 && <span className="notification-count" aria-hidden="true">{unreadCount > 99 ? '99+' : unreadCount}</span>}
  </a>
}

export default NotificationBell
