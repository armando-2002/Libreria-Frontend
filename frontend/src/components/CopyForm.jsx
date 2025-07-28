import React, { useState } from 'react';
import { createCopy } from '../services/api2';

const CopyForm = ({ bookId }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    libro_id: bookId,
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await createCopy(formData);
      setSuccess(true);
      // Reset form
      setFormData({
        codigo: '',
        libro_id: bookId,
        observaciones: ''
      });
    } catch (err) {
      setError(err.message || 'Error al crear el ejemplar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Agregar Nuevo Ejemplar</h2>
      {success && <div className="success">Ejemplar creado exitosamente!</div>}
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Código:</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Observaciones:</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Ejemplar'}
        </button>
      </form>
    </div>
  );
};

export default CopyForm;