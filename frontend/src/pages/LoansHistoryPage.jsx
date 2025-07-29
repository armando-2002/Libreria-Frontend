import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { getMyLoanHistory } from '../services/api';
import { Link } from 'react-router-dom';
import '../css/loans.css';
const HistorialPrestamosPage = () => {
  const { isAuthenticated } = useAuth();
  const [loanHistory, setLoanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const loadLoanHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyLoanHistory();
      setLoanHistory(response.data);
    } catch (err) {
      setError('Error al cargar historial de préstamos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadLoanHistory();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="auth-message">Debes iniciar sesión para ver tu historial</div>;
  }

  return (
    <div className="loans-container">
            <Link to="/home" className="back-button">
          <i className="fas fa-arrow-left"></i> Volver 
        </Link>
      <h1>Mi Historial de Préstamos</h1>
      
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Cargando historial...</p>
      ) : loanHistory.length > 0 ? (
        <div className="loans-grid">
          {loanHistory.map(loan => (
            <div key={loan.id} className="loan-card">
              <h3>Préstamo #{loan.id}</h3>
              <p><strong>Ejemplar ID:</strong> {loan.ejemplar_id}</p>
              <p><strong>Fecha préstamo:</strong> {formatDate(loan.fecha_prestamo)}</p>
              <p><strong>Fecha devolución:</strong> {formatDate(loan.fecha_devolucion)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes préstamos en tu historial</p>
      )}
    </div>
  );
};

export default HistorialPrestamosPage;