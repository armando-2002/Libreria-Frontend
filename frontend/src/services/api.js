// src/api/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Elimina la barra final para consistencia

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json', // Default para todas las peticiones
  },
});

// Interceptor para requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para responses (manejo centralizado de errores)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    try {
      const response = await api.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Override solo para login
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error de autenticación');
    }
  },

  register: async (userData) => {
    try {
      // Asegura que el ID sea número (requerimiento de tu backend)
      const payload = {
        ...userData,
        id: parseInt(userData.id),
      };

      const response = await api.post('/auth/', payload);
      return response.data;
    } catch (error) {
      // Manejo específico para errores 422 (validación)
      if (error.response?.status === 422) {
        const details = error.response.data.detail;
        const messages = details.map(d => `${d.loc[1]}: ${d.msg}`).join('\n');
        throw new Error(`Error de validación:\n${messages}`);
      }
      throw new Error(error.response?.data?.detail || 'Error en el registro');
    }
  },
};

export default api;