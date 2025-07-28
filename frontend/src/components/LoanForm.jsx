import React, { useState } from 'react';
import { createLoan } from '../services/api2';


const LoanForm = ({ copyId, onSuccess, onCancel }) => {
  const [usuarioId, setUsuarioId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createLoan({
        usuario_id: usuarioId,
        ejemplar_id: copyId
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Error al registrar el préstamo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loan-form">
      <h3>Registrar Nuevo Préstamo</h3>
      
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="usuarioId">ID de Usuario:</label>
          <input
            id="usuarioId"
            type="number"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Ejemplar ID:</label>
          <input
            type="text"
            value={copyId}
            readOnly
            disabled
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Confirmar Préstamo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanForm;