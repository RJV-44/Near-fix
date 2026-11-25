const { Review, Service, User, Booking } = require('../models')

const updateServiceRating = async (serviceId) => {
  const reviews = await Review.findAll({ where: { serviceId, isApproved: true }, attributes: ['rating'] })
  const rating = reviews.length
    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
    : 0
  await Service.update({ rating, reviewCount: reviews.length }, { where: { id: serviceId } })
}

const getReviews = async (req, res) => {
  try {
    const where = {}
    if (req.user.role === 'customer') {
      where.customerId = req.user.id
    } else if (req.user.role === 'provider') {
      where.providerId = req.user.id
      where.isApproved = true
    } else {
      if (req.query.provider) where.providerId = req.query.provider
      if (req.query.customer) where.customerId = req.query.customer
      if (req.query.pending === 'true') where.isApproved = false
    }
    const reviews = await Review.findAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'businessName'] },
        { model: Service, as: 'service', attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createReview = async (req, res) => {
  try {
    if (req.user.role !== 'customer') return res.status(403).json({ message: 'Only customers can write reviews' })
    const bookingId = Number(req.body.bookingId)
    const rating = Number(req.body.rating)
    const comment = typeof req.body.comment === 'string' ? req.body.comment.trim() : ''
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({ message: 'A valid bookingId is required' })
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5' })
    }
    if (!comment || comment.length > 2000) {
      return res.status(400).json({ message: 'Please enter a comment of 1 to 2000 characters' })
    }

    const booking = await Booking.findOne({ where: { id: bookingId, customerId: req.user.id } })
    if (!booking) return res.status(404).json({ message: 'Completed booking not found' })
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can review a service after its booking is completed' })
    }
    const existing = await Review.findOne({ where: { customerId: req.user.id, bookingId } })
    if (existing) return res.status(400).json({ message: 'You have already reviewed this booking' })

    const review = await Review.create({
      customerId: req.user.id,
      providerId: booking.providerId,
      bookingId: booking.id,
      serviceId: booking.serviceId,
      rating,
      comment,
    })
    const reviewWithDetails = await Review.findByPk(review.id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'businessName'] },
        { model: Service, as: 'service', attributes: ['id', 'title'] },
      ],
    })
    res.status(201).json(reviewWithDetails)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const moderateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    if (typeof req.body.isApproved !== 'boolean') {
      return res.status(400).json({ message: 'isApproved must be a boolean' })
    }
    await review.update({ isApproved: req.body.isApproved })
    if (review.serviceId) await updateServiceRating(review.serviceId)
    res.json(review)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    if (review.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }
    await review.destroy()
    if (review.serviceId) await updateServiceRating(review.serviceId)
    res.json({ message: 'Review removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getReviews, createReview, moderateReview, deleteReview }