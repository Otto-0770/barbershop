import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle, Loader } from 'lucide-react'
import { getBarbers, getServices, getBarberAvailability, createAppointment } from '../api'

const STEPS = ['Servicio', 'Barbero', 'Fecha y hora', 'Tus datos', 'Confirmar']

export default function Booking() {
  const [step, setStep] = useState(0)
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const [form, setForm] = useState({
    service_id: '',
    barber_id: '',
    date: '',
    time: '',
    client_name: '',
    client_phone: '',
    notes: ''
  })

  useEffect(() => {
    getServices().then(setServices)
    getBarbers().then(setBarbers)
  }, [])

  useEffect(() => {
    if (form.barber_id && form.date) {
      getBarberAvailability(form.barber_id, form.date).then(setSlots)
    }
  }, [form.barber_id, form.date])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const selectedService = services.find(s => s.id === form.service_id)
  const selectedBarber = barbers.find(b => b.id === form.barber_id)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await createAppointment(form)
      setDone(true)
      toast.success('¡Cita reservada con éxito!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al reservar')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="text-center text-white">
          <CheckCircle size={72} className="text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-3">¡Cita confirmada!</h2>
          <p className="text-gray-400 mb-2">
            {selectedService?.name} con {selectedBarber?.name}
          </p>
          <p className="text-gray-400 mb-8">
            {form.date} a las {form.time}
          </p>
          <button
            onClick={() => { setDone(false); setStep(0); setForm({ service_id:'',barber_id:'',date:'',time:'',client_name:'',client_phone:'',notes:'' }) }}
            className="bg-amber-400 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-300"
          >
            Reservar otra cita
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Reserva tu cita</h1>
        <p className="text-gray-400 text-center mb-10">Sigue los pasos para completar tu reserva</p>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-amber-400 text-gray-900' :
                'bg-gray-800 text-gray-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs text-gray-500 hidden md:block">{label}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          {/* Step 0: Servicio */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">¿Qué servicio quieres?</h2>
              <div className="grid gap-3">
                {services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { set('service_id', s.id); setStep(1) }}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      form.service_id === s.id
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-sm text-gray-400">{s.duration_minutes} min</p>
                      </div>
                      <span className="text-amber-400 font-bold text-lg">${s.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Barbero */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Elige tu barbero</h2>
              <div className="grid gap-3">
                {barbers.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { set('barber_id', b.id); setStep(2) }}
                    className={`text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                      form.barber_id === b.id
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-gray-900 font-black text-xl flex-shrink-0">
                      {b.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{b.name}</p>
                      <p className="text-sm text-gray-400">{b.bio}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Fecha y hora */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Elige fecha y hora</h2>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 mb-6 text-white focus:outline-none focus:border-amber-400"
              />
              {form.date && (
                <>
                  <p className="text-sm text-gray-400 mb-4">Horarios disponibles:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map(slot => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => { set('time', slot.time); setStep(3) }}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          !slot.available
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed line-through'
                            : form.time === slot.time
                            ? 'bg-amber-400 text-gray-900'
                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Datos del cliente */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Tus datos</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={form.client_name}
                  onChange={e => set('client_name', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="tel"
                  placeholder="Tu número de teléfono"
                  value={form.client_phone}
                  onChange={e => set('client_phone', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
                <textarea
                  placeholder="Notas adicionales (opcional)"
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 resize-none"
                />
                <button
                  disabled={!form.client_name || !form.client_phone}
                  onClick={() => setStep(4)}
                  className="w-full bg-amber-400 text-gray-900 font-bold py-3 rounded-xl hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmar */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Confirma tu cita</h2>
              <div className="bg-gray-800 rounded-xl p-6 space-y-3 mb-6">
                <Row label="Servicio" value={selectedService?.name} />
                <Row label="Barbero" value={selectedBarber?.name} />
                <Row label="Fecha" value={form.date} />
                <Row label="Hora" value={form.time} />
                <Row label="Cliente" value={form.client_name} />
                <Row label="Teléfono" value={form.client_phone} />
                <hr className="border-gray-700" />
                <Row label="Total" value={`$${selectedService?.price}`} highlight />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-amber-400 text-gray-900 font-bold py-4 rounded-xl hover:bg-amber-300 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <Loader size={18} className="animate-spin" /> : null}
                {loading ? 'Reservando...' : 'Confirmar reserva'}
              </button>
            </div>
          )}

          {/* Navegación */}
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="mt-6 text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Volver
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className={highlight ? 'text-amber-400 font-bold text-lg' : 'font-medium'}>{value}</span>
    </div>
  )
}
