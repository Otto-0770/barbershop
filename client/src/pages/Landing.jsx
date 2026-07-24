import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getServices, getBarbers, createAppointment, getTakenSlots, getMemberships } from '../api'
import '../landing.css'

// ── Scroll reveal hook ──────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ── Particle canvas ─────────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 4 + 1}px`,
    duration: `${Math.random() * 15 + 8}s`,
    delay: `${Math.random() * 10}s`,
    opacity: Math.random() * 0.6 + 0.2,
  }))
  return (
    <div className="hero-particles">
      {particles.map(p => (
        <span key={p.id} className="particle" style={{
          left: p.left, width: p.size, height: p.size,
          animationDuration: p.duration, animationDelay: p.delay,
          opacity: p.opacity,
        }} />
      ))}
    </div>
  )
}

// ── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#servicios', label: 'Servicios' },
    { href: '#barberos', label: 'Barberos' },
    { href: '#membresias', label: 'Membresías' },
    { href: '#galeria', label: 'Galería' },
    { href: '#contacto', label: 'Contacto' },
  ]

  const scroll = (href) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`famy-nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#inicio" className="logo" onClick={e => { e.preventDefault(); scroll('#inicio') }}>
        <img src="/famy-logo.png" alt="Famy Barber Club" className="logo-img" />
        <div>
          <div className="logo-text">FAMY</div>
          <div className="logo-sub">Barber Club</div>
        </div>
      </a>
      <ul>
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href} onClick={e => { e.preventDefault(); scroll(l.href) }}>{l.label}</a>
          </li>
        ))}
      </ul>
      <a href="#reservas" className="nav-cta" onClick={e => { e.preventDefault(); scroll('#reservas') }}>
        Reservar
      </a>
      <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menú">
        <span /><span /><span />
      </button>
    </nav>
  )
}

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="inicio" className="hero-section">
      <Particles />
      <div className="hero-badge">Est. 2024 · Premium Barbershop</div>
      <h1 className="hero-title">
        <span className="line-1">Más que un corte,</span>
        <span className="line-2">una experiencia.</span>
      </h1>
      <p className="hero-subtitle">
        Barbería moderna con estilo, precisión y atención personalizada.<br />
        Donde cada visita es un ritual de distinción.
      </p>
      <div className="hero-buttons">
        <a href="#reservas" className="btn-gold" onClick={e => { e.preventDefault(); document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' }) }}>
          ✦ Reservar Cita
        </a>
        <a href="#servicios" className="btn-outline" onClick={e => { e.preventDefault(); document.querySelector('#servicios')?.scrollIntoView({ behavior: 'smooth' }) }}>
          Ver Servicios →
        </a>
      </div>
      <div className="hero-stats">
        <div className="stat"><div className="stat-num">500+</div><div className="stat-label">Clientes satisfechos</div></div>
        <div className="stat"><div className="stat-num">10+</div><div className="stat-label">Años de experiencia</div></div>
        <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Satisfacción garantizada</div></div>
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  )
}

// ── About ───────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="nosotros" className="about-section section">
      <div className="about-grid">
        <div className="about-image-wrap reveal-left">
          <div className="about-image">
            <img src="/galeria-interior.jpg" alt="Interior Famy Barber Club" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div className="about-image-border" />
          <div className="about-badge">
            <div className="num">10+</div>
            <div className="txt">Años de<br />excelencia</div>
          </div>
        </div>
        <div className="reveal-right">
          <div className="section-tag">Nuestra historia</div>
          <h2 className="section-title">Más de una década de <span>experiencia y estilo.</span></h2>
          <div className="divider" />
          <p className="section-desc">
            En Famy Barber Club ofrecemos más que un corte: brindamos una experiencia de cuidado, estilo y confianza para caballeros y niños.
          </p>
          <p className="section-desc" style={{ marginTop: '16px' }}>
            Con más de una década de experiencia, combinamos técnica, herramientas profesionales y atención personalizada para que cada cliente salga satisfecho, renovado y con un look que le represente.
          </p>
          <div className="about-features">
            {[
              { icon: '✂️', title: 'Dominio de la técnica', desc: 'Cada corte se realiza con precisión, desde estilos clásicos hasta degradados modernos y acabados definidos.' },
              { icon: '👦', title: 'Para caballeros y niños', desc: 'Un espacio cómodo y profesional para todas las edades, con atención dedicada en cada visita.' },
              { icon: '🔄', title: 'Siempre evolucionando', desc: 'Nos mantenemos aprendiendo y perfeccionando nuestras técnicas para ofrecerte lo mejor en cada servicio.' },
              { icon: '🏆', title: 'Calidad en cada detalle', desc: 'No importa el servicio que elijas: nuestro compromiso es que salgas con un resultado que te haga sentir bien.' },
            ].map((f, i) => (
              <div key={i} className="about-feat">
                <span className="about-feat-icon">{f.icon}</span>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Services ────────────────────────────────────────────────────────────────
const SERVICE_ICONS = {
  'corte adulto + lavado + facial': '✂️',
  'corte joven + lavado + facial':  '👦',
  'corte infantil + lavado':        '👶',
  'cerquillo':                      '〽️',
  'afeitado tradicional + cerquillo': '🪒',
  'arreglo de barba':               '🧔',
  'corte adulto + barba':           '👑',
  'perfilado de barba':             '✦',
  'cejas':                          '👁️',
  'diseño o líneas en el corte':    '🎨',
  'tratamiento capilar':            '💧',
  'camuflaje de canas':             '⚗️',
}
const getIcon = (name, isUsd) => {
  if (isUsd) return '🏠'
  return SERVICE_ICONS[name.toLowerCase()] || '✂️'
}

function ServiceCard({ s, i }) {
  return (
    <div key={s.id} className="service-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
      <div className="service-num">{String(i + 1).padStart(2, '0')}</div>
      <span className="service-icon">{getIcon(s.name, s.is_usd)}</span>
      <div className="service-name">{s.name.replace(/ a domicilio$/i, '')}</div>
      <div className="service-desc">{s.description}</div>
      <div className="service-price">
        {s.price_from && <span style={{ fontSize: '14px', fontWeight: 400 }}>Desde </span>}
        {s.is_usd ? `US$${Number(s.price)}` : `RD$${Number(s.price).toLocaleString()}`}
      </div>
    </div>
  )
}

function Services({ services }) {
  const inBarber = services.filter(s => !s.is_usd)
  const atHome   = services.filter(s => s.is_usd)

  useEffect(() => {
    if (services.length === 0) return
    const els = document.querySelectorAll('#servicios .reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [services])

  return (
    <section id="servicios" className="services-section section">
      <div className="services-header reveal">
        <div className="section-tag" style={{ paddingLeft: 0 }}>Nuestros servicios</div>
        <h2 className="section-title">Todo lo que necesitas, <span>en un solo lugar.</span></h2>
        <div className="divider" />
        <p className="section-desc">Servicios diseñados para hombres que valoran su imagen y apariencia.</p>
      </div>

      {inBarber.length > 0 && (
        <>
          <div className="services-subsection-label reveal">✦ En barbería</div>
          <div className="services-grid">
            {inBarber.map((s, i) => <ServiceCard key={s.id} s={s} i={i} />)}
          </div>
        </>
      )}

      {atHome.length > 0 && (
        <div className="at-home-section">
          <div className="at-home-header reveal">
            <div className="at-home-icon">🏠</div>
            <div>
              <h3 className="at-home-title">Servicios a domicilio</h3>
              <p className="at-home-desc">Llevamos la experiencia Famy hasta donde estés. Agenda tu servicio y te atendemos en tu hogar u oficina.</p>
            </div>
          </div>
          <div className="services-grid">
            {atHome.map((s, i) => <ServiceCard key={s.id} s={s} i={i} />)}
          </div>
        </div>
      )}
    </section>
  )
}

// ── Gallery ──────────────────────────────────────────────────────────────────
const GALLERY = [
  { src: '/galeria-exterior.jpg',  label: 'Famy Barber Club',    tall: true },
  { src: '/galeria-corte1.jpg',    label: 'Fade con Diseño' },
  { src: '/galeria-corte2.jpg',    label: 'Degradado Perfecto' },
  { src: '/galeria-interior.jpg',  label: 'Nuestro Espacio' },
  { src: '/galeria-corte3.jpg',    label: 'Corte Ejecutivo' },
  { src: '/galeria-barba.jpg',     label: 'Barba Completa' },
  { src: '/galeria-sala.jpg',      label: 'Zona de Espera' },
]

function Gallery() {
  return (
    <section id="galeria" className="gallery-section section">
      <div className="gallery-header reveal">
        <div className="section-tag">Galería</div>
        <h2 className="section-title">Nuestro <span>trabajo habla</span><br />por nosotros.</h2>
        <div className="divider" />
      </div>
      <div className="gallery-grid">
        {GALLERY.map((g, i) => (
          <div key={i} className={`gallery-item ${g.tall ? 'tall' : ''} reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="gallery-placeholder">
              <img src={g.src} alt={g.label} className="gallery-img" loading="lazy" />
              <div className="gallery-overlay" />
              <div className="gallery-label">{g.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Barbers ──────────────────────────────────────────────────────────────────
function Barbers({ barbers }) {
  if (barbers.length === 0) return null
  return (
    <section id="barberos" className="barbers-section section">
      <div className="barbers-header reveal">
        <div className="section-tag">Nuestro equipo</div>
        <h2 className="section-title">Conoce a quien <span>te atenderá.</span></h2>
        <div className="divider" />
        <p className="section-desc">Profesionales dedicados a dar lo mejor en cada servicio.</p>
      </div>
      <div className="barbers-grid">
        {barbers.map((b, i) => (
          <div key={b.id} className="barber-card-web reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
            <div className="barber-photo-wrap">
              {b.photo_url
                ? <img src={b.photo_url} alt={b.name} className="barber-photo" />
                : <div className="barber-photo-placeholder">{b.name.charAt(0).toUpperCase()}</div>
              }
            </div>
            <div className="barber-info-web">
              <h3 className="barber-name-web">{b.name}</h3>
              {b.bio && <p className="barber-bio-web">{b.bio}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function fmt12(h, m) {
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function getSlotsForDate(dateStr) {
  if (!dateStr) return []
  const day = new Date(dateStr + 'T12:00:00').getDay() // 0=Dom
  const [startH, startM, endH, endM] =
    day === 0 ? [9, 30, 15, 0]   // Domingo 9:30am-3pm
    : day === 1 ? [11, 30, 20, 0] // Lunes 11:30am-8pm
    : [8, 30, 19, 30]             // Mar-Sab 8:30am-7:30pm
  const slots = []
  let h = startH, m = startM
  while (h < endH || (h === endH && m <= endM)) {
    slots.push({ value: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`, label: fmt12(h, m) })
    m += 30; if (m >= 60) { m = 0; h++ }
  }
  return slots
}

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '18095087962'

function buildWaLink(phone, message) {
  const num = phone.replace(/\D/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`
}

// ── Booking Form ─────────────────────────────────────────────────────────────
function Booking({ services, barbers }) {
  const [loading, setLoading] = useState(false)
  const [takenSlots, setTakenSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [waLink, setWaLink] = useState(null)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', service: '', barber: '', date: '', time: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const rawSlots = getSlotsForDate(form.date)
  const isSunday = false
  const today = new Date().toISOString().split('T')[0]
  const isToday = form.date === today
  const slots = rawSlots.map(slot => {
    if (!isToday) return { ...slot, blocked: null }
    const [h, m] = slot.value.split(':').map(Number)
    const now = new Date()
    const slotMin = h * 60 + m
    const nowMin = now.getHours() * 60 + now.getMinutes()
    if (slotMin <= nowMin) return { ...slot, blocked: 'ya-paso' }
    if (slotMin < nowMin + 30) return { ...slot, blocked: 'muy-pronto' }
    return { ...slot, blocked: null }
  })

  const handleDateChange = async (date) => {
    set('date', date)
    set('time', '')
    if (!date) return
    setLoadingSlots(true)
    try {
      const taken = await getTakenSlots(date)
      setTakenSlots(taken.map(t => t.substring(0, 5)))
    } catch {
      setTakenSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.service || !form.date || !form.time) {
      toast.error('Por favor completa todos los campos')
      return
    }
    if (takenSlots.includes(form.time)) {
      toast.error('Ese horario ya está ocupado, elige otro')
      return
    }
    const selectedSlot = slots.find(s => s.value === form.time)
    if (selectedSlot?.blocked === 'ya-paso') {
      toast.error('Ese horario ya pasó, elige uno más tarde')
      return
    }
    if (selectedSlot?.blocked === 'muy-pronto') {
      toast.error('Las reservas requieren al menos 30 minutos de anticipación')
      return
    }
    setLoading(true)
    const selectedService = services.find(s => s.name === form.service)
    const selectedBarber = barbers.find(b => b.name === form.barber)
    const timeLabel = slots.find(s => s.value === form.time)?.label || form.time
    try {
      await createAppointment({
        service_id: selectedService?.id || null,
        barber_id: selectedBarber?.id || null,
        date: form.date,
        time: form.time,
        client_name: form.name,
        client_phone: form.phone,
        notes: form.email ? `Email: ${form.email}` : undefined,
      })
      const msg = `🔔 Nueva cita desde la web\n\n👤 Cliente: ${form.name}\n📞 Tel: ${form.phone}\n✂️ Servicio: ${form.service}${form.barber ? `\n💈 Barbero: ${form.barber}` : ''}\n📅 Fecha: ${form.date}\n🕐 Hora: ${timeLabel}`
      setWaLink(buildWaLink(WA_NUMBER, msg))
      setForm({ name: '', phone: '', email: '', service: '', date: '', time: '' })
      setTakenSlots([])
    } catch (err) {
      const msg = err?.response?.data?.error
      toast.error(msg === 'Ese horario ya está reservado' ? 'Ese horario acaba de ser tomado, elige otro' : 'Hubo un error. Por favor llámanos directamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="reservas" className="booking-section section">
      <div className="booking-inner">
        <div className="booking-info reveal-left">
          <div className="section-tag">Reservas online</div>
          <h2 className="section-title">Tu cita,<br /><span>en minutos.</span></h2>
          <div className="divider" />
          <p className="section-desc">
            Reserva tu cita de forma rápida y sencilla. Sin esperas, sin llamadas. Solo elige tu servicio, fecha y hora.
          </p>
          <div className="booking-highlights" style={{ marginTop: '40px' }}>
            {[
              { icon: '⚡', title: 'Rápido y sencillo', desc: 'Elige servicio, fecha y hora en menos de un minuto' },
              { icon: '💬', title: 'Confirmación por WhatsApp', desc: 'Notificamos al barbero directamente al confirmar tu cita' },
              { icon: '🎯', title: 'Sin comisiones', desc: 'Reserva directamente sin costos adicionales' },
            ].map((h, i) => (
              <div key={i} className="booking-highlight">
                <div className="highlight-icon">{h.icon}</div>
                <div className="highlight-text">
                  <h4>{h.title}</h4>
                  <p>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="booking-form reveal-right">
          <h3>✦ Reserva tu cita</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label>Nombre completo</label>
                <input type="text" placeholder="Tu nombre" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-field">
                <label>Teléfono</label>
                <input type="tel" placeholder="+1 000 000 0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="form-field full">
                <label>Correo electrónico</label>
                <input type="email" placeholder="tu@correo.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="form-field full">
                <label>Servicio</label>
                <select value={form.service} onChange={e => set('service', e.target.value)}>
                  <option value="">Selecciona un servicio</option>
                  {services.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} — {s.price_from ? 'Desde ' : ''}{s.is_usd ? `US$${Number(s.price)}` : `RD$${Number(s.price).toLocaleString()}`}
                    </option>
                  ))}
                </select>
              </div>
              {barbers.length > 1 && (
                <div className="form-field full">
                  <label>Barbero</label>
                  <select value={form.barber} onChange={e => set('barber', e.target.value)}>
                    <option value="">Sin preferencia</option>
                    {barbers.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
              )}
              <div className="form-field">
                <label>Fecha</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} value={form.date}
                  onChange={e => handleDateChange(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Hora {loadingSlots && <span style={{ color: 'var(--gold)', fontSize: '11px' }}>Cargando...</span>}</label>
                <select value={form.time} onChange={e => set('time', e.target.value)} disabled={!form.date || loadingSlots || isSunday}>
                  <option value="">
                    {!form.date ? 'Primero elige fecha' : 'Selecciona hora'}
                  </option>
                  {slots.map(({ value, label, blocked }) => {
                    const taken = takenSlots.includes(value)
                    const isDisabled = taken || !!blocked
                    let suffix = ''
                    if (taken) suffix = ' — Ocupado'
                    else if (blocked === 'ya-paso') suffix = ' — Ya pasó'
                    else if (blocked === 'muy-pronto') suffix = ' — Mínimo 30 min de anticipación'
                    return (
                      <option key={value} value={value} disabled={isDisabled}>
                        {label}{suffix}
                      </option>
                    )
                  })}
                </select>
                {isToday && (
                  <span style={{ fontSize: '11px', color: 'var(--gold)', opacity: 0.75, marginTop: '4px', display: 'block' }}>
                    Las reservas requieren al menos 30 min de anticipación
                  </span>
                )}
              </div>
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Enviando reserva...' : '✦ Confirmar Reserva'}
            </button>
          </form>
          {waLink && (
            <div className="wa-success">
              <div className="wa-success-text">
                ✅ ¡Reserva enviada! Toca el botón para notificar al barbero por WhatsApp.
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="wa-btn"
                onClick={() => setWaLink(null)}>
                <span>📱</span> Confirmar por WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contacto" className="contact-section section">
      <div className="contact-inner">
        <div className="reveal-left">
          <div className="section-tag">Contáctanos</div>
          <h2 className="section-title">Estamos<br /><span>para servirte.</span></h2>
          <div className="divider" />
          <p className="section-desc">Visítanos o contáctanos por cualquiera de nuestros canales. Estaremos encantados de atenderte.</p>
          <div className="contact-items" style={{ marginTop: '40px' }}>
            {[
              { icon: '📍', label: 'Dirección', text: 'Famybarberclub, Santo Domingo' },
              { icon: '📞', label: 'Teléfono', text: '+1 (809) 508-7962', href: 'tel:+18095087962' },
              { icon: '💬', label: 'WhatsApp', text: 'Escríbenos ahora', href: 'https://wa.me/18095087962' },
            ].map((c, i) => (
              <div key={i} className="contact-item">
                <div className="contact-icon">{c.icon}</div>
                <div className="contact-text">
                  <h4>{c.label}</h4>
                  {c.href ? <a href={c.href}>{c.text}</a> : <p>{c.text}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal-right">
          <div className="map-wrap">
            <iframe
              title="Ubicación Famy Barber Club"
              src="https://maps.google.com/maps?q=18.4707382,-69.9627236&z=16&output=embed"
              allowFullScreen loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Memberships ──────────────────────────────────────────────────────────────
const MEMBERSHIP_ICONS = {
  'cerquillo fresh': '✂️',
  'infantil':        '👶',
  'joven':           '👦',
  'básica adulto':   '👤',
  'barba fresh':     '🧔',
  'premium':         '👑',
  'vip':             '✦',
}

function Memberships({ memberships }) {
  useEffect(() => {
    if (memberships.length === 0) return
    const els = document.querySelectorAll('#membresias .reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [memberships])

  if (memberships.length === 0) return null

  const featured = memberships.find(m => m.name.toLowerCase() === 'vip') || memberships[memberships.length - 1]

  return (
    <section id="membresias" className="memberships-section section">
      <div className="memberships-header reveal">
        <div className="section-tag" style={{ paddingLeft: 0 }}>Membresías</div>
        <h2 className="section-title">Suscríbete y <span>ahorra cada mes.</span></h2>
        <div className="divider" />
        <p className="section-desc">Paga una vez al mes y visita la barbería cuando quieras dentro de tu plan.</p>
      </div>
      <div className="memberships-grid">
        {memberships.map((m, i) => {
          const isVip = m.id === featured.id
          const icon = MEMBERSHIP_ICONS[m.name.toLowerCase()] || '✦'
          const benefits = m.includes.split('+').map(b => b.trim())
          return (
            <div key={m.id} className={`membership-card reveal${isVip ? ' membership-vip' : ''}`} style={{ transitionDelay: `${i * 0.07}s` }}>
              {isVip && <div className="membership-badge">⭐ Más popular</div>}
              <div className="membership-icon">{icon}</div>
              <div className="membership-name">{m.name}</div>
              <div className="membership-price">
                <span className="membership-currency">RD$</span>
                {Number(m.price).toLocaleString()}
                <span className="membership-period">/mes</span>
              </div>
              <ul className="membership-benefits">
                {benefits.map((b, j) => (
                  <li key={j}><span className="benefit-check">✓</span>{b}</li>
                ))}
              </ul>
              <a href="#reservas" className={`membership-btn ${isVip ? 'membership-btn-vip' : ''}`}
                onClick={e => { e.preventDefault(); document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' }) }}>
                Reservar ahora
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ services }) {
  const scroll = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <footer className="famy-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src="/famy-logo.png" alt="Famy Barber Club" className="footer-logo" />
          <div className="logo-text">FAMY</div>
          <div className="logo-sub">Barber Club</div>
          <p>Más que una barbería, una experiencia de distinción y estilo. Tu imagen, nuestra pasión.</p>
          <div className="footer-socials">
            <a href="https://www.instagram.com/famybarberclub/" target="_blank" rel="noopener noreferrer" className="social-btn">📷</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Navegación</h4>
          <ul>
            {[['#inicio','Inicio'],['#nosotros','Nosotros'],['#servicios','Servicios'],['#galeria','Galería'],['#reservas','Reservas']].map(([href, label]) => (
              <li key={href}><a href={href} onClick={e => { e.preventDefault(); scroll(href) }}>{label}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Servicios</h4>
          <ul>
            {services.map(s => <li key={s.id}><a href="#servicios" onClick={e => { e.preventDefault(); scroll('#servicios') }}>{s.name}</a></li>)}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Horarios</h4>
          <div className="footer-hours">
            {[
              ['Lunes', '11:30 AM – 8:00 PM'],
              ['Martes – Sábado', '8:30 AM – 7:30 PM'],
              ['Domingos', '9:30 AM – 3:00 PM'],
            ].map(([day, time]) => (
              <div key={day} className="hour-item">
                <span className="day">{day}</span>
                <span className="time">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 <span>Famy Barber Club</span>. Todos los derechos reservados.</p>
        <p>Diseñado con <span>✦</span> para la excelencia &nbsp;·&nbsp; <a href="/login" style={{ color: 'rgba(255,255,255,0.18)', fontSize: '11px', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='rgba(212,175,55,0.5)'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.18)'}>Admin</a></p>
      </div>
    </footer>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Landing() {
  useReveal()
  const [services, setServices] = useState([])
  const [memberships, setMemberships] = useState([])
  const [barbers, setBarbers] = useState([])

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  useEffect(() => {
    getServices().then(setServices).catch(() => {})
    getMemberships().then(setMemberships).catch(() => {})
    getBarbers().then(setBarbers).catch(() => {})
  }, [])

  return (
    <div className="landing">
      <Navbar />
      <Hero />
      <About />
      <Services services={services} />
      <Barbers barbers={barbers} />
      <Gallery />
      <Memberships memberships={memberships} />
      <Booking services={services} barbers={barbers} />
      <Contact />
      <Footer services={services} />
    </div>
  )
}
