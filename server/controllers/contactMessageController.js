const { ContactMessage, Notification, User } = require('../models')
const { sequelize } = require('../config/db')
const { Op } = require('sequelize')

const createContactMessage = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim()
    const email = String(req.body.email || '').trim().toLowerCase()
    const subject = String(req.body.subject || 'General enquiry').trim()
    const message = String(req.body.message || '').trim()

    if (!name || name.length > 100) {
      return res.status(400).json({ message: 'Name is required and must be 100 characters or fewer' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return res.status(400).json({ message: 'Enter a valid email address' })
    }
    if (!subject || subject.length > 150) {
      return res.status(400).json({ message: 'Subject is required and must be 150 characters or fewer' })
    }
    if (!message || message.length > 5000) {
      return res.status(400).json({ message: 'Message is required and must be 5000 characters or fewer' })
    }

    let contactMessage
    await sequelize.transaction(async (transaction) => {
      contactMessage = await ContactMessage.create(
        { name, email, subject, message },
        { transaction },
      )
      const admin = await User.findOne({
        where: { role: 'admin' },
        attributes: ['id'],
        transaction,
      })
      if (admin) {
        await Notification.create({
          userId: admin.id,
          title: `Contact: ${subject}`,
          message: `New contact message from ${name} (${email}).`,
          type: 'system',
          relatedId: contactMessage.id,
          relatedModel: 'ContactMessage',
        }, { transaction })
      }
    })

    res.status(201).json({ message: 'Message sent successfully', contactMessage })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100,
    })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const markContactMessageRead = async (req, res) => {
  try {
    const contactMessage = await ContactMessage.findByPk(req.params.id)
    if (!contactMessage) return res.status(404).json({ message: 'Contact message not found' })
    await contactMessage.update({ isRead: true })
    res.json(contactMessage)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const replyToContactMessage = async (req, res) => {
  try {
    const reply = String(req.body.reply || '').trim()
    if (!reply || reply.length > 5000) {
      return res.status(400).json({ message: 'Reply is required and must be 5000 characters or fewer' })
    }

    const contactMessage = await ContactMessage.findByPk(req.params.id)
    if (!contactMessage) return res.status(404).json({ message: 'Contact message not found' })

    let notified = false
    await sequelize.transaction(async (transaction) => {
      await contactMessage.update({
        adminReply: reply,
        repliedAt: new Date(),
        isRead: true,
      }, { transaction })

      const recipient = await User.findOne({
        where: {
          email: contactMessage.email,
          role: { [Op.in]: ['customer', 'provider'] },
        },
        attributes: ['id'],
        transaction,
      })
      if (recipient) {
        await Notification.create({
          userId: recipient.id,
          title: 'Support replied to your message',
          message: `An administrator replied to your contact request: ${contactMessage.subject}`,
          type: 'system',
          relatedId: contactMessage.id,
          relatedModel: 'ContactMessage',
        }, { transaction })
        notified = true
      }
    })

    res.json({
      message: notified ? 'Reply sent and sender notified' : 'Reply saved; no matching customer or provider account was found',
      notificationSent: notified,
      contactMessage,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createContactMessage,
  getContactMessages,
  markContactMessageRead,
  replyToContactMessage,
}
