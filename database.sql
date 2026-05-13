-- =============================================
-- ESQUEMA DE BASE DE DATOS - BarberPro
-- Ejecutar en Supabase > SQL Editor
-- =============================================

-- Servicios que ofrece la barbería
CREATE TABLE services (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Barberos del equipo
CREATE TABLE barbers (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  bio        TEXT,
  photo_url  TEXT,
  active     BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Clientes registrados
CREATE TABLE clients (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT UNIQUE NOT NULL,
  email      TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Citas (tabla principal del negocio)
CREATE TABLE appointments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id   UUID REFERENCES barbers(id),
  service_id  UUID REFERENCES services(id),
  client_id   UUID REFERENCES clients(id),
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  notes       TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Índices para consultas frecuentes
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_barber_date ON appointments(barber_id, date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- =============================================
-- DATOS DE PRUEBA (seed)
-- =============================================

INSERT INTO services (name, description, price, duration_minutes) VALUES
  ('Corte clásico',    'Corte tradicional con tijera y máquina',       15.00, 30),
  ('Corte + barba',    'Corte completo más arreglo y perfilado de barba', 25.00, 60),
  ('Barba completa',   'Afeitado clásico con navaja y toalla caliente', 15.00, 30),
  ('Corte infantil',   'Corte para niños hasta 12 años',               12.00, 30),
  ('Tratamiento',      'Hidratación profunda y masaje capilar',         20.00, 45);

INSERT INTO barbers (name, bio) VALUES
  ('Carlos Mendez',  'Especialista en cortes clásicos · 8 años de experiencia'),
  ('Luis Torres',    'Experto en diseños modernos y fade · 5 años de experiencia'),
  ('Miguel Ruiz',    'Maestro barbero · Especialidad en barba y afeitado clásico');

-- Política de seguridad: habilitar acceso público a la API (solo lectura en producción)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Permitir todo desde el service role (nuestro servidor Express lo usa)
CREATE POLICY "service_role_all" ON services FOR ALL USING (true);
CREATE POLICY "service_role_all" ON barbers FOR ALL USING (true);
CREATE POLICY "service_role_all" ON clients FOR ALL USING (true);
CREATE POLICY "service_role_all" ON appointments FOR ALL USING (true);
