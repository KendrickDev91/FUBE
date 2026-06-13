import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexto/AuthContext'
import Login from './paginas/Login'
import Dashboard from './paginas/Dashboard'
import AdminDashboard from './paginas/AdminDashboard'
import Usuarios from './paginas/Usuarios'
import NuevoUsuario from './paginas/NuevoUsuario'
import VerUsuario from './paginas/VerUsuario'
import NuevoCaso from './paginas/NuevoCaso'
import Casos from './paginas/Casos'
import VerCaso from './paginas/VerCaso'
import NuevaSesion from './paginas/NuevaSesion'
import NuevaEvaluacionTrimestral from './paginas/NuevaEvaluacionTrimestral'


function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Cargando...</div>
  if (!usuario) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
      <Route path="/admin-dashboard" element={<RutaProtegida><AdminDashboard /></RutaProtegida>} />
      <Route path="/usuarios" element={<RutaProtegida><Usuarios /></RutaProtegida>} />
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/usuarios/nuevo" element={<RutaProtegida rolesPermitidos={['administrador', 'ceo']}><NuevoUsuario /></RutaProtegida>} />
      <Route path="/usuarios/:id" element={
      <RutaProtegida rolesPermitidos={['administrador', 'ceo']}><VerUsuario /></RutaProtegida>} />
      <Route path="/casos/nuevo" element={<RutaProtegida rolesPermitidos={['administrador', 'ceo', 'psicologa_encargada', 'psicologa']}><NuevoCaso /></RutaProtegida>} />
      <Route path="/casos" element={<RutaProtegida rolesPermitidos={['administrador', 'ceo', 'psicologa_encargada', 'psicologa', 'trabajadora_social', 'abogada']}><Casos /></RutaProtegida>} />
      <Route path="/casos/:id" element={
      <RutaProtegida rolesPermitidos={['administrador', 'ceo', 'psicologa_encargada', 'psicologa', 'trabajadora_social', 'abogada']}><VerCaso /></RutaProtegida>} />
      <Route path="/casos/:id/nueva-sesion" element={<RutaProtegida rolesPermitidos={['administrador', 'ceo', 'psicologa_encargada', 'psicologa']}><NuevaSesion /></RutaProtegida>} />
      <Route path="/casos/:id/nueva-evaluacion-trimestral" element={<RutaProtegida rolesPermitidos={['administrador', 'ceo', 'psicologa_encargada', 'psicologa']}><NuevaEvaluacionTrimestral /></RutaProtegida>} />
    </Routes>
  )
}

