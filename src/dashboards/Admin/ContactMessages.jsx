import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { contactAPI } from '../../api.js'

function ContactMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [replyDrafts, setReplyDrafts] = useState({})
  const [replyingId, setReplyingId] = useState(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    contactAPI.getAll()
      .then(setMessages)
      .catch(err => setError(`Could not load contact messages: ${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  const markAsRead = async (id) => {
    setUpdatingId(id)
    setError('')
    try {
      const updatedMessage = await contactAPI.markAsRead(id)
      setMessages(current => current.map(message =>
        String(message.id) === String(updatedMessage.id) ? updatedMessage : message,
      ))
    } catch (err) {
      setError(`Could not update contact message: ${err.message}`)
    } finally {
      setUpdatingId(null)
    }
  }

  const sendReply = async (event, contactMessage) => {
    event.preventDefault()
    const reply = String(replyDrafts[contactMessage.id] || '').trim()
    if (!reply) return

    setReplyingId(contactMessage.id)
    setError('')
    setNotice('')
    try {
      const result = await contactAPI.reply(contactMessage.id, reply)
      setMessages(current => current.map(message =>
        String(message.id) === String(result.contactMessage.id) ? result.contactMessage : message,
      ))
      setReplyDrafts(current => ({ ...current, [contactMessage.id]: '' }))
      setNotice(result.notificationSent
        ? `Reply sent; ${contactMessage.name} was notified in the app.`
        : 'Reply saved, but no customer or provider account matches this email. Reply by email as well.')
    } catch (err) {
      setError(`Could not send reply: ${err.message}`)
    } finally {
      setReplyingId(null)
    }
  }

  return <AdminLayout title="Contact Messages" subtitle="Read and respond to messages sent through the contact form.">
    {error && <p className="form-error" role="alert">{error}</p>}
    {notice && <p className="form-success" role="status">{notice}</p>}
    <section className="panel">
      <div className="panel-heading">
        <div><h2>Inbox</h2><p>{messages.filter(message => !message.isRead).length} unread · {messages.length} total</p></div>
      </div>
      {loading ? <p>Loading contact messages...</p> :
       messages.length === 0 ? <p>No contact messages yet.</p> :
       <div className="contact-message-list">
         {messages.map(message => <article className={`contact-message-card${message.isRead ? '' : ' unread'}`} key={message.id}>
           <div className="contact-message-heading">
             <div>
               <h3>{message.subject}</h3>
               <p><strong>{message.name}</strong> · <a href={`mailto:${message.email}`}>{message.email}</a></p>
             </div>
             <span className={`status status-${message.isRead ? 'active' : 'pending'}`}>{message.isRead ? 'Read' : 'New'}</span>
           </div>
           <p className="contact-message-body">{message.message}</p>
           {message.adminReply && <div className="contact-message-reply">
             <strong>Admin reply · {message.repliedAt ? new Date(message.repliedAt).toLocaleString() : ''}</strong>
             <p>{message.adminReply}</p>
           </div>}
           <form className="contact-reply-form" onSubmit={event => sendReply(event, message)}>
             <label htmlFor={`contact-reply-${message.id}`}>{message.adminReply ? 'Send another reply' : 'Reply to this message'}</label>
             <textarea
               id={`contact-reply-${message.id}`}
               value={replyDrafts[message.id] || ''}
               onChange={event => setReplyDrafts(current => ({ ...current, [message.id]: event.target.value }))}
               maxLength={5000}
               required
               placeholder="Write a reply for the sender..."
             />
             <button className="primary-button" type="submit" disabled={replyingId === message.id}>
               {replyingId === message.id ? 'Sending...' : 'Send reply'}
             </button>
           </form>
           <div className="contact-message-footer">
             <small>{new Date(message.createdAt).toLocaleString()}</small>
             <div>
               {!message.isRead && <button className="text-button" onClick={() => markAsRead(message.id)} disabled={updatingId === message.id}>{updatingId === message.id ? 'Saving...' : 'Mark as read'}</button>}
               <a className="text-button" href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}>Reply by email</a>
             </div>
           </div>
         </article>)}
       </div>}
    </section>
  </AdminLayout>
}

export default ContactMessages
