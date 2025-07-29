/*import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookListPage from './pages/BookListPage';
import BookDetailsPage from './pages/BookDetailPage';
import LoanHistoryPage from './pages/LoanHistoryPage';
import UserLoansPage from './pages/UserLoansPage';
import PenaltyPage from './pages/PenaltyPage';
import BookSearchPage from './pages/BookSearchPage';

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
          <Route path="/my-loans" element={<UserLoansPage />} />
        <Route path="/penalties" element={<PenaltyPage />} />
        <Route path="/search" element={<BookSearchPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;*/
/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookListPage from './pages/BookListPage';
import BookDetailsPage from './pages/BookDetailPage';
import LoanHistoryPage from './pages/LoanHistoryPage';
import UserLoansPage from './pages/UserLoansPage';
import PenaltyPage from './pages/PenaltyPage';
import BookSearchPage from './pages/BookSearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './services/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/books" element={<BookListPage />} />
            <Route path="/books/:bookId" element={<BookDetailsPage />} />
            <Route path="/my-loans" element={<UserLoansPage />} />
            <Route path="/loans/history/:userId" element={<LoanHistoryPage />} />
            <Route path="/penalties" element={<PenaltyPage />} />
            <Route path="/search" element={<BookSearchPage />} />
            <Route path="*" element={<div className="not-found">Página no encontrada</div>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
/*
export default App;*//*
Aqui ya vale lo del register
/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;*/
/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage'
import Home2 from './pages/Home2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home2/>} />
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />

      </Routes>
    </Router>
  );
}
export default App;*/
/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage'; // Opcional si aún la usarás en otra ruta

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal ahora muestra el LoginPage }
        <Route path="/" element={<LoginPage />} />
        
        {/* Ruta de registro }
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Ruta de home (si la mantienes para después del login)/}
        <Route path="/home" element={<HomePage />} />
        
        {/* Puedes agregar más rutas según necesites }
      </Routes>
    </Router>
  );
}

export default App;*/
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './services/AuthContext.jsx';

// Componentes con lazy loading
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const BookListPage = React.lazy(() => import('./pages/BookListPage'));
const BookDetailsPage = React.lazy(() => import('./pages/BookDetailPage'));
const PenaltiesPage = React.lazy(() => import('./pages/PenaltiesPage'));
const LoansPage = React.lazy(() => import('./pages/LoansPage'));
const CopyHistoryPage = React.lazy(() => import('./pages/CopyHistoryPage.jsx'));
const MyLoansPage = React.lazy(() => import('./pages/MyLoansPage.jsx'));
const LoanHistoryPage = React.lazy(() => import('./pages/LoansHistoryPage.jsx'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>Cargando aplicación...</div>}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Rutas protegidas */}
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            
            <Route path="/libros" element={
              <ProtectedRoute>
                <BookListPage />
              </ProtectedRoute>
            } />
            
            <Route path="/libros/:id" element={
              <ProtectedRoute>
                <BookDetailsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/multas" element={
              <ProtectedRoute>
                <PenaltiesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/historial-ejemplar" element={
              <ProtectedRoute>
                <CopyHistoryPage />
              </ProtectedRoute>
            } />
            
            <Route path="/mis-libros" element={
              <ProtectedRoute>
                <MyLoansPage />
              </ProtectedRoute>
            } />
            
            <Route path="/prestamos" element={
              <ProtectedRoute>
                <LoanHistoryPage />
              </ProtectedRoute>
            } />
            
            {/* Redirecciones */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/home" replace />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;