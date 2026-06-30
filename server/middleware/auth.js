const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'famy-secret-2024'

function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const token = header.split(' ')[1]
  try {
    req.admin = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

module.exports = requireAuth
