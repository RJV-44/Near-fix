const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  providerId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  netAmount: { type: DataTypes.DECIMAL(10, 2) },
  method: { type: DataTypes.ENUM('card', 'cash', 'online'), defaultValue: 'card' },
  status: { type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'), defaultValue: 'pending' },
  transactionId: { type: DataTypes.STRING },
  paidAt: { type: DataTypes.DATE },
}, { timestamps: true })

module.exports = Payment