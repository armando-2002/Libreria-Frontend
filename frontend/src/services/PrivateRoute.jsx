import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-spinner">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.tipo)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default PrivateRoute;