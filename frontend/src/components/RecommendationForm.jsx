import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRecommendation, getBooks } from '../services/api';
import '../css/Recomendation.css'
const RecommendationForm = ({ bookId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    origen_id: bookId,
    recomendado_id: '',
    comentario: ''
  });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState({
    books: true,
    submission: false
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Cargar libros disponibles para recomendación
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data.filter(book => book.id !== parseInt(bookId)));
      } catch (err) {
        setError('Error al cargar los libros disponibles');
      } finally {
        setLoading(prev => ({ ...prev, books: false }));
      }
    };
    loadBooks();
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.recomendado_id) {
      return setError('Debes seleccionar un libro');
    }

    setLoading(prev => ({ ...prev, submission: true }));
    setError(null);
    setSuccessMessage(null);

    try {
      await createRecommendation({
        origen_id: formData.origen_id,
        recomendado_id: formData.recomendado_id,
        comentario: formData.comentario || null
      });
      
      setSuccessMessage('¡Recomendación creada exitosamente!');
      
      // Limpiar formulario después de éxito
      setFormData(prev => ({
        ...prev,
        recomendado_id: '',
        comentario: ''
      }));
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
        if (onSuccess) onSuccess();
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.detail || 
              'Error al crear la recomendación');
    } finally {
      setLoading(prev => ({ ...prev, submission: false }));
    }
  };

  if (loading.books) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando libros disponibles...</p>
      </div>
    );
  }

  return (
    <div className="recommendation-form-container">
      <h2>Recomendar Libro Relacionado</h2>
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="recomendado_id">Libro recomendado *</label>
          <select
            id="recomendado_id"
            name="recomendado_id"
            value={formData.recomendado_id}
            onChange={handleChange}
            disabled={loading.submission}
            className="form-select"
          >
            <option value="">Selecciona un libro</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.titulo} - {book.autor} (ISBN: {book.isbn})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="comentario">Comentario</label>
          <textarea
            id="comentario"
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
            disabled={loading.submission}
            className="form-textarea"
            placeholder="¿Por qué recomiendas este libro?"
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading.submission}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading.submission || !formData.recomendado_id}
            className="submit-button"
          >
            {loading.submission ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Enviando...
              </>
            ) : (
              'Enviar Recomendación'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

RecommendationForm.propTypes = {
  bookId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired
};

export default RecommendationForm;