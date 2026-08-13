const express = require('express')
const router = express.Router()
const { getReviews, createReview, moderateReview, deleteReview } = require('../controllers/reviewController')
const { protect, authorize } = require('../middleware/auth')

router.get('/', protect, getReviews)
router.post('/', protect, createReview)
router.put('/:id/moderate', protect, authorize('admin'), moderateReview)
router.delete('/:id', protect, deleteReview)

module.exports = router