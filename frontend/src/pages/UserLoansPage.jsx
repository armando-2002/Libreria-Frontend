import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { getMyLoans, returnLoan } from '../services/api';
import { formatDate, calculateDueStatus } from '../utils/helpers';
import './UserLoansPage.css';

const UserLoansPage = () => {
  const { user } = useAuth();
  const [state, setState] = useState({
    loans: [],
    loading: true,
    error: null,
    returningId: null
  });

  const fetchLoans = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await getMyLoans();
      setState(prev => ({
        ...prev,
        loans: response.data,
        loading: false
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.response?.data?.message || 'Error al cargar préstamos',
        loading: false
      }));
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleReturn = async (loanId) => {
    if (!window.confirm('¿Estás seguro de devolver este libro?')) return;

    try {
      setState(prev => ({ ...prev, returningId: loanId }));
      await returnLoan(loanId);
      await fetchLoans(); // Refresh the list
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.response?.data?.message || 'Error al devolver el libro'
      }));
    } finally {
      setState(prev => ({ ...prev, returningId: null }));
    }
  };

  if (state.loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando tus préstamos...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="error-container">
        <div className="error-alert">
          <i className="fas fa-exclamation-triangle"></i>
          {state.error}
        </div>
        <button 
          onClick={fetchLoans}
          className="retry-button"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="user-loans-container">
      <div className="header-section">
        <h1>Mis Préstamos Activos</h1>
        <button 
          onClick={fetchLoans}
          className="refresh-button"
          disabled={state.loading}
        >
          <i className="fas fa-sync-alt"></i> Actualizar
        </button>
      </div>

      {state.loans.length === 0 ? (
        <div className="no-loans">
          <i className="fas fa-book-open"></i>
          <p>No tienes préstamos activos actualmente</p>
          <a href="/libros" className="explore-link">
            Explorar catálogo de libros
          </a>
        </div>
      ) : (
        <div className="loans-table-container">
          <table className="loans-table">
            <thead>
              <tr>
                <th>Libro</th>
                <th>Ejemplar</th>
                <th>Fecha préstamo</th>
                <th>Fecha devolución</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {state.loans.map(loan => (
                <tr key={loan.id}>
                  <td>
                    <div className="book-info">
                      {loan.ejemplar.libro.portada_uri ? (
                        <img 
                          src={loan.ejemplar.libro.portada_uri} 
                          alt={`Portada de ${loan.ejemplar.libro.titulo}`}
                          className="book-cover"
                          onError={(e) => {
                            e.target.src = '/default-book-cover.jpg';
                            e.target.className = 'book-cover default-cover';
                          }}
                        />
                      ) : (
                        <div className="book-cover default-cover">
                          <i className="fas fa-book"></i>
                        </div>
                      )}
                      <div>
                        <strong>{loan.ejemplar.libro.titulo}</strong>
                        <p>{loan.ejemplar.libro.autor}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="copy-code">{loan.ejemplar.codigo}</span>
                  </td>
                  <td>{formatDate(loan.fecha_prestamo)}</td>
                  <td>
                    <span className={calculateDueStatus(loan.fecha_devolucion_prevista).className}>
                      {formatDate(loan.fecha_devolucion_prevista)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${loan.devuelto ? 'returned' : 'active'}`}>
                      {loan.devuelto ? 'Devuelto' : 'Activo'}
                    </span>
                  </td>
                  <td>
                    {!loan.devuelto && (
                      <button
                        onClick={() => handleReturn(loan.id)}
                        disabled={state.returningId === loan.id}
                        className="return-button"
                      >
                        {state.returningId === loan.id ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          'Devolver'
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserLoansPage;