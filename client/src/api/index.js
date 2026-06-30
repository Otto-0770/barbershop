import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Agrega el token automáticamente en cada request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('famy_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si el token expira, limpia la sesión
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('famy_token')
    }
    return Promise.reject(err)
  }
)

// Auth
export const login = (password) => api.post('/auth/login', { password }).then(r => r.data)
export const verifyToken = (token) => api.post('/auth/verify', { token }).then(r => r.data)

// Servicios
export const getServices = () => api.get('/services').then(r => r.data)
export const createService = (data) => api.post('/services', data).then(r => r.data)
export const updateService = (id, data) => api.put(`/services/${id}`, data).then(r => r.data)
export const deleteService = (id) => api.delete(`/services/${id}`).then(r => r.data)

// Barberos
export const getBarbers = () => api.get('/barbers').then(r => r.data)
export const getBarberAvailability = (id, date) =>
  api.get(`/barbers/${id}/availability?date=${date}`).then(r => r.data)
export const createBarber = (data) => api.post('/barbers', data).then(r => r.data)
export const updateBarber = (id, data) => api.put(`/barbers/${id}`, data).then(r => r.data)

// Citas (protegidas)
export const getAppointments = (date) =>
  api.get('/appointments', { params: date ? { date } : {} }).then(r => r.data)
export const createAppointment = (data) => api.post('/appointments', data).then(r => r.data)
export const updateAppointmentStatus = (id, status) =>
  api.patch(`/appointments/${id}/status`, { status }).then(r => r.data)
export const cancelAppointment = (id) => api.delete(`/appointments/${id}`).then(r => r.data)

// Clientes (protegidos)
export const getClients = () => api.get('/clients').then(r => r.data)
export const getClient = (id) => api.get(`/clients/${id}`).then(r => r.data)
