import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error response:', error.response.data);
      return Promise.reject({
        message: error.response.data?.detail || 'Error en la solicitud',
        status: error.response.status,
        data: error.response.data
      });
    }
    return Promise.reject(error);
  }
);

// Libros
// Libros
export const getBooks = () => api.get('/books/');
export const getBookDetails = (id) => api.get(`/books/${id}`);
export const getBookRecommendations = (id) => api.get(`/books/${id}/recommendations`);

// Ejemplares
export const createCopy = (copyData) => api.post('/copies/', copyData);
export const getCopyStatus = (id) => api.get(`/copies/${id}/status`);

// Préstamos
export const createLoan = (loanData) => api.post('/loans/', loanData);
export const returnLoan = (loanId) => api.put(`/loans/${loanId}/return`);
export const getActiveLoans = () => api.get('/loans/active');
export const getLoanHistory = (userId) => api.get(`/loans/history/${userId}`);

// Multas
export const getMyPenalty = () => api.get('/penalties/my-penalty');
export const getMyPenaltyHistory = () => api.get('/penalties-history/my-history');

// Recomendaciones
export const createRecommendation = (data) => api.post('/recommendations/', data);
export const  getRecommendedBooks= (bookId) => api.get(`/recommendations/book/${bookId}`);
export default api;
/*
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Ajusta según tu backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;*/