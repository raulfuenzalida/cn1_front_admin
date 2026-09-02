/**
 * Servicio para gestión de pedidos
 * 
 * Responsabilidades:
 * - Listar pedidos con filtros
 * - Obtener detalle de pedido
 * - Confirmar pedido
 * - Completar pedido
 * - Cancelar pedido
 * - Descargar comprobante PDF
 */

import { apiClient } from './apiClient';

/**
 * Obtiene lista de pedidos
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>} Lista de pedidos
 */
export const getOrders = async (filters = {}) => {
  // TODO: Reemplazar con apiClient.get('/orders', { params: filters }) cuando esté disponible
  // Por ahora retorna datos mock
  return [
    {
      id: 'PW-000124',
      customer: 'Juan Pérez',
      email: 'juan.perez@email.com',
      date: '2026-09-01T10:30:00Z',
      status: 'CREATED',
      total: 7900,
      items: [
        {
          productId: 1,
          productName: 'Miniatura Space Marine',
          quantity: 2,
          unitPrice: 3900,
          subtotal: 7800,
        },
      ],
    },
    {
      id: 'PW-000123',
      customer: 'María González',
      email: 'maria.gonzalez@email.com',
      date: '2026-08-31T15:45:00Z',
      status: 'CONFIRMED',
      total: 15800,
      items: [
        {
          productId: 1,
          productName: 'Miniatura Space Marine',
          quantity: 4,
          unitPrice: 3900,
          subtotal: 15600,
        },
      ],
    },
    {
      id: 'PW-000122',
      customer: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      date: '2026-08-30T09:15:00Z',
      status: 'COMPLETED',
      total: 3900,
      items: [
        {
          productId: 1,
          productName: 'Miniatura Space Marine',
          quantity: 1,
          unitPrice: 3900,
          subtotal: 3900,
        },
      ],
    },
    {
      id: 'PW-000121',
      customer: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      date: '2026-08-29T14:20:00Z',
      status: 'CANCELLED',
      total: 7900,
      items: [
        {
          productId: 1,
          productName: 'Miniatura Space Marine',
          quantity: 2,
          unitPrice: 3900,
          subtotal: 7800,
        },
      ],
    },
  ];
};

/**
 * Obtiene detalle de un pedido
 * @param {string} id - ID del pedido
 * @returns {Promise<Object>} Detalle del pedido
 */
export const getOrder = async (id) => {
  // TODO: Reemplazar con apiClient.get(`/orders/${id}`) cuando esté disponible
  const orders = await getOrders();
  return orders.find(o => o.id === id) || null;
};

/**
 * Confirma un pedido
 * @param {string} id - ID del pedido
 * @returns {Promise<Object>} Pedido actualizado
 */
export const confirmOrder = async (id) => {
  // TODO: Reemplazar con apiClient.post(`/orders/${id}/confirm`) cuando esté disponible
  return { id, status: 'CONFIRMED' };
};

/**
 * Completa un pedido
 * @param {string} id - ID del pedido
 * @returns {Promise<Object>} Pedido actualizado
 */
export const completeOrder = async (id) => {
  // TODO: Reemplazar con apiClient.post(`/orders/${id}/complete`) cuando esté disponible
  return { id, status: 'COMPLETED' };
};

/**
 * Cancela un pedido
 * @param {string} id - ID del pedido
 * @returns {Promise<Object>} Pedido actualizado
 */
export const cancelOrder = async (id) => {
  // TODO: Reemplazar con apiClient.post(`/orders/${id}/cancel`) cuando esté disponible
  return { id, status: 'CANCELLED' };
};

/**
 * Descarga comprobante PDF de un pedido
 * @param {string} id - ID del pedido
 * @returns {Promise<Blob>} PDF como blob
 */
export const downloadReceipt = async (id) => {
  // TODO: Reemplazar con apiClient.get(`/orders/${id}/receipt`, { responseType: 'blob' }) cuando esté disponible
  // Por ahora retorna null (mock)
  console.log(`Descargando comprobante para pedido ${id}`);
  return null;
};

export default {
  getOrders,
  getOrder,
  confirmOrder,
  completeOrder,
  cancelOrder,
  downloadReceipt,
};
