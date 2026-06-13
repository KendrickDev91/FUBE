import { createContext, useState, useContext, useEffect } from 'react'
import api from '../servicios/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')
    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    }
    setCargando(false)
  }, [])

  const login = async (correo, password) => {
    const respuesta = await api.post('/auth/login/', {
      email: correo,
      password: password,
    })
    const { access } = respuesta.data
    localStorage.setItem('token', access)

    const perfil = await api.get('/usuarios/', {
      headers: { Authorization: `Bearer ${access}` }
    })
    const usuarioActual = perfil.data.find(u => u.email === correo)
    localStorage.setItem('usuario', JSON.stringify(usuarioActual))
    setUsuario(usuarioActual)
    return usuarioActual
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}