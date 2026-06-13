import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'
import api from '../servicios/api'

export default function Dashboard() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [victimas, setVictimas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api.get('/victimas/')
      .then(res => setVictimas(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0' }}>
      <nav style={{
        background: '#fff',
        borderBottom: '0.5px solid #e0e0d8',
        padding: '0 2rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px', fontWeight: '500' }}>FUBE</span>
          <span style={{ fontSize: '12px', color: '#888', background: '#EEEDFE', color: '#3C3489', padding: '2px 8px', borderRadius: '6px' }}>
            {usuario?.rol}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
          <span style={{ color: '#666' }}>{usuario?.username}</span>
          <button onClick={handleLogout} style={{
            background: 'transparent',
            border: '0.5px solid #e0e0d8',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: 'pointer',
            color: '#444'
          }}>Cerrar sesión</button>
        </div>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '500', margin: 0 }}>Mis casos</h1>
          <button
            onClick={() => navigate('/victimas/nuevo')}
            style={{
              background: '#534AB7',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}>
            + Nuevo caso
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '2rem' }}>
          {[
            { label: 'casos activos', valor: victimas.filter(v => v.estado === 'activo').length },
            { label: 'casos cerrados', valor: victimas.filter(v => v.estado === 'cerrado').length },
            { label: 'casos derivados', valor: victimas.filter(v => v.estado === 'derivado').length },
            { label: 'total casos', valor: victimas.length },
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: '10px',
              border: '0.5px solid #e0e0d8',
              padding: '1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', fontWeight: '500' }}>{stat.valor}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #e0e0d8', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid #e0e0d8', fontSize: '14px', fontWeight: '500' }}>
            Lista de casos
          </div>
          {cargando ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Cargando...</div>
          ) : victimas.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
              No hay casos registrados aún.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f5f5f0' }}>
                  {['N° caso', 'Nombre', 'Tipo de caso', 'Estado', 'Fecha ingreso', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: '500' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {victimas.map(v => (
                  <tr key={v.id} style={{ borderTop: '0.5px solid #e0e0d8' }}>
                    <td style={{ padding: '12px 16px' }}>{v.numero_caso}</td>
                    <td style={{ padding: '12px 16px' }}>{v.nombre} {v.apellido}</td>
                    <td style={{ padding: '12px 16px' }}>{v.tipo_caso}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '12px',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        background: v.estado === 'activo' ? '#E1F5EE' : v.estado === 'cerrado' ? '#F1EFE8' : '#FAEEDA',
                        color: v.estado === 'activo' ? '#085041' : v.estado === 'cerrado' ? '#444441' : '#633806',
                      }}>{v.estado}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#888' }}>{v.fecha_ingreso}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => navigate(`/victimas/${v.id}`)}
                        style={{
                          background: 'transparent',
                          border: '0.5px solid #e0e0d8',
                          borderRadius: '6px',
                          padding: '4px 12px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}>Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}