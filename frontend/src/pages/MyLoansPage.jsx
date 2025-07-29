import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { getMyLoans, returnLoan } from '../services/api';
import '../css/Myloans.css'
import { Link } from 'react-router-dom';
const MisPrestamosPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentLoans, setCurrentLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const loadCurrentLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyLoans();
      setCurrentLoans(response.data);
    } catch (err) {
      setError('Error al cargar préstamos actuales');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnLoan = async (loanId) => {
    try {
      setLoading(true);
      await returnLoan(loanId);
      setSuccess('Préstamo devuelto exitosamente');
      await loadCurrentLoans();
    } catch (err) {
      setError('Error al devolver el préstamo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCurrentLoans();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="auth-message">Debes iniciar sesión para ver tus préstamos</div>;
  }

  return (
    <div className="loans-container">
      <Link to="/home" className="back-button">
          <i className="fas fa-arrow-left"></i> Volver 
        </Link>
      <h1>Mis Préstamos Activos</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <p>Cargando préstamos...</p>
      ) : currentLoans.length > 0 ? (
        <div className="loans-grid">
          {currentLoans.map(loan => (
            <div key={loan.id} className="loan-card">
              <h3>Préstamo #{loan.id}</h3>
              <p><strong>Ejemplar ID:</strong> {loan.ejemplar_id}</p>
              <p><strong>Fecha préstamo:</strong> {formatDate(loan.fecha_prestamo)}</p>
              <p><strong>Devolución estimada:</strong> {formatDate(loan.fecha_prevista)}</p>
              <button
                onClick={() => handleReturnLoan(loan.id)}
                disabled={loading}
                className="return-button"
              >
                Devolver
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes préstamos activos actualmente</p>
      )}
    </div>
  );
};

export default MisPrestamosPage;