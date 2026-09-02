import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../config/msalConfig';
import { ThemeProvider } from '../context/ThemeContext';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/Login/Login';
import Loading from '../components/common/Loading';

// Lazy loading de páginas administrativas y de error
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Unauthorized = lazy(() => import('../pages/Unauthorized/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

/**
 * Configuración de rutas de la aplicación
 * 
 * Rutas públicas:
 * - /login
 * 
 * Rutas protegidas (requieren autenticación MSAL):
 * - /dashboard
 * - /products
 * - /orders
 * - /configuration
 * 
 * Las páginas administrativas se cargan bajo demanda con React.lazy()
 * para optimizar el bundle inicial.
 */
const AppRoutes = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Ruta pública - Login */}
              <Route path="/login" element={<Login />} />

              {/* Rutas protegidas con layout administrativo */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<div className="p-4">Productos (próximamente)</div>} />
                <Route path="orders" element={<div className="p-4">Pedidos (próximamente)</div>} />
                <Route path="configuration" element={<div className="p-4">Configuración (próximamente)</div>} />
              </Route>

              {/* Rutas de error */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </MsalProvider>
  );
};

export default AppRoutes;
