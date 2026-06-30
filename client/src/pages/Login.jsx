import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '../api'

export default function Login() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password) return toast.error('Ingresa la contraseña')
    setLoading(true)
    try {
      const { token } = await login(password)
      localStorage.setItem('famy_token', token)
      toast.success('Bienvenido al panel')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Contraseña incorrecta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 40%, rgba(63,107,58,0.12) 0%, transparent 60%), #0F1115',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Playfair Display', 'Times New Roman', serif", padding: '20px'
    }}>
      <style>{`
        @keyframes particle-float {
          0%   { transform: translateY(100vh); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fadeUp 0.6s ease both; }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(212,175,55,0.4);
        }
      `}</style>

      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} style={{
          position: 'fixed',
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          background: '#D4AF37', borderRadius: '50%',
          left: `${(i / 14) * 100}%`,
          animation: `particle-float ${10 + i * 1.2}s linear infinite`,
          animationDelay: `${i * 0.8}s`,
          opacity: 0.2, pointerEvents: 'none',
        }} />
      ))}

      <div className="login-card" style={{
        background: '#161A20',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '16px', padding: '52px 48px',
        width: '100%', maxWidth: '420px', position: 'relative',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
        }} />

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/famy-logo.png" alt="Famy Barber Club" style={{
            width: '90px', height: '90px', borderRadius: '50%',
            objectFit: 'cover', border: '2px solid #D4AF37',
            margin: '0 auto 16px', display: 'block',
            boxShadow: '0 0 30px rgba(212,175,55,0.3)',
          }} />
          <div style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '3px', color: '#D4AF37' }}>FAMY</div>
          <div style={{ fontSize: '10px', letterSpacing: '4px', color: '#6B7280', marginBottom: '8px' }}>BARBER CLUB</div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Panel de Administración</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '10px', letterSpacing: '2px',
              textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '10px', fontWeight: 600
            }}>Contraseña de acceso</label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoFocus
                style={{
                  width: '100%', padding: '14px 48px 14px 16px',
                  background: '#1E232B', border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '8px', color: '#fff',
                  fontFamily: "'Playfair Display', 'Times New Roman', serif", fontSize: '14px',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onFocus={e => { e.target.style.borderColor = '#D4AF37'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(212,175,55,0.2)'; e.target.style.boxShadow = 'none' }}
              />
              <button type="button" onClick={() => setShow(!show)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '16px'
              }}>{show ? '🙈' : '👁️'}</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-btn" style={{
            width: '100%', padding: '16px',
            background: loading ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #D4AF37, #A08020)',
            color: '#0F1115', fontFamily: "'Playfair Display', 'Times New Roman', serif",
            fontSize: '12px', fontWeight: 800, letterSpacing: '3px',
            textTransform: 'uppercase', border: 'none', borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
          }}>
            {loading ? 'Verificando...' : '✦ Acceder al Panel'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <a href="/" style={{ fontSize: '12px', color: '#6B7280', textDecoration: 'none', transition: 'color 0.3s' }}
            onMouseEnter={e => e.target.style.color = '#D4AF37'}
            onMouseLeave={e => e.target.style.color = '#6B7280'}>
            ← Volver al sitio
          </a>
        </div>
      </div>
    </div>
  )
}
