import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Página 404 - Página no encontrada
 */
const NotFound = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Alert variant="info" className="text-center">
        <Alert.Heading>Página no encontrada</Alert.Heading>
        <p>La página que buscas no existe.</p>
        <hr />
        <div className="d-flex justify-content-center">
          <Button as={Link} to="/dashboard" variant="outline-info">
            Volver al Dashboard
          </Button>
        </div>
      </Alert>
    </Container>
  );
};

export default NotFound;
