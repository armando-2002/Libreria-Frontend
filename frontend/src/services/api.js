// src/api/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/', // ajusta a tu backend real
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // opcional, si usas cookies
});

// Interceptor para agregar el token automáticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // o sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores como 401 globalmente
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/*
export default {
  /*
  // 🔐 AUTENTICACIÓN
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  logout: () => API.post('/auth/logout'),

  // 👤 USUARIOS
  getUsuarios: () => API.get('/usuarios'),
  getUsuario: (id) => API.get(`/usuarios/${id}`),
  createUsuario: (data) => API.post('/usuarios', data),
  updateUsuario: (id, data) => API.put(`/usuarios/${id}`, data),
  deleteUsuario: (id) => API.delete(`/usuarios/${id}`),

  // 📚 LIBROS
  getLibros: () => API.get('/libros'),
  getLibro: (id) => API.get(`/libros/${id}`),
  createLibro: (data) => API.post('/libros', data),
  updateLibro: (id, data) => API.put(`/libros/${id}`, data),
  deleteLibro: (id) => API.delete(`/libros/${id}`),

  // 📚 EJEMPLARES
  getEjemplares: () => API.get('/ejemplares'),
  createEjemplar: (data) => API.post('/ejemplares', data),

  // 🤝 RECOMENDACIONES
  getRecomendaciones: (idLibro) => API.get(`/libros/${idLibro}/recomendaciones`),
  setRecomendaciones: (idLibro, data) => API.post(`/libros/${idLibro}/recomendaciones`, data),

  // 📖 PRÉSTAMOS
  solicitarPrestamo: (data) => API.post('/prestamos/solicitar', data),
  aprobarPrestamo: (id, data) => API.put(`/prestamos/${id}/aprobar`, data),
  devolverPrestamo: (id) => API.post(`/prestamos/${id}/devolver`),
  getPrestamosActivos: () => API.get('/prestamos/activos'),
  getHistorialPrestamos: () => API.get('/prestamos/historial'),
  getMisPrestamos: () => API.get('/prestamos/mis'),

  // ⚠️ MULTAS
  getMultas: () => API.get('/multas'),
  createMulta: (data) => API.post('/multas', data),
  updateMulta: (id, data) => API.put(`/multas/${id}`, data),
  deleteMulta: (id) => API.delete(`/multas/${id}`),

  // 📊 REPORTES
  getReportes: () => API.get('/reportes'),
};*/
