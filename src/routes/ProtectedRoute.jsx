import { Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import Loading from '../components/common/Loading';

/**
 * Componente de ruta protegida
 *
 * Usa el estado reactivo de MsalProvider (accounts + inProgress)
 * como única fuente de verdad para la sesión.
 */
const ProtectedRoute = ({ children }) => {
  const { accounts, inProgress } = useMsal();

  if (inProgress !== InteractionStatus.None) {
    return <Loading />;
  }

  if (accounts.length === 0) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
