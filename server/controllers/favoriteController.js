const { Favorite, User } = require('../models')

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { customerId: req.user.id },
      include: [{ model: User, as: 'provider', attributes: ['id', 'name', 'businessName', 'serviceCategory', 'rating'] }],
    })
    res.json(favorites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const addFavorite = async (req, res) => {
  try {
    const { providerId } = req.body
    const existing = await Favorite.findOne({ where: { customerId: req.user.id, providerId } })
    if (existing) return res.status(400).json({ message: 'Already in favorites' })
    const favorite = await Favorite.create({ customerId: req.user.id, providerId })
    res.status(201).json(favorite)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ where: { customerId: req.user.id, providerId: req.params.providerId } })
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' })
    await favorite.destroy()
    res.json({ message: 'Removed from favorites' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getFavorites, addFavorite, removeFavorite }