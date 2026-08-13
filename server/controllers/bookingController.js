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
    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createBooking = async (req, res) => {
  try {
    const { providerId, serviceId, date, time, address, notes, totalPrice } = req.body
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
    if (req.body.status) booking.status = req.body.status
    if (req.body.paymentStatus) booking.paymentStatus = req.body.paymentStatus
    await booking.save()
    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getBookings, getBookingById, createBooking, updateBookingStatus }