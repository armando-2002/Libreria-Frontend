
/*
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
*/
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from './services/AuthContext';
import App from './App.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);