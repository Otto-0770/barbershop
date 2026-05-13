const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET /api/services — lista todos los servicios
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/services — crear servicio (solo admin)
router.post('/', async (req, res) => {
  const { name, description, price, duration_minutes } = req.body

  if (!name || !price || !duration_minutes) {
    return res.status(400).json({ error: 'Nombre, precio y duración son requeridos' })
  }

  const { data, error } = await supabase
    .from('services')
    .insert([{ name, description, price, duration_minutes }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// PUT /api/services/:id — actualizar servicio
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, description, price, duration_minutes } = req.body

  const { data, error } = await supabase
    .from('services')
    .update({ name, description, price, duration_minutes })
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/services/:id — eliminar servicio
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Servicio eliminado' })
})

module.exports = router
