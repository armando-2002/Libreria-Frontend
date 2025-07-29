/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
    
    if (!formData.username) newErrors.username = 'Email es requerido';
    if (!formData.password) newErrors.password = 'Contraseña es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);

    try {
      const response = await loginUser(formData.username, formData.password);
      
      // Guardar el token (ejemplo con localStorage)
      localStorage.setItem('access_token', response.data.access_token);
      
      alert('¡Inicio de sesión exitoso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
      
      let errorMessage = 'Error al iniciar sesión. Por favor intente nuevamente.';
      if (error.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'input-error' : ''}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
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

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
*/
/*
version dos
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../services/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) newErrors.username = 'Email es requerido';
    else if (!/^\S+@\S+\.\S+$/.test(formData.username)) newErrors.username = 'Email no válido';
    
    if (!formData.password) newErrors.password = 'Contraseña es requerida';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);

    try {
      const response = await loginUser(formData.username, formData.password);
      
      // Guardar el token
      localStorage.setItem('access_token', response.data.access_token);
      
      // Guardar datos del usuario en el contexto de autenticación
      login({
        email: formData.username,
        nombre: response.data.nombre || 'Usuario', // Ajusta según tu API
        // otros datos del usuario que necesites
      });
      
      // Redirigir al HomePage
      navigate('/home');
      
    } catch (error) {
      console.error('Error en login:', error);
      
      let errorMessage = 'Error al iniciar sesión. Por favor intente nuevamente.';
      if (error.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      setErrors({ apiError: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Iniciar Sesión</h2>
      {errors.apiError && (
        <div className="error-message" style={{ color: '#e74c3c', marginBottom: '1rem', textAlign: 'center' }}>
          {errors.apiError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'input-error' : ''}
            disabled={isSubmitting}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>Contraseña*</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'input-error' : ''}
            disabled={isSubmitting}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? (
            <>
              <span style={{ marginRight: '8px' }}>Iniciando sesión...</span>
              <span className="spinner" style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                borderTopColor: '#fff',
                animation: 'spin 1s ease-in-out infinite'
              }}></span>
            </>
          ) : 'Iniciar Sesión'}
        </button>
      </form>
      
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoginForm;*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) newErrors.username = 'Email es requerido';
    else if (!/^\S+@\S+\.\S+$/.test(formData.username)) newErrors.username = 'Email no válido';
    
    if (!formData.password) newErrors.password = 'Contraseña es requerida';
    //else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrors({}); // Limpiar errores previos

    try {
      // Usar la función login del contexto
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // El contexto ya maneja el token y la información del usuario
        navigate('/home');
      } else {
        setErrors({ apiError: result.error });
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      setErrors({ apiError: 'Error inesperado. Por favor intente nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Iniciar Sesión</h2>
      {errors.apiError && (
        <div className="error-message" style={{ 
          color: '#e74c3c', 
          marginBottom: '1rem', 
          textAlign: 'center',
          padding: '0.8rem',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          borderRadius: '6px',
          border: '1px solid rgba(231, 76, 60, 0.3)'
        }}>
          {errors.apiError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'input-error' : ''}
            disabled={isSubmitting}
            placeholder="Ingresa tu email"
          />
          {errors.username && (
            <span className="error-message" style={{ 
              color: '#e74c3c', 
              fontSize: '0.85rem',
              display: 'block',
              marginTop: '0.25rem'
            }}>
              {errors.username}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>Contraseña*</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'input-error' : ''}
            disabled={isSubmitting}
            placeholder="Ingresa tu contraseña"
          />
          {errors.password && (
            <span className="error-message" style={{ 
              color: '#e74c3c', 
              fontSize: '0.85rem',
              display: 'block',
              marginTop: '0.25rem'
            }}>
              {errors.password}
            </span>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? (
            <>
              <span style={{ marginRight: '8px' }}>Iniciando sesión...</span>
              <span className="spinner" style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                borderTopColor: '#fff',
                animation: 'spin 1s ease-in-out infinite'
              }}></span>
            </>
          ) : 'Iniciar Sesión'}
        </button>
      </form>
      
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .input-error {
            border-color: #e74c3c !important;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
          }
        `}
      </style>
    </div>
  );
};

export default LoginForm;