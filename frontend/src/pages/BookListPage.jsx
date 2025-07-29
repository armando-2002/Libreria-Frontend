import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks } from '../services/api';
import '../css/BookListPage.css';
import { Link } from 'react-router-dom';
const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data);
      } catch (err) {
        setError(err.message || 'Error al cargar los libros');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleViewDetails = (bookId) => {
  navigate(`/libros/${bookId}`); // Coincide con la ruta definida
};

  if (loading) return <div className="loading-spinner">Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
  <div className="book-list-container">
    <Link to="/Home" className="back-button">
        <i className="fas fa-arrow-left"></i> Volver
      </Link>
    <header className="page-header">
      <h1>Catálogo de Libros</h1>
    </header>

    <div className="book-grid">
      {books.map((book) => (
        <div key={book.id} className="book-card">
          <div className="book-info">
            <h3 className="book-title">{book.titulo}</h3>
            <p className="book-author">Autor: {book.autor}</p>
            {book.isbn && <p className="book-isbn">ISBN: {book.isbn}</p>}
          </div>
          <button
            className="view-details-btn"
            onClick={() => handleViewDetails(book.id)}
          >
            Ver detalles y ejemplares
          </button>
        </div>
      ))}
    </div>
  </div>
);
};

export default BookListPage;