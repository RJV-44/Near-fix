const { Booking, User, Service, Notification } = require('../models')
const { sequelize } = require('../config/db')
const { Op } = require('sequelize')

const getBookings = async (req, res) => {
  try {
    let where = {}
    if (req.user.role === 'customer') where.customerId = req.user.id
    else if (req.user.role === 'provider') {
      const ownedServices = await Service.findAll({
        where: { providerId: req.user.id },
        attributes: ['id'],
        raw: true,
      })
      where = {
        [Op.or]: [
          { providerId: req.user.id },
          { serviceId: { [Op.in]: ownedServices.map(service => service.id) } },
        ],
      }
    }
    const bookings = await Booking.findAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'businessName'] },
        { model: Service, as: 'service', attributes: ['id', 'title', 'price', 'providerId'] },
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
      String(booking.customerId) !== String(req.user.id) &&
      String(booking.providerId) !== String(req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' })
    }

    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createBooking = async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create bookings' })
    }

    const { serviceId, date, time, address, notes } = req.body
    const service = await Service.findByPk(serviceId)
    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found or unavailable' })
    }

    let booking
    await sequelize.transaction(async (transaction) => {
      booking = await Booking.create({
        customerId: req.user.id,
        providerId: service.providerId,
        serviceId: service.id,
        date,
        time,
        address,
        notes,
        totalPrice: service.price,
      }, { transaction })

      await Notification.create({
        userId: service.providerId,
        title: 'New booking request',
        message: `${req.user.name} requested ${service.title} for ${date} at ${time}.`,
        type: 'booking',
        relatedId: booking.id,
        relatedModel: 'Booking',
      }, { transaction })
    })
    res.status(201).json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    const service = await Service.findByPk(booking.serviceId)
    if (req.user.role === 'customer' && String(booking.customerId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to modify this booking' })
    }
    const bookingProviderMatches = String(booking.providerId) === String(req.user.id)
    const serviceProviderMatches = String(service?.providerId) === String(req.user.id)
    if (req.user.role === 'provider' && !bookingProviderMatches && !serviceProviderMatches) {
      return res.status(403).json({ message: 'Not authorized to modify this booking' })
    }

    const previousStatus = String(booking.status || '').toLowerCase()
    const nextStatus = req.body.status
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['in-progress', 'completed', 'cancelled'],
      'in-progress': ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    }

    if (nextStatus && nextStatus !== previousStatus) {
      if (!validTransitions[previousStatus]?.includes(nextStatus)) {
        return res.status(400).json({ message: `Cannot change booking from ${previousStatus} to ${nextStatus}` })
      }
      if (req.user.role === 'customer' && nextStatus !== 'cancelled') {
        return res.status(403).json({ message: 'Customers can only cancel their bookings' })
      }
    }

    await sequelize.transaction(async (transaction) => {
      if (req.user.role === 'provider' && serviceProviderMatches) {
        booking.providerId = req.user.id
      }
      if (nextStatus) booking.status = nextStatus
      if (req.body.paymentStatus) booking.paymentStatus = req.body.paymentStatus
      await booking.save({ transaction })
    })

    if (nextStatus && nextStatus !== previousStatus) {
      try {
        let recipientId = booking.customerId
        let title = 'Booking status updated'
        let message = `Your booking for ${service?.title || 'a service'} is now ${nextStatus}.`

        if (nextStatus === 'confirmed') {
          title = 'Booking accepted'
          message = `Your booking for ${service?.title || 'a service'} has been accepted by the provider.`
        } else if (nextStatus === 'in-progress') {
          title = 'Service started'
          message = `The provider has started your ${service?.title || 'service'}.`
        } else if (nextStatus === 'completed') {
          title = 'Service completed'
          message = `Your ${service?.title || 'service'} booking is complete.`
        } else if (nextStatus === 'cancelled' && req.user.role === 'customer') {
          recipientId = booking.providerId
          title = 'Booking cancelled'
          message = `The customer cancelled the booking for ${service?.title || 'your service'}.`
        } else if (nextStatus === 'cancelled') {
          title = 'Booking cancelled'
          message = `The provider cancelled your booking for ${service?.title || 'a service'}.`
        }

        await Notification.create({
          userId: recipientId,
          title,
          message,
          type: 'booking',
          relatedId: booking.id,
          relatedModel: 'Booking',
        })
      } catch (error) {
        console.error(`Booking ${booking.id} status updated but notification failed: ${error.message}`)
        booking.setDataValue('notificationWarning', 'Booking status updated, but its notification could not be sent.')
      }
    }

    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getBookings, getBookingById, createBooking, updateBookingStatus }