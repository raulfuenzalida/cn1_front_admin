import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

/**
 * Página Dashboard de PrintWorks Admin
 * 
 * Muestra una vista rápida del estado operativo.
 * Los datos estarán disponibles cuando se implementen ms-products y ms-orders.
 */
const Dashboard = () => {
  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Vista general del estado operativo</p>
      </div>

      <Alert variant="info">
        <Alert.Heading>Dashboard en desarrollo</Alert.Heading>
        <p className="mb-0">
          El Dashboard estará disponible cuando se implementen los microservicios 
          <strong>ms-products</strong> y <strong>ms-orders</strong>. 
          Por ahora, utilice la sección de <strong>Configuración</strong> para gestionar filamentos y parámetros energéticos.
        </p>
      </Alert>

      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={3}>
          <Card className="stat-card h-100">
            <Card.Body>
              <h3 className="stat-value text-muted">-</h3>
              <p className="stat-label">Productos activos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Card className="stat-card h-100">
            <Card.Body>
              <h3 className="stat-value text-muted">-</h3>
              <p className="stat-label">Productos inactivos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Card className="stat-card h-100">
            <Card.Body>
              <h3 className="stat-value text-muted">-</h3>
              <p className="stat-label">Precios desactualizados</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Card className="stat-card h-100">
            <Card.Body>
              <h3 className="stat-value text-muted">-</h3>
              <p className="stat-label">Pedidos pendientes</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Atención requerida</h5>
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-0">
            No hay elementos que requieran atención inmediata.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
