const { Review, Service, User } = require('../models')
const { Op } = require('sequelize')

const getReviews = async (req, res) => {
  try {
    const where = {}
    if (req.query.provider) where.providerId = req.query.provider
    if (req.query.customer) where.customerId = req.query.customer
    if (req.user.role === 'admin' && req.query.pending) where.isApproved = false
    if (req.user.role !== 'admin') where.isApproved = true
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
    const { providerId, bookingId, serviceId, rating, comment } = req.body
    const existing = await Review.findOne({ where: { customerId: req.user.id, providerId } })
    if (existing) return res.status(400).json({ message: 'You already reviewed this provider' })
    const review = await Review.create({ customerId: req.user.id, providerId, bookingId, serviceId, rating, comment })
    const allReviews = await Review.findAll({ where: { providerId, isApproved: true } })
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
    await Service.update({ rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length }, { where: { providerId } })
    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const moderateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    await review.update({ isApproved: req.body.isApproved })
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
    res.json({ message: 'Review removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getReviews, createReview, moderateReview, deleteReview }