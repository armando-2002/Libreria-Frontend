// RegisterPage.js
import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    password: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    ciudad: '',
    tipo: 'ALUMNO',
    telefono_padres: '',
    departamento: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Preparar datos según el tipo de usuario
      const userData = {
        id: parseInt(formData.id),
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2 || null,
        ciudad: formData.ciudad || null,
        tipo: formData.tipo
      };

      if (formData.tipo === 'ALUMNO') {
        userData.telefono_padres = formData.telefono_padres;
      } else {
        userData.departamento = formData.departamento;
      }

      const success = await register(userData);
      if (success) {
        navigate('/login');
      }
    } catch (err) {
      setError('Error al registrar el usuario');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Registro de Usuario</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>ID:</label>
              <input
                type="number"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Tipo de Usuario:</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="ALUMNO">Alumno</option>
                <option value="PROFESOR">Profesor</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Primer Apellido:</label>
              <input
                type="text"
                name="apellido1"
                value={formData.apellido1}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Segundo Apellido (opcional):</label>
            <input
              type="text"
              name="apellido2"
              value={formData.apellido2}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Ciudad (opcional):</label>
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
            />
          </div>
          
          {formData.tipo === 'ALUMNO' ? (
            <div className="form-group">
              <label>Teléfono de Padres:</label>
              <input
                type="text"
                name="telefono_padres"
                value={formData.telefono_padres}
                onChange={handleChange}
                required={formData.tipo === 'ALUMNO'}
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Departamento:</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                required={formData.tipo === 'PROFESOR'}
              />
            </div>
          )}
          
          <button type="submit" className="auth-button">
            Registrarse
          </button>
        </form>
        
        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <span onClick={() => navigate('/login')}>Inicia sesión</span></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;