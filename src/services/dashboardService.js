/**
 * Servicio para datos del Dashboard
 * 
 * Responsabilidades:
 * - Obtener métricas de resumen (productos activos/inactivos, precios desactualizados, pedidos por estado)
 * - Obtener elementos que requieren atención
 */

import { apiClient } from './apiClient';

/**
 * Obtiene las métricas del Dashboard
 * @returns {Promise<Object>} Métricas del dashboard
 */
export const getDashboardMetrics = async () => {
  // TODO: Reemplazar con apiClient.get('/dashboard/metrics') cuando esté disponible
  // Por ahora retorna datos mock
  return {
    activeProducts: 12,
    inactiveProducts: 3,
    outdatedPrices: 2,
    createdOrders: 5,
    confirmedOrders: 8,
    completedOrders: 15,
  };
};

/**
 * Obtiene elementos que requieren atención
 * @returns {Promise<Array>} Lista de elementos que requieren atención
 */
export const getAttentionRequired = async () => {
  // TODO: Reemplazar con apiClient.get('/dashboard/attention-required') cuando esté disponible
  // Por ahora retorna datos mock
  return [
    {
      type: 'product',
      id: 1,
      name: 'Miniatura Space Marine',
      filament: 'PLA Verde',
      status: 'OUTDATED',
    },
    {
      type: 'product',
      id: 2,
      name: 'Dragón de Ébano',
      filament: 'ABS Negro',
      status: 'OUTDATED',
    },
    {
      type: 'order',
      count: 5,
      status: 'CREATED',
      message: 'Pedidos pendientes de confirmación',
    },
  ];
};

export default {
  getDashboardMetrics,
  getAttentionRequired,
};
