import React, { useState, useEffect } from 'react';
import { getLoanHistory } from '../services/api2';

const LoanHistoryPage = ({ userId }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoanHistory = async () => {
      try {
        const response = await getLoanHistory(userId);
        setLoans(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error al cargar el historial de préstamos');
        setLoading(false);
      }
    };

    fetchLoanHistory();
  }, [userId]);

  if (loading) return <div>Cargando historial...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Historial de Préstamos</h1>
      <table>
        <thead>
          <tr>
            <th>ID Préstamo</th>
            <th>Libro</th>
            <th>Fecha Préstamo</th>
            <th>Fecha Devolución</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.ejemplar.libro.titulo}</td>
              <td>{new Date(loan.fecha_prestamo).toLocaleDateString()}</td>
              <td>
                {loan.fecha_devolucion 
                  ? new Date(loan.fecha_devolucion).toLocaleDateString()
                  : 'Pendiente'}
              </td>
              <td>{loan.estado ? 'Devuelto' : 'Prestado'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanHistoryPage;