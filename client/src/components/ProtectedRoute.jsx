import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { verifyToken } from '../api'

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking')

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
        fontFamily: 'Montserrat, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', margin: '0 auto 16px',
            border: '3px solid rgba(212,175,55,0.2)',
            borderTopColor: '#D4AF37',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#9CA3AF', fontSize: '12px', letterSpacing: '2px' }}>VERIFICANDO ACCESO...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (status === 'denied') return <Navigate to="/login" replace />

  return children
}
