import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../componentes/Layout'
import api from '../servicios/api'

export default function NuevoCaso() {
  const navigate = useNavigate()
  const [pestana, setPestana] = useState('nna')
  const [personal, setPersonal] = useState([])
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const hoy = new Date().toISOString().split('T')[0]
  const haceUnaSemana = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [datos, setDatos] = useState({
    tipo_caso: '',
    fecha_ingreso: hoy,
    fecha_cierre_caso: '',
    estado_caso: 'activo',
    nombres: '',
    apellidos: '',
    carnet_identidad: '',
    fecha_nacimiento: '',
    telefono_nna: '',
    con_quien_vive: '',
    genero: '',
    recepcionado_por: '',
    psicologa: '',
    abogada: '',
    trabajadora_social: '',
  })

  useEffect(() => {
    api.get('/usuarios/').then(res => setPersonal(res.data)).catch(console.error)
  }, [])

  const porRol = (roles) => personal.filter(p => roles.includes(p.rol_nombre) && p.estado === 'activo')

  const handleChange = (campo, valor) => {
    setDatos(prev => ({ ...prev, [campo]: valor }))
    setErrores(prev => ({ ...prev, [campo]: '' }))
  }

  const validarNNA = () => {
    const e = {}
    if (!datos.tipo_caso) e.tipo_caso = 'Requerido'
    if (!datos.fecha_ingreso) e.fecha_ingreso = 'Requerido'
    if (!datos.nombres) e.nombres = 'Requerido'
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(datos.nombres)) e.nombres = 'Solo letras'
    if (!datos.apellidos) e.apellidos = 'Requerido'
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(datos.apellidos)) e.apellidos = 'Solo letras'
    if (!datos.carnet_identidad) e.carnet_identidad = 'Requerido'
    if (!datos.fecha_nacimiento) e.fecha_nacimiento = 'Requerido'
    if (!datos.genero) e.genero = 'Requerido'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const validarFUBE = () => {
    const e = {}
    if (!datos.recepcionado_por) e.recepcionado_por = 'Requerido'
    if (!datos.psicologa) e.psicologa = 'Requerido'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleSiguiente = () => {
    if (validarNNA()) setPestana('fube')
  }

  const handleRegistrar = async () => {
    if (!validarFUBE()) return
    setCargando(true)
    setError('')
    try {
      const respVictima = await api.post('/victimas/', {
        tipo_caso: datos.tipo_caso,
        fecha_ingreso: datos.fecha_ingreso,
        fecha_cierre_caso: datos.fecha_cierre_caso || null,
        estado_caso: datos.estado_caso,
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        carnet_identidad: datos.carnet_identidad,
        fecha_nacimiento: datos.fecha_nacimiento,
        telefono_nna: datos.telefono_nna || null,
        con_quien_vive: datos.con_quien_vive || null,
        genero: datos.genero,
      })

      const victimaId = respVictima.data.id
      const asignados = [datos.psicologa, datos.abogada, datos.trabajadora_social, datos.recepcionado_por]
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)

      await Promise.all(asignados.map(personalId =>
        api.post('/seguimientos/', { personal: personalId, victima: victimaId })
      ))

      navigate('/casos')
    } catch (err) {
      setError('Error al registrar el caso. Verifica los datos.')
      console.error(JSON.stringify(err.response?.data))
    } finally {
      setCargando(false)
    }
  }

  const campo = (label, key, tipo = 'text', placeholder = '') => (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{label}</label>
      <input
        type={tipo}
        value={datos[key]}
        onChange={e => handleChange(key, e.target.value)}
        placeholder={placeholder}
        min={tipo === 'date' && key === 'fecha_ingreso' ? haceUnaSemana : undefined}
        max={tipo === 'date' && key === 'fecha_ingreso' ? hoy : undefined}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '10px 12px',
          border: `1.5px solid ${errores[key] ? '#ef4444' : '#e5e7eb'}`,
          borderRadius: '8px', fontSize: '14px', outline: 'none',
          background: '#f9fafb', color: '#111827',
        }}
        onFocus={e => e.target.style.borderColor = '#0f2d5e'}
        onBlur={e => e.target.style.borderColor = errores[key] ? '#ef4444' : '#e5e7eb'}
      />
      {errores[key] && <p style={{ fontSize: '11px', color: '#ef4444', margin: '3px 0 0' }}>{errores[key]}</p>}
    </div>
  )

  const select = (label, key, opciones) => (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{label}</label>
      <select
        value={datos[key]}
        onChange={e => handleChange(key, e.target.value)}
        style={{
          width: '100%', padding: '10px 12px',
          border: `1.5px solid ${errores[key] ? '#ef4444' : '#e5e7eb'}`,
          borderRadius: '8px', fontSize: '14px', outline: 'none',
          background: '#f9fafb', color: datos[key] ? '#111827' : '#9ca3af',
          cursor: 'pointer',
        }}
      >
        <option value="">Seleccionar...</option>
        {opciones.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {errores[key] && <p style={{ fontSize: '11px', color: '#ef4444', margin: '3px 0 0' }}>{errores[key]}</p>}
    </div>
  )

  const selectPersonal = (label, key, roles) => {
    const opciones = porRol(roles).map(p => ({
      value: p.id,
      label: `${p.first_name} ${p.last_name}`,
    }))
    return (
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{label}</label>
        <select
          value={datos[key]}
          onChange={e => handleChange(key, e.target.value)}
          style={{
            width: '100%', padding: '10px 12px',
            border: `1.5px solid ${errores[key] ? '#ef4444' : '#e5e7eb'}`,
            borderRadius: '8px', fontSize: '14px', outline: 'none',
            background: '#f9fafb', color: datos[key] ? '#111827' : '#9ca3af',
            cursor: 'pointer',
          }}
        >
          <option value="">Seleccionar...</option>
          {opciones.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {errores[key] && <p style={{ fontSize: '11px', color: '#ef4444', margin: '3px 0 0' }}>{errores[key]}</p>}
      </div>
    )
  }

  return (
    <Layout>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/casos')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '13px', padding: 0, marginBottom: '8px' }}>
            ← Volver a casos
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 4px' }}>Registrar nuevo caso</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Completa la información de la víctima</p>
        </div>

        {/* Datos generales del caso */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos del caso</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>

            {/* Número de caso automático */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Número de caso</label>
              <div style={{
                padding: '10px 12px', background: '#f3f4f6',
                border: '1.5px solid #e5e7eb', borderRadius: '8px',
                fontSize: '13px', color: '#6b7280', fontStyle: 'italic',
              }}>
                Se genera automáticamente
              </div>
            </div>

            {select('Tipo de caso', 'tipo_caso', [
              { value: 'agresion_clara', label: 'Agresión clara' },
              { value: 'sospecha', label: 'Sospecha' },
              { value: 'poco_probable', label: 'Poco probable' },
            ])}
            {campo('Fecha de ingreso', 'fecha_ingreso', 'date')}
            {campo('Fecha cierre de caso', 'fecha_cierre_caso', 'date')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', marginTop: '1rem' }}>
            {select('Estado', 'estado_caso', [
              { value: 'activo', label: 'Activo' },
              { value: 'cerrado', label: 'Cerrado' },
              { value: 'derivado', label: 'Derivado' },
            ])}
          </div>
        </div>

        {/* Pestañas */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
          {[
            { key: 'nna', label: 'NNA' },
            { key: 'fube', label: 'FUBE' },
          ].map(p => (
            <button key={p.key}
              onClick={() => p.key === 'fube' ? handleSiguiente() : setPestana(p.key)}
              style={{
                padding: '10px 28px', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                background: pestana === p.key ? '#0f2d5e' : '#e5e7eb',
                color: pestana === p.key ? '#fff' : '#6b7280',
                transition: 'all 0.2s',
              }}
            >{p.label}</button>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          {pestana === 'nna' && (
            <>
              <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos NNA</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {campo('Nombres', 'nombres', 'text', 'Ej: María')}
                {campo('Apellidos', 'apellidos', 'text', 'Ej: García')}
                {campo('Carnet de identidad', 'carnet_identidad', 'text', 'Ej: 12345678')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {campo('Fecha de nacimiento', 'fecha_nacimiento', 'date')}
                {select('Género', 'genero', [
                  { value: 'masculino', label: 'Masculino' },
                  { value: 'femenino', label: 'Femenino' },
                  { value: 'otro', label: 'Otro' },
                ])}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {campo('Teléfono', 'telefono_nna', 'text', 'Ej: 70123456')}
                {campo('Con quién vive', 'con_quien_vive', 'text', 'Ej: Madre y hermanos')}
              </div>
              <button onClick={handleSiguiente} style={{
                width: '100%', padding: '12px', background: '#0f2d5e',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              }}>Seguir completando →</button>
            </>
          )}

          {pestana === 'fube' && (
            <>
              <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos FUBE</h3>
              <div style={{ marginBottom: '1rem' }}>
                {selectPersonal('¿Quién recepciona el caso?', 'recepcionado_por', ['psicologa', 'psicologa_encargada', 'trabajadora_social', 'abogada'])}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {selectPersonal('Psicología', 'psicologa', ['psicologa', 'psicologa_encargada'])}
                {selectPersonal('Legal', 'abogada', ['abogada'])}
                {selectPersonal('Social', 'trabajadora_social', ['trabajadora_social'])}
              </div>

              {error && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: '8px', padding: '10px 14px',
                  marginBottom: '1rem', fontSize: '13px', color: '#dc2626',
                }}>{error}</div>
              )}

              <button onClick={handleRegistrar} disabled={cargando} style={{
                width: '100%', padding: '12px',
                background: cargando ? '#93c5fd' : '#0f2d5e',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600',
                cursor: cargando ? 'not-allowed' : 'pointer',
              }}>{cargando ? 'Registrando...' : 'Registrar caso ✓'}</button>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}