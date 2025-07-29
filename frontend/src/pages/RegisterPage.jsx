import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../css/registro.css';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    email: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    ciudad: '',
    tipo: 'ALUMNO',
    telefono_padres: '',
    departamento: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.id) newErrors.id = 'ID es requerido';
    if (!formData.password) newErrors.password = 'Contraseña es requerida';
    if (!formData.email) newErrors.email = 'Email es requerido';
    if (!formData.nombre) newErrors.nombre = 'Nombre es requerido';
    if (!formData.apellido1) newErrors.apellido1 = 'Primer apellido es requerido';
    
    if (formData.tipo === 'ALUMNO' && !formData.telefono_padres) {
      newErrors.telefono_padres = 'Teléfono de padres es requerido para alumnos';
    }
    
    if (formData.tipo === 'PROFESOR' && !formData.departamento) {
      newErrors.departamento = 'Departamento es requerido para profesores';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validate()) return;
  
  setIsSubmitting(true);

  try {
    // Asegurar que el tipo esté en mayúsculas
    const userType = formData.tipo.toUpperCase();
    
    const payload = {
      ...formData,
      id: parseInt(formData.id, 10),
      tipo: userType, // Forzar mayúsculas
      telefono_padres: userType === 'ALUMNO' ? formData.telefono_padres : null,
      departamento: userType === 'PROFESOR' ? formData.departamento : null
    };

    const response = await registerUser(payload);
    alert('¡Registro exitoso!');
    navigate('/');
  } catch (error) {
    console.error('Error en registro:', error);
    
    // Mostrar mejor el mensaje de error
    const errorMessage = error.response?.data?.detail || 
                        (typeof error.response?.data === 'object' ? 
                         JSON.stringify(error.response.data) : 
                         'Error al registrar. Por favor intente nuevamente.');
    
    alert(`Error: ${errorMessage}`);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="register-container">
      <h1>Registro de Usuario</h1>
      
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-section">
          <h2>Información Básica</h2>
          
          <div className="form-group">
            <label>ID*</label>
            <input
              type="number"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className={errors.id ? 'input-error' : ''}
            />
            {errors.id && <span className="error-message">{errors.id}</span>}
          </div>

          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Información Personal</h2>
          
          <div className="form-group">
            <label>Nombre*</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? 'input-error' : ''}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label>Primer Apellido*</label>
            <input
              type="text"
              name="apellido1"
              value={formData.apellido1}
              onChange={handleChange}
              className={errors.apellido1 ? 'input-error' : ''}
            />
            {errors.apellido1 && <span className="error-message">{errors.apellido1}</span>}
          </div>

          <div className="form-group">
            <label>Segundo Apellido</label>
            <input
              type="text"
              name="apellido2"
              value={formData.apellido2}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ciudad</label>
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Tipo de Usuario</h2>
          
          <div className="form-group">
            <label>Tipo*</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={(e) =>{
                handleChange({
                  target:{
                    name:e.target.name,
                    value:e.target.value
                  }
                });
              }}

            >
              <option value="ALUMNO">Alumno</option>
              <option value="PROFESOR">Profesor</option>
            </select>
          </div>

          {formData.tipo === 'ALUMNO' && (
            <div className="form-group">
              <label>Teléfono de Padres*</label>
              <input
                type="text"
                name="telefono_padres"
                value={formData.telefono_padres}
                onChange={handleChange}
                className={errors.telefono_padres ? 'input-error' : ''}
              />
              {errors.telefono_padres && (
                <span className="error-message">{errors.telefono_padres}</span>
              )}
            </div>
          )}

          {formData.tipo === 'PROFESOR' && (
            <div className="form-group">
              <label>Departamento*</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className={errors.departamento ? 'input-error' : ''}
              />
              {errors.departamento && (
                <span className="error-message">{errors.departamento}</span>
              )}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Registrando...' : 'Completar Registro'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;