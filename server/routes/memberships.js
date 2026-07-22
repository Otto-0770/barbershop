const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET /api/memberships — pública
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('memberships')
    .select('*')
    .eq('active', true)
    .order('price', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
