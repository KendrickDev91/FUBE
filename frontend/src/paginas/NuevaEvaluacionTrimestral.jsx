import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../componentes/Layout'
import api from '../servicios/api'

const INDICADORES = {
  comportamiento: {
    titulo: 'A) Efectos en el comportamiento',
    tipo: 'checkbox_tres_columnas',
    items: [
      { id: 1, texto: 'Golpeas/pegas a los demás cuando estás enojado/a', inverso: false },
      { id: 2, texto: 'Peleas todo el tiempo con los demás', inverso: false },
      { id: 3, texto: 'Te has escapado de casa / (otro lugar)', inverso: false },
      { id: 4, texto: 'Problemas en la escuela/trabajo', inverso: false },
      { id: 5, texto: 'Evitas personas, lugares, cosas o sensaciones relacionados al trauma', inverso: false },
      { id: 6, texto: 'Lastimas tu cuerpo (autolesiones)', inverso: false },
      { id: 7, texto: 'Puedes expresar libremente tus emociones', inverso: true },
      { id: 8, texto: 'Confías en otros muy rápido/límites inapropiados', inverso: false },
      { id: 9, texto: 'Discutes todo el tiempo con los demás', inverso: false },
      { id: 10, texto: 'Usas palabrotas (palabras groseras)', inverso: false },
      { id: 11, texto: 'Tienes ganas de llorar todo el tiempo', inverso: false },
      { id: 12, texto: 'Puedes mentir con facilidad', inverso: false },
      { id: 13, texto: 'Actúas como alguien más joven en relación a tu edad (regresiones)', inverso: false },
      { id: 14, texto: 'Tienes relaciones sexuales, sin protección o con personas que recién conoces', inverso: false },
      { id: 15, texto: 'Levantaste algo que no era tuyo (robar)', inverso: false },
      { id: 16, texto: 'Haces rabietas (terquedad)', inverso: false },
      { id: 17, texto: 'Tienes miedo de perder a tus seres queridos (Dificultad con separación/apegos)', inverso: false },
      { id: 18, texto: 'No escuchas y eres indiferente con los demás', inverso: false },
      { id: 19, texto: 'Rompes las cosas cuando estás enojado', inverso: false },
      { id: 20, texto: 'Tienes ataques de ira', inverso: false },
      { id: 21, texto: 'Tienes problemas para hacer tus necesidades en el baño (control de esfínteres / estreñimiento, diarrea)', inverso: false },
      { id: 22, texto: 'Te alejas de los demás (familia, amigos/as)', inverso: false },
      { id: 23, texto: 'Has intentado suicidarte', inverso: false },
      { id: 24, texto: 'Tienes problemas alimenticios (no quiero comer, atracones, vómitos)', inverso: false },
      { id: 25, texto: 'Uso drogas, alcohol, cigarrillos', inverso: false },
      { id: 26, texto: 'No me siento capaz de relacionarme con los demás', inverso: false },
    ]
  },
  cuerpo: {
    titulo: 'B) Efectos en el cuerpo',
    tipo: 'checkbox_tres_columnas',
    items: [
      { id: 1, texto: 'Cuando pienso en lo que me pasó, siento que vuelvo a sentirlo en mi cuerpo', inverso: false },
      { id: 2, texto: 'Me asusto fácilmente', inverso: false },
      { id: 3, texto: 'Siento temblor en mi cuerpo', inverso: false },
      { id: 4, texto: 'Tengo problemas para dormir', inverso: false },
      { id: 5, texto: 'Me siento con baja energía', inverso: false },
      { id: 6, texto: 'Siento tensión muscular en alguna parte de mi cuerpo', inverso: false },
      { id: 7, texto: 'Estoy siempre alerta, vigilante/actitud defensiva, de que alguien me haga daño', inverso: false },
      { id: 8, texto: 'Tienes ataques de pánico (miedo extremo)', inverso: false },
      { id: 9, texto: 'Siento que no puedo quedarme quieto mucho tiempo (Hiperactividad)', inverso: false },
      { id: 10, texto: 'Tengo pesadillas', inverso: false },
      { id: 11, texto: 'Me siento desconectado/a de mi cuerpo (disociación)', inverso: false },
      { id: 12, texto: 'Tengo dolor de cabeza', inverso: false },
      { id: 13, texto: 'Siento que no puedo coordinar los movimientos de algunas partes de mi cuerpo', inverso: false },
      { id: 14, texto: 'Tengo disminución o pérdida de la motricidad fina o gruesa', inverso: false },
      { id: 15, texto: 'Siento que no tengo fuerza en mis brazos y piernas', inverso: false },
      { id: 16, texto: 'Me siento sucia asqueada o rota', inverso: false },
      { id: 17, texto: 'Tengo dolor de estómago o náusea', inverso: false },
      { id: 18, texto: 'Me gusta salir a altas horas de la noche', inverso: false },
    ]
  },
  emocional: {
    titulo: 'C) Efectos en la vida emocional (sentirse)',
    tipo: 'checkbox_tres_columnas',
    items: [
      { id: 1, texto: 'Me siento Culpable de lo que me pasó', inverso: false },
      { id: 2, texto: 'Me siento Enojada/o todo el tiempo', inverso: false },
      { id: 3, texto: 'No logro disfrutar de las cosas que antes disfrutaba', inverso: false },
      { id: 4, texto: 'Me siento Avergonzada/o', inverso: false },
      { id: 5, texto: 'Me siento Rechazada/o, por los demás', inverso: false },
      { id: 6, texto: 'Me siento Indefensa/o y vulnerable', inverso: false },
      { id: 7, texto: 'Siempre estoy Nerviosa/o, ansiedad', inverso: false },
      { id: 8, texto: 'Me siento Triste todo el tiempo', inverso: false },
      { id: 9, texto: 'Tengo muchas preocupaciones', inverso: false },
      { id: 10, texto: 'Me siento Traicionada/o', inverso: false },
      { id: 11, texto: 'Me siento diferente a los demás', inverso: false },
      { id: 12, texto: 'Me enojo fácilmente', inverso: false },
      { id: 13, texto: 'Me siento Deprimida/o', inverso: false },
      { id: 14, texto: 'Reacciono fácilmente, soy irritable', inverso: false },
      { id: 15, texto: 'No me preocupo por los demás', inverso: false },
      { id: 16, texto: 'No tengo esperanza en el futuro', inverso: false },
      { id: 17, texto: 'Me siento Humillada/o', inverso: false },
    ]
  },
  cognitivo: {
    titulo: 'D) Efectos en los procesos cognitivos',
    tipo: 'checkbox_tres_columnas',
    items: [
      { id: 1, texto: '"Todos pueden hacerme daño"', inverso: false },
      { id: 2, texto: '"El mundo es un lugar malo"', inverso: false },
      { id: 3, texto: 'Tengo dificultades para concentrarme', inverso: false },
      { id: 4, texto: 'Pienso que nada bueno va a pasar', inverso: false },
      { id: 5, texto: 'Pienso mucho tiempo en lo que me pasó', inverso: false },
      { id: 6, texto: 'No confío en los demás', inverso: false },
      { id: 7, texto: 'No recuerdo algunas cosas sobre lo que me pasó', inverso: false },
      { id: 8, texto: '"Soy mala/o"', inverso: false },
      { id: 9, texto: 'Siempre pienso en la seguridad de mis seres queridos', inverso: false },
      { id: 10, texto: 'Pienso mucho en quitarme la vida (suicidio)', inverso: false },
      { id: 11, texto: 'Aparecen en mi mente imágenes de lo que me pasó (Memorias/flashbacks)', inverso: false },
      { id: 12, texto: '"Es mi culpa"', inverso: false },
      { id: 13, texto: 'Evito/reprimo pensar en lo que me pasó (trauma)', inverso: false },
      { id: 14, texto: 'Surgen pensamientos sobre lo que me pasó durante el día (trauma)', inverso: false },
    ]
  },
  relaciones_familia: {
    titulo: 'E) Relaciones con mi familia y pares',
    tipo: 'tres_opciones',
    columnas: ['Casi siempre', 'Rara vez', 'Casi nunca'],
    items: [
      { id: 1, texto: 'Me relaciono bien con mi familia', inverso: false },
      { id: 2, texto: 'Puedo hablar con mis padres de mis problemas', inverso: false },
      { id: 3, texto: 'Compartimos momentos lindos/recreativos en familia', inverso: false },
      { id: 4, texto: 'Siento que mi familia me apoya', inverso: false },
      { id: 5, texto: 'Me gusta pasar tiempo con mi familia', inverso: false },
      { id: 6, texto: 'Soy importante para mi familia - mis opiniones son valoradas', inverso: false },
      { id: 7, texto: 'Me relaciono bien con mis pares en FUBE o en la Escuela', inverso: false },
      { id: 8, texto: 'Me gusta decidir por mí misma/o y no dejo que otros decidan por mí', inverso: false },
      { id: 9, texto: 'Comparto mis emociones y opiniones con facilidad', inverso: false },
      { id: 10, texto: 'Relación con otras niñas, niños y adolescentes en mi colegio', inverso: false },
      { id: 11, texto: 'Siento que no puedo confiar en nadie', inverso: true },
      { id: 12, texto: 'Siento que todos quieren hacerme daño', inverso: true },
    ]
  },
  nutricion_sueno: {
    titulo: 'F) Nutrición física y sueño',
    tipo: 'tres_opciones',
    columnas: ['Casi siempre', 'Rara vez', 'Casi nunca'],
    items: [
      { id: 1, texto: 'Después de comer me dan ganas de vomitar y vomito', inverso: false },
      { id: 2, texto: 'Me da ansiedad cuando tengo que comer', inverso: false },
      { id: 3, texto: 'Boto y escondo comida', inverso: false },
      { id: 4, texto: 'Otra gente se preocupa de cómo y cuánto como', inverso: false },
      { id: 5, texto: 'Uso bebidas alcohólicas o drogas', inverso: false },
      { id: 6, texto: 'Hago actividades físicas como deporte-baile-yoga, etc', inverso: true },
    ]
  },
  autoestima: {
    titulo: 'H) Autoestima (Rosenberg)',
    tipo: 'escala_4',
    columnas: ['Muy de acuerdo (4)', 'De acuerdo (3)', 'No estoy de acuerdo ni en desacuerdo (0)', 'En desacuerdo (2)', 'Muy en desacuerdo (1)'],
    valores: [4, 3, 0, 2, 1],
    items: [
      { id: 1, texto: 'Siento que soy una persona digna de aprecio, al menos en igual medida que los demás', inverso: false },
      { id: 2, texto: 'Estoy convencida/o de que tengo buenas cualidades', inverso: false },
      { id: 3, texto: 'Soy capaz de hacer las cosas tan bien como la mayoría de la gente', inverso: false },
      { id: 4, texto: 'Tengo una actitud positiva hacia mí misma/o', inverso: false },
      { id: 5, texto: 'En general estoy satisfecha/o de mí misma/o', inverso: false },
      { id: 6, texto: 'Siento que no tengo mucho de lo que estar orgullosa/o', inverso: true },
      { id: 7, texto: 'En general, me inclino a pensar que soy una fracasada/o', inverso: true },
      { id: 8, texto: 'Me gustaría poder sentir más respeto por mí misma/o', inverso: true },
      { id: 9, texto: 'Hay veces que realmente pienso que soy inútil', inverso: true },
      { id: 10, texto: 'A veces creo que no soy una persona buena', inverso: true },
    ]
  },
  autoeficacia: {
    titulo: 'I) Auto Eficacia (Chen, Gully y Eden, 2001)',
    tipo: 'escala_4',
    columnas: ['Muy de acuerdo (4)', 'De acuerdo (3)', 'No estoy de acuerdo ni en desacuerdo (0)', 'En desacuerdo (2)', 'Muy en desacuerdo (1)'],
    valores: [4, 3, 0, 2, 1],
    items: [
      { id: 1, texto: 'Podré lograr la mayoría de las metas que me he propuesto', inverso: false },
      { id: 2, texto: 'Al enfrentar tareas difíciles, estoy seguro/a de que las cumpliré', inverso: false },
      { id: 3, texto: 'En general, creo que puedo obtener resultados que son importantes para mí', inverso: false },
      { id: 4, texto: 'Creo que puedo tener éxito en la mayoría de los esfuerzos que me proponga', inverso: false },
      { id: 5, texto: 'Podré superar con éxito muchos desafíos', inverso: false },
      { id: 6, texto: 'Estoy seguro/a de que puedo desempeñarme con eficacia en muchas tareas diferentes', inverso: false },
      { id: 7, texto: 'Comparado con otras personas, puedo hacer muy bien la mayoría de las tareas', inverso: false },
      { id: 8, texto: 'Incluso cuando las cosas se ponen difíciles, puedo desempeñarme bastante bien', inverso: false },
    ]
  },
}

const QUIEN_RESPONDE = ['terapeuta', 'cuidador', 'nna']
const QUIEN_LABEL = { terapeuta: 'Terapeuta', cuidador: 'Cuidador/a', nna: 'NNA' }

export default function NuevaEvaluacionTrimestral() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [caso, setCaso] = useState(null)
  const [psicologas, setPsicologas] = useState([])
  const [psicologa, setPsicologa] = useState('')
  const [trimestre, setTrimestre] = useState('')
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [seccionActual, setSeccionActual] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const secciones = Object.keys(INDICADORES)

  useEffect(() => {
    api.get(`/victimas/${id}/`).then(res => setCaso(res.data)).catch(console.error)
    api.get('/usuarios/').then(res => {
      setPsicologas(res.data.filter(u => ['psicologa', 'psicologa_encargada'].includes(u.rol_nombre) && u.estado === 'activo'))
    }).catch(console.error)

    const respInicial = {}
    Object.entries(INDICADORES).forEach(([seccion, data]) => {
      data.items.forEach(item => {
        QUIEN_RESPONDE.forEach(quien => {
          respInicial[`${seccion}_${item.id}_${quien}`] = null
        })
      })
    })
    setRespuestas(respInicial)
  }, [id])

  const setRespuesta = (seccion, itemId, quien, valor) => {
    setRespuestas(prev => ({ ...prev, [`${seccion}_${itemId}_${quien}`]: valor }))
  }

  const getRespuesta = (seccion, itemId, quien) => {
    return respuestas[`${seccion}_${itemId}_${quien}`]
  }

  const calcularPuntaje = (quien) => {
    let total = 0
    Object.entries(INDICADORES).forEach(([seccion, data]) => {
      data.items.forEach(item => {
        const val = respuestas[`${seccion}_${item.id}_${quien}`]
        if (val === null || val === undefined) return
        if (item.inverso) {
          total += val === 1 ? 0 : 1
        } else {
          total += val
        }
      })
    })
    return total
  }

  const handleGuardar = async () => {
    if (!psicologa || !trimestre) { setError('Debes seleccionar psicóloga y trimestre'); return }
    setCargando(true)
    setError('')
    try {
      const evalResp = await api.post('/evaluaciones-trimestrales/', {
        victima: parseInt(id),
        psicologa: parseInt(psicologa),
        trimestre: parseInt(trimestre),
        anio,
        puntaje_total_terapeuta: calcularPuntaje('terapeuta'),
        puntaje_total_cuidador: calcularPuntaje('cuidador'),
        puntaje_total_nna: calcularPuntaje('nna'),
      })

      const evalId = evalResp.data.id
      const promesas = []

      Object.entries(INDICADORES).forEach(([seccion, data]) => {
        data.items.forEach(item => {
          promesas.push(api.post('/respuestas-indicadores/', {
            evaluacion: evalId,
            seccion,
            numero_indicador: item.id,
            indicador: item.texto,
            es_inverso: item.inverso,
            valor_terapeuta: respuestas[`${seccion}_${item.id}_terapeuta`],
            valor_cuidador: respuestas[`${seccion}_${item.id}_cuidador`],
            valor_nna: respuestas[`${seccion}_${item.id}_nna`],
          }))
        })
      })

      await Promise.all(promesas)
      navigate(`/casos/${id}`)
    } catch (err) {
      setError('Error al guardar la evaluación')
      console.error(err.response?.data)
    } finally {
      setCargando(false)
    }
  }

  const seccionKey = secciones[seccionActual]
  const seccionData = INDICADORES[seccionKey]

  const renderCheckboxTresColumnas = () => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: '600', fontSize: '12px', width: '40%' }}>Indicador</th>
            {QUIEN_RESPONDE.map(q => (
              <th key={q} colSpan={2} style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#0f2d5e', fontWeight: '600', fontSize: '12px', borderLeft: '1px solid #e5e7eb' }}>
                {QUIEN_LABEL[q]}
              </th>
            ))}
          </tr>
          <tr style={{ background: '#f8fafc' }}>
            <th style={{ borderBottom: '2px solid #e5e7eb' }}></th>
            {QUIEN_RESPONDE.map(q => (
              <>
                <th key={`${q}_si`} style={{ padding: '6px 12px', textAlign: 'center', borderBottom: '2px solid #e5e7eb', color: '#22c55e', fontWeight: '700', fontSize: '12px', borderLeft: '1px solid #e5e7eb' }}>Sí</th>
                <th key={`${q}_no`} style={{ padding: '6px 12px', textAlign: 'center', borderBottom: '2px solid #e5e7eb', color: '#ef4444', fontWeight: '700', fontSize: '12px' }}>No</th>
              </>
            ))}
          </tr>
        </thead>
        <tbody>
          {seccionData.items.map((item, idx) => (
            <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '10px 14px', color: '#374151', lineHeight: '1.5' }}>
                {item.inverso && <span style={{ fontSize: '10px', background: '#dbeafe', color: '#1d4ed8', padding: '1px 6px', borderRadius: '4px', marginRight: '6px', fontWeight: '600' }}>INVERSO</span>}
                {item.texto}
              </td>
              {QUIEN_RESPONDE.map(quien => (
                <>
                  <td key={`${quien}_si`} style={{ padding: '10px 12px', textAlign: 'center', borderLeft: '1px solid #e5e7eb' }}>
                    <input
                      type="radio"
                      name={`${seccionKey}_${item.id}_${quien}`}
                      checked={getRespuesta(seccionKey, item.id, quien) === 1}
                      onChange={() => setRespuesta(seccionKey, item.id, quien, 1)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#22c55e' }}
                    />
                  </td>
                  <td key={`${quien}_no`} style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <input
                      type="radio"
                      name={`${seccionKey}_${item.id}_${quien}`}
                      checked={getRespuesta(seccionKey, item.id, quien) === 0}
                      onChange={() => setRespuesta(seccionKey, item.id, quien, 0)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ef4444' }}
                    />
                  </td>
                </>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderTresOpciones = () => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: '600', fontSize: '12px', width: '50%' }}>Indicador</th>
            {seccionData.columnas.map(col => (
              <th key={col} style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#0f2d5e', fontWeight: '600', fontSize: '12px' }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {seccionData.items.map((item, idx) => (
            <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '10px 14px', color: '#374151', lineHeight: '1.5' }}>
                {item.inverso && <span style={{ fontSize: '10px', background: '#dbeafe', color: '#1d4ed8', padding: '1px 6px', borderRadius: '4px', marginRight: '6px', fontWeight: '600' }}>INVERSO</span>}
                {item.texto}
              </td>
              {[2, 1, 0].map(val => (
                <td key={val} style={{ padding: '10px 14px', textAlign: 'center' }}>
                  <input
                    type="radio"
                    name={`${seccionKey}_${item.id}_nna`}
                    checked={getRespuesta(seccionKey, item.id, 'nna') === val}
                    onChange={() => setRespuesta(seccionKey, item.id, 'nna', val)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0f2d5e' }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderEscala4 = () => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: '600', fontSize: '12px', width: '40%' }}>Indicador</th>
            {seccionData.columnas.map((col, i) => (
              <th key={i} style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#0f2d5e', fontWeight: '600', fontSize: '11px', maxWidth: '80px' }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {seccionData.items.map((item, idx) => (
            <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '10px 14px', color: '#374151', lineHeight: '1.5' }}>{item.texto}</td>
              {seccionData.valores.map(val => (
                <td key={val} style={{ padding: '10px 8px', textAlign: 'center' }}>
                  <input
                    type="radio"
                    name={`${seccionKey}_${item.id}_nna`}
                    checked={getRespuesta(seccionKey, item.id, 'nna') === val}
                    onChange={() => setRespuesta(seccionKey, item.id, 'nna', val)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0f2d5e' }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <Layout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <button onClick={() => navigate(`/casos/${id}`)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '13px', padding: 0, marginBottom: '8px' }}>
            ← Volver al caso
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 4px' }}>
            Nueva evaluación trimestral
          </h1>
          {caso && (
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              {caso.nombres} {caso.apellidos} · Caso {caso.numero_caso}
            </p>
          )}
        </div>

        {/* Datos generales */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos de la evaluación</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Psicóloga</label>
              <select value={psicologa} onChange={e => setPsicologa(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#f9fafb' }}>
                <option value="">Seleccionar...</option>
                {psicologas.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Trimestre</label>
              <select value={trimestre} onChange={e => setTrimestre(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#f9fafb' }}>
                <option value="">Seleccionar...</option>
                <option value="1">Primer trimestre</option>
                <option value="2">Segundo trimestre</option>
                <option value="3">Tercer trimestre</option>
                <option value="4">Cuarto trimestre</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Año</label>
              <input type="number" value={anio} onChange={e => setAnio(parseInt(e.target.value))}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#f9fafb' }} />
            </div>
          </div>
        </div>

        {/* Navegación de secciones */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {secciones.map((sec, i) => (
            <button key={sec} onClick={() => setSeccionActual(i)} style={{
              padding: '8px 14px', border: 'none', borderRadius: '8px', whiteSpace: 'nowrap',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              background: seccionActual === i ? '#0f2d5e' : '#e5e7eb',
              color: seccionActual === i ? '#fff' : '#6b7280',
              transition: 'all 0.2s',
            }}>
              {INDICADORES[sec].titulo.split(')')[0]})
            </button>
          ))}
        </div>

        {/* Sección actual */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f2d5e', margin: '0 0 1.25rem' }}>
            {seccionData.titulo}
          </h3>
          {seccionData.tipo === 'checkbox_tres_columnas' && renderCheckboxTresColumnas()}
          {seccionData.tipo === 'tres_opciones' && renderTresOpciones()}
          {seccionData.tipo === 'escala_4' && renderEscala4()}
        </div>

        {/* Puntajes parciales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1rem' }}>
          {QUIEN_RESPONDE.map(quien => (
            <div key={quien} style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>{QUIEN_LABEL[quien]}</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f2d5e' }}>{calcularPuntaje(quien)}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>puntos acumulados</div>
            </div>
          ))}
        </div>

        {/* Navegación entre secciones */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
          <button onClick={() => setSeccionActual(Math.max(0, seccionActual - 1))}
            disabled={seccionActual === 0}
            style={{
              flex: 1, padding: '12px', background: 'transparent',
              border: '1.5px solid #e5e7eb', borderRadius: '8px',
              fontSize: '14px', fontWeight: '600',
              cursor: seccionActual === 0 ? 'not-allowed' : 'pointer',
              color: '#6b7280', opacity: seccionActual === 0 ? 0.5 : 1,
            }}>
            ← Sección anterior
          </button>
          {seccionActual < secciones.length - 1 ? (
            <button onClick={() => setSeccionActual(seccionActual + 1)}
              style={{ flex: 1, padding: '12px', background: '#0f2d5e', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#fff' }}>
              Sección siguiente →
            </button>
          ) : (
            <button onClick={handleGuardar} disabled={cargando}
              style={{
                flex: 1, padding: '12px',
                background: cargando ? '#93c5fd' : '#0f2d5e',
                border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600',
                cursor: cargando ? 'not-allowed' : 'pointer',
                color: '#fff',
              }}>
              {cargando ? 'Guardando...' : 'Guardar evaluación trimestral ✓'}
            </button>
          )}
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626' }}>
            {error}
          </div>
        )}
      </div>
    </Layout>
  )
}