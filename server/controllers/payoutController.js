const { Payout, User } = require('../models')

const getPayouts = async (req, res) => {
  try {
    const where = req.user.role === 'provider' ? { providerId: req.user.id } : {}
    const payouts = await Payout.findAll({
      where,
      include: [{ model: User, as: 'provider', attributes: ['id', 'name', 'businessName'] }],
      order: [['createdAt', 'DESC']],
    })
    res.json(payouts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const requestPayout = async (req, res) => {
  try {
    const { amount, method, accountDetails } = req.body
    const fee = amount * 0.02
    const payout = await Payout.create({ providerId: req.user.id, amount, fee, netAmount: amount - fee, method, accountDetails })
    res.status(201).json(payout)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updatePayoutStatus = async (req, res) => {
  try {
    const payout = await Payout.findByPk(req.params.id)
    if (!payout) return res.status(404).json({ message: 'Payout not found' })
    const updateData = { status: req.body.status }
    if (req.body.status === 'completed') updateData.processedAt = new Date()
    await payout.update(updateData)
    res.json(payout)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getPayouts, requestPayout, updatePayoutStatus }