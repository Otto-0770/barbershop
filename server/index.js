require('dotenv').config()
const express = require('express')
const cors = require('cors')

const servicesRouter = require('./routes/services')
const barbersRouter = require('./routes/barbers')
const appointmentsRouter = require('./routes/appointments')
const clientsRouter = require('./routes/clients')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Rutas de la API
app.use('/api/services', servicesRouter)
app.use('/api/barbers', barbersRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/clients', clientsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor de barbería funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
