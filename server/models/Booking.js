const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  providerId: { type: DataTypes.INTEGER, allowNull: false },
  serviceId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'in-progress', 'completed', 'cancelled'), defaultValue: 'pending' },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentStatus: { type: DataTypes.ENUM('unpaid', 'paid', 'refunded'), defaultValue: 'unpaid' },
}, { timestamps: true })

module.exports = Booking