const express = require('express')
const router = express.Router()
const { getPayouts, requestPayout, updatePayoutStatus } = require('../controllers/payoutController')
const { protect, authorize } = require('../middleware/auth')

router.get('/', protect, getPayouts)
router.post('/', protect, authorize('provider'), requestPayout)
router.put('/:id', protect, authorize('admin'), updatePayoutStatus)

module.exports = router