const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET /api/barbers — lista todos los barberos
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('barbers')
    .select('*')
    .eq('active', true)
    .order('name')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET /api/barbers/:id/availability?date=YYYY-MM-DD
router.get('/:id/availability', async (req, res) => {
  const { id } = req.params
  const { date } = req.query

  if (!date) return res.status(400).json({ error: 'Fecha requerida' })

  // Traer citas del barbero en esa fecha
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('time, services(duration_minutes)')
    .eq('barber_id', id)
    .eq('date', date)
    .in('status', ['pending', 'confirmed'])

  if (error) return res.status(500).json({ error: error.message })

  // Horario de trabajo: 9am a 7pm, slots de 30 min
  const slots = []
  for (let hour = 9; hour < 19; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
      const isBusy = appointments.some(a => a.time === time)
      slots.push({ time, available: !isBusy })
    }
  }

  res.json(slots)
})

// POST /api/barbers — crear barbero
router.post('/', async (req, res) => {
  const { name, bio, photo_url } = req.body

  if (!name) return res.status(400).json({ error: 'El nombre es requerido' })

  const { data, error } = await supabase
    .from('barbers')
    .insert([{ name, bio, photo_url, active: true }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// PUT /api/barbers/:id — actualizar barbero
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const updates = req.body

  const { data, error } = await supabase
    .from('barbers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/barbers/:id — eliminar barbero
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('barbers').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Barbero eliminado' })
})

module.exports = router
