const express = require('express')
const router = express.Router()
const { getBookings, getBookingById, createBooking, updateBookingStatus } = require('../controllers/bookingController')
const { protect } = require('../middleware/auth')

router.get('/', protect, getBookings)
router.get('/:id', protect, getBookingById)
router.post('/', protect, createBooking)
router.put('/:id', protect, updateBookingStatus)

module.exports = router