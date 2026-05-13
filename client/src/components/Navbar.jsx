import { Link, useLocation } from 'react-router-dom'
import { Scissors } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/reservar', label: 'Reservar cita' },
    { to: '/admin', label: 'Admin' },
  ]

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-amber-400">
        <Scissors size={24} />
        BarberPro
      </Link>
      <ul className="flex gap-6">
        {links.map(link => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                pathname === link.to ? 'text-amber-400' : 'text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
