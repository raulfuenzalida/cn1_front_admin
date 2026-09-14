/**
 * Servicio para gestión de pedidos
 *
 * Responsabilidades:
 * - Listar pedidos
 * - Obtener detalle de pedido
 * - Confirmar pedido
 * - Completar pedido
 * - Cancelar pedido
 * - Descargar comprobante PDF
 */

import { apiClient } from './apiClient';

/**
 * Obtiene la lista de pedidos.
 *
 * @returns {Promise<Array>} Lista de pedidos
 */
export const getOrders = async () => {
  return apiClient.get('/api/v1/orders');
};

/**
 * Obtiene el detalle de un pedido.
 *
 * @param {number|string} id - ID del pedido
 * @returns {Promise<Object>} Detalle del pedido
 */
export const getOrder = async (id) => {
  return apiClient.get(`/api/v1/orders/${id}`);
};

/**
 * Confirma un pedido.
 *
 * Transición:
 * CREATED -> CONFIRMED
 *
 * @param {number|string} id - ID del pedido
 * @returns {Promise<Object>} Pedido actualizado
 */
export const confirmOrder = async (id) => {
  return apiClient.post(`/api/v1/orders/${id}/confirm`);
};

/**
 * Completa un pedido.
 *
 * Transición:
 * CONFIRMED -> COMPLETED
 *
 * @param {number|string} id - ID del pedido
 * @returns {Promise<Object>} Pedido actualizado
 */
export const completeOrder = async (id) => {
  return apiClient.post(`/api/v1/orders/${id}/complete`);
};

/**
 * Cancela un pedido.
 *
 * Transiciones:
 * CREATED -> CANCELLED
 * CONFIRMED -> CANCELLED
 *
 * @param {number|string} id - ID del pedido
 * @returns {Promise<Object>} Pedido actualizado
 */
export const cancelOrder = async (id) => {
  return apiClient.post(`/api/v1/orders/${id}/cancel`);
};

/**
 * Obtiene el comprobante PDF de un pedido.
 *
 * @param {number|string} id - ID del pedido
 * @returns {Promise<Blob>} Comprobante PDF
 */
export const downloadReceipt = async (id) => {
  return apiClient.get(
    `/api/v1/orders/${id}/receipt`,
    { responseType: 'blob' }
  );
};

export default {
  getOrders,
  getOrder,
  confirmOrder,
  completeOrder,
  cancelOrder,
  downloadReceipt,
};