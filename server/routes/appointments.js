const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET /api/appointments?date=YYYY-MM-DD — para el panel admin
router.get('/', async (req, res) => {
  const { date } = req.query

  let query = supabase
    .from('appointments')
    .select(`
      *,
      barbers(name),
      services(name, price, duration_minutes),
      clients(name, phone)
    `)
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  if (date) query = query.eq('date', date)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/appointments — reservar una cita (cliente público)
router.post('/', async (req, res) => {
  const { barber_id, service_id, date, time, client_name, client_phone, notes } = req.body

  if (!barber_id || !service_id || !date || !time || !client_name || !client_phone) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' })
  }

  // Verificar que el slot no esté ocupado
  const { data: existing } = await supabase
    .from('appointments')
    .select('id')
    .eq('barber_id', barber_id)
    .eq('date', date)
    .eq('time', time)
    .in('status', ['pending', 'confirmed'])
    .single()

  if (existing) {
    return res.status(409).json({ error: 'Ese horario ya está reservado' })
  }

  // Buscar o crear cliente
  let clientId
  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('phone', client_phone)
    .single()

  if (existingClient) {
    clientId = existingClient.id
  } else {
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert([{ name: client_name, phone: client_phone }])
      .select()
      .single()

    if (clientError) return res.status(500).json({ error: clientError.message })
    clientId = newClient.id
  }

  // Crear la cita
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      barber_id,
      service_id,
      client_id: clientId,
      date,
      time,
      notes,
      status: 'pending'
    }])
    .select(`
      *,
      barbers(name),
      services(name, price),
      clients(name, phone)
    `)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// PATCH /api/appointments/:id/status — cambiar estado (admin)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' })
  }

  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/appointments/:id — cancelar cita
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Cita cancelada' })
})

module.exports = router
