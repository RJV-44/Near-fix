const { WishlistItem, Service, User } = require('../models')

const serviceInclude = {
  model: Service,
  as: 'service',
  include: [{ model: User, as: 'provider', attributes: ['id', 'name', 'businessName', 'serviceCategory'] }],
}

const getFavorites = async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can view their wishlist' })
    }
    const items = await WishlistItem.findAll({
      where: { customerId: req.user.id },
      include: [serviceInclude],
      order: [['createdAt', 'DESC']],
    })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const addFavorite = async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can save services' })
    }
    const serviceId = Number(req.body.serviceId)
    if (!Number.isInteger(serviceId) || serviceId <= 0) {
      return res.status(400).json({ message: 'A valid serviceId is required' })
    }
    const service = await Service.findOne({ where: { id: serviceId, isActive: true } })
    if (!service) return res.status(404).json({ message: 'Service not found or unavailable' })

    const [item] = await WishlistItem.findOrCreate({
      where: { customerId: req.user.id, serviceId },
      defaults: { customerId: req.user.id, serviceId },
    })
    const itemWithService = await WishlistItem.findByPk(item.id, { include: [serviceInclude] })
    res.status(201).json(itemWithService)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const removeFavorite = async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can remove services from their wishlist' })
    }
    const serviceId = Number(req.params.serviceId)
    if (!Number.isInteger(serviceId) || serviceId <= 0) {
      return res.status(400).json({ message: 'A valid serviceId is required' })
    }
    await WishlistItem.destroy({ where: { customerId: req.user.id, serviceId } })
    res.json({ message: 'Service removed from wishlist' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getFavorites, addFavorite, removeFavorite }
