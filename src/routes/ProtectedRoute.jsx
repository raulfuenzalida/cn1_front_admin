import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
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
  const { inProgress } = useMsal();

  useEffect(() => {
    const checkAuth = () => {
      // Verificar si hay cuenta autenticada
      const account = authService.getAccount();
      setIsAuthenticated(account !== null);
    };

    checkAuth();
  }, [inProgress]); // Re-verificar cuando cambie el estado de progreso de MSAL

  if (inProgress !== 'none' || isAuthenticated === null) {
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
