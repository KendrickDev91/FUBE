import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [verPassword, setVerPassword] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validarCorreo = (email) => email.endsWith('@fube.bolivia.org')

  const handleLogin = async (e) => {
  e.preventDefault()
  setError('')
  if (!validarCorreo(correo)) {
    setError('El correo debe tener el formato nombre@fube.bolivia.org')
    return
  }
  setCargando(true)
  try {
    const usuario = await login(correo, password)
    if (!usuario) {
      setError('Correo o contraseña incorrectos')
      return
    }
    if (usuario.rol_nombre === 'administrador') {
      navigate('/admin-dashboard')
    } else {
      navigate('/dashboard')
    }
  } catch {
    setError('Correo o contraseña incorrectos')
  } finally {
    setCargando(false)
  }
}

  const IconoOjo = ({ visible }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {visible ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </>
      )}
    </svg>
  )

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 36px 10px 28px',
    border: 'none',
    borderBottom: '1.5px solid rgba(255,255,255,0.5)',
    fontSize: '14px',
    outline: 'none',
    color: '#fff',
    background: 'transparent',
    transition: 'border-color 0.2s',
    fontWeight: '500',
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      position: 'fixed', top: 0, left: 0,
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .login-card {
          animation: cardIn 0.5s ease forwards;
          transition: transform 0.3s ease, box-shadow 0.3s ease !important;
        }
        .login-card:hover {
          transform: scale(1.014) !important;
          box-shadow: 0 0 70px rgba(120,190,255,0.4), 0 10px 40px rgba(0,0,0,0.4) !important;
        }
        input::placeholder { color: rgba(255,255,255,0.7) !important; font-size: 14px !important; }
        input { color: #fff !important; font-size: 14px !important; }
        input:-webkit-autofill { -webkit-text-fill-color: #fff !important; -webkit-box-shadow: 0 0 0px 1000px transparent inset !important; }
      `}</style>

      <img src="/fondo1.png" alt="" style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        display: 'block',
      }}/>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(20,40,100,0.35)',
      }}/>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '1rem', gap: '1rem',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <img src="/logo.png" alt="Logo FUBE" style={{
            height: '65px', objectFit: 'contain',
          }}/>
          <p style={{
            fontSize: '10px', color: '#fff',
            margin: '5px 0 0', letterSpacing: '0.14em',
            textTransform: 'uppercase', fontWeight: '700',
          }}>Sistema de evaluaciones psicológicas</p>
        </div>

        {/* Tarjeta compacta */}
        <div className="login-card" style={{
          width: '100%', maxWidth: '360px',
          background: 'rgba(10,30,90,0.5)',
          border: '1.5px solid rgba(255,255,255,0.2)',
          borderRadius: '16px',
          padding: '1.5rem 1.5rem',
          backdropFilter: 'blur(20px)',
        }}>
          <h2 style={{
            fontSize: '19px', fontWeight: '800',
            color: '#fff', margin: '0 0 3px', textAlign: 'center',
            letterSpacing: '0.08em',
          }}>INICIAR SESIÓN</h2>
          <p style={{
            fontSize: '12px', color: 'rgba(255,255,255,0.85)',
            margin: '0 0 1.25rem', textAlign: 'center', fontWeight: '500',
          }}>Cuenta institucional FUBE</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '0', top: '11px' }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                type="email"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                placeholder="Correo electrónico"
                required
                style={{
                  ...inputStyle,
                  borderBottomColor: correo && !validarCorreo(correo) ? '#f87171' : 'rgba(255,255,255,0.5)',
                }}
                onFocus={e => e.target.style.borderBottomColor = '#fff'}
                onBlur={e => e.target.style.borderBottomColor = correo && !validarCorreo(correo) ? '#f87171' : 'rgba(255,255,255,0.5)'}
              />
              {correo && !validarCorreo(correo) && (
                <p style={{ fontSize: '11px', color: '#f87171', margin: '3px 0 0' }}>
                  Debe terminar en @fube.bolivia.org
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '0', top: '11px' }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type={verPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderBottomColor = '#fff'}
                onBlur={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
              />
              <button type="button" onClick={() => setVerPassword(!verPassword)} style={{
                position: 'absolute', right: '0', top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', padding: '4px',
                display: 'flex', alignItems: 'center',
              }}>
                <IconoOjo visible={verPassword} />
              </button>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.18)',
                border: '1px solid rgba(239,68,68,0.35)',
                borderRadius: '7px', padding: '7px 11px',
                marginBottom: '10px', fontSize: '12px', color: '#fca5a5',
              }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={cargando}
              style={{
                width: '100%', padding: '11px',
                background: 'rgba(255,255,255,0.14)',
                color: '#fff', border: '1.5px solid rgba(255,255,255,0.6)',
                borderRadius: '9px', fontSize: '14px', fontWeight: '800',
                cursor: cargando ? 'not-allowed' : 'pointer',
                letterSpacing: '0.1em', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!cargando) { e.target.style.background = 'rgba(255,255,255,0.24)'; e.target.style.borderColor = '#fff' }}}
              onMouseLeave={e => { if (!cargando) { e.target.style.background = 'rgba(255,255,255,0.14)'; e.target.style.borderColor = 'rgba(255,255,255,0.6)' }}}
            >{cargando ? 'Ingresando...' : 'INGRESAR'}</button>
          </form>

          <div style={{
            marginTop: '1rem', paddingTop: '0.875rem',
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}>
            <p style={{
              fontSize: '12px', color: 'rgba(255,255,255,0.85)',
              textAlign: 'center', marginBottom: '8px',
            }}>¿Eres NNA? Ingresa con tu código de acceso</p>
            <input
              type="text"
              placeholder="Código de acceso"
              style={{
                ...inputStyle,
                textAlign: 'center', letterSpacing: '0.2em',
                paddingLeft: '14px', paddingRight: '14px',
              }}
              onFocus={e => e.target.style.borderBottomColor = '#fff'}
              onBlur={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
            />
            <button style={{
              marginTop: '8px', width: '100%', padding: '10px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '9px', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', color: '#fff', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = '#fff' }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(255,255,255,0.3)' }}
            >Acceder con código</button>
          </div>
        </div>

        {/* Texto institucional AFUERA y grande */}
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <p style={{
            fontSize: '16px', color: '#fff',
            lineHeight: '1.7', margin: '0 0 4px',
            fontStyle: 'italic', fontWeight: '600',
            textShadow: '0 1px 8px rgba(0,0,0,0.6)',
          }}>
            "Trabajando juntos por la seguridad, sanidad y bienestar de los niños, niñas y adolescentes de Bolivia."
          </p>
          <span style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.8)',
            letterSpacing: '0.05em', fontWeight: '600',
          }}>FUBE · Cochabamba, Bolivia</span>
        </div>

        <p style={{
          fontSize: '12px', color: 'rgba(255,255,255,0.5)',
          textAlign: 'center', margin: 0,
        }}>FUBE © 2026 · Todos los derechos reservados</p>
      </div>
    </div>
  )
}