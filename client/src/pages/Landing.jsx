import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Scissors, Clock, Star, ChevronRight } from 'lucide-react'
import { getServices, getBarbers } from '../api'

export default function Landing() {
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])

  useEffect(() => {
    getServices().then(setServices).catch(() => {})
    getBarbers().then(setBarbers).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-950 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <span className="bg-amber-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
              Barbería Premium
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Tu mejor versión <br />
            <span className="text-amber-400">empieza aquí</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Cortes de calidad, barberos profesionales y la mejor experiencia en cada visita.
          </p>
          <Link
            to="/reservar"
            className="inline-flex items-center gap-2 bg-amber-400 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg hover:bg-amber-300 transition-colors"
          >
            Reservar cita <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Nuestros servicios</h2>
          <p className="text-gray-400 text-center mb-12">Todo lo que necesitas en un solo lugar</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.length === 0 ? (
              // Placeholder mientras carga
              [1, 2, 3].map(i => (
                <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse h-40" />
              ))
            ) : (
              services.map(service => (
                <div key={service.id} className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition-colors border border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <Scissors size={24} className="text-amber-400" />
                    <span className="text-2xl font-bold text-amber-400">${service.price}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock size={14} />
                    <span>{service.duration_minutes} min</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Barberos */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Nuestro equipo</h2>
          <p className="text-gray-400 text-center mb-12">Profesionales con experiencia</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {barbers.length === 0 ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse h-48" />
              ))
            ) : (
              barbers.map(barber => (
                <div key={barber.id} className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
                  <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black text-gray-900">
                    {barber.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{barber.name}</h3>
                  <p className="text-gray-400 text-sm">{barber.bio}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6 bg-amber-400 text-gray-900 text-center">
        <h2 className="text-3xl font-black mb-4">¿Listo para tu próximo corte?</h2>
        <p className="text-gray-700 mb-8">Reserva tu cita en menos de 2 minutos</p>
        <Link
          to="/reservar"
          className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Star size={18} /> Reservar ahora
        </Link>
      </section>
    </div>
  )
}
