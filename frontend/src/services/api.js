/*import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Método específico para registro que maneja la lógica de validación
export const registerUser = (userData) => {
  // Asegurarse que los campos no requeridos sean null según el tipo de usuario
  const payload = {
    ...userData,
    id: parseInt(userData.id, 10),
    telefono_padres: userData.tipo === 'ALUMNO' ? userData.telefono_padres : null,
    departamento: userData.tipo === 'PROFESOR' ? userData.departamento : null
  };
  
  return api.post('/auth/', payload);
};
//Metodo para el login
// Método para login (x-www-form-urlencoded)
export const loginUser = async (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  params.append('grant_type', 'password');
  
  const response = await api.post('/auth/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  localStorage.setItem('access_token', response.data.access_token);
  
  // Si el backend devuelve user_id en la respuesta del token, guardarlo
  if (response.data.user_id) {
    localStorage.setItem('user_id', response.data.user_id);
  }
  
  // Guardar token en las instancias de axios para futuras peticiones
  api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
  return response;
};
// Método para obtener información del usuario actual
export const getCurrentUser = () => api.get('/auth/me'); // o el endpoint que uses

// Método para obtener user_id desde localStorage o token
export const getUserId = () => {
  const userId = localStorage.getItem('user_id');
  if (userId) {
    return parseInt(userId, 10);
  }
  
  // Si no está en localStorage, hacer petición al backend
  return getCurrentUser().then(response => {
    localStorage.setItem('user_id', response.data.id);
    return response.data.id;
  });
};
// Método para logout (limpia el token)
// Método para logout (limpia el token y user_id)
export const logoutUser = () => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_id');
};

// Añadir interceptor para incluir token en cada petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Resto de tus métodos API (libros, préstamos, etc.)
// Métodos de Libros
export const getBooks = () => api.get('/books/');
export const getBookDetails = (id) => api.get(`/books/${id}`);

export const getBookRecommendations = (id) => api.get(`/books/${id}/recommendations`);

// Métodos de Ejemplares (Copies)
export const createCopy = (copyData) => api.post('/copies/', copyData);
export const getCopyStatus = (copyId) => api.get(`/copies/${copyId}/status`);

// ==================== MÉTODOS DE PRÉSTAMOS (LOANS) ====================
// Crear nuevo préstamo
export const createLoan = (loanData) => api.post('/loans/', loanData);

// Obtener préstamos activos del usuario actual
export const getMyLoans = () => api.get('/loans/my-loans');

// Devolver un libro (finalizar préstamo)
export const returnLoan = (loanId) => api.post(`/loans/${loanId}/return`);

// ==================== HISTORIAL DE PRÉSTAMOS ====================
// Obtener historial completo del usuario
export const getMyLoanHistory = () => api.get('/loans-history/my-history');

// Obtener historial de un ejemplar específico
export const getCopyLoanHistory = (copyId) => api.get(`/loans-history/copy/${copyId}`);
// Métodos de Multas (Penalties)
export const getMyPenalty = () => {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    return Promise.reject(new Error('No se encontró user_id'));
  }
   return api.get(`/penalties/my-penalty`, {
    params: { user_id: userId } // Envía user_id como parámetro de consulta
  });
};

export const getMyPenaltyHistory = () => {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    return Promise.reject(new Error('No se encontró user_id'));
  }
  return api.get(`/penalties-history/my-history`, {
    params: { user_id: userId } // Envía user_id como parámetro de consulta
  });
};
export const getAllPenaltyHistory = () => api.get('/penalties-history/');

// Métodos de Recomendaciones
export const createRecommendation = (recommendationData) => {
  return api.post('/recommendations/', {
    origen_id: recommendationData.origen_id,
    recomendado_id: recommendationData.recomendado_id,
    comentario: recommendationData.comentario || null
  });
};

export const getBookRecommendationsList = (bookId) => api.get(`/recommendations/book/${bookId}`);
export default api;
*/
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});
export const decodeToken = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub, // ID del usuario
      nombre: payload.nombre,
      email: payload.email,
      tipo: payload.tipo
      // Agrega otros campos que necesites
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
// Método específico para registro que maneja la lógica de validación
export const registerUser = (userData) => {
  // Asegurarse que los campos no requeridos sean null según el tipo de usuario
  const payload = {
    ...userData,
    id: parseInt(userData.id, 10),
    telefono_padres: userData.tipo === 'ALUMNO' ? userData.telefono_padres : null,
    departamento: userData.tipo === 'PROFESOR' ? userData.departamento : null
  };
  
  return api.post('/auth/', payload);
};

// Método para login (x-www-form-urlencoded)
export const loginUser = async (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  params.append('grant_type', 'password');
  
  const response = await api.post('/auth/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  
  // Guardar token
  localStorage.setItem('access_token', response.data.access_token);
  
  // Guardar user_id (ahora viene directamente del backend)
  if (response.data.user_id) {
    localStorage.setItem('user_id', response.data.user_id.toString());
  } else {
    console.warn('No se recibió user_id del backend');
  }
  
  // Configurar header de autorización para futuras peticiones
  api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
  
  return response;
};

// Método para obtener user_id desde localStorage
export const getUserId = () => {
  const userId = localStorage.getItem('user_id');
  if (userId) {
    // Convertir a número ya que siempre debería ser un ID numérico
    return parseInt(userId, 10);
  }
  
  console.warn('No se encontró user_id en localStorage');
  return null;
};

// Método para logout (limpia el token y user_id)
export const logoutUser = () => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user');
};

// Interceptor para incluir token en cada petición
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.log('Token inválido, cerrando sesión...');
      logoutUser();
      // Opcional: redirigir al login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== MÉTODOS DE LIBROS ====================
export const getBooks = () => api.get('/books/');
export const getBookDetails = (id) => api.get(`/books/${id}`);
export const getBookRecommendations = (id) => api.get(`/books/${id}/recommendations`);

// ==================== MÉTODOS DE EJEMPLARES (COPIES) ====================
export const createCopy = (copyData) => api.post('/copies/', copyData);
export const getCopyStatus = (copyId) => api.get(`/copies/${copyId}/status`);

// ==================== MÉTODOS DE PRÉSTAMOS (LOANS) ====================
export const createLoan = async (loanData) => {
  try {
    // El endpoint /loans/ solo requiere ejemplar_id según tu documentación
    // El user_id se maneja automáticamente por el token de autenticación en el backend
    const payload = {
      ejemplar_id: parseInt(loanData.ejemplar_id, 10)
    };
    
    console.log('Creando préstamo con payload:', payload);
    return api.post('/loans/', payload);
  } catch (error) {
    console.error('Error creando préstamo:', error);
    throw error;
  }
};

export const getMyLoans = () => {
  const userId = getUserId(); // Obtiene el user_id del localStorage
  if (!userId) {
    return Promise.reject(new Error('No se encontró user_id'));
  }
  
  return api.get('/loans/my-loans', {
    params: {
      user_id: userId
    }
  });
};
export const returnLoan = (loanId) => api.post(`/loans/${loanId}/return`);

// ==================== HISTORIAL DE PRÉSTAMOS ====================
export const getMyLoanHistory = () => {
  const userId = getUserId(); // Obtiene el user_id del localStorage
  if (!userId) {
    return Promise.reject(new Error('No se encontró user_id'));
  }
  
  return api.get('/loans-history/my-history', {
    params: {
      user_id: userId // Asegúrate que este sea el nombre correcto del parámetro que espera tu backend
    }
  });
};
export const getCopyLoanHistory = (copyId) => api.get(`/loans-history/copy/${copyId}`);

// ==================== MÉTODOS DE MULTAS (PENALTIES) ====================
export const getMyPenalty = () => {
  const userId = getUserId();
  if (!userId) {
    return Promise.reject(new Error('No se encontró user_id'));
  }
  return api.get(`/penalties/my-penalty`, {
    params: { user_id: userId }
  });
};

export const getMyPenaltyHistory = () => {
  const userId = getUserId();
  if (!userId) {
    return Promise.reject(new Error('No se encontró user_id'));
  }
  return api.get(`/penalties-history/my-history`, {
    params: { user_id: userId }
  });
};

export const getAllPenaltyHistory = () => api.get('/penalties-history/');

// ==================== MÉTODOS DE RECOMENDACIONES ====================
export const createRecommendation = (recommendationData) => {
  return api.post('/recommendations/', {
    origen_id: recommendationData.origen_id,
    recomendado_id: recommendationData.recomendado_id,
    comentario: recommendationData.comentario || null
  });
};

export const getBookRecommendationsList = (bookId) => api.get(`/recommendations/book/${bookId}`);

export default api;