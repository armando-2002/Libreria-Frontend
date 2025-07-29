import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCopyLoanHistory } from '../services/api';
import '../css/copy.css';
import { Link } from 'react-router-dom';
const CopyHistoryPage = () => {
  const [copyHistory, setCopyHistory] = useState([]);
  const [copyIdInput, setCopyIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadCopyLoanHistory = async (copyId) => {
    if (!copyId || isNaN(Number(copyId))) {
      setError('ID de ejemplar inválido');
      setCopyHistory([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getCopyLoanHistory(copyId);
      
      if (Array.isArray(response.data)) {
        setCopyHistory(response.data.length > 0 ? response.data : []);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.detail || 
              'Error al cargar historial del ejemplar');
      setCopyHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadCopyLoanHistory(copyIdInput);
  };

  return (
    <div className="loans-container">
      <Link to="/home" className="back-button">
                <i className="fas fa-arrow-left"></i> Volver 
              </Link>
      
      <h1 className="loans-title">Historial por Ejemplar</h1>
      
      <form onSubmit={handleSearch} className="copy-search-form">
        <input
          type="number"
          min="1"
          value={copyIdInput}
          onChange={(e) => setCopyIdInput(e.target.value)}
          placeholder="Ingresa el ID del ejemplar"
          required
          className="copy-search-input"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="search-button"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p className="loading-text">Cargando historial...</p>
      ) : copyHistory.length > 0 ? (
        <div className="loans-grid">
          {copyHistory.map(loan => (
            <div key={loan.id} className="loan-card">
              <h3>Préstamo #{loan.id}</h3>
              <p><strong>Usuario ID:</strong> {loan.usuario_id}</p>
              <p><strong>Ejemplar ID:</strong> {loan.ejemplar_id}</p>
              <p><strong>Fecha préstamo:</strong> {formatDate(loan.fecha_prestamo)}</p>
              <p><strong>Fecha devolución:</strong> {formatDate(loan.fecha_devolucion)}</p>
            </div>
          ))}
        </div>
      ) : copyIdInput ? (
        <p className="no-data">No se encontró historial para este ejemplar</p>
      ) : (
        <p className="no-data">Ingresa un ID de ejemplar para comenzar</p>
      )}
    </div>
  );
};

// Mover esta función fuera si se usa en varios lugares
const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default CopyHistoryPage;