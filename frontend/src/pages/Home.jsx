import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Bienvenido a la Biblioteca</h1>
      <p>Por favor regístrate para continuar</p>
      <Link to="/login" className="login-link">Iinicar sesion</Link>
      <Link to="/register" className="register-link">
        Ir al Registro
      </Link>
    </div>
  );
};

export default HomePage;