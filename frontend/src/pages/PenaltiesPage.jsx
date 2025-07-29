import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { getMyPenalty, getMyPenaltyHistory } from '../services/api';
import '../css/Multas.css';
import { Link } from 'react-router-dom';
const PenaltiesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('current');
  const [currentPenalty, setCurrentPenalty] = useState(null);
  const [penaltyHistory, setPenaltyHistory] = useState([]);
  const [loading, setLoading] = useState({
    current: false,
    history: false
  });
  const [error, setError] = useState(null);

  const loadCurrentPenalty = async () => {
    try {
      setLoading(prev => ({ ...prev, current: true }));
      setError(null);
      
      const response = await getMyPenalty();
      
      // Verificar si la respuesta es un objeto vacío o tiene datos
      if (response.data && Object.keys(response.data).length > 0) {
        setCurrentPenalty(response.data);
      } else {
        setCurrentPenalty(null); // No hay multa activa
      }
    } catch (err) {
      console.error('Error al cargar multa actual:', err);
      
      // Manejar diferentes tipos de errores
      if (err.response?.status === 404) {
        setCurrentPenalty(null); // No hay multa activa
      } else {
        setError(err.response?.data?.detail || 'Error al cargar multa actual');
      }
    } finally {
      setLoading(prev => ({ ...prev, current: false }));
    }
  };

  const loadPenaltyHistory = async () => {
    try {
      setLoading(prev => ({ ...prev, history: true }));
      setError(null);
      
      const response = await getMyPenaltyHistory();
      
      // Verificar si la respuesta es un array (incluso vacío)
      if (Array.isArray(response.data)) {
        setPenaltyHistory(response.data);
      } else {
        setPenaltyHistory([]);
        console.warn('La respuesta del historial no es un array:', response.data);
      }
    } catch (err) {
      console.error('Error al cargar historial:', err);
      setError(err.response?.data?.detail || 'Error al cargar historial de multas');
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

  useEffect(() => {
    if (activeTab === 'current') {
      loadCurrentPenalty();
    } else {
      loadPenaltyHistory();
    }
  }, [activeTab]);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString; // Si hay error al parsear, devolver el string original
    }
  };

  return (
    <div className="penalties-page">
      <Link to="/" className="home-button">
      <i className="home"></i> Volver
    </Link>
      <h1>Multas</h1>
      
      <div className="tabs">
        <button
          className={activeTab === 'current' ? 'active' : ''}
          onClick={() => setActiveTab('current')}
          disabled={loading.current}
        >
          Multa Actual
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
          disabled={loading.history}
        >
          Historial de Multas
        </button>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i> {error}
        </div>
      )}

      {activeTab === 'current' ? (
        <div className="current-penalty-section">
          {loading.current ? (
            <div className="loading-indicator">
              <i className="fas fa-spinner fa-spin"></i> Cargando multa actual...
            </div>
          ) : currentPenalty ? (
            <div className="penalty-card active-penalty">
              <h3>Multa Activa</h3>
              <div className="penalty-details-grid">
                <div className="detail-item">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{currentPenalty.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha inicio:</span>
                  <span className="detail-value">{formatDate(currentPenalty.fecha_inicio)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Días acumulados:</span>
                  <span className="detail-value">{currentPenalty.dias_acumulados}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha fin:</span>
                  <span className="detail-value">{formatDate(currentPenalty.fecha_fin)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-penalty-message">
              <i className="fas fa-check-circle"></i>
              <p>No tienes multas activas actualmente</p>
            </div>
          )}
        </div>
      ) : (
        <div className="history-section">
          {loading.history ? (
            <div className="loading-indicator">
              <i className="fas fa-spinner fa-spin"></i> Cargando historial...
            </div>
          ) : penaltyHistory.length > 0 ? (
            <div className="history-list">
              <h3>Historial de Multas</h3>
              {penaltyHistory.map(penalty => (
                <div key={penalty.id} className="penalty-card history-item">
                  <div className="penalty-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">ID:</span>
                      <span className="detail-value">{penalty.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Fecha inicio:</span>
                      <span className="detail-value">{formatDate(penalty.fecha_inicio)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Días acumulados:</span>
                      <span className="detail-value">{penalty.dias_acumulados}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Fecha fin:</span>
                      <span className="detail-value">{formatDate(penalty.fecha_fin)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-history-message">
              <i className="fas fa-history"></i>
              <p>No tienes multas en tu historial</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PenaltiesPage;