import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../componentes/Layout'
import api from '../servicios/api'

const CARAS = ['😢', '😢', '😢', '😢', '😐', '😐', '😐', '😊', '😊', '😊', '😊']
const COLORES = ['#ef4444', '#ef4444', '#ef4444', '#ef4444', '#f59e0b', '#f59e0b', '#f59e0b', '#22c55e', '#22c55e', '#22c55e', '#22c55e']

const getNivel = (valor) => {
  if (valor <= 3) return { label: 'Mala', color: '#ef4444', bg: '#fef2f2' }
  if (valor <= 6) return { label: 'Buena', color: '#f59e0b', bg: '#fefce8' }
  return { label: 'Muy buena', color: '#22c55e', bg: '#f0fdf4' }
}

export default function NuevaSesion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [caso, setCaso] = useState(null)
  const [psicologas, setPsicologas] = useState([])
  const [escucha, setEscucha] = useState(5)
  const [importancia, setImportancia] = useState(5)
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [psicologa, setPsicologa] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/victimas/${id}/`).then(res => setCaso(res.data)).catch(console.error)
    api.get('/usuarios/').then(res => {
      setPsicologas(res.data.filter(u => ['psicologa', 'psicologa_encargada'].includes(u.rol_nombre) && u.estado === 'activo'))
    }).catch(console.error)
  }, [id])

  const handleGuardar = async () => {
    if (!psicologa) { setError('Debes seleccionar una psicóloga'); return }
    setCargando(true)
    setError('')
    try {
      const resp = await api.post('/sesiones/', {
        victima: parseInt(id),
        psicologa: parseInt(psicologa),
        fecha,
        escala_escucha: escucha,
        escala_importancia: importancia,
      })
      const recomendacion = resp.data.recomendacion_agente
      sessionStorage.setItem('notificacion_agente', recomendacion)
      navigate(`/casos/${id}`)
    } catch (err) {
      setError('Error al guardar la sesión')
      console.error(err.response?.data)
    } finally {
      setCargando(false)
    }
  }

  const EscalaCaras = ({ titulo, descripcionMin, descripcionMax, valor, onChange }) => {
    const nivel = getNivel(valor)
    return (
      <div style={{
        background: '#f8fafc', borderRadius: '12px',
        border: '1px solid #e5e7eb', padding: '1.5rem',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f2d5e', margin: 0 }}>{titulo}</h3>
          <span style={{
            fontSize: '13px', fontWeight: '600', padding: '4px 12px',
            borderRadius: '20px', background: nivel.bg, color: nivel.color,
          }}>{nivel.label}</span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '64px', lineHeight: 1 }}>{CARAS[valor]}</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: COLORES[valor], marginTop: '4px' }}>{valor}</div>
        </div>
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <input
            type="range" min="0" max="10" step="1"
            value={valor}
            onChange={e => onChange(parseInt(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: COLORES[valor] }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
            <span key={n} style={{
              fontSize: '12px', fontWeight: n === valor ? '700' : '400',
              color: n === valor ? COLORES[valor] : '#9ca3af', cursor: 'pointer',
            }} onClick={() => onChange(n)}>{n}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: '#9ca3af', maxWidth: '120px' }}>{descripcionMin}</span>
          <span style={{ fontSize: '11px', color: '#9ca3af', maxWidth: '120px', textAlign: 'right' }}>{descripcionMax}</span>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <button onClick={() => navigate(`/casos/${id}`)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '13px', padding: 0, marginBottom: '8px' }}>
            ← Volver al caso
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 4px' }}>
            Nueva evaluación de sesión
          </h1>
          {caso && (
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              {caso.nombres} {caso.apellidos} · Caso {caso.numero_caso}
            </p>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos de la sesión</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Fecha de la sesión</label>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#f9fafb' }}
                onFocus={e => e.target.style.borderColor = '#0f2d5e'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Psicóloga</label>
              <select value={psicologa} onChange={e => setPsicologa(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#f9fafb', cursor: 'pointer' }}>
                <option value="">Seleccionar...</option>
                {psicologas.map(p => (
                  <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <EscalaCaras
          titulo="ESCUCHAR"
          descripcionMin="No me escuchó ni le importó lo que tenía que decir"
          descripcionMax="Me escuchó"
          valor={escucha}
          onChange={setEscucha}
        />

        <EscalaCaras
          titulo="IMPORTANCIA"
          descripcionMin="Lo que hicimos y hablamos no fue importante para mí"
          descripcionMax="Lo que hicimos y hablamos fue importante para mí"
          valor={importancia}
          onChange={setImportancia}
        />

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem', fontSize: '13px', color: '#dc2626' }}>
            {error}
          </div>
        )}

        <button onClick={handleGuardar} disabled={cargando} style={{
          width: '100%', padding: '13px',
          background: cargando ? '#93c5fd' : '#0f2d5e',
          color: '#fff', border: 'none', borderRadius: '8px',
          fontSize: '15px', fontWeight: '600',
          cursor: cargando ? 'not-allowed' : 'pointer',
        }}>{cargando ? 'Guardando...' : 'Guardar evaluación de sesión ✓'}</button>
      </div>
    </Layout>
  )
}