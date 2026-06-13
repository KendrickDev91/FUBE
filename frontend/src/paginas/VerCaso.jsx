import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../componentes/Layout'
import api from '../servicios/api'

const TIPO_CASO = {
  'agresion_clara': 'Agresión clara',
  'sospecha': 'Sospecha',
  'poco_probable': 'Poco probable',
}

const ESTADO_COLORES = {
  'activo': { bg: '#dcfce7', color: '#166534' },
  'cerrado': { bg: '#f3f4f6', color: '#6b7280' },
  'derivado': { bg: '#fef3c7', color: '#92400e' },
}

export default function VerCaso() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [caso, setCaso] = useState(null)
  const [seguimientos, setSeguimientos] = useState([])
  const [personal, setPersonal] = useState([])
  const [sesiones, setSesiones] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])
  const [pestana, setPestana] = useState('nna')
  const [editando, setEditando] = useState(false)
  const [datos, setDatos] = useState({})
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [notificacion, setNotificacion] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get(`/victimas/${id}/`),
      api.get('/seguimientos/'),
      api.get('/usuarios/'),
      api.get(`/sesiones/?victima=${id}`),
      api.get(`/evaluaciones-trimestrales/?victima=${id}`),
    ]).then(([casoResp, seguimientosResp, personalResp, sesionesResp, evaluacionesResp]) => {
      setCaso(casoResp.data)
      setDatos(casoResp.data)
      setSeguimientos(seguimientosResp.data.filter(s => s.victima === parseInt(id)))
      setPersonal(personalResp.data)
      setSesiones(sesionesResp.data)
      setEvaluaciones(evaluacionesResp.data)

      const notif = sessionStorage.getItem('notificacion_agente')
      if (notif) {
        setNotificacion(notif)
        sessionStorage.removeItem('notificacion_agente')
        setPestana('sesiones')
      }
    }).catch(console.error)
      .finally(() => setCargando(false))
  }, [id])

  const getNombrePersonal = (personalId) => {
    const p = personal.find(p => p.id === personalId)
    return p ? `${p.first_name} ${p.last_name}` : '-'
  }

  const getRolPersonal = (personalId) => {
    const p = personal.find(p => p.id === personalId)
    return p?.rol_nombre || '-'
  }

  const handleGuardar = async () => {
    setGuardando(true)
    setError('')
    try {
      await api.patch(`/victimas/${id}/`, {
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        carnet_identidad: datos.carnet_identidad,
        fecha_nacimiento: datos.fecha_nacimiento,
        genero: datos.genero,
        telefono_nna: datos.telefono_nna,
        con_quien_vive: datos.con_quien_vive,
        tipo_caso: datos.tipo_caso,
        estado_caso: datos.estado_caso,
        fecha_cierre_caso: datos.fecha_cierre_caso || null,
      })
      setCaso({ ...caso, ...datos })
      setEditando(false)
      setMensaje('Caso actualizado correctamente')
      setTimeout(() => setMensaje(''), 3000)
    } catch {
      setError('Error al actualizar el caso')
    } finally {
      setGuardando(false)
    }
  }

  const inputStyle = () => ({
    width: '100%', boxSizing: 'border-box',
    padding: '9px 12px', border: '1.5px solid #e5e7eb',
    borderRadius: '8px', fontSize: '14px',
    outline: 'none', background: '#f9fafb',
  })

  const campo = (label, key, tipo = 'text') => (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      {editando ? (
        <input type={tipo} value={datos[key] || ''} onChange={e => setDatos(p => ({ ...p, [key]: e.target.value }))} style={inputStyle()} />
      ) : (
        <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500', padding: '2px 0' }}>{caso[key] || '-'}</div>
      )}
    </div>
  )

  const getNivelColor = (valor) => {
    if (valor <= 3) return { color: '#ef4444', bg: '#fef2f2', label: 'Mala' }
    if (valor <= 6) return { color: '#f59e0b', bg: '#fefce8', label: 'Buena' }
    return { color: '#22c55e', bg: '#f0fdf4', label: 'Muy buena' }
  }

  const getColorNotif = (texto) => {
    if (!texto) return { color: '#f59e0b', bg: '#fefce8', border: '#fde68a' }
    if (texto.includes('crítica') || texto.includes('urgentemente')) return { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' }
    if (texto.includes('exitosa') || texto.includes('Continuar')) return { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' }
    return { color: '#f59e0b', bg: '#fefce8', border: '#fde68a' }
  }

  const TRIMESTRE_LABEL = {
    1: 'Primer trimestre',
    2: 'Segundo trimestre',
    3: 'Tercer trimestre',
    4: 'Cuarto trimestre',
  }

  const PESTANAS = [
    { key: 'nna', label: 'NNA' },
    { key: 'fube', label: 'FUBE' },
    { key: 'sesiones', label: 'Evaluaciones por sesión' },
    { key: 'trimestral', label: 'Evaluación trimestral' },
  ]

  if (cargando) return <Layout><div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Cargando...</div></Layout>
  if (!caso) return <Layout><div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Caso no encontrado</div></Layout>

  const estadoColor = ESTADO_COLORES[caso.estado_caso] || { bg: '#f3f4f6', color: '#6b7280' }
  const colorNotif = getColorNotif(notificacion)

  return (
    <Layout>
      {/* Notificación agente reactivo */}
      {notificacion && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px',
          maxWidth: '400px', zIndex: 1000,
          background: colorNotif.bg,
          border: `1.5px solid ${colorNotif.border}`,
          borderRadius: '12px', padding: '1.25rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>🤖</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: colorNotif.color, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recomendación del agente reactivo
                </div>
                <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
                  {notificacion}
                </div>
              </div>
            </div>
            <button onClick={() => setNotificacion(null)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '18px', color: '#9ca3af', flexShrink: 0, padding: 0,
            }}>✕</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/casos')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '13px', padding: 0, marginBottom: '8px' }}>
            ← Volver a casos
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f2d5e', margin: 0 }}>
                Caso {caso.numero_caso}
              </h1>
              <span style={{
                fontSize: '12px', padding: '4px 12px', borderRadius: '20px',
                fontWeight: '600', background: estadoColor.bg, color: estadoColor.color,
              }}>{caso.estado_caso}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {editando ? (
                <>
                  <button onClick={() => setEditando(false)} style={{
                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                    fontWeight: '600', cursor: 'pointer', border: '1.5px solid #e5e7eb',
                    background: 'transparent', color: '#6b7280',
                  }}>Cancelar</button>
                  <button onClick={handleGuardar} disabled={guardando} style={{
                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                    fontWeight: '600', cursor: 'pointer', border: 'none',
                    background: '#0f2d5e', color: '#fff',
                  }}>{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
                </>
              ) : (
                <button onClick={() => setEditando(true)} style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', border: 'none',
                  background: '#0f2d5e', color: '#fff',
                }}>Editar caso</button>
              )}
            </div>
          </div>
        </div>

        {mensaje && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem', fontSize: '13px', color: '#166534' }}>
            {mensaje}
          </div>
        )}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem', fontSize: '13px', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {/* Pestañas */}
        <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem', background: '#f3f4f6', borderRadius: '10px', padding: '4px' }}>
          {PESTANAS.map(p => (
            <button key={p.key} onClick={() => setPestana(p.key)} style={{
              flex: 1, padding: '9px 12px', border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              background: pestana === p.key ? '#fff' : 'transparent',
              color: pestana === p.key ? '#0f2d5e' : '#6b7280',
              boxShadow: pestana === p.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}>{p.label}</button>
          ))}
        </div>

        {/* Pestaña NNA */}
        {pestana === 'nna' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: '#0f2d5e', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: '700', flexShrink: 0,
              }}>
                {(caso.nombres?.[0] || 'N').toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                  {caso.nombres} {caso.apellidos}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  CI: {caso.carnet_identidad} · {caso.edad_actual} años
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              {campo('Nombres', 'nombres')}
              {campo('Apellidos', 'apellidos')}
              {campo('Carnet de identidad', 'carnet_identidad')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              {campo('Fecha de nacimiento', 'fecha_nacimiento', 'date')}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Género</label>
                {editando ? (
                  <select value={datos.genero || ''} onChange={e => setDatos(p => ({ ...p, genero: e.target.value }))} style={inputStyle()}>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                ) : (
                  <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{caso.genero || '-'}</div>
                )}
              </div>
              {campo('Teléfono', 'telefono_nna')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              {campo('Con quién vive', 'con_quien_vive')}
            </div>
          </div>
        )}

        {/* Pestaña FUBE */}
        {pestana === 'fube' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Información del caso</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Número de caso</label>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f2d5e', background: '#eff6ff', padding: '8px 12px', borderRadius: '8px', display: 'inline-block' }}>
                  {caso.numero_caso}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tipo de caso</label>
                {editando ? (
                  <select value={datos.tipo_caso || ''} onChange={e => setDatos(p => ({ ...p, tipo_caso: e.target.value }))} style={inputStyle()}>
                    <option value="agresion_clara">Agresión clara</option>
                    <option value="sospecha">Sospecha</option>
                    <option value="poco_probable">Poco probable</option>
                  </select>
                ) : (
                  <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{TIPO_CASO[caso.tipo_caso] || caso.tipo_caso}</div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fecha de ingreso</label>
                <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{caso.fecha_ingreso || '-'}</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fecha cierre de caso</label>
                {editando ? (
                  <input type="date" value={datos.fecha_cierre_caso || ''} onChange={e => setDatos(p => ({ ...p, fecha_cierre_caso: e.target.value }))} style={inputStyle()} />
                ) : (
                  <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{caso.fecha_cierre_caso || 'Sin fecha de cierre'}</div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estado</label>
                {editando ? (
                  <select value={datos.estado_caso || ''} onChange={e => setDatos(p => ({ ...p, estado_caso: e.target.value }))} style={inputStyle()}>
                    <option value="activo">Activo</option>
                    <option value="cerrado">Cerrado</option>
                    <option value="derivado">Derivado</option>
                  </select>
                ) : (
                  <span style={{ fontSize: '13px', padding: '4px 12px', borderRadius: '20px', fontWeight: '600', background: estadoColor.bg, color: estadoColor.color }}>
                    {caso.estado_caso}
                  </span>
                )}
              </div>
            </div>
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1.25rem' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personal asignado</h3>
              {seguimientos.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>No hay personal asignado</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {seguimientos.map(s => (
                    <div key={s.id} style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '1rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0f2d5e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>
                        {(getNombrePersonal(s.personal)?.[0] || 'P').toUpperCase()}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{getNombrePersonal(s.personal)}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{getRolPersonal(s.personal)}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Desde: {s.fecha_asignacion}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pestaña Sesiones */}
        {pestana === 'sesiones' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f2d5e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Evaluaciones por sesión ({sesiones.length})
              </h3>
              <button onClick={() => navigate(`/casos/${id}/nueva-sesion`)} style={{
                background: '#0f2d5e', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
                fontWeight: '600', cursor: 'pointer',
              }}>+ Nueva sesión</button>
            </div>
            {sesiones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No hay sesiones registradas aún</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sesiones.map(s => {
                  const nivelEscucha = getNivelColor(s.escala_escucha)
                  const nivelImportancia = getNivelColor(s.escala_importancia)
                  return (
                    <div key={s.id} style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f2d5e' }}>Sesión #{s.numero_sesion}</span>
                          <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '10px' }}>{s.fecha}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Psicóloga: {getNombrePersonal(s.psicologa)}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                        <div style={{ background: nivelEscucha.bg, borderRadius: '8px', padding: '10px 14px', border: `1px solid ${nivelEscucha.color}30` }}>
                          <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>ESCUCHA</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '22px', fontWeight: '800', color: nivelEscucha.color }}>{s.escala_escucha}</span>
                            <span style={{ fontSize: '12px', color: nivelEscucha.color, fontWeight: '600' }}>{nivelEscucha.label}</span>
                          </div>
                        </div>
                        <div style={{ background: nivelImportancia.bg, borderRadius: '8px', padding: '10px 14px', border: `1px solid ${nivelImportancia.color}30` }}>
                          <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>IMPORTANCIA</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '22px', fontWeight: '800', color: nivelImportancia.color }}>{s.escala_importancia}</span>
                            <span style={{ fontSize: '12px', color: nivelImportancia.color, fontWeight: '600' }}>{nivelImportancia.label}</span>
                          </div>
                        </div>
                      </div>
                      {s.recomendacion_agente && (
                        <div style={{ background: '#fff', borderRadius: '8px', padding: '10px 14px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#374151' }}>
                          <span style={{ fontWeight: '600', color: '#0f2d5e' }}>🤖 Agente: </span>
                          {s.recomendacion_agente}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Pestaña Trimestral */}
        {pestana === 'trimestral' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f2d5e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Evaluaciones trimestrales ({evaluaciones.length})
              </h3>
              <button onClick={() => navigate(`/casos/${id}/nueva-evaluacion-trimestral`)} style={{
                background: '#0f2d5e', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
                fontWeight: '600', cursor: 'pointer',
              }}>+ Nueva evaluación</button>
            </div>
            {evaluaciones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                No hay evaluaciones trimestrales registradas aún
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {evaluaciones.map(e => (
                  <div key={e.id} style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f2d5e' }}>
                          {TRIMESTRE_LABEL[e.trimestre]} {e.anio}
                        </span>
                        <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '10px' }}>{e.fecha}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        Psicóloga: {getNombrePersonal(e.psicologa)}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {[
                        { label: 'Terapeuta', valor: e.puntaje_total_terapeuta },
                        { label: 'Cuidador/a', valor: e.puntaje_total_cuidador },
                        { label: 'NNA', valor: e.puntaje_total_nna },
                      ].map((p, i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: '8px', padding: '10px 14px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>{p.label}</div>
                          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f2d5e' }}>{p.valor}</div>
                          <div style={{ fontSize: '11px', color: '#9ca3af' }}>puntos</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}