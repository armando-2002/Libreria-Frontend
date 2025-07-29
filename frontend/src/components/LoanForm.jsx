import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext.jsx';
import { createLoan, getBooks, getAvailableCopies } from '../services/api';

const LoanForm = ({ onLoanCreated, onCancel }) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    ejemplar_id: ''
  });
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [availableCopies, setAvailableCopies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoadingBooks(true);
        const response = await getBooks();
        setBooks(response.data);
      } catch (err) {
        console.error('Error cargando libros:', err);
        setError('No se pudieron cargar los libros');
      } finally {
        setLoadingBooks(false);
      }
    };

    if (isAuthenticated) {
      loadBooks();
    }
  }, [isAuthenticated]);

  const handleBookSelect = async (bookId) => {
    if (!bookId) {
      setSelectedBook(null);
      setAvailableCopies([]);
      return;
    }

    try {
      const book = books.find(b => b.id === parseInt(bookId));
      setSelectedBook(book);
      const response = await getAvailableCopies(bookId);
      setAvailableCopies(response.data);
    } catch (err) {
      console.error('Error obteniendo ejemplares:', err);
      setError('Error al obtener ejemplares disponibles');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Debes estar autenticado para crear un préstamo');
      return;
    }

    if (!formData.ejemplar_id) {
      setError('Debes seleccionar un ejemplar');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const loanData = {
        ejemplar_id: parseInt(formData.ejemplar_id, 10)
      };

      const response = await createLoan(loanData);
      
      setSuccess('¡Préstamo creado exitosamente!');
      setFormData({ ejemplar_id: '' });
      setSelectedBook(null);
      setAvailableCopies([]);
      
      if (onLoanCreated) {
        onLoanCreated(response.data);
      }
      
    } catch (err) {
      console.error('Error creando préstamo:', err);
      
      let errorMessage = 'Error al crear el préstamo';
      
      if (err.response?.status === 400) {
        errorMessage = err.response.data?.detail || 'Datos inválidos para el préstamo';
      } else if (err.response?.status === 409) {
        errorMessage = 'Este ejemplar ya está prestado o no está disponible';
      } else if (err.response?.status === 403) {
        errorMessage = 'No tienes permisos para crear préstamos';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>
      <p>Debes iniciar sesión para crear préstamos</p>
    </div>;
  }

  return (
    <div>
      <h2>Crear Nuevo Préstamo</h2>
      
      <div>
        <h3>Usuario: {user?.nombre} {user?.apellido1}</h3>
        <p>Email: {user?.email}</p>
        <p>Tipo: {user?.tipo}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="book-select">Seleccionar Libro:</label>
          {loadingBooks ? (
            <p>Cargando libros...</p>
          ) : (
            <select
              id="book-select"
              onChange={(e) => handleBookSelect(e.target.value)}
            >
              <option value="">-- Selecciona un libro --</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.titulo} - {book.autor}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedBook && (
          <div>
            <h4>Libro Seleccionado:</h4>
            <p><strong>Título:</strong> {selectedBook.titulo}</p>
            <p><strong>Autor:</strong> {selectedBook.autor}</p>
            {selectedBook.isbn && <p><strong>ISBN:</strong> {selectedBook.isbn}</p>}
          </div>
        )}

        {availableCopies.length > 0 && (
          <div>
            <label htmlFor="ejemplar_id">Ejemplar Disponible: *</label>
            <select
              id="ejemplar_id"
              name="ejemplar_id"
              value={formData.ejemplar_id}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Selecciona un ejemplar --</option>
              {availableCopies.map(copy => (
                <option key={copy.id} value={copy.id}>
                  Ejemplar #{copy.id} - {copy.codigo || `Copia ${copy.id}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedBook && availableCopies.length === 0 && (
          <div>
            <p>No hay ejemplares disponibles para este libro en este momento.</p>
          </div>
        )}

        {error && <div>{error}</div>}

        {success && <div>{success}</div>}

        <div>
          {onCancel && (
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading || !formData.ejemplar_id}
          >
            {loading ? 'Creando...' : 'Crear Préstamo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanForm;