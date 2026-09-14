import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Badge,
  Button,
} from 'react-bootstrap';
import { getDashboardData } from '../../services/dashboardService';

const initialMetrics = {
  totalProducts: 0,
  activeProducts: 0,
  inactiveProducts: 0,
  outdatedPrices: 0,
  totalOrders: 0,
  createdOrders: 0,
  confirmedOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  completedSalesTotal: 0,
  averageCompletedOrder: 0,
};

/**
 * Página Dashboard de PrintWorks Admin
 *
 * Muestra una vista general del estado operativo y comercial
 * utilizando información real de ms_products y ms_orders.
 */
const Dashboard = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(initialMetrics);
  const [attentionItems, setAttentionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getDashboardData();

      setMetrics(data.metrics);
      setAttentionItems(data.attentionItems);
    } catch (err) {
      console.error('Error al cargar Dashboard:', err);

      setError(
        err?.message ||
          'No fue posible obtener la información del Dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    Number(value ?? 0).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    });

  if (loading) {
    return (
      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>

          <p className="page-subtitle">
            Vista general del estado operativo
          </p>
        </div>

        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">
              Cargando Dashboard...
            </span>
          </Spinner>

          <p className="text-muted mt-3 mb-0">
            Cargando información...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>

        <p className="page-subtitle">
          Vista general del estado operativo de PrintWorks
        </p>
      </div>

      {error && (
        <Alert variant="danger">
          <Alert.Heading>
            No se pudo cargar el Dashboard
          </Alert.Heading>

          <p className="mb-0">{error}</p>
        </Alert>
      )}

      {!error && (
        <>
          <h5 className="mb-3">Resumen general</h5>

          <Row className="g-4 mb-4">
            <Col xs={12} sm={6} xl={3}>
              <Card className="stat-card h-100">
                <Card.Body>
                  <div className="text-muted small mb-2">
                    Productos registrados
                  </div>

                  <h2 className="stat-value mb-1">
                    {metrics.totalProducts}
                  </h2>

                  <small className="text-muted">
                    {metrics.activeProducts} activos ·{' '}
                    {metrics.inactiveProducts} inactivos
                  </small>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} xl={3}>
              <Card className="stat-card h-100">
                <Card.Body>
                  <div className="text-muted small mb-2">
                    Productos activos
                  </div>

                  <h2 className="stat-value mb-1">
                    {metrics.activeProducts}
                  </h2>

                  <small className="text-muted">
                    Disponibles actualmente
                  </small>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} xl={3}>
              <Card className="stat-card h-100">
                <Card.Body>
                  <div className="text-muted small mb-2">
                    Precios desactualizados
                  </div>

                  <h2 className="stat-value mb-1">
                    {metrics.outdatedPrices}
                  </h2>

                  <small className="text-muted">
                    Requieren recálculo
                  </small>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} xl={3}>
              <Card className="stat-card h-100">
                <Card.Body>
                  <div className="text-muted small mb-2">
                    Pedidos registrados
                  </div>

                  <h2 className="stat-value mb-1">
                    {metrics.totalOrders}
                  </h2>

                  <small className="text-muted">
                    Total histórico
                  </small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            <Col xs={12} lg={7}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">
                    Estado de pedidos
                  </h5>
                </Card.Header>

                <Card.Body>
                  <Row className="g-3">
                    <Col xs={6} md={3}>
                      <div className="border rounded p-3 h-100">
                        <Badge bg="warning" text="dark">
                          Creados
                        </Badge>

                        <h3 className="mt-3 mb-0">
                          {metrics.createdOrders}
                        </h3>
                      </div>
                    </Col>

                    <Col xs={6} md={3}>
                      <div className="border rounded p-3 h-100">
                        <Badge bg="primary">
                          Confirmados
                        </Badge>

                        <h3 className="mt-3 mb-0">
                          {metrics.confirmedOrders}
                        </h3>
                      </div>
                    </Col>

                    <Col xs={6} md={3}>
                      <div className="border rounded p-3 h-100">
                        <Badge bg="success">
                          Completados
                        </Badge>

                        <h3 className="mt-3 mb-0">
                          {metrics.completedOrders}
                        </h3>
                      </div>
                    </Col>

                    <Col xs={6} md={3}>
                      <div className="border rounded p-3 h-100">
                        <Badge bg="secondary">
                          Cancelados
                        </Badge>

                        <h3 className="mt-3 mb-0">
                          {metrics.cancelledOrders}
                        </h3>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} lg={5}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">
                    Resumen comercial
                  </h5>
                </Card.Header>

                <Card.Body>
                  <div className="mb-4">
                    <div className="text-muted small mb-1">
                      Ventas completadas
                    </div>

                    <h3 className="mb-0">
                      {formatCurrency(
                        metrics.completedSalesTotal
                      )}
                    </h3>
                  </div>

                  <div>
                    <div className="text-muted small mb-1">
                      Ticket promedio
                    </div>

                    <h3 className="mb-0">
                      {formatCurrency(
                        metrics.averageCompletedOrder
                      )}
                    </h3>
                  </div>

                  <small className="text-muted d-block mt-3">
                    Considera únicamente pedidos completados.
                  </small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Atención requerida
              </h5>

              {attentionItems.length > 0 && (
                <Badge bg="warning" text="dark">
                  {attentionItems.length}
                </Badge>
              )}
            </Card.Header>

            <Card.Body>
              {attentionItems.length === 0 ? (
                <Alert variant="success" className="mb-0">
                  No hay elementos que requieran atención inmediata.
                </Alert>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {attentionItems.map((item) => {
                    if (item.type === 'product') {
                      return (
                        <div
                          key={`product-${item.id}`}
                          className="border rounded p-3"
                        >
                          <div className="d-flex justify-content-between align-items-center gap-3">
                            <div>
                              <strong>{item.name}</strong>

                              <div className="text-muted small mt-1">
                                Producto #{item.id} · Requiere
                                recálculo antes de volver a estar
                                disponible.
                              </div>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <Badge bg="warning" text="dark">
                                Precio desactualizado
                              </Badge>

                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => navigate('/products')}
                              >
                                Ir a productos
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (item.type === 'order') {
                      return (
                        <div
                          key={`order-${item.status}`}
                          className="border rounded p-3"
                        >
                          <div className="d-flex justify-content-between align-items-center gap-3">
                            <div>
                              <strong>{item.message}</strong>

                              <div className="text-muted small mt-1">
                                Requiere revisión en la sección de
                                pedidos.
                              </div>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <Badge bg="primary">
                                {item.count}
                              </Badge>

                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => navigate('/orders')}
                              >
                                Ir a pedidos
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Dashboard;