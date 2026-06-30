import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { verifyToken } from '../api'

export default function AuthGuard({ children }) {
  const [status, setStatus] = useState('checking') // 'checking' | 'ok' | 'denied'

  useEffect(() => {
    const token = localStorage.getItem('famy_token')
    if (!token) { setStatus('denied'); return }

    verifyToken(token)
      .then(({ valid }) => setStatus(valid ? 'ok' : 'denied'))
      .catch(() => setStatus('denied'))
  }, [])

  if (status === 'checking') {
    return (
      <div style={{
        minHeight: '100vh', background: '#0F1115',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Montserrat', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>✦</div>
          <div style={{ color: '#D4AF37', fontSize: '12px', letterSpacing: '3px' }}>VERIFICANDO ACCESO...</div>
        </div>
      </div>
    )
  }

  if (status === 'denied') return <Navigate to="/login" replace />

  return children
}
