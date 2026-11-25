const express = require('express')
const router = express.Router()
const {
  createContactMessage,
  getContactMessages,
  markContactMessageRead,
  replyToContactMessage,
} = require('../controllers/contactMessageController')
const { protect, authorize } = require('../middleware/auth')

router.post('/', createContactMessage)
router.get('/', protect, authorize('admin'), getContactMessages)
router.put('/:id/read', protect, authorize('admin'), markContactMessageRead)
router.put('/:id/reply', protect, authorize('admin'), replyToContactMessage)

module.exports = router
