import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

export const getServices = () => api.get('/services').then(r => r.data)
export const createService = (data) => api.post('/services', data).then(r => r.data)
export const updateService = (id, data) => api.put(`/services/${id}`, data).then(r => r.data)
export const deleteService = (id) => api.delete(`/services/${id}`).then(r => r.data)

export const getBarbers = () => api.get('/barbers').then(r => r.data)
export const getBarberAvailability = (id, date) =>
  api.get(`/barbers/${id}/availability?date=${date}`).then(r => r.data)
export const createBarber = (data) => api.post('/barbers', data).then(r => r.data)
export const updateBarber = (id, data) => api.put(`/barbers/${id}`, data).then(r => r.data)

export const getAppointments = (date) =>
  api.get('/appointments', { params: date ? { date } : {} }).then(r => r.data)
export const createAppointment = (data) => api.post('/appointments', data).then(r => r.data)
export const updateAppointmentStatus = (id, status) =>
  api.patch(`/appointments/${id}/status`, { status }).then(r => r.data)
export const cancelAppointment = (id) => api.delete(`/appointments/${id}`).then(r => r.data)

export const getClients = () => api.get('/clients').then(r => r.data)
export const getClient = (id) => api.get(`/clients/${id}`).then(r => r.data)
