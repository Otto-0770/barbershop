const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET /api/clients — lista clientes con historial de citas
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      appointments(
        id, date, time, status,
        services(name, price),
        barbers(name)
      )
    `)
    .order('name')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET /api/clients/:id — detalle de un cliente
router.get('/:id', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      appointments(
        id, date, time, status, notes,
        services(name, price),
        barbers(name)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
