const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'famy-secret-2024'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'famy2024'

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { password } = req.body

  if (!password) return res.status(400).json({ error: 'Contraseña requerida' })
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Contraseña incorrecta' })

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' })
  res.json({ token })
})

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  const { token } = req.body
  if (!token) return res.status(401).json({ valid: false })
  try {
    jwt.verify(token, JWT_SECRET)
    res.json({ valid: true })
  } catch {
    res.json({ valid: false })
  }
})

module.exports = router
