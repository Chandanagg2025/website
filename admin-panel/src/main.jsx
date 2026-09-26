import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import { AdminDataProvider } from './context/AdminDataContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthProvider>
      <AdminDataProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AdminDataProvider>
    </AdminAuthProvider>
  </StrictMode>,
);
