const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Payout = sequelize.define('Payout', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  providerId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  netAmount: { type: DataTypes.DECIMAL(10, 2) },
  status: { type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'), defaultValue: 'pending' },
  method: { type: DataTypes.ENUM('bank', 'paypal', 'stripe'), defaultValue: 'bank' },
  accountDetails: { type: DataTypes.TEXT },
  processedAt: { type: DataTypes.DATE },
  notes: { type: DataTypes.TEXT },
}, { timestamps: true })

module.exports = Payout