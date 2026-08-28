import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { authService } from '../../services/authService';

/**
 * Página de Login para PrintWorks Admin
 * 
 * Utiliza MSAL para autenticación con Microsoft Entra ID mediante redirect.
 * No existe autenticación local con email/password.
 * 
 * Flujo:
 * 1. Usuario hace clic en "Iniciar sesión con Microsoft"
 * 2. loginRedirect() redirige a Microsoft Entra ID
 * 3. Después de autenticarse, Entra ID redirige de vuelta a la aplicación
 * 4. MSAL procesa la respuesta y establece la cuenta
 * 5. ProtectedRoute detecta autenticación y redirige al dashboard
 */
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { instance, inProgress } = useMsal();

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (authService.isAuthenticated() && inProgress === 'none') {
      navigate('/dashboard');
    }
  }, [inProgress, navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login();
      // loginRedirect() redirige a Microsoft Entra ID
      // El flujo continúa cuando MSAL procesa el redirect de vuelta
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, inténtelo nuevamente.');
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Body className="p-5 text-center">
              <div className="mb-4">
                <h1 className="brand-logo justify-content-center mb-3">
                  PrintWorks
                </h1>
                <h2 className="h4 mb-2 login-text">Admin</h2>
                <p className="text-muted login-text">Panel de administración</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-100"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Cargando...
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="me-2"
                    >
                      <path d="M0 0h4v4H0V0zm0 5h4v4H0V5zm0 5h4v4H0v-4zm5-10h4v4H5V0zm0 5h4v4H5V5zm0 5h4v4H5v-4zm5-10h4v4h-4V0zm0 5h4v4h-4V5zm0 5h4v4h-4v-4z" />
                    </svg>
                    Iniciar sesión con Microsoft
                  </>
                )}
              </Button>

              <p className="mt-4 mb-0 text-muted small login-text">
                Se requiere autenticación con Microsoft Entra ID
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
