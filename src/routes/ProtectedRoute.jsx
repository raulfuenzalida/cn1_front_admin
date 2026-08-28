import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Spinner } from 'react-bootstrap';

/**
 * Componente de ruta protegida
 * 
 * Verifica que exista una sesión MSAL activa antes de permitir acceso.
 * Muestra estado de carga mientras MSAL resuelve el estado de autenticación.
 */
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Verificar si hay cuenta autenticada
      const account = authService.getAccount();
      setIsAuthenticated(account !== null);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status" />
        <p className="loading-text">Verificando autenticación...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
