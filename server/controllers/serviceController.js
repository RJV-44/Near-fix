const { Service, User, Category } = require('../models')

const getServices = async (req, res) => {
  try {
    const where = { isActive: true }
    if (req.query.category) where.category = req.query.category
    if (req.query.provider) where.providerId = req.query.provider
    const services = await Service.findAll({ where, include: [{ model: User, as: 'provider', attributes: ['id', 'name', 'businessName', 'rating'] }] })
    res.json(services)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, { include: [{ model: User, as: 'provider', attributes: ['id', 'name', 'businessName', 'email', 'phone', 'rating'] }] })
    if (!service) return res.status(404).json({ message: 'Service not found' })
    res.json(service)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createService = async (req, res) => {
  try {
    const { title, category, categoryId, description, price, duration } = req.body
    const service = await Service.create({ providerId: req.user.id, title, category, categoryId, description, price, duration })
    res.status(201).json(service)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id)
    if (!service) return res.status(404).json({ message: 'Service not found' })
    if (service.providerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }
    await service.update(req.body)
    res.json(service)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id)
    if (!service) return res.status(404).json({ message: 'Service not found' })
    if (service.providerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }
    await service.destroy()
    res.json({ message: 'Service removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getServices, getServiceById, createService, updateService, deleteService }