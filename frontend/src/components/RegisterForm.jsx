import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../css/registro.css';
const RegisterForm = () => {
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
    
    // Validación de campos requeridos
    if (!formData.id) newErrors.id = 'ID es requerido';
    else if (isNaN(formData.id)) newErrors.id = 'ID debe ser un número';
    
    if (!formData.password) newErrors.password = 'Contraseña es requerida';
    else if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    
    if (!formData.email) newErrors.email = 'Email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email no válido';
    
    if (!formData.nombre) newErrors.nombre = 'Nombre es requerido';
    if (!formData.apellido1) newErrors.apellido1 = 'Primer apellido es requerido';
    
    // Validaciones específicas por tipo de usuario
    if (formData.tipo === 'ALUMNO') {
      if (!formData.telefono_padres) {
        newErrors.telefono_padres = 'Teléfono de padres es requerido para alumnos';
      } else if (!/^\d{9,15}$/.test(formData.telefono_padres)) {
        newErrors.telefono_padres = 'Teléfono no válido';
      }
    }
    
    if (formData.tipo === 'PROFESOR') {
      if (!formData.departamento) {
        newErrors.departamento = 'Departamento es requerido para profesores';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);

    try {
      await registerUser(formData);
      alert('¡Registro completado con éxito!');
      navigate('/');
    } catch (error) {
      console.error('Error en registro:', error);
      alert(error.response?.data?.detail || 'Error al registrar usuario. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="register-form-container">
    <h2>Registro de Usuario</h2>
    <form onSubmit={handleSubmit}>
      {/* ID */}
      <div className="form-group">
        <label htmlFor="id">ID*</label>
        <input
          type="text"
          id="id"
          name="id"
          value={formData.id}
          onChange={handleChange}
        />
        {errors.id && <span className="error-message">{errors.id}</span>}
      </div>

      {/* Contraseña */}
      <div className="form-group">
        <label htmlFor="password">Contraseña*</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email">Email*</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      {/* Nombre */}
      <div className="form-group">
        <label htmlFor="nombre">Nombre*</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
        {errors.nombre && <span className="error-message">{errors.nombre}</span>}
      </div>

      {/* Apellido1 */}
      <div className="form-group">
        <label htmlFor="apellido1">Primer Apellido*</label>
        <input
          type="text"
          id="apellido1"
          name="apellido1"
          value={formData.apellido1}
          onChange={handleChange}
        />
        {errors.apellido1 && <span className="error-message">{errors.apellido1}</span>}
      </div>

      {/* Apellido2 */}
      <div className="form-group">
        <label htmlFor="apellido2">Segundo Apellido</label>
        <input
          type="text"
          id="apellido2"
          name="apellido2"
          value={formData.apellido2}
          onChange={handleChange}
        />
      </div>

      {/* Ciudad */}
      <div className="form-group">
        <label htmlFor="ciudad">Ciudad</label>
        <input
          type="text"
          id="ciudad"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
        />
      </div>

      {/* Tipo de usuario */}
      <div className="form-group">
        <label htmlFor="tipo">Tipo de Usuario*</label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
        >
          <option value="ALUMNO">Alumno</option>
          <option value="PROFESOR">Profesor</option>
        </select>
      </div>

      {/* Campos condicionales */}
      {formData.tipo === 'ALUMNO' && (
        <div className="form-group conditional-field">
          <label htmlFor="telefono_padres">Teléfono de Padres*</label>
          <input
            type="text"
            id="telefono_padres"
            name="telefono_padres"
            value={formData.telefono_padres}
            onChange={handleChange}
          />
          {errors.telefono_padres && <span className="error-message">{errors.telefono_padres}</span>}
        </div>
      )}

      {formData.tipo === 'PROFESOR' && (
        <div className="form-group conditional-field">
          <label htmlFor="departamento">Departamento*</label>
          <input
            type="text"
            id="departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
          />
          {errors.departamento && <span className="error-message">{errors.departamento}</span>}
        </div>
      )}

      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  </div>
);
};

export default RegisterForm;