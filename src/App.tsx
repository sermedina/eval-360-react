import { Route, Routes } from 'react-router-dom'
import './App.css'
import  Dashboard  from './components/Dashboard'
import  Employees  from './components/Employees'
import  Profile  from './components/Profile'
import PrivateRoute from './PrivateRoute'
import Login from './components/Login'
import Header from './components/Header'
import { useAuth } from './contexts/AuthContext'
import Evaluations from './components/Evaluations'
import EvaluationForm from './components/EvaluationForm'

function App() {
  const { user } = useAuth(); 



  return (
    <div className="flex h-screen">
    {/* Mostramos el Header solo si el usuario está logueado */}
    {user?.token && <Header  />}

    {/* Contenido principal */}
    <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute requiredRole="employee"><Profile /></PrivateRoute>} />
        <Route path="/employees" element={<PrivateRoute requiredRole="admin"><Employees /></PrivateRoute>} />
        <Route path="/evaluations" element={<PrivateRoute requiredRole="admin"><Evaluations /></PrivateRoute>} />
        <Route path="/evaluation" element={<PrivateRoute requiredRole="employee"><EvaluationForm /></PrivateRoute>} />
      </Routes>
    </main>
  </div>
  );
}

export default App
