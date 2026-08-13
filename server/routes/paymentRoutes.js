const express = require('express')
const router = express.Router()
const { getPayments, getPaymentStats, createPayment, processRefund } = require('../controllers/paymentController')
const { protect, authorize } = require('../middleware/auth')

router.get('/', protect, getPayments)
router.get('/stats', protect, getPaymentStats)
router.post('/', protect, authorize('customer', 'admin'), createPayment)
router.put('/:id/refund', protect, authorize('admin'), processRefund)

module.exports = router