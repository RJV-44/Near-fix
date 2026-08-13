const express = require('express')
const router = express.Router()
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController')
const { protect } = require('../middleware/auth')

router.get('/', protect, getFavorites)
router.post('/', protect, addFavorite)
router.delete('/:providerId', protect, removeFavorite)

module.exports = router