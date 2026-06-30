import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/Landing'
import Booking from './pages/Booking'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

function AppRoutes() {
  const { pathname } = useLocation()
  const hideNav = ['/', '/login'].includes(pathname)

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/reservar" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  )
}
