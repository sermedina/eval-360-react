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
import PendingEvaluations from './components/PendingEvaluations'
import EvaluationDetail from './components/EvaluationDetail'

function App() {
  const { user } = useAuth(); 



  return (
    <div className="flex h-screen">
    {/* Mostramos el Header solo si el usuario está logueado */}
    {user?.token && <Header />}
  
    {/* Contenido principal */}
    <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 dark:text-white overflow-y-auto">
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
  
        {/* Rutas privadas */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/employees" element={<PrivateRoute requiredRole="admin"><Employees /></PrivateRoute>} />
        <Route path="/evaluations" element={<PrivateRoute requiredRole="admin"><Evaluations /></PrivateRoute>} />
        <Route path="/evaluation" element={<PrivateRoute requiredRole="employee"><EvaluationForm /></PrivateRoute>} />
        <Route path="/" element={<PendingEvaluations />} />
        <Route path="/evaluations/:id" element={<EvaluationDetail />} />
      </Routes>
    </main>
  </div>
  );
}

export default App
