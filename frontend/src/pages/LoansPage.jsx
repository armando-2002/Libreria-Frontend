import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { getMyLoans, returnLoan, getMyLoanHistory, getCopyLoanHistory } from '../services/api';


const LoansPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('current');
  const [currentLoans, setCurrentLoans] = useState([]);
  const [loanHistory, setLoanHistory] = useState([]);
  const [copyHistory, setCopyHistory] = useState([]);
  const [copyIdInput, setCopyIdInput] = useState('');
  const [loading, setLoading] = useState({
    current: false,
    history: false,
    copyHistory: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Función mejorada para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'null' || dateString === 'undefined') {
      return 'No especificada';
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Fecha inválida:', dateString);
        return 'No especificada';
      }
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'No especificada';
    }
  };

  // Cargar préstamos actuales con manejo robusto de datos
  const loadCurrentLoans = async () => {
    try {
      setLoading(prev => ({ ...prev, current: true }));
      setError(null);
      
      const response = await getMyLoans();
      console.log('Respuesta de la API:', response.data);

      if (Array.isArray(response.data)) {
        const processedLoans = response.data.map(loan => {
          // Busca la fecha de devolución en diferentes campos posibles
          const returnDate = 
            loan.fecha_prevista || 
            loan.fecha_devolucion_estimada || 
            loan.fecha_devolucion || 
            null;

          return {
            id: loan.id,
            usuario_id: loan.usuario_id,
            ejemplar_id: loan.ejemplar_id,
            fecha_prestamo: loan.fecha_prestamo,
            fecha_prevista: returnDate
          };
        });

        setCurrentLoans(processedLoans);
      } else {
        console.warn('Formato de respuesta inesperado:', response.data);
        setCurrentLoans([]);
      }
    } catch (err) {
      console.error('Error al cargar préstamos:', err);
      setError(err.response?.data?.detail || 'Error al cargar préstamos actuales');
    } finally {
      setLoading(prev => ({ ...prev, current: false }));
    }
  };

  // Cargar historial de préstamos
  const loadUserLoanHistory = async () => {
    try {
      setLoading(prev => ({ ...prev, history: true }));
      setError(null);
      
      const response = await getMyLoanHistory();
      
      if (Array.isArray(response.data)) {
        setLoanHistory(response.data);
      } else {
        setLoanHistory([]);
      }
    } catch (err) {
      console.error('Error al cargar historial:', err);
      setError('Error al cargar historial de préstamos');
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

  // Cargar historial por ejemplar

  // Manejar devolución de préstamo
  const handleReturnLoan = async (loanId) => {
    try {
      setLoading(prev => ({ ...prev, current: true }));
      setError(null);
      setSuccess(null);
      
      await returnLoan(loanId);
      setSuccess('Préstamo devuelto exitosamente');
      await loadCurrentLoans();
    } catch (err) {
      console.error('Error al devolver préstamo:', err);
      setError('Error al devolver el préstamo');
    } finally {
      setLoading(prev => ({ ...prev, current: false }));
    }
  };

  // Manejar búsqueda de ejemplar
  const handleCopyHistorySearch = (e) => {
    e.preventDefault();
    if (copyIdInput) {
      loadCopyLoanHistory(copyIdInput);
    }
  };

  // Cargar datos según pestaña activa
  useEffect(() => {
    if (activeTab === 'current') {
      loadCurrentLoans();
    } else if (activeTab === 'history') {
      loadUserLoanHistory();
    }
  }, [activeTab]);

  if (!isAuthenticated) {
    return (
      <div className="auth-message">
        <p>Debes iniciar sesión para ver tus préstamos</p>
      </div>
    );
  }

  return (
    <div className="loans-container">
      <h1 className="loans-title">Mis Préstamos</h1>
      
      <div className="loans-tabs">
        <button 
          onClick={() => setActiveTab('current')}
          disabled={activeTab === 'current'}
          className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
        >
          Préstamos Actuales
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          disabled={activeTab === 'history'}
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
        >
          Mi Historial
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {activeTab === 'current' && (
        <div className="loans-section">
          <h2>Préstamos Activos</h2>
          {loading.current ? (
            <p className="loading-text">Cargando préstamos actuales...</p>
          ) : currentLoans.length > 0 ? (
            <div className="loans-grid">
              {currentLoans.map(loan => (
                <div key={loan.id} className="loan-card">
                  <h3>Préstamo #{loan.id}</h3>
                  <p><strong>Usuario ID:</strong> {loan.usuario_id}</p>
                  <p><strong>Ejemplar ID:</strong> {loan.ejemplar_id}</p>
                  <p><strong>Fecha de préstamo:</strong> {formatDate(loan.fecha_prestamo)}</p>
                  <p><strong>Fecha de devolución estimada:</strong> {formatDate(loan.fecha_prevista)}</p>
                  <button
                    onClick={() => handleReturnLoan(loan.id)}
                    disabled={loading.current}
                    className="return-button"
                  >
                    Devolver
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No tienes préstamos activos actualmente</p>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="loans-section">
          <h2>Mi Historial de Préstamos</h2>
          {loading.history ? (
            <p className="loading-text">Cargando historial...</p>
          ) : loanHistory.length > 0 ? (
            <div className="loans-grid">
              {loanHistory.map(loan => (
                <div key={loan.id} className="loan-card">
                  <h3>Préstamo #{loan.id}</h3>
                  <p><strong>Usuario ID:</strong> {loan.usuario_id}</p>
                  <p><strong>Ejemplar ID:</strong> {loan.ejemplar_id}</p>
                  <p><strong>Fecha de préstamo:</strong> {formatDate(loan.fecha_prestamo)}</p>
                  <p><strong>Fecha de devolución:</strong> {formatDate(loan.fecha_devolucion)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No tienes préstamos en tu historial</p>
          )}
        </div>
      )}

      {activeTab === 'copy-history' && (
        <div className="loans-section">
          <h2>Historial por Ejemplar</h2>
          <form onSubmit={handleCopyHistorySearch} className="copy-search-form">
            <input
              type="text"
              value={copyIdInput}
              onChange={(e) => setCopyIdInput(e.target.value)}
              placeholder="Ingresa el ID del ejemplar"
              required
              className="copy-search-input"
            />
            <button 
              type="submit" 
              disabled={loading.copyHistory}
              className="search-button"
            >
              {loading.copyHistory ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {loading.copyHistory ? (
            <p className="loading-text">Cargando historial del ejemplar...</p>
          ) : copyHistory.length > 0 ? (
            <div className="loans-grid">
              {copyHistory.map(loan => (
                <div key={loan.id} className="loan-card">
                  <h3>Préstamo #{loan.id}</h3>
                  <p><strong>Usuario ID:</strong> {loan.usuario_id}</p>
                  <p><strong>Ejemplar ID:</strong> {loan.ejemplar_id}</p>
                  <p><strong>Fecha de préstamo:</strong> {formatDate(loan.fecha_prestamo)}</p>
                  <p><strong>Fecha de devolución:</strong> {formatDate(loan.fecha_devolucion)}</p>
                </div>
              ))}
            </div>
          ) : copyIdInput ? (
            <p className="no-data">No se encontró historial para el ejemplar {copyIdInput}</p>
          ) : (
            <p className="no-data">Ingresa un ID de ejemplar para buscar su historial</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoansPage;