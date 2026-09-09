import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { formatCLP } from '../../utils/currency';
import {
  getFilaments,
  createFilament,
  updateFilament,
  updateFilamentStatus,
  getPrintingConfig,
  updatePrintingConfig,
} from '../../services/configService';

/**
 * Página Configuration de PrintWorks Admin
 * 
 * Gestiona:
 * - Filamentos (CRUD sin DELETE físico)
 * - Configuración energética
 * 
 * Integra con cn1_ms_config mediante configService
 */
const Configuration = () => {
  // Estados para filamentos
  const [filaments, setFilaments] = useState([]);
  const [filamentsLoading, setFilamentsLoading] = useState(true);
  const [filamentsError, setFilamentsError] = useState(null);
  
  // Estados para configuración energética
  const [printConfig, setPrintConfig] = useState(null);
  const [printConfigLoading, setPrintConfigLoading] = useState(true);
  const [printConfigError, setPrintConfigError] = useState(null);
  
  // Estados para modales
  const [showFilamentModal, setShowFilamentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingFilament, setEditingFilament] = useState(null);
  const [filamentToDelete, setFilamentToDelete] = useState(null);
  
  // Estados para formularios
  const [filamentForm, setFilamentForm] = useState({
    name: '',
    color: '#000000',
    pricePerKg: '',
  });
  const [printConfigForm, setPrintConfigForm] = useState({
    kwhPrice: '',
    printerConsumption: '',
  });
  
  // Estados de submit
  const [filamentSubmitting, setFilamentSubmitting] = useState(false);
  const [printConfigSubmitting, setPrintConfigSubmitting] = useState(false);
  
  // Estados de feedback
  const [filamentSuccess, setFilamentSuccess] = useState(null);
  const [printConfigSuccess, setPrintConfigSuccess] = useState(null);

  // Cargar filamentos al montar
  useEffect(() => {
    loadFilaments();
  }, []);

  // Cargar configuración de impresión al montar
  useEffect(() => {
    loadPrintConfig();
  }, []);

  const loadFilaments = async () => {
    setFilamentsLoading(true);
    setFilamentsError(null);
    try {
      const data = await getFilaments();
      setFilaments(data);
    } catch (error) {
      setFilamentsError(error.message);
    } finally {
      setFilamentsLoading(false);
    }
  };

  const loadPrintConfig = async () => {
    setPrintConfigLoading(true);
    setPrintConfigError(null);
    try {
      const data = await getPrintingConfig();
      setPrintConfig(data);
      setPrintConfigForm({
        kwhPrice: data.electricityPriceKwh || '',
        printerConsumption: data.printerConsumptionKwh || '',
      });
    } catch (error) {
      setPrintConfigError(error.message);
    } finally {
      setPrintConfigLoading(false);
    }
  };

  const handleFilamentSubmit = async (e) => {
    e.preventDefault();
    setFilamentSubmitting(true);
    setFilamentsError(null);
    setFilamentSuccess(null);

    // Validaciones UX
    if (!filamentForm.name.trim()) {
      setFilamentsError('El nombre es requerido');
      setFilamentSubmitting(false);
      return;
    }
    if (!filamentForm.color) {
      setFilamentsError('El color es requerido');
      setFilamentSubmitting(false);
      return;
    }
    if (!filamentForm.pricePerKg || parseFloat(filamentForm.pricePerKg) <= 0) {
      setFilamentsError('El precio por kg debe ser mayor a 0');
      setFilamentSubmitting(false);
      return;
    }

    try {
      const filamentData = {
        name: filamentForm.name.trim(),
        color: filamentForm.color,
        pricePerKg: parseFloat(filamentForm.pricePerKg),
        status: 'ACTIVE', // Estado por defecto para nuevos filamentos
      };

      if (editingFilament) {
        await updateFilament(editingFilament.id, filamentData);
        setFilamentSuccess('Filamento actualizado correctamente');
      } else {
        await createFilament(filamentData);
        setFilamentSuccess('Filamento creado correctamente');
      }

      setShowFilamentModal(false);
      resetFilamentForm();
      loadFilaments();
    } catch (error) {
      if (error.message.includes('409') || error.message.includes('Conflicto')) {
        setFilamentsError('Ya existe un filamento con ese nombre y color');
      } else {
        setFilamentsError(error.message);
      }
    } finally {
      setFilamentSubmitting(false);
    }
  };

  const handlePrintConfigSubmit = async (e) => {
    e.preventDefault();
    setPrintConfigSubmitting(true);
    setPrintConfigError(null);
    setPrintConfigSuccess(null);

    // Validaciones UX
    if (!printConfigForm.kwhPrice || parseFloat(printConfigForm.kwhPrice) <= 0) {
      setPrintConfigError('El precio por kWh debe ser mayor a 0');
      setPrintConfigSubmitting(false);
      return;
    }
    if (!printConfigForm.printerConsumption || parseFloat(printConfigForm.printerConsumption) <= 0) {
      setPrintConfigError('El consumo de impresora debe ser mayor a 0');
      setPrintConfigSubmitting(false);
      return;
    }

    try {
      const configData = {
        electricityPriceKwh: parseFloat(printConfigForm.kwhPrice),
        printerConsumptionKwh: parseFloat(printConfigForm.printerConsumption),
      };

      await updatePrintingConfig(configData);
      setPrintConfigSuccess('Configuración energética actualizada correctamente');
      setPrintConfig(configData);
    } catch (error) {
      setPrintConfigError(error.message);
    } finally {
      setPrintConfigSubmitting(false);
    }
  };

  const handleEditFilament = (filament) => {
    setEditingFilament(filament);
    setFilamentForm({
      name: filament.name,
      color: filament.color,
      pricePerKg: filament.pricePerKg,
    });
    setShowFilamentModal(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateFilamentStatus(id, newStatus);
      setFilamentSuccess(`Filamento ${newStatus === 'ACTIVE' ? 'activado' : 'inactivado'} correctamente`);
      loadFilaments();
    } catch (error) {
      setFilamentsError(error.message);
    }
  };

  const resetFilamentForm = () => {
    setEditingFilament(null);
    setFilamentForm({
      name: '',
      color: '#000000',
      pricePerKg: '',
    });
  };

  const openCreateModal = () => {
    resetFilamentForm();
    setShowFilamentModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Configuración</h1>
        <p className="page-subtitle">Gestión de filamentos y parámetros energéticos</p>
      </div>

      {/* Sección de Filamentos */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Filamentos</h5>
          <Button variant="primary" onClick={openCreateModal}>
            Crear Filamento
          </Button>
        </Card.Header>
        <Card.Body>
          {filamentsError && (
            <Alert variant="danger" dismissible onClose={() => setFilamentsError(null)}>
              {filamentsError}
            </Alert>
          )}
          {filamentSuccess && (
            <Alert variant="success" dismissible onClose={() => setFilamentSuccess(null)}>
              {filamentSuccess}
            </Alert>
          )}

          {filamentsLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          ) : filaments.length === 0 ? (
            <Alert variant="info">
              No hay filamentos registrados. Cree el primero para comenzar.
            </Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Color</th>
                  <th>Precio/kg</th>
                  <th>Estado</th>
                  <th>Actualizado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filaments.map((filament) => (
                  <tr key={filament.id}>
                    <td>{filament.name}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="color-preview me-2"
                          style={{ backgroundColor: filament.color, width: '24px', height: '24px', borderRadius: '4px' }}
                        />
                        <span>{filament.color}</span>
                      </div>
                    </td>
                    <td>{formatCLP(filament.pricePerKg)}</td>
                    <td>
                      <span className={`badge ${filament.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                        {filament.status}
                      </span>
                    </td>
                    <td>{formatDate(filament.updatedAt)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditFilament(filament)}
                      >
                        Editar
                      </Button>
                      {filament.status === 'ACTIVE' ? (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleStatusChange(filament.id, 'INACTIVE')}
                        >
                          Inactivar
                        </Button>
                      ) : (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleStatusChange(filament.id, 'ACTIVE')}
                        >
                          Activar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Sección de Configuración Energética */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Configuración Energética</h5>
        </Card.Header>
        <Card.Body>
          {printConfigError && (
            <Alert variant="danger" dismissible onClose={() => setPrintConfigError(null)}>
              {printConfigError}
            </Alert>
          )}
          {printConfigSuccess && (
            <Alert variant="success" dismissible onClose={() => setPrintConfigSuccess(null)}>
              {printConfigSuccess}
            </Alert>
          )}

          {printConfigLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          ) : (
            <Form onSubmit={handlePrintConfigSubmit}>
              <Alert variant="warning">
                <strong>Advertencia:</strong> Esta configuración afecta los costos utilizados para calcular precios de productos. La actualización de productos será responsabilidad de ms-products.
              </Alert>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio por kWh (CLP)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      value={printConfigForm.kwhPrice}
                      onChange={(e) => setPrintConfigForm({ ...printConfigForm, kwhPrice: e.target.value })}
                      disabled={printConfigSubmitting}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Consumo promedio de impresora (kWh/h)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      value={printConfigForm.printerConsumption}
                      onChange={(e) => setPrintConfigForm({ ...printConfigForm, printerConsumption: e.target.value })}
                      disabled={printConfigSubmitting}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type="submit"
                variant="primary"
                disabled={printConfigSubmitting}
              >
                {printConfigSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Configuración'
                )}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>

      {/* Modal para crear/editar filamento */}
      <Modal show={showFilamentModal} onHide={() => setShowFilamentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingFilament ? 'Editar Filamento' : 'Crear Filamento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFilamentSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                value={filamentForm.name}
                onChange={(e) => setFilamentForm({ ...filamentForm, name: e.target.value })}
                disabled={filamentSubmitting}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Color *</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="color"
                  value={filamentForm.color}
                  onChange={(e) => setFilamentForm({ ...filamentForm, color: e.target.value })}
                  disabled={filamentSubmitting}
                  className="me-2"
                  style={{ width: '60px' }}
                />
                <Form.Control
                  type="text"
                  value={filamentForm.color}
                  onChange={(e) => setFilamentForm({ ...filamentForm, color: e.target.value })}
                  disabled={filamentSubmitting}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio por kg (CLP) *</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={filamentForm.pricePerKg}
                onChange={(e) => setFilamentForm({ ...filamentForm, pricePerKg: e.target.value })}
                disabled={filamentSubmitting}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowFilamentModal(false)}
                disabled={filamentSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={filamentSubmitting}
              >
                {filamentSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  editingFilament ? 'Actualizar' : 'Crear'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Configuration;
