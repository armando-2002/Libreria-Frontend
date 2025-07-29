import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecommendationForm from '../components/RecommendationForm';
import '../css/BookDetail.css';
import { Link } from 'react-router-dom';
import { 
  getBookDetails, 
  getBookRecommendations,
  createLoan
} from '../services/api';
import { useAuth } from '../services/AuthContext';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loanSuccess, setLoanSuccess] = useState(null);
  const [loanError, setLoanError] = useState(null);
  const [recommendationText, setRecommendationText] = useState('');
  const [recommendationSuccess, setRecommendationSuccess] = useState(null);
  const [recommendationError, setRecommendationError] = useState(null);
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const bookResponse = await getBookDetails(id);
        setBook(bookResponse.data);
        
        const recommendationsResponse = await getBookRecommendations(id);
        setRecommendations(recommendationsResponse.data.recomendaciones || []);
        
      } catch (err) {
        console.error('Error fetching book data:', err);
        setError('Error al cargar los datos del libro');
        if (err.response?.status === 404) {
          navigate('/not-found', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id, navigate]);

  const handleLoanBook = async (copyId) => {
    try {
      setLoanError(null);
      setLoanSuccess(null);
      
      if (!isAuthenticated) {
        navigate('/login', { state: { from: `/books/${id}` } });
        return;
      }

      const response = await createLoan({ ejemplar_id: Number(copyId) });

      setLoanSuccess(`Préstamo realizado con éxito. Fecha prevista de devolución: ${response.data.fecha_prevista}`);

      // Actualizar localmente para que el ejemplar no esté disponible
      setBook(prevBook => ({
        ...prevBook,
        ejemplares: prevBook.ejemplares.map(ej => 
          ej.id === copyId ? { ...ej, disponible: false } : ej
        )
      }));

      // Actualizar la disponibilidad total
      setBook(prevBook => ({
        ...prevBook,
        ejemplares_disponibles: prevBook.ejemplares_disponibles - 1
      }));

      // Opcional: podrías volver a cargar datos si prefieres
      // const updatedBookResponse = await getBookDetails(id);
      // setBook(updatedBookResponse.data);

    } catch (err) {
      setLoanError(err.response?.data?.detail || 'Error al realizar el préstamo');
    }
  };

  // Esta función solo para mostrar el formulario o limpiar mensajes si usas el form embebido
  const onRecommendationSuccess = () => {
    // Recargar recomendaciones
    getBookRecommendations(id).then(res => {
      setRecommendations(res.data.recomendaciones || []);
    });
    setShowRecommendationForm(false);
    setRecommendationSuccess('Recomendación enviada con éxito');
  };

  const onRecommendationCancel = () => {
    setShowRecommendationForm(false);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!book) {
    return null;
  }

  return (
    <div className="book-detail-container">
      <Link to="/libros" className="back-button">
    <i className="fas fa-arrow-left"></i> Volver a la lista de libros
  </Link>
      <div className="book-main-info">
        {book.portada_uri ? (
          <img 
            src={book.portada_uri} 
            alt={`Portada de ${book.titulo}`} 
            className="book-cover"
          />
        ) : (
          <div className="book-cover-placeholder">Sin portada</div>
        )}
        
        <div className="book-meta">
          <h1>{book.titulo}</h1>
          <p><strong>Autor:</strong> {book.autor}</p>
          <p><strong>ISBN:</strong> {book.isbn}</p>
          {book.num_paginas && <p><strong>Páginas:</strong> {book.num_paginas}</p>}
          <p>
            <strong>Disponibilidad:</strong> 
            {book.ejemplares_disponibles} de {book.total_ejemplares} disponibles
          </p>
        </div>
      </div>

      <div className="book-copies">
        <h2>Ejemplares disponibles</h2>

        {loanSuccess && <div className="success-message">{loanSuccess}</div>}
        {loanError && <div className="error-message">{loanError}</div>}

        {book.ejemplares && book.ejemplares.length > 0 ? (
          <div className="copies-grid">
            {book.ejemplares.map((copy) => (
              <div key={copy.id} className="copy-card">
                <h3>Ejemplar #{copy.id}</h3>
                <p><strong>Código:</strong> {copy.codigo}</p>
                <p><strong>Libro ID:</strong> {copy.libro_id}</p>
                <p><strong>Fecha de adquisición:</strong> {copy.fecha_adquisicion}</p>
                <p><strong>Observaciones:</strong> {copy.observaciones || 'Ninguna'}</p>
                <p><strong>Disponible:</strong> {copy.disponible ? 'Sí' : 'No'}</p>
                <button
                  disabled={!isAuthenticated || !copy.disponible}
                  onClick={() => handleLoanBook(copy.id)}
                >
                  Prestar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay ejemplares disponibles actualmente.</p>
        )}
      </div>

      <div className="book-recommendations">
        <h2>Recomendaciones</h2>

        {recommendationSuccess && <div className="success-message">{recommendationSuccess}</div>}
        {recommendationError && <div className="error-message">{recommendationError}</div>}

        {isAuthenticated && (
          <>
            {!showRecommendationForm ? (
              <button onClick={() => setShowRecommendationForm(true)}>
                Agregar recomendación
              </button>
            ) : (
              <RecommendationForm
                bookId={id}
                onSuccess={onRecommendationSuccess}
                onCancel={onRecommendationCancel}
              />
            )}
          </>
        )}

        {recommendations.length > 0 ? (
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={rec.id || index} className="recommendation-item">
                <p><strong>ID Recomendación:</strong> {rec.id}</p>
                <p><strong>Comentario:</strong> {rec.comentario || 'Sin comentario'}</p>
                <p><strong>ID Origen:</strong> {rec.origen_id}</p>
                <p><strong>ID Recomendado:</strong> {rec.recomendado_id}</p>
                {index < recommendations.length - 1 && <hr />}
              </div>
            ))}
          </div>
        ) : (
          <p>Aún no hay recomendaciones para este libro.</p>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
