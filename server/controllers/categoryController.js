const { Category } = require('../models')

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { isActive: true }, order: [['order', 'ASC']] })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, order } = req.body
    const category = await Category.create({ name, slug, description, icon, order })
    res.status(201).json(category)
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Category with this name or slug already exists' })
    }
    res.status(500).json({ message: error.message })
  }
}

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    await category.update(req.body)
    res.json(category)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    await category.update({ isActive: false })
    res.json({ message: 'Category deactivated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory }