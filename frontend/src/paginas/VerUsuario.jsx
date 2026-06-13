import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../componentes/Layout'
import api from '../servicios/api'

const ROLES = [
  { value: 'administrador', label: 'Administrador del sistema' },
  { value: 'ceo', label: 'CEO / Coordinadora' },
  { value: 'psicologa_encargada', label: 'Psicóloga Encargada' },
  { value: 'psicologa', label: 'Psicóloga' },
  { value: 'trabajadora_social', label: 'Trabajadora Social' },
  { value: 'abogada', label: 'Abogada' },
]

const ROL_AREA = {
  'administrador': 'Administrativa',
  'ceo': 'Administrativa',
  'psicologa_encargada': 'Psicología',
  'psicologa': 'Psicología',
  'trabajadora_social': 'Social',
  'abogada': 'Legal',
}

const PERMISOS_POR_ROL = {
  'administrador': [
    { modulo: 'Usuarios', acciones: 'Crear, editar, eliminar, ver', alcance: 'Todo el sistema' },
    { modulo: 'Casos', acciones: 'Crear, editar, eliminar, ver', alcance: 'Todos los casos' },
    { modulo: 'Evaluaciones', acciones: 'Ver', alcance: 'Todos' },
    { modulo: 'Reportes', acciones: 'Ver, exportar', alcance: 'Todos' },
  ],
  'ceo': [
    { modulo: 'Usuarios', acciones: 'Crear, editar, ver', alcance: 'Todo el sistema' },
    { modulo: 'Casos', acciones: 'Crear, editar, ver', alcance: 'Todos los casos' },
    { modulo: 'Evaluaciones', acciones: 'Ver', alcance: 'Todos' },
    { modulo: 'Reportes', acciones: 'Ver, exportar', alcance: 'Todos' },
  ],
  'psicologa_encargada': [
    { modulo: 'Casos', acciones: 'Crear, editar, ver', alcance: 'Todos los casos' },
    { modulo: 'Evaluaciones', acciones: 'Crear, editar, ver', alcance: 'Todos' },
    { modulo: 'Reportes', acciones: 'Ver, exportar', alcance: 'Todos' },
  ],
  'psicologa': [
    { modulo: 'Casos', acciones: 'Crear, editar, ver', alcance: 'Solo sus casos' },
    { modulo: 'Evaluaciones', acciones: 'Crear, editar, ver', alcance: 'Solo sus casos' },
    { modulo: 'Reportes', acciones: 'Ver, exportar', alcance: 'Solo sus casos' },
  ],
  'trabajadora_social': [
    { modulo: 'Casos', acciones: 'Ver', alcance: 'Solo sus casos asignados' },
    { modulo: 'Evaluaciones', acciones: 'Ver', alcance: 'Solo sus casos asignados' },
    { modulo: 'Reportes', acciones: 'Ver, exportar', alcance: 'Según sus filtros' },
  ],
  'abogada': [
    { modulo: 'Casos', acciones: 'Ver', alcance: 'Solo sus casos asignados' },
    { modulo: 'Evaluaciones', acciones: 'Ver', alcance: 'Solo sus casos asignados' },
    { modulo: 'Reportes', acciones: 'Ver, exportar', alcance: 'Según sus filtros' },
  ],
}

export default function VerUsuario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [editando, setEditando] = useState(false)
  const [datos, setDatos] = useState({})
  const [roles, setRoles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get(`/usuarios/${id}/`),
      api.get('/roles/'),
    ]).then(([usuarioResp, rolesResp]) => {
      setUsuario(usuarioResp.data)
      setDatos(usuarioResp.data)
      setRoles(rolesResp.data)
    }).catch(err => console.error(err))
    .finally(() => setCargando(false))
  }, [id])

  const handleGuardar = async () => {
    setGuardando(true)
    setError('')
    try {
      const rolId = roles.find(r => r.nombre_rol === datos.rol_nombre)?.id || datos.rol
      await api.patch(`/usuarios/${id}/`, {
        first_name: datos.first_name,
        last_name: datos.last_name,
        estado: datos.estado,
        rol: rolId,
      })
      setUsuario({ ...usuario, ...datos })
      setEditando(false)
      setMensaje('Usuario actualizado correctamente')
      setTimeout(() => setMensaje(''), 3000)
    } catch (err) {
      setError('Error al actualizar el usuario')
    } finally {
      setGuardando(false)
    }
  }

  const handleDesactivar = async () => {
    if (!window.confirm('¿Estás seguro de que deseas desactivar este usuario?')) return
    try {
      await api.patch(`/usuarios/${id}/`, { estado: usuario.estado === 'activo' ? 'inactivo' : 'activo' })
      setUsuario(prev => ({ ...prev, estado: prev.estado === 'activo' ? 'inactivo' : 'activo' }))
      setMensaje('Estado del usuario actualizado')
      setTimeout(() => setMensaje(''), 3000)
    } catch {
      setError('Error al cambiar el estado del usuario')
    }
  }

  if (cargando) return <Layout><div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Cargando...</div></Layout>
  if (!usuario) return <Layout><div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Usuario no encontrado</div></Layout>

  const rolNombre = usuario.rol_nombre
  const permisos = PERMISOS_POR_ROL[rolNombre] || []

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/usuarios')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '13px', padding: 0, marginBottom: '8px' }}>
            ← Volver a usuarios
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f2d5e', margin: 0 }}>
              Perfil de usuario
            </h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleDesactivar}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', border: '1.5px solid',
                  background: 'transparent',
                  borderColor: usuario.estado === 'activo' ? '#ef4444' : '#22c55e',
                  color: usuario.estado === 'activo' ? '#ef4444' : '#22c55e',
                }}
              >{usuario.estado === 'activo' ? 'Desactivar usuario' : 'Activar usuario'}</button>
              <button
                onClick={() => setEditando(!editando)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', border: 'none',
                  background: editando ? '#6b7280' : '#0f2d5e', color: '#fff',
                }}
              >{editando ? 'Cancelar' : 'Editar usuario'}</button>
            </div>
          </div>
        </div>

        {mensaje && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem',
            fontSize: '13px', color: '#166534',
          }}>{mensaje}</div>
        )}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem',
            fontSize: '13px', color: '#dc2626',
          }}>{error}</div>
        )}

        {/* Datos del usuario */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: '#0f2d5e', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: '700', flexShrink: 0,
            }}>
              {(usuario.first_name?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                {usuario.first_name} {usuario.last_name}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{usuario.email}</div>
              <span style={{
                display: 'inline-block', marginTop: '4px',
                fontSize: '11px', padding: '2px 10px', borderRadius: '20px', fontWeight: '600',
                background: usuario.estado === 'activo' ? '#dcfce7' : '#fee2e2',
                color: usuario.estado === 'activo' ? '#166534' : '#dc2626',
              }}>{usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}</span>
            </div>
          </div>

          {editando ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Nombres</label>
                  <input value={datos.first_name || ''} onChange={e => setDatos(p => ({ ...p, first_name: e.target.value }))}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Apellidos</label>
                  <input value={datos.last_name || ''} onChange={e => setDatos(p => ({ ...p, last_name: e.target.value }))}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}/>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Rol</label>
                <select value={datos.rol_nombre || ''} onChange={e => setDatos(p => ({ ...p, rol_nombre: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Estado</label>
                <select value={datos.estado || 'activo'} onChange={e => setDatos(p => ({ ...p, estado: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <button onClick={handleGuardar} disabled={guardando}
                style={{
                  width: '100%', padding: '12px', background: '#0f2d5e', color: '#fff',
                  border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                }}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Nombres', valor: usuario.first_name },
                { label: 'Apellidos', valor: usuario.last_name },
                { label: 'Correo', valor: usuario.email },
                { label: 'Rol', valor: ROLES.find(r => r.value === rolNombre)?.label || rolNombre },
                { label: 'Área', valor: ROL_AREA[rolNombre] || '-' },
                { label: 'Estado', valor: usuario.estado === 'activo' ? 'Activo' : 'Inactivo' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', marginBottom: '2px', textTransform: 'uppercase' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{item.valor}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Permisos */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 1rem' }}>
            Permisos del rol — {ROLES.find(r => r.value === rolNombre)?.label}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Módulo', 'Acciones', 'Alcance'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permisos.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 14px', fontWeight: '600', color: '#111827' }}>{p.modulo}</td>
                  <td style={{ padding: '10px 14px', color: '#374151' }}>{p.acciones}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      fontSize: '12px', padding: '3px 10px', borderRadius: '20px',
                      background: '#eff6ff', color: '#1d4ed8', fontWeight: '500',
                    }}>{p.alcance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}