import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Calendar, Users, Scissors, TrendingUp, Check, X, Clock, LogOut } from 'lucide-react'
import {
  getAppointments, updateAppointmentStatus, cancelAppointment,
  getClients, getServices, getBarbers, createService, createBarber
} from '../api'

const TABS = ['Citas', 'Clientes', 'Servicios', 'Barberos']

const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}

const STATUS_LABELS = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export default function Admin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [appointments, setAppointments] = useState([])
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0])

  const loadAppointments = () =>
    getAppointments(filterDate).then(setAppointments).catch(() => {})

  useEffect(() => { loadAppointments() }, [filterDate])
  useEffect(() => {
    getClients().then(setClients).catch(() => {})
    getServices().then(setServices).catch(() => {})
    getBarbers().then(setBarbers).catch(() => {})
  }, [])

  const changeStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status)
      toast.success('Estado actualizado')
      loadAppointments()
    } catch {
      toast.error('Error al actualizar')
    }
  }

  const stats = {
    today: appointments.filter(a => a.status !== 'cancelled').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    revenue: appointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + Number(a.services?.price || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Panel de administración</h1>
          <button
            onClick={() => {
              localStorage.removeItem('famy_token')
              toast.success('Sesión cerrada')
              navigate('/login')
            }}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<Calendar size={24} />} label="Citas hoy" value={stats.today} color="text-blue-400" />
          <StatCard icon={<Clock size={24} />} label="Pendientes" value={stats.pending} color="text-yellow-400" />
          <StatCard icon={<TrendingUp size={24} />} label="Ingresos del día" value={`$${stats.revenue}`} color="text-green-400" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-2">
          {TABS.map((t, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                tab === i ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab: Citas */}
        {tab === 0 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <label className="text-gray-400 text-sm">Filtrar por fecha:</label>
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No hay citas para esta fecha</p>
              ) : (
                appointments.map(apt => (
                  <div key={apt.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="text-center min-w-[60px]">
                        <p className="text-amber-400 font-bold text-lg">{apt.time}</p>
                        <p className="text-gray-500 text-xs">{apt.date}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{apt.clients?.name}</p>
                        <p className="text-gray-400 text-sm">{apt.services?.name} · {apt.barbers?.name}</p>
                        {apt.notes && <p className="text-gray-500 text-xs mt-1">{apt.notes}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[apt.status]}`}>
                        {STATUS_LABELS[apt.status]}
                      </span>
                      <span className="text-amber-400 font-bold">${apt.services?.price}</span>
                      {apt.status === 'pending' && (
                        <>
                          <button onClick={() => changeStatus(apt.id, 'confirmed')} title="Confirmar"
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40 transition-colors">
                            <Check size={16} />
                          </button>
                          <button onClick={() => changeStatus(apt.id, 'completed')} title="Completar"
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/40 transition-colors">
                            <TrendingUp size={16} />
                          </button>
                          <button onClick={() => changeStatus(apt.id, 'cancelled')} title="Cancelar"
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-colors">
                            <X size={16} />
                          </button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <button onClick={() => changeStatus(apt.id, 'completed')} title="Marcar como completada"
                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/40 transition-colors">
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab: Clientes */}
        {tab === 1 && (
          <div className="space-y-3">
            {clients.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No hay clientes registrados</p>
            ) : (
              clients.map(client => (
                <div key={client.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-gray-900 font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{client.name}</p>
                        <p className="text-gray-400 text-sm">{client.phone}</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {client.appointments?.length || 0} visitas
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Servicios */}
        {tab === 2 && (
          <div>
            <NewServiceForm onCreated={s => setServices(sv => [...sv, s])} />
            <div className="space-y-3 mt-6">
              {services.map(s => (
                <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-gray-400 text-sm">{s.duration_minutes} min · {s.description}</p>
                  </div>
                  <span className="text-amber-400 font-bold text-lg">${s.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Barberos */}
        {tab === 3 && (
          <div>
            <NewBarberForm onCreated={b => setBarbers(bv => [...bv, b])} />
            <div className="space-y-3 mt-6">
              {barbers.map(b => (
                <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-gray-900 font-black text-xl">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-gray-400 text-sm">{b.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
      <div className={`${color}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

function NewServiceForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', duration_minutes: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const created = await createService({
        ...form,
        price: Number(form.price),
        duration_minutes: Number(form.duration_minutes)
      })
      onCreated(created)
      setForm({ name: '', description: '', price: '', duration_minutes: '' })
      toast.success('Servicio creado')
    } catch {
      toast.error('Error al crear servicio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <h3 className="font-semibold mb-4 text-amber-400">+ Nuevo servicio</h3>
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Nombre" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 col-span-2" />
        <input placeholder="Descripción" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 col-span-2" />
        <input required type="number" placeholder="Precio" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400" />
        <input required type="number" placeholder="Duración (min)" value={form.duration_minutes} onChange={e => setForm(f => ({...f, duration_minutes: e.target.value}))}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400" />
      </div>
      <button type="submit" disabled={loading}
        className="mt-4 bg-amber-400 text-gray-900 font-bold px-6 py-2 rounded-lg hover:bg-amber-300 disabled:opacity-60">
        {loading ? 'Creando...' : 'Crear servicio'}
      </button>
    </form>
  )
}

function NewBarberForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', bio: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const created = await createBarber(form)
      onCreated(created)
      setForm({ name: '', bio: '' })
      toast.success('Barbero creado')
    } catch {
      toast.error('Error al crear barbero')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <h3 className="font-semibold mb-4 text-amber-400">+ Nuevo barbero</h3>
      <div className="grid gap-3">
        <input required placeholder="Nombre del barbero" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400" />
        <input placeholder="Bio (especialidad, experiencia...)" value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400" />
      </div>
      <button type="submit" disabled={loading}
        className="mt-4 bg-amber-400 text-gray-900 font-bold px-6 py-2 rounded-lg hover:bg-amber-300 disabled:opacity-60">
        {loading ? 'Creando...' : 'Crear barbero'}
      </button>
    </form>
  )
}
