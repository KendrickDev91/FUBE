import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'
import Layout from '../componentes/Layout'

export default function AdminDashboard() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const tarjetas = [
    { label: 'Registrar nuevo caso', icono: '📁', ruta: '/casos/nuevo', color: '#0f2d5e' },
    { label: 'Registrar nuevo usuario', icono: '👤', ruta: '/usuarios/nuevo', color: '#0f2d5e' },
  ]

  return (
    <Layout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 6px' }}>
          Bienvenido, {usuario?.first_name || 'Administrador'}
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Actualmente registrado como <strong>Administrador del sistema</strong>
        </p>
      </div>

      {/* Acciones rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: '500px', marginBottom: '2.5rem' }}>
        {tarjetas.map((t, i) => (
          <button
            key={i}
            onClick={() => navigate(t.ruta)}
            style={{
              background: '#fff', border: '1.5px solid #e5e7eb',
              borderRadius: '12px', padding: '1.5rem',
              cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f2d5e'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,45,94,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{t.icono}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: t.color }}>+ {t.label}</div>
          </button>
        ))}
      </div>
    </Layout>
  )
}