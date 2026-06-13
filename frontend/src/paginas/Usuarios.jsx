import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../componentes/Layout'
import api from '../servicios/api'

const AREAS = ['Todos', 'Legal', 'Psicología', 'Social', 'Administrativa', 'Deshabilitados']

const ROL_DISPLAY = {
  'administrador': 'Administrador',
  'ceo': 'CEO / Coordinadora',
  'psicologa_encargada': 'Psicóloga Encargada',
  'psicologa': 'Psicóloga',
  'trabajadora_social': 'Trabajadora Social',
  'abogada': 'Abogada',
}

const ROL_AREA = {
  'administrador': 'Administrativa',
  'ceo': 'Administrativa',
  'psicologa_encargada': 'Psicología',
  'psicologa': 'Psicología',
  'trabajadora_social': 'Social',
  'abogada': 'Legal',
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/usuarios/')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  const usuariosFiltrados = usuarios.filter(u => {
    if (filtro === 'Todos') return true
    if (filtro === 'Deshabilitados') return u.estado === 'inactivo'
    return ROL_AREA[u.rol_nombre] === filtro && u.estado === 'activo'
  })

  return (
    <Layout>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 4px' }}>
            Administración de usuarios
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Visualiza todos los usuarios en FUBE organizados por sus respectivas áreas
          </p>
        </div>
        <button
          onClick={() => navigate('/usuarios/nuevo')}
          style={{
            background: '#0f2d5e', color: '#fff',
            border: 'none', borderRadius: '8px',
            padding: '10px 18px', fontSize: '14px',
            fontWeight: '600', cursor: 'pointer',
          }}
        >+ Crear usuario</button>
      </div>

      {/* Filtros */}
      <div style={{
        display: 'flex', gap: '4px', marginBottom: '1.5rem',
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: '10px', padding: '4px', width: 'fit-content',
      }}>
        {AREAS.map(area => (
          <button
            key={area}
            onClick={() => setFiltro(area)}
            style={{
              padding: '7px 16px', border: 'none', borderRadius: '7px',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer',
              background: filtro === area ? '#0f2d5e' : 'transparent',
              color: filtro === area ? '#fff' : '#6b7280',
              transition: 'all 0.2s',
            }}
          >{area}</button>
        ))}
      </div>

      {/* Tabla */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '1px solid #e5e7eb', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Usuario', 'Correo', 'Rol', 'Área', 'Estado', ''].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: '12px', color: '#6b7280', fontWeight: '600',
                  borderBottom: '1px solid #e5e7eb',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Cargando...</td></tr>
            ) : usuariosFiltrados.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No hay usuarios en esta categoría</td></tr>
            ) : (
              usuariosFiltrados.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: '#e0f2fe', color: '#0369a1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: '700',
                      }}>
                        {(u.first_name?.[0] || 'U').toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '500', color: '#111827' }}>
                        {u.first_name} {u.last_name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', color: '#111827', fontWeight: '500' }}>
                    {ROL_DISPLAY[u.rol_nombre] || u.rol_nombre || '-'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                    {ROL_AREA[u.rol_nombre] || '-'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '12px', padding: '3px 10px', borderRadius: '20px',
                      background: u.estado === 'activo' ? '#dcfce7' : '#fee2e2',
                      color: u.estado === 'activo' ? '#166534' : '#dc2626',
                      fontWeight: '500',
                    }}>{u.estado === 'activo' ? 'Activo' : 'Inactivo'}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => navigate(`/usuarios/${u.id}`)}
                      style={{
                        background: 'transparent', border: '1px solid #e5e7eb',
                        borderRadius: '6px', padding: '5px 12px',
                        fontSize: '12px', cursor: 'pointer', color: '#374151',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f2d5e'; e.currentTarget.style.color = '#0f2d5e' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151' }}
                    >Ver usuario</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}