// /

const { sequelize } = require('./db')
const { Category } = require('../models')

const syncDatabase = async () => {
  try {
    // Sync all models to create tables
    await sequelize.sync({ alter: false })
    console.log('MySQL tables synchronized')

    // Seed default categories
    const count = await Category.count()
    if (count === 0) {
      await Category.bulkCreate([
        { name: 'Cleaning', slug: 'cleaning', description: 'Home and office cleaning services', icon: '🧹', order: 1 },
        { name: 'Repairs', slug: 'repairs', description: 'General home repair services', icon: '🔧', order: 2 },
        { name: 'Plumbing', slug: 'plumbing', description: 'Plumbing installation and repair', icon: '🔧', order: 3 },
        { name: 'Electrical', slug: 'electrical', description: 'Electrical wiring and fixture services', icon: '⚡', order: 4 },
        { name: 'Gardening', slug: 'gardening', description: 'Garden maintenance and landscaping', icon: '🌿', order: 5 },
        { name: 'Home care', slug: 'home-care', description: 'Elderly and child care services', icon: '🏠', order: 6 },
        { name: 'Moving', slug: 'moving', description: 'Moving and packing assistance', icon: '📦', order: 7 },
        { name: 'Painting', slug: 'painting', description: 'Interior and exterior painting', icon: '🎨', order: 8 },
      ])
      console.log('Default categories seeded')
    }
  } catch (error) {
    console.error(`Database sync error: ${error.message}`)
    throw error
  }
}

module.exports = { syncDatabase }