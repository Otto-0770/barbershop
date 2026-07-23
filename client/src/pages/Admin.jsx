import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Check, X, LogOut, ChevronRight, Pencil, Save, MessageCircle } from 'lucide-react'
import {
  getAppointments, updateAppointmentStatus,
  getClients, getServices, getBarbers, createService, updateService, createBarber
} from '../api'
import '../admin.css'

const TABS = ['Citas', 'Clientes', 'Servicios', 'Barberos']

const STATUS_CLASS = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  completed: 'status-completed',
  cancelled: 'status-cancelled',
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

  const logout = () => {
    localStorage.removeItem('famy_token')
    toast.success('Sesión cerrada')
    navigate('/login')
  }

  const stats = {
    today: appointments.filter(a => a.status !== 'cancelled').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    revenue: appointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + Number(a.services?.price || 0), 0),
  }

  return (
    <div className="admin-wrap">
      {/* Header */}
      <header className="admin-header">
        <a href="/" className="admin-brand">
          <img src="/famy-logo.png" alt="Famy" />
          <div>
            <div className="admin-brand-text">FAMY</div>
            <div className="admin-brand-sub">Barber Club</div>
          </div>
        </a>
        <span className="admin-title">Panel de Administración</span>
        <button className="admin-logout" onClick={logout}>
          <LogOut size={14} /> Cerrar sesión
        </button>
      </header>

      <main className="admin-main">
        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-card-bg">📅</div>
            <div className="stat-card-label">Citas del día</div>
            <div className="stat-card-value">{stats.today}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-bg">⏳</div>
            <div className="stat-card-label">Pendientes</div>
            <div className="stat-card-value">{stats.pending}</div>
          </div>
          <div className="stat-card green-accent">
            <div className="stat-card-bg">💰</div>
            <div className="stat-card-label">Ingresos completados</div>
            <div className="stat-card-value">${stats.revenue}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map((t, i) => (
            <button key={i} className={`admin-tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
              {t}
            </button>
          ))}
        </div>

        {/* Citas */}
        {tab === 0 && (
          <div>
            <div className="admin-filter">
              <label>Fecha</label>
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
              />
            </div>
            {appointments.length === 0 ? (
              <div className="empty-state">Sin citas para esta fecha</div>
            ) : (
              <div className="apt-list">
                <div className="section-label">{appointments.length} cita{appointments.length !== 1 ? 's' : ''} encontrada{appointments.length !== 1 ? 's' : ''}</div>
                {appointments.map(apt => (
                  <div key={apt.id} className="apt-card">
                    <div className="apt-time-block">
                      <div className="apt-time">{apt.time}</div>
                      <div className="apt-date">{apt.date}</div>
                    </div>
                    <div className="apt-divider" />
                    <div className="apt-info">
                      <div className="apt-client">{apt.clients?.name}</div>
                      <div className="apt-service">
                        {apt.services?.name}{apt.barbers?.name ? ` · ${apt.barbers.name}` : ''}
                      </div>
                      {apt.notes && <div className="apt-notes">{apt.notes}</div>}
                    </div>
                    <div className="apt-actions">
                      <span className={`status-badge ${STATUS_CLASS[apt.status]}`}>
                        {STATUS_LABELS[apt.status]}
                      </span>
                      <span className="apt-price">${apt.services?.price || 0}</span>
                      {apt.status === 'pending' && (
                        <>
                          <button className="action-btn confirm" title="Confirmar" onClick={() => changeStatus(apt.id, 'confirmed')}>
                            <Check size={15} />
                          </button>
                          <button className="action-btn complete" title="Completar" onClick={() => changeStatus(apt.id, 'completed')}>
                            <ChevronRight size={15} />
                          </button>
                          <button className="action-btn cancel" title="Cancelar" onClick={() => changeStatus(apt.id, 'cancelled')}>
                            <X size={15} />
                          </button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <button className="action-btn complete" title="Marcar completada" onClick={() => changeStatus(apt.id, 'completed')}>
                          <Check size={15} />
                        </button>
                      )}
                      {apt.clients?.phone && apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <a
                          className="action-btn"
                          title="Confirmar por WhatsApp al cliente"
                          style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          href={`https://wa.me/${apt.clients.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hola ${apt.clients.name}, te confirmamos tu cita en Famy Barber Club para el ${apt.date} a las ${apt.time}. ¡Te esperamos! ✦`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clientes */}
        {tab === 1 && (
          <div className="apt-list">
            {clients.length === 0 ? (
              <div className="empty-state">Sin clientes registrados</div>
            ) : (
              <>
                <div className="section-label">{clients.length} cliente{clients.length !== 1 ? 's' : ''}</div>
                {clients.map(c => (
                  <div key={c.id} className="client-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className="client-avatar">{c.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="client-name">{c.name}</div>
                        <div className="client-phone">{c.phone}</div>
                      </div>
                    </div>
                    <div className="client-visits">
                      <span>{c.appointments?.length || 0}</span>
                      visitas
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Servicios */}
        {tab === 2 && (
          <div>
            <NewServiceForm onCreated={s => setServices(sv => [...sv, s])} />
            <div className="apt-list">
              {services.length > 0 && <div className="section-label">{services.length} servicios — haz clic en ✏ para editar precio</div>}
              {services.map(s => (
                <ServiceRow key={s.id} service={s} onUpdated={updated =>
                  setServices(sv => sv.map(x => x.id === updated.id ? updated : x))
                } />
              ))}
            </div>
          </div>
        )}

        {/* Barberos */}
        {tab === 3 && (
          <div>
            <NewBarberForm onCreated={b => setBarbers(bv => [...bv, b])} />
            <div className="apt-list">
              {barbers.length > 0 && <div className="section-label">{barbers.length} barberos</div>}
              {barbers.map(b => (
                <div key={b.id} className="barber-card">
                  <div className="barber-avatar">{b.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="barber-name">{b.name}</div>
                    {b.bio && <div className="barber-bio">{b.bio}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function ServiceRow({ service: s, onUpdated }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: s.name, price: s.price, description: s.description || '' })
  const [loading, setLoading] = useState(false)

  const save = async () => {
    if (!form.name || !form.price) return toast.error('Nombre y precio son requeridos')
    setLoading(true)
    try {
      const updated = await updateService(s.id, {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        duration_minutes: s.duration_minutes,
      })
      onUpdated(updated)
      setEditing(false)
      toast.success('Servicio actualizado')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const currency = s.is_usd ? 'US$' : 'RD$'

  if (editing) {
    return (
      <div className="service-card-admin editing">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <input
            className="admin-input"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Nombre del servicio"
          />
          <input
            className="admin-input"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Descripción (opcional)"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--gold)', fontWeight: 600, whiteSpace: 'nowrap' }}>{currency}</span>
          <input
            type="number"
            className="admin-input"
            style={{ width: '90px', textAlign: 'right' }}
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            placeholder="Precio"
          />
          <button className="action-btn confirm" title="Guardar" onClick={save} disabled={loading}>
            <Save size={15} />
          </button>
          <button className="action-btn cancel" title="Cancelar" onClick={() => { setEditing(false); setForm({ name: s.name, price: s.price, description: s.description || '' }) }}>
            <X size={15} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="service-card-admin">
      <div>
        <div className="service-name-admin">{s.name}</div>
        <div className="service-meta">
          {s.duration_minutes} min{s.description ? ` · ${s.description}` : ''}
          {s.is_usd && <span style={{ marginLeft: '8px', color: 'var(--green)', fontSize: '11px', fontWeight: 600 }}>A domicilio</span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="service-price-admin">{currency}{Number(s.price).toLocaleString()}</div>
        <button className="action-btn" title="Editar precio" onClick={() => setEditing(true)}
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold)' }}>
          <Pencil size={13} />
        </button>
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
        duration_minutes: Number(form.duration_minutes),
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

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={submit} className="admin-form">
      <div className="admin-form-title">✦ Nuevo servicio</div>
      <div className="admin-form-grid">
        <input required className="admin-input span-2" placeholder="Nombre del servicio"
          value={form.name} onChange={e => set('name', e.target.value)} />
        <input className="admin-input span-2" placeholder="Descripción (opcional)"
          value={form.description} onChange={e => set('description', e.target.value)} />
        <input required type="number" className="admin-input" placeholder="Precio ($)"
          value={form.price} onChange={e => set('price', e.target.value)} />
        <input required type="number" className="admin-input" placeholder="Duración (min)"
          value={form.duration_minutes} onChange={e => set('duration_minutes', e.target.value)} />
      </div>
      <button type="submit" disabled={loading} className="admin-form-btn">
        {loading ? 'Creando...' : '✦ Crear servicio'}
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

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={submit} className="admin-form">
      <div className="admin-form-title">✦ Nuevo barbero</div>
      <div className="admin-form-grid single">
        <input required className="admin-input" placeholder="Nombre del barbero"
          value={form.name} onChange={e => set('name', e.target.value)} />
        <input className="admin-input" placeholder="Especialidad o bio (opcional)"
          value={form.bio} onChange={e => set('bio', e.target.value)} />
      </div>
      <button type="submit" disabled={loading} className="admin-form-btn">
        {loading ? 'Creando...' : '✦ Crear barbero'}
      </button>
    </form>
  )
}
