const { Payment, User, Booking } = require('../models')
const { sequelize } = require('../config/db')

const getPayments = async (req, res) => {
  try {
    let where = {}
    if (req.user.role === 'customer') where.customerId = req.user.id
    else if (req.user.role === 'provider') where.providerId = req.user.id
    const payments = await Payment.findAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'businessName'] },
        { model: Booking, as: 'booking', attributes: ['id', 'date', 'totalPrice'] },
      ],
      order: [['createdAt', 'DESC']],
    })
    res.json(payments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getPaymentStats = async (req, res) => {
  try {
    const where = req.user.role === 'provider' ? { providerId: req.user.id } : {}
    const stats = await Payment.findAll({
      where,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
        [sequelize.fn('SUM', sequelize.col('fee')), 'totalFees'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      raw: true,
    })
    res.json(stats[0] || { totalRevenue: 0, totalFees: 0, count: 0 })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getUpiConfig = async (req, res) => {
  try {
    const upiId = process.env.UPI_ID || 'nearfix@okaxis'
    const payeeName = process.env.UPI_PAYEE_NAME || 'NearFix Services'
    const currency = 'INR'
    res.json({ upiId, payeeName, currency })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createPayment = async (req, res) => {
  try {
    const { bookingId, customerId, providerId, amount, method, transactionId, upiId } = req.body
    const fee = amount * 0.05
    const payment = await Payment.create({
      bookingId,
      customerId: customerId || req.user.id,
      providerId,
      amount,
      fee,
      netAmount: amount - fee,
      method: method || 'upi',
      status: 'paid',
      transactionId: transactionId || null,
      upiId: upiId || null,
      paidAt: new Date(),
    })

    if (bookingId) {
      const booking = await Booking.findByPk(bookingId)
      if (booking) {
        booking.paymentStatus = 'paid'
        await booking.save()
      }
    }

    res.status(201).json(payment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const processRefund = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id)
    if (!payment) return res.status(404).json({ message: 'Payment not found' })
    await payment.update({ status: 'refunded' })
    res.json(payment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getPayments, getPaymentStats, getUpiConfig, createPayment, processRefund }