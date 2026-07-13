const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  providerId: { type: DataTypes.INTEGER, allowNull: false },
  bookingId: { type: DataTypes.INTEGER },
  serviceId: { type: DataTypes.INTEGER },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT, allowNull: false },
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true })

module.exports = Review