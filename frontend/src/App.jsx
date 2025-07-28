import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookListPage from './pages/BookListPage';
import BookDetailsPage from './pages/BookDetailPage';
import LoanHistoryPage from './pages/LoanHistoryPage';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Libros</Link></li>
            <li><Link to="/loans/1">Historial de Préstamos (Usuario 1)</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<BookListPage />} />
          <Route path="/books/:bookId" element={<BookDetailsPage />} />
          <Route path="/loans/:userId" element={<LoanHistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
// App.jsx
// App.jsx
/*import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import PrivateRoute from './services/PrivateRoute';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import './App.css';

// Componente temporal para diagnóstico

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Componente temporal para verificar renderizado }
        <DebugView />
        
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/books" element={<PrivateRoute><BookListPage /></PrivateRoute>} />
            <Route path="/books/:id" element={<PrivateRoute><BookDetailPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;*/