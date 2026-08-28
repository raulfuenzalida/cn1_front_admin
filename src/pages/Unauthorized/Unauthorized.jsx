import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Página de acceso no autorizado
 */
const Unauthorized = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Acceso no autorizado</Alert.Heading>
        <p>No tienes permisos para acceder a esta página.</p>
        <hr />
        <div className="d-flex justify-content-center">
          <Button as={Link} to="/dashboard" variant="outline-danger">
            Volver al Dashboard
          </Button>
        </div>
      </Alert>
    </Container>
  );
};

export default Unauthorized;
