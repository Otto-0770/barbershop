import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getServices, getBarbers, createAppointment } from '../api'
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
        <div className="stat"><div className="stat-num">8+</div><div className="stat-label">Años de experiencia</div></div>
        <div className="stat"><div className="stat-num">3</div><div className="stat-label">Barberos expertos</div></div>
        <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Satisfacción</div></div>
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
          <div className="about-image" />
          <div className="about-image-border" />
          <div className="about-badge">
            <div className="num">8+</div>
            <div className="txt">Años de<br />excelencia</div>
          </div>
        </div>
        <div className="reveal-right">
          <div className="section-tag">Nuestra historia</div>
          <h2 className="section-title">El arte del barbero, <span>reinventado.</span></h2>
          <div className="divider" />
          <p className="section-desc">
            Famy Barber Club nació de la pasión por el arte del barbero tradicional, fusionado con el estilo contemporáneo. Somos más que una barbería: somos un espacio donde cada cliente vive una experiencia única de grooming y bienestar.
          </p>
          <p className="section-desc" style={{ marginTop: '16px' }}>
            Con técnicas precisas y productos de alta gama, nuestros barberos transforman cada visita en un ritual de cuidado personal que refleja tu personalidad y estilo.
          </p>
          <div className="about-features">
            {[
              { icon: '⚡', title: 'Técnicas Premium', desc: 'Maestría en cortes clásicos y modernos con décadas de experiencia.' },
              { icon: '✦', title: 'Productos Selectos', desc: 'Solo utilizamos productos de las mejores marcas del mercado.' },
              { icon: '🎯', title: 'Atención Personalizada', desc: 'Cada cliente recibe una consulta personalizada antes del servicio.' },
              { icon: '🏆', title: 'Ambiente Premium', desc: 'Un espacio diseñado para que te sientas como en casa, pero en clase.' },
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
const STATIC_SERVICES = [
  { icon: '✂️', name: 'Corte Clásico', desc: 'Corte tradicional con tijera y máquina. El estilo atemporal que nunca pasa de moda.', price: 15, duration: '30 min' },
  { icon: '👑', name: 'Corte Premium', desc: 'Experiencia completa con masaje de cuero cabelludo, lavado y estilizado final.', price: 30, duration: '60 min' },
  { icon: '🪒', name: 'Barba y Perfilado', desc: 'Arreglo y perfilado de barba con navaja de precisión y toalla caliente.', price: 15, duration: '30 min' },
  { icon: '⚗️', name: 'Afeitado Tradicional', desc: 'Afeitado clásico con navaja, crema artesanal y toallas calientes. Lujo puro.', price: 20, duration: '45 min' },
  { icon: '💧', name: 'Lavado Capilar', desc: 'Tratamiento de hidratación profunda y masaje relajante para el cuero cabelludo.', price: 12, duration: '20 min' },
  { icon: '🎨', name: 'Diseño de Barba', desc: 'Escultura artística de la barba, desde estilos minimalistas hasta diseños elaborados.', price: 25, duration: '45 min' },
]

function Services() {
  return (
    <section id="servicios" className="services-section section">
      <div className="services-header reveal">
        <div className="section-tag" style={{ paddingLeft: 0 }}>Nuestros servicios</div>
        <h2 className="section-title">Todo lo que necesitas, <span>en un solo lugar.</span></h2>
        <div className="divider" />
        <p className="section-desc">Servicios diseñados para hombres que valoran su imagen y apariencia.</p>
      </div>
      <div className="services-grid">
        {STATIC_SERVICES.map((s, i) => (
          <div key={i} className="service-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="service-num">0{i + 1}</div>
            <span className="service-icon">{s.icon}</span>
            <div className="service-name">{s.name}</div>
            <div className="service-desc">{s.desc}</div>
            <div className="service-price">${s.price} <span>· {s.duration}</span></div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Gallery ──────────────────────────────────────────────────────────────────
const GALLERY = [
  { cls: 'gal-1 tall', label: 'Corte Fade', tall: true },
  { cls: 'gal-2', label: 'Barba Diseñada' },
  { cls: 'gal-3', label: 'Corte Clásico' },
  { cls: 'gal-4', label: 'Afeitado Premium' },
  { cls: 'gal-5', label: 'Corte Moderno' },
  { cls: 'gal-6', label: 'Estilo Completo' },
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
            <div className={`gallery-placeholder ${g.cls.split(' ')[0]}`} style={{ minHeight: g.tall ? '400px' : '200px' }}>
              <div className="gallery-overlay"><span>Ver más</span></div>
              <div className="gallery-label">{g.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Booking Form ─────────────────────────────────────────────────────────────
function Booking() {
  const [services, setServices] = useState(STATIC_SERVICES.map((s, i) => ({ id: i + 1, ...s })))
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', service: '', date: '', time: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.service || !form.date || !form.time) {
      toast.error('Por favor completa todos los campos')
      return
    }
    setLoading(true)
    try {
      await createAppointment({
        barber_id: null,
        service_id: null,
        date: form.date,
        time: form.time,
        client_name: form.name,
        client_phone: form.phone,
        notes: `Servicio: ${form.service}. Email: ${form.email}`,
      })
      toast.success('¡Reserva confirmada! Te contactaremos pronto.')
      setForm({ name: '', phone: '', email: '', service: '', date: '', time: '' })
    } catch {
      toast.error('Hubo un error. Por favor llámanos directamente.')
    } finally {
      setLoading(false)
    }
  }

  const TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
                  '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30']

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
              { icon: '⚡', title: 'Confirmación instantánea', desc: 'Recibe confirmación de tu cita al instante' },
              { icon: '🔄', title: 'Fácil de modificar', desc: 'Cambia o cancela tu cita cuando necesites' },
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
                  {STATIC_SERVICES.map((s, i) => (
                    <option key={i} value={s.name}>{s.name} — ${s.price}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Fecha</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div className="form-field">
                <label>Hora</label>
                <select value={form.time} onChange={e => set('time', e.target.value)}>
                  <option value="">Selecciona hora</option>
                  {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Confirmando reserva...' : '✦ Confirmar Reserva'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Andrés M.', detail: 'Cliente desde 2022', text: 'Famy Barber Club cambió mi perspectiva sobre las barberías. El nivel de detalle y precisión en cada corte es incomparable. Definitivamente el mejor lugar de la ciudad.', stars: '★★★★★', init: 'A' },
  { name: 'Carlos R.', detail: 'Cliente habitual', text: 'El ambiente es premium desde que entras. Los barberos saben exactamente lo que quieres con solo describírtelo una vez. Mi barba nunca ha lucido tan bien.', stars: '★★★★★', init: 'C' },
  { name: 'Miguel L.', detail: 'Cliente desde 2023', text: 'Vine recomendado por un amigo y no me arrepiento. El trato personalizado y la calidad de los productos que usan es de primer nivel. 100% recomendado.', stars: '★★★★★', init: 'M' },
]

function Testimonials() {
  return (
    <section className="testimonials-section section">
      <div className="testimonials-header reveal">
        <div className="section-tag" style={{ paddingLeft: 0 }}>Testimonios</div>
        <h2 className="section-title">Lo que dicen<br /><span>nuestros clientes.</span></h2>
        <div className="divider" />
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="testimonial-card reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">{t.text}</p>
            <div className="testimonial-stars">{t.stars}</div>
            <div className="testimonial-author">
              <div className="author-avatar">{t.init}</div>
              <div>
                <div className="author-name">{t.name}</div>
                <div className="author-detail">{t.detail}</div>
              </div>
            </div>
          </div>
        ))}
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
              { icon: '📍', label: 'Dirección', text: 'Calle Principal 123, Ciudad' },
              { icon: '📞', label: 'Teléfono', text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
              { icon: '💬', label: 'WhatsApp', text: 'Escríbenos ahora', href: 'https://wa.me/15551234567' },
              { icon: '✉️', label: 'Correo', text: 'info@famybarber.com', href: 'mailto:info@famybarber.com' },
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613507864!3d-6.194741395493371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnNDEuMSJTIDEwNsKwNDknMTEuMyJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
              allowFullScreen loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
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
            {['📘','📷','🐦','📹'].map((s, i) => <a key={i} href="#" className="social-btn">{s}</a>)}
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
            {STATIC_SERVICES.map((s, i) => <li key={i}><a href="#servicios" onClick={e => { e.preventDefault(); scroll('#servicios') }}>{s.name}</a></li>)}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Horarios</h4>
          <div className="footer-hours">
            {[
              ['Lunes – Viernes', '9:00 – 19:00'],
              ['Sábados', '9:00 – 18:00'],
              ['Domingos', 'Cerrado'],
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
        <p>© 2024 <span>Famy Barber Club</span>. Todos los derechos reservados.</p>
        <p>Diseñado con <span>✦</span> para la excelencia</p>
      </div>
    </footer>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Landing() {
  useReveal()

  useEffect(() => {
    // Google Fonts
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  return (
    <div className="landing">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Booking />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}
