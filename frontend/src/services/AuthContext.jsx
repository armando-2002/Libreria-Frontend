/*import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from './api'; // Ajusta la ruta según tu estructura
import api from './api'; // Importa la instancia de axios

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener información del usuario actual
  const getCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me'); // Ajusta el endpoint según tu API
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      throw error;
    }
  };

  // Verificar si hay un token guardado al cargar la aplicación
 useEffect(() => {
  const initializeAuth = async () => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    const storedUserId = localStorage.getItem('user_id');

    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Si tenemos usuario guardado, usamos esos datos
        if (storedUser && storedUserId) {
          const userData = JSON.parse(storedUser);
          setUser({
            ...userData,
            id: parseInt(storedUserId, 10) // Asegurar que id es número
          });
        } else {
          // Si no hay usuario guardado pero sí token, creamos un objeto básico
          /*const basicUser = {
            email: 'usuario@ejemplo.com', // Puedes dejar un valor por defecto
            nombre: 'Usuario',
            id: localStorage.getItem('user_id'), // Esto es crítico
            tipo: 'USUARIO'
          };*/
          /*
          try{
            const userData = await getCurrentUser();
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('user_id', userData.id);
            setUser(userData);

          }catch (error) {
            console.error('Error obteniendo usuario:', error);
            logout();
        }}
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        logout();
      }
    }
    setLoading(false);
  };

  initializeAuth();
}, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      
      console.log('Intentando login con:', username);
      
      const response = await loginUser(username, password);
      console.log('Respuesta del login:', response.data);
      
      const { access_token } = response.data;
      
      // Guardar token
      localStorage.setItem('access_token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Obtener información del usuario
      try {
        const userData = await getCurrentUser();
        
        // Guardar datos del usuario
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        console.log('Login exitoso, usuario:', userData);
        return { success: true, user: userData };
        
      } catch (userError) {
        console.error('Error obteniendo datos del usuario:', userError);
        
        // Si no se puede obtener el usuario, usar información básica
        const basicUserInfo = {
          email: username,
          nombre: 'Usuario',
          id: null, // Esto causará problemas con los préstamos
          tipo: 'DESCONOCIDO'
        };
        
        localStorage.setItem('user', JSON.stringify(basicUserInfo));
        setUser(basicUserInfo);
        
        return { 
          success: true, 
          user: basicUserInfo,
          warning: 'No se pudo obtener información completa del usuario'
        };
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Error al iniciar sesión';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Cerrando sesión...');
    logoutUser(); // Llama al método del api.js
    
    // Limpiar localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    // Limpiar headers de axios
    delete api.defaults.headers.common['Authorization'];
    
    // Limpiar estado
    setUser(null);
  };

  // Verificar autenticación (útil para rutas protegidas)
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('access_token');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: isAuthenticated()
  };

  console.log('AuthContext state:', { user, loading, isAuthenticated: isAuthenticated() });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
*/
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from './api';
import api from './api';

const AuthContext = createContext();

// Función para decodificar token JWT
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub,
      nombre: payload.nombre || 'Usuario',
      email: payload.email,
      tipo: payload.tipo || 'USUARIO'
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Función para verificar expiración del token
const isTokenExpired = (token) => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        try {
          if (isTokenExpired(token)) {
            throw new Error('Token expirado');
          }

          const tokenData = decodeToken(token);
          if (!tokenData) throw new Error('Token inválido');

          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          const userData = {
            ...storedUser,
            ...tokenData,
            id: tokenData.id || storedUser.id
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
        } catch (error) {
          console.error('Error inicializando auth:', error);
          await logout();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await loginUser(username, password);
      const { access_token, user_id } = response.data;
      
      const tokenData = decodeToken(access_token);
      if (!tokenData) throw new Error('Token inválido');

      const userData = {
        id: user_id || tokenData.id,
        email: username,
        nombre: tokenData.nombre || response.data.user?.nombre || 'Usuario',
        apellido1: response.data.user?.apellido1 || '',
        apellido2: response.data.user?.apellido2 || '',
        tipo: tokenData.tipo || response.data.user?.tipo || 'USUARIO'
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };
      
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas';
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      logoutUser();
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const tokenData = decodeToken(token);
    if (!tokenData) return;

    const updatedUser = { ...user, ...tokenData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    return !!user && !!token && !isTokenExpired(token);
  };

  const getUserId = () => user?.id;

  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: isAuthenticated(),
    getUserId,
    updateUser,
    refreshUserData,
    token: localStorage.getItem('access_token')
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="auth-loading">
          {/* Tu spinner de carga */}
        </div>
      )}
    </AuthContext.Provider>
  );
};
