import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Importa tu configuración de Axios
import { getCurrentUser } from '../services/authService';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Aquí asumo que tienes un endpoint /users/{id} en tu backend
        const response = await api.get(`/users/${currentUser.id}`);
        setUserData(response.data);
      } catch (err) {
        setError('Error al cargar los datos del usuario');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Panel de Control</h1>
        <button onClick={handleLogout} className="btn btn-danger">
          Cerrar Sesión
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Información del Usuario</h2>
        </div>
        <div className="card-body">
          {userData && (
            <div className="row">
              <div className="col-md-6">
                <p><strong>Nombre:</strong> {userData.nombre} {userData.apellido1} {userData.apellido2}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Tipo de usuario:</strong> {userData.tipo}</p>
              </div>
              <div className="col-md-6">
                {userData.tipo === 'ALUMNO' && (
                  <p><strong>Teléfono padres:</strong> {userData.telefono_padres}</p>
                )}
                {userData.tipo === 'PROFESOR' && (
                  <p><strong>Departamento:</strong> {userData.departamento}</p>
                )}
                <p><strong>Ciudad:</strong> {userData.ciudad}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Secciones adicionales según el tipo de usuario */}
      {userData?.tipo === 'ALUMNO' && (
        <div className="card mt-4">
          <div className="card-header">
            <h2>Mis Cursos</h2>
          </div>
          <div className="card-body">
            {/* Aquí iría la lista de cursos del alumno */}
            <p>Contenido específico para alumnos...</p>
          </div>
        </div>
      )}

      {userData?.tipo === 'PROFESOR' && (
        <div className="card mt-4">
          <div className="card-header">
            <h2>Mis Clases</h2>
          </div>
          <div className="card-body">
            {/* Aquí iría la lista de clases del profesor */}
            <p>Contenido específico para profesores...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;