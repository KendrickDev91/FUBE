import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../componentes/Layout'
import api from '../servicios/api'

const TIPO_CASO = {
  'agresion_clara': 'Agresión clara',
  'sospecha': 'Sospecha',
  'poco_probable': 'Poco probable',
}

export default function Casos() {
  const [casos, setCasos] = useState([])
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/victimas/')
      .then(res => setCasos(res.data))
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  const casosFiltrados = casos.filter(c => {
    const coincideBusqueda =
      c.numero_caso?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.nombres?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.apellidos?.toLowerCase().includes(busqueda.toLowerCase())
    const coincideFiltro = filtro === 'todos' || c.estado_caso === filtro
    return coincideBusqueda && coincideFiltro
  })

  return (
    <Layout>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 4px' }}>
            Casos registrados
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Gestiona y da seguimiento a todos los casos NNA
          </p>
        </div>
        <button
          onClick={() => navigate('/casos/nuevo')}
          style={{
            background: '#0f2d5e', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '10px 18px',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          }}
        >+ Nuevo caso</button>
      </div>

      {/* Estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total casos', valor: casos.length, color: '#0f2d5e', bg: '#eff6ff' },
          { label: 'Activos', valor: casos.filter(c => c.estado_caso === 'activo').length, color: '#166534', bg: '#dcfce7' },
          { label: 'Cerrados', valor: casos.filter(c => c.estado_caso === 'cerrado').length, color: '#6b7280', bg: '#f3f4f6' },
          { label: 'Derivados', valor: casos.filter(c => c.estado_caso === 'derivado').length, color: '#92400e', bg: '#fef3c7' },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: '700', color: s.color }}>{s.valor}</div>
            <div style={{ fontSize: '12px', color: s.color, fontWeight: '500', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Búsqueda y filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar por código, nombre o apellido..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            flex: 1, padding: '9px 14px',
            border: '1.5px solid #e5e7eb', borderRadius: '8px',
            fontSize: '14px', outline: 'none', background: '#fff',
          }}
          onFocus={e => e.target.style.borderColor = '#0f2d5e'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
        />
        <div style={{
          display: 'flex', gap: '4px',
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: '8px', padding: '4px',
        }}>
          {[
            { value: 'todos', label: 'Todos' },
            { value: 'activo', label: 'Activo' },
            { value: 'cerrado', label: 'Cerrado' },
            { value: 'derivado', label: 'Derivado' },
          ].map(f => (
            <button key={f.value} onClick={() => setFiltro(f.value)} style={{
              padding: '6px 14px', border: 'none', borderRadius: '6px',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer',
              background: filtro === f.value ? '#0f2d5e' : 'transparent',
              color: filtro === f.value ? '#fff' : '#6b7280',
              transition: 'all 0.2s',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['N° Caso', 'NNA', 'Tipo', 'Edad', 'Estado', 'Fecha ingreso', ''].map(h => (
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
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Cargando...</td></tr>
            ) : casosFiltrados.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No hay casos registrados</td></tr>
            ) : (
              casosFiltrados.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontWeight: '700', color: '#0f2d5e',
                      background: '#eff6ff', padding: '4px 10px',
                      borderRadius: '6px', fontSize: '13px',
                    }}>{c.numero_caso}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '500', color: '#111827' }}>{c.nombres} {c.apellidos}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{c.carnet_identidad}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{TIPO_CASO[c.tipo_caso] || c.tipo_caso}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{c.edad_actual} años</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500',
                      background: c.estado_caso === 'activo' ? '#dcfce7' : c.estado_caso === 'cerrado' ? '#f3f4f6' : '#fef3c7',
                      color: c.estado_caso === 'activo' ? '#166534' : c.estado_caso === 'cerrado' ? '#6b7280' : '#92400e',
                    }}>{c.estado_caso}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{c.fecha_ingreso}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => navigate(`/casos/${c.id}`)}
                      style={{
                        background: 'transparent', border: '1px solid #e5e7eb',
                        borderRadius: '6px', padding: '5px 12px',
                        fontSize: '12px', cursor: 'pointer', color: '#374151',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f2d5e'; e.currentTarget.style.color = '#0f2d5e' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151' }}
                    >Ver caso</button>
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