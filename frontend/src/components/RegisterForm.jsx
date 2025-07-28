import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    ciudad: '',
    tipo: 'ALUMNO',
    telefono_padres: '',
    departamento: ''
  });
  
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const success = await register(formData);
    if (success) {
      navigate('/login', { state: { registrationSuccess: true } });
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <h2>Registro de Usuario</h2>
        {error && <div className="auth-error-message">{error}</div>}
        
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
                min="1"
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
          
          {/* Resto de los campos del formulario */}
          {/* ... (similar a los ejemplos anteriores) ... */}
          
          <button type="submit" className="auth-submit-button">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;