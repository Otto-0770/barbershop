require('dotenv').config()
const express = require('express')
const cors = require('cors')

const servicesRouter = require('./routes/services')
const barbersRouter = require('./routes/barbers')
const appointmentsRouter = require('./routes/appointments')
const clientsRouter = require('./routes/clients')
const authRouter = require('./routes/auth')
const membershipsRouter = require('./routes/memberships')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:5173', /\.vercel\.app$/]
}))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/services', servicesRouter)
app.use('/api/barbers', barbersRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/clients', clientsRouter)
app.use('/api/memberships', membershipsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor de barbería funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
