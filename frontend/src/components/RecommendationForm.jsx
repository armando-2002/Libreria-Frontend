import React, { useState } from 'react';
import { createRecommendation } from '../services/api2';

const RecommendationForm = ({ bookId }) => {
  const [formData, setFormData] = useState({
    origen_id: bookId,
    recomendado_id: '',
    comentario: ''
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
      await createRecommendation(formData);
      setSuccess(true);
      // Reset form
      setFormData(prev => ({
        ...prev,
        recomendado_id: '',
        comentario: ''
      }));
    } catch (err) {
      setError(err.message || 'Error al crear la recomendación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Recomendar Libro</h2>
      {success && <div className="success">Recomendación creada exitosamente!</div>}
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID del Libro Recomendado:</label>
          <input
            type="number"
            name="recomendado_id"
            value={formData.recomendado_id}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Comentario (opcional):</label>
          <textarea
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
          />
        </div>
        
        <input type="hidden" name="origen_id" value={bookId} />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Recomendación'}
        </button>
      </form>
    </div>
  );
};

export default RecommendationForm;