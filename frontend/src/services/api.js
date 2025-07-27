import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // cambia si usas otra ruta
});

export const getLibros = async () => {
  const res = await api.get('/libros');
  return res.data;
};
