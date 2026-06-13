import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'

export default function Layout({ children }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const rolNombre = usuario?.rol_nombre || 'Usuario'

  const ROL_DISPLAY = {
    'administrador': 'Administrador',
    'ceo': 'CEO / Coordinadora',
    'psicologa_encargada': 'Psicóloga Encargada',
    'psicologa': 'Psicóloga',
    'trabajadora_social': 'Trabajadora Social',
    'abogada': 'Abogada',
  }

  const navegacion = [
    { label: 'Panel de control', icono: '⊞', ruta: '/admin-dashboard', roles: ['administrador'] },
    { label: 'Panel de control', icono: '⊞', ruta: '/dashboard', roles: ['ceo', 'psicologa_encargada', 'psicologa', 'trabajadora_social', 'abogada'] },
    { label: 'Usuarios', icono: '👤', ruta: '/usuarios', roles: ['administrador', 'ceo'] },
    { label: 'Casos', icono: '📁', ruta: '/casos', roles: ['administrador', 'ceo', 'psicologa_encargada', 'psicologa', 'trabajadora_social', 'abogada'] },
    { label: 'Evaluaciones', icono: '📋', ruta: '/evaluaciones', roles: ['administrador', 'ceo', 'psicologa_encargada', 'psicologa', 'trabajadora_social', 'abogada'] },
    { label: 'Reportes', icono: '📊', ruta: '/reportes', roles: ['administrador', 'ceo', 'psicologa_encargada', 'psicologa', 'trabajadora_social', 'abogada'] },
  ]

  const navFiltrada = navegacion.filter(n => n.roles.includes(rolNombre))

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#f0f4f8', fontFamily: 'sans-serif',
    }}>
      {/* Sidebar */}
      <div style={{
        width: '220px', minHeight: '100vh',
        background: '#0f2d5e',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed', top: 0, left: 0,
        zIndex: 100,
      }}>
        <div>
          {/* Logo */}
          <div style={{
            padding: '1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <img src="/logo.png" alt="FUBE" style={{ height: '36px', objectFit: 'contain' }}/>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>FUBE</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}>Sistema</div>
            </div>
          </div>

          {/* Rol badge */}
          <div style={{ padding: '1rem 1.25rem' }}>
            <div style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '8px 12px',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '2px' }}>Conectado como</div>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>{ROL_DISPLAY[rolNombre] || rolNombre}</div>
            </div>
          </div>

          {/* Navegación */}
          <nav style={{ padding: '0 0.75rem' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', padding: '0 0.5rem', marginBottom: '6px' }}>MENÚ</div>
            {navFiltrada.map((item) => (
              <button
                key={item.ruta}
                onClick={() => navigate(item.ruta)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: '10px', padding: '10px 12px', marginBottom: '2px',
                  background: location.pathname === item.ruta ? 'rgba(255,255,255,0.12)' : 'transparent',
                  border: 'none', borderRadius: '8px',
                  color: location.pathname === item.ruta ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontSize: '14px', fontWeight: location.pathname === item.ruta ? '600' : '400',
                  cursor: 'pointer', textAlign: 'left',
                  borderLeft: location.pathname === item.ruta ? '3px solid #4a9fd4' : '3px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (location.pathname !== item.ruta) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { if (location.pathname !== item.ruta) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: '16px' }}>{item.icono}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer sidebar */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
            FUBE © 2026
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #e5e7eb',
          padding: '0 2rem', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Hola, <strong>{usuario?.first_name || usuario?.email}</strong>
            </span>
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#0f2d5e', color: '#fff', border: 'none',
                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {(usuario?.first_name?.[0] || 'U').toUpperCase()}
            </button>

            {menuAbierto && (
              <div style={{
                position: 'absolute', top: '44px', right: 0,
                background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: '10px', padding: '0.5rem',
                minWidth: '200px', zIndex: 200,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6', marginBottom: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>
                    {usuario?.first_name} {usuario?.last_name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{usuario?.email}</div>
                  <div style={{
                    display: 'inline-block', marginTop: '4px',
                    fontSize: '11px', background: '#e0f2fe', color: '#0369a1',
                    padding: '2px 8px', borderRadius: '20px', fontWeight: '500',
                  }}>{ROL_DISPLAY[rolNombre] || rolNombre}</div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '8px 12px', textAlign: 'left',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontSize: '13px', color: '#dc2626', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  ⬅ Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Página */}
        <div style={{ padding: '2rem', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  )
}