const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const WishlistItem = sequelize.define('WishlistItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  serviceId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: true,
  indexes: [{ unique: true, fields: ['customerId', 'serviceId'] }],
})

module.exports = WishlistItem
