import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactElement;
  requiredRole?: string; // Rol opcional requerido para acceder a la ruta
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // Si no hay token, redirigir al login
  if (!user?.token) {
    return <Navigate to="/login" />;
  }

  // Si la ruta requiere un rol específico y el usuario no lo tiene, redirigir al dashboard
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  // Si el usuario está autenticado y tiene el rol adecuado (si se requiere), renderizar el componente hijo
  return children;
};

export default PrivateRoute;