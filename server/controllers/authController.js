const jwt = require('jsonwebtoken')
const { User } = require('../models')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

const register = async (req, res) => {
  try {
    const { name, email, password, phone, businessName, serviceCategory, yearsOfExperience } = req.body
    const requestedRole = String(req.body.role || 'customer').toLowerCase()
    if (!['customer', 'provider'].includes(requestedRole)) {
      return res.status(403).json({ message: 'Administrator accounts cannot be created through public registration' })
    }

    const normalizedEmail = String(email || '').trim().toLowerCase()
    const existing = await User.findOne({ where: { email: normalizedEmail } })
    if (existing) return res.status(400).json({ message: 'User already exists' })

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: requestedRole,
      phone,
      businessName,
      serviceCategory,
      yearsOfExperience,
    })

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
    const email = String(req.body.email || '').trim().toLowerCase()
    const { password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user || user.isActive === false || !(await user.matchPassword(password))) {
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