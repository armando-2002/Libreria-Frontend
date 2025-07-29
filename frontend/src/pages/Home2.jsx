import React from 'react';
import { Link } from 'react-router-dom';
import libraryImage from '../assets/biblio.jpg';
import "../css/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="sidebar">
        <h2 className="app-name">BiblioSmart</h2>
        
        <nav className="main-menu">
          <ul>
            <li>
              <Link to="/login">
                <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/register">
                <i className="fas fa-user-plus"></i> Registrarse
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <div className="welcome-message">
          <h1 className="app-title">BiblioSmart</h1>
          <div className="image-container">
            <img 
              src={libraryImage} 
              alt="Biblioteca moderna" 
              className="centered-image"
            />
          </div>
          <p className="welcome-text">Bienvenido a nuestro sistema de gestión bibliotecaria</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;