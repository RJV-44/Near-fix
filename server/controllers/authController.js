const jwt = require('jsonwebtoken')
const { User } = require('../models')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, businessName, serviceCategory, yearsOfExperience } = req.body

    const existing = await User.findOne({ where: { email } })
    if (existing) return res.status(400).json({ message: 'User already exists' })

    const user = await User.create({ name, email, password, role, phone, businessName, serviceCategory, yearsOfExperience })

    res.status(201).json({
      id: user.id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user.id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      id: user.id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user.id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMe = async (req, res) => {
  res.json(req.user)
}

module.exports = { register, login, getMe }