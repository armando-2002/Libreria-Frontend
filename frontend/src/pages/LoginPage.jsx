/*import React from 'react';

import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Iniciar Sesión</h1>
        <LoginForm />
        <div className="register-link">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;*/
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import libraryImage from '../assets/biblio.jpg';
import '../css/LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      {/* Fondo de pantalla completo */}
      <div 
        className="background-image" 
        style={{ backgroundImage: `url(${libraryImage})` }}
      />
      
      {/* Contenido centrado */}
      <div className="login-content">
        <div className="app-header">
          <h1>BiblioSmart</h1>
          <p>Sistema de Gestión Bibliotecaria</p>
        </div>
        
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          <LoginForm />
          <div className="register-link">
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;