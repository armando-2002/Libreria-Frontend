import React from 'react';
import { useAuth } from '../services/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h1>Bienvenido a la Biblioteca</h1>
      
      {user ? (
        <div className="authenticated-view">
          <p>Hola {user.nombre}, ¿qué te gustaría hacer hoy?</p>
          <Link to="/books" className="action-button">
            Ver catálogo de libros
          </Link>
        </div>
      ) : (
        <div className="guest-view">
          <p>Por favor inicia sesión para acceder al sistema</p>
          <div className="auth-actions">
            <Link to="/login" className="action-button">
              Iniciar sesión
            </Link>
            <Link to="/register" className="action-button secondary">
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;