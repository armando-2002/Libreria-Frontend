import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';
import api from '../services/api';
import '../css/HomePage.css';
import logo from '../assets/logo.png';


const HomePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await api.get(`/users/${user.id}/stats`);
        setUserStats(response.data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    if (user?.id) {
      fetchUserStats();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }

  return (
    <div className="home-container">
      {/* Sidebar con opciones */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Menú</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/libros" className="nav-item">
            <i className="fas fa-book"></i> Todos los Libros
          </Link>
          <Link to="/mis-libros" className="nav-item">
            <i className="fas fa-book-open"></i> Mis Libros
          </Link>
          <Link to="/prestamos" className="nav-item">
            <i className="fas fa-list-ul"></i> Préstamos
          </Link>
          <Link to="/historial-ejemplar" className="nav-item">
            <i className="fas fa-history"></i> Historial por Ejemplar
          </Link>
          <Link to="/multas" className="nav-item">
            <i className="fas fa-exclamation-circle"></i> Multas
          </Link>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        {/* Header con nombre de app y usuario */}
        <header className="main-header">
          <div className="header-center">
            <h1 className="app-title">BiblioSmart</h1>
          </div>
          <div className="user-info">
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Cerrar sesión
            </button>
          </div>
        </header>

        {/* Contenido central - Dashboard inicial */}
        <div className="content-area">
          <div className="dashboard-welcome">
            <h2>Bienvenido</h2>
            <p>Selecciona una opción del menú para comenzar</p>
            {/* Agrega esta línea para la imagen */}
    <img 
      src={logo} // Cambia esto por la ruta correcta
      alt="Ilustración de bienvenida" 
      className="welcome-image"
    />
            <div className="dashboard-stats">
              {userStats && (
                <>
                  <div className="stat-card">
                    <h3>Préstamos activos</h3>
                    <p>{userStats.active_loans}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Libros leídos</h3>
                    <p>{userStats.books_read}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Multas</h3>
                    <p>{userStats.penalties}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;