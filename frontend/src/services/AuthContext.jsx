import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from './authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Aquí deberías implementar la verificación del token
          // o obtener los datos del usuario si tu backend lo permite
          setUser({ username: 'Usuario' }); // Datos temporales
        } catch (err) {
          handleLogout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const handleLogin = async (username, password) => {
    setError(null);
    try {
      const { access_token, token_type } = await apiLogin(username, password);
      localStorage.setItem('authToken', access_token);
      setToken(access_token);
      navigate('/books');
      return true;
    } catch (err) {
      setError(err.detail?.[0]?.msg || 'Credenciales incorrectas');
      return false;
    }
  };

  const handleRegister = async (userData) => {
    setError(null);
    try {
      await apiRegister({
        id: parseInt(userData.id),
        password: userData.password,
        email: userData.email,
        nombre: userData.nombre,
        apellido1: userData.apellido1,
        apellido2: userData.apellido2 || null,
        ciudad: userData.ciudad || null,
        tipo: userData.tipo,
        ...(userData.tipo === 'ALUMNO' ? { 
          telefono_padres: userData.telefono_padres 
        } : { 
          departamento: userData.departamento 
        })
      });
      navigate('/login', { state: { registrationSuccess: true } });
      return true;
    } catch (err) {
      setError(err.detail?.[0]?.msg || 'Error en el registro');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading,
      error,
      login: handleLogin, 
      register: handleRegister, 
      logout: handleLogout,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);