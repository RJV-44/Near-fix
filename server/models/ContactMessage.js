const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const ContactMessage = sequelize.define('ContactMessage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(254), allowNull: false },
  subject: { type: DataTypes.STRING(150), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  adminReply: { type: DataTypes.TEXT },
  repliedAt: { type: DataTypes.DATE },
}, { timestamps: true })

module.exports = ContactMessage
