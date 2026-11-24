const { Booking, User, Service } = require('../models')

const getBookings = async (req, res) => {
  try {
    let where = {}
    if (req.user.role === 'customer') where.customerId = req.user.id
    else if (req.user.role === 'provider') where.providerId = req.user.id
    const bookings = await Booking.findAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'businessName'] },
        { model: Service, as: 'service', attributes: ['id', 'title', 'price'] },
      ],
      order: [['createdAt', 'DESC']],
    })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'phone'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'businessName', 'phone'] },
        { model: Service, as: 'service', attributes: ['id', 'title', 'price', 'description'] },
      ],
    })
    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    // Authorization check: must be customer, provider, or admin
    if (
      req.user.role !== 'admin' &&
      booking.customerId !== req.user.id &&
      booking.providerId !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' })
    }

    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const parseSlotTime = (dateStr, timeSlot) => {
  if (!dateStr || !timeSlot) return null
  const startPart = timeSlot.split('-')[0].trim()
  const match = startPart.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return null
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const meridian = match[3].toUpperCase()
  if (meridian === 'PM' && hours < 12) hours += 12
  if (meridian === 'AM' && hours === 12) hours = 0

  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

const createBooking = async (req, res) => {
  try {
    const { providerId, serviceId, date, time, address, notes, totalPrice } = req.body

    if (!date || !time) {
      return res.status(400).json({ message: 'Invalid date and time: Both date and time are required.' })
    }

    const slotDate = parseSlotTime(date, time)
    if (!slotDate || isNaN(slotDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date or time format.' })
    }

    if (slotDate <= new Date()) {
      return res.status(400).json({ message: 'Invalid date and time: You cannot select a past date or time.' })
    }

    const booking = await Booking.create({ customerId: req.user.id, providerId, serviceId, date, time, address, notes, totalPrice })
    res.status(201).json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    // Authorization check: must be customer, provider, or admin
    if (
      req.user.role !== 'admin' &&
      booking.customerId !== req.user.id &&
      booking.providerId !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this booking' })
    }

    if (req.body.status) booking.status = req.body.status
    if (req.body.paymentStatus) booking.paymentStatus = req.body.paymentStatus
    await booking.save()
    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getBookings, getBookingById, createBooking, updateBookingStatus }