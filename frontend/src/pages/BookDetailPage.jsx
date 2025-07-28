import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookDetails, getBookRecommendations } from '../services/api2';
import LoanForm from '../components/LoanForm';

const BookDetailsPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [selectedCopy, setSelectedCopy] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await getBookDetails(bookId);
        setBook(response.data);
      } catch (err) {
        setError(err.message || 'Error al cargar los detalles del libro');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleLoanClick = (copyId) => {
    setSelectedCopy(copyId);
    setShowLoanForm(true);
  };

  if (loading) return <div className="loading">Cargando detalles...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="not-found">Libro no encontrado</div>;

  return (
    <div className="book-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Volver al catálogo
      </button>

      <div className="book-header">
        {book.portada_uri && (
          <img 
            src={book.portada_uri} 
            alt={`Portada de ${book.titulo}`} 
            className="book-cover"
          />
        )}
        
        <div className="book-info">
          <h1>{book.titulo}</h1>
          <h2>{book.autor}</h2>
          
          <div className="book-meta">
            <p><strong>ISBN:</strong> {book.isbn}</p>
            {book.num_paginas && <p><strong>Páginas:</strong> {book.num_paginas}</p>}
            <p><strong>Ejemplares totales:</strong> {book.total_ejemplares}</p>
            <p><strong>Disponibles:</strong> {book.ejemplares_disponibles}</p>
            {book.editorial && <p><strong>Editorial:</strong> {book.editorial}</p>}
            {book.anio_publicacion && (
              <p><strong>Año de publicación:</strong> {book.anio_publicacion}</p>
            )}
          </div>
        </div>
      </div>

      <section className="book-description">
        {book.descripcion && (
          <>
            <h3>Descripción</h3>
            <p>{book.descripcion}</p>
          </>
        )}
      </section>

      <section className="copies-section">
        <h2>Ejemplares Disponibles ({book.ejemplares_disponibles})</h2>
        {book.ejemplares && book.ejemplares.length > 0 ? (
          <div className="copies-grid">
            {book.ejemplares.map((copy) => (
              <div key={copy.id} className="copy-card">
                <div className="copy-info">
                  <p><strong>Código:</strong> {copy.codigo}</p>
                  <p><strong>Adquisición:</strong> {new Date(copy.fecha_adquisicion).toLocaleDateString()}</p>
                  {copy.observaciones && <p><strong>Notas:</strong> {copy.observaciones}</p>}
                </div>
                {copy.disponible && (
                  <button
                    className="loan-button"
                    onClick={() => handleLoanClick(copy.id)}
                  >
                    Realizar préstamo
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-copies">No hay ejemplares disponibles actualmente</p>
        )}
      </section>

      {showLoanForm && (
        <div className="loan-modal">
          <div className="loan-modal-content">
            <LoanForm 
              copyId={selectedCopy} 
              onSuccess={() => {
                setShowLoanForm(false);
                // Recargar datos
                getBookDetails(bookId).then(res => setBook(res.data));
              }}
              onCancel={() => setShowLoanForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;