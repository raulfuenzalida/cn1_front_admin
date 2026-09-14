import { Fragment, useEffect, useState } from 'react';
import {
  cancelOrder,
  completeOrder,
  confirmOrder,
  downloadReceipt,
  getOrder,
  getOrders,
} from '../../services/orderService';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loadingDetailId, setLoadingDetailId] = useState(null);
  const [detailError, setDetailError] = useState('');

  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [actionError, setActionError] = useState('');

  const [downloadingReceiptId, setDownloadingReceiptId] = useState(null);
  const [receiptError, setReceiptError] = useState('');

  const loadOrders = async () => {
    const response = await getOrders();

    setOrders(
      Array.isArray(response)
        ? response
        : response?.content ?? []
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        await loadOrders();
      } catch (err) {
        console.error('Error al cargar pedidos:', err);

        setError(
          err?.message ||
            'No fue posible obtener los pedidos.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleToggleDetails = async (orderId) => {
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
      setDetailError('');
      return;
    }

    try {
      setLoadingDetailId(orderId);
      setDetailError('');

      const detail = await getOrder(orderId);

      setOrderDetails((current) => ({
        ...current,
        [orderId]: detail,
      }));

      setSelectedOrderId(orderId);
    } catch (err) {
      console.error(
        'Error al obtener detalle del pedido:',
        err
      );

      setDetailError(
        err?.message ||
          'No fue posible obtener el detalle del pedido.'
      );
    } finally {
      setLoadingDetailId(null);
    }
  };

  const refreshOrderDetail = async (orderId) => {
    if (selectedOrderId !== orderId) {
      return;
    }

    const detail = await getOrder(orderId);

    setOrderDetails((current) => ({
      ...current,
      [orderId]: detail,
    }));
  };

  const handleConfirmOrder = async (order) => {
    try {
      setUpdatingOrderId(order.id);
      setActionError('');

      await confirmOrder(order.id);
      await loadOrders();
      await refreshOrderDetail(order.id);
    } catch (err) {
      console.error('Error al confirmar pedido:', err);

      setActionError(
        err?.message ||
          'No fue posible confirmar el pedido.'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCompleteOrder = async (order) => {
    try {
      setUpdatingOrderId(order.id);
      setActionError('');

      await completeOrder(order.id);
      await loadOrders();
      await refreshOrderDetail(order.id);
    } catch (err) {
      console.error('Error al completar pedido:', err);

      setActionError(
        err?.message ||
          'No fue posible completar el pedido.'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = async (order) => {
    try {
      setUpdatingOrderId(order.id);
      setActionError('');

      await cancelOrder(order.id);
      await loadOrders();
      await refreshOrderDetail(order.id);
    } catch (err) {
      console.error('Error al cancelar pedido:', err);

      setActionError(
        err?.message ||
          'No fue posible cancelar el pedido.'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDownloadReceipt = async (order) => {
    try {
      setDownloadingReceiptId(order.id);
      setReceiptError('');

      const blob = await downloadReceipt(order.id);

      if (!(blob instanceof Blob)) {
        throw new Error(
          'El comprobante recibido no es un archivo válido.'
        );
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download =
        `${order.orderNumber || `pedido-${order.id}`}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        'Error al descargar comprobante:',
        err
      );

      setReceiptError(
        err?.message ||
          'No fue posible descargar el comprobante.'
      );
    } finally {
      setDownloadingReceiptId(null);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) {
      return '-';
    }

    return `$${Number(value).toLocaleString('es-CL')}`;
  };

  const formatDate = (value) => {
    if (!value) {
      return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('es-CL');
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'CREATED':
        return 'Creado';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'CREATED':
        return 'text-bg-warning';
      case 'CONFIRMED':
        return 'text-bg-primary';
      case 'COMPLETED':
        return 'text-bg-success';
      case 'CANCELLED':
        return 'text-bg-secondary';
      default:
        return 'text-bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2>Pedidos</h2>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2>Pedidos</h2>

        <div
          className="alert alert-danger"
          role="alert"
        >
          <strong>Error al cargar pedidos:</strong>{' '}
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="mb-1">Pedidos</h2>

        <p className="text-muted mb-0">
          Gestión de pedidos registrados en PrintWorks
        </p>
      </div>

      {actionError && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          <strong>Error:</strong> {actionError}
        </div>
      )}

      {detailError && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          <strong>Error al cargar detalle:</strong>{' '}
          {detailError}
        </div>
      )}

      {receiptError && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          <strong>Error al descargar comprobante:</strong>{' '}
          {receiptError}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="alert alert-info">
          No existen pedidos registrados.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const updating =
                  updatingOrderId === order.id;

                const downloading =
                  downloadingReceiptId === order.id;

                const loadingDetail =
                  loadingDetailId === order.id;

                const showDetails =
                  selectedOrderId === order.id;

                const detail =
                  orderDetails[order.id];

                return (
                  <Fragment key={order.id}>
                    <tr>
                      <td>
                        <strong>
                          {order.orderNumber ||
                            `#${order.id}`}
                        </strong>
                      </td>

                      <td>
                        {order.customerName || '-'}
                      </td>

                      <td>
                        {order.customerEmail || '-'}
                      </td>

                      <td>
                        {formatDate(order.createdAt)}
                      </td>

                      <td>
                        <strong>
                          {formatCurrency(order.total)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              handleToggleDetails(order.id)
                            }
                            disabled={
                              updating ||
                              downloading ||
                              loadingDetail
                            }
                          >
                            {loadingDetail
                              ? 'Cargando...'
                              : showDetails
                                ? 'Ocultar detalle'
                                : 'Ver detalle'}
                          </button>

                          {order.status === 'CREATED' && (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                                onClick={() =>
                                  handleConfirmOrder(order)
                                }
                                disabled={
                                  updating || downloading
                                }
                              >
                                {updating
                                  ? 'Actualizando...'
                                  : 'Confirmar'}
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleCancelOrder(order)
                                }
                                disabled={
                                  updating || downloading
                                }
                              >
                                Cancelar
                              </button>
                            </>
                          )}

                          {order.status === 'CONFIRMED' && (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                                onClick={() =>
                                  handleCompleteOrder(order)
                                }
                                disabled={
                                  updating || downloading
                                }
                              >
                                {updating
                                  ? 'Actualizando...'
                                  : 'Completar'}
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleCancelOrder(order)
                                }
                                disabled={
                                  updating || downloading
                                }
                              >
                                Cancelar
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              handleDownloadReceipt(order)
                            }
                            disabled={
                              updating || downloading
                            }
                          >
                            {downloading
                              ? 'Descargando...'
                              : 'Comprobante'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {showDetails && detail && (
                      <tr>
                        <td colSpan="7">
                          <div className="card border-0 bg-light">
                            <div className="card-body">
                              <h6 className="mb-3">
                                Detalle del pedido
                              </h6>

                              {detail.items?.length > 0 ? (
                                <div className="table-responsive">
                                  <table className="table table-sm mb-0">
                                    <thead>
                                      <tr>
                                        <th>Producto</th>
                                        <th>Precio unitario</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {detail.items.map((item) => (
                                        <tr key={item.id}>
                                          <td>
                                            <strong>
                                              {item.productName}
                                            </strong>

                                            <div className="small text-muted">
                                              Producto #{item.idProduct}
                                            </div>
                                          </td>

                                          <td>
                                            {formatCurrency(
                                              item.unitPrice
                                            )}
                                          </td>

                                          <td>
                                            {item.quantity}
                                          </td>

                                          <td>
                                            {formatCurrency(
                                              item.subtotal
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-muted mb-0">
                                  Este pedido no contiene productos.
                                </p>
                              )}

                              <hr />

                              <div className="row g-3">
                                <div className="col-md-4">
                                  <strong>Creado:</strong>
                                  <div>
                                    {formatDate(
                                      detail.createdAt
                                    )}
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <strong>
                                    Confirmado:
                                  </strong>
                                  <div>
                                    {formatDate(
                                      detail.confirmedAt
                                    )}
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <strong>
                                    Completado:
                                  </strong>
                                  <div>
                                    {formatDate(
                                      detail.completedAt
                                    )}
                                  </div>
                                </div>

                                {detail.cancelledAt && (
                                  <div className="col-md-4">
                                    <strong>
                                      Cancelado:
                                    </strong>
                                    <div>
                                      {formatDate(
                                        detail.cancelledAt
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="col-md-4">
                                  <strong>
                                    Última actualización:
                                  </strong>
                                  <div>
                                    {formatDate(
                                      detail.updatedAt
                                    )}
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <strong>Total:</strong>
                                  <div>
                                    {formatCurrency(
                                      detail.total
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Orders;