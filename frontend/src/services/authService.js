// authService.js
import api from './api';

export const login = async (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  params.append('grant_type', 'password');

  try {
    const response = await api.post('/auth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Guardar el token en localStorage
    localStorage.setItem('access_token', response.data.access_token);
    
    return response.data;
  } catch (error) {
    console.error('Error de autenticación:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/', userData);
    return response.data;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
};

export const getCurrentUser = () => {
  // Implementa esto según cómo manejes los datos del usuario
  // Podrías decodificar el token JWT para obtener la info del usuario
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  // Decodificar el token (sin verificar, solo para frontend)
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};