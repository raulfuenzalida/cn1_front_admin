/**
 * Servicio para datos del Dashboard
 *
 * Responsabilidades:
 * - Obtener métricas de resumen de productos y pedidos
 * - Obtener métricas comerciales
 * - Obtener elementos que requieren atención
 * - Consolidar información de los microservicios existentes
 */

import { getProducts } from './productService';
import { getOrders } from './orderService';

/**
 * Normaliza la respuesta paginada de ms_products.
 *
 * @param {Object|Array} response Respuesta de productos
 * @returns {Array} Lista de productos
 */
const normalizeProducts = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.content ?? [];
};

/**
 * Normaliza la respuesta de ms_orders.
 *
 * @param {Object|Array} response Respuesta de pedidos
 * @returns {Array} Lista de pedidos
 */
const normalizeOrders = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.content ?? [];
};

/**
 * Construye las métricas del Dashboard.
 *
 * @param {Array} products Lista de productos
 * @param {Array} orders Lista de pedidos
 * @returns {Object} Métricas del Dashboard
 */
const buildMetrics = (products, orders) => {
  const activeProducts = products.filter(
    (product) => product.status === 'ACTIVE'
  ).length;

  const inactiveProducts = products.filter(
    (product) => product.status === 'INACTIVE'
  ).length;

  const outdatedPrices = products.filter(
    (product) => product.priceStatus === 'OUTDATED'
  ).length;

  const createdOrders = orders.filter(
    (order) => order.status === 'CREATED'
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === 'CONFIRMED'
  ).length;

  const completedOrdersList = orders.filter(
    (order) => order.status === 'COMPLETED'
  );

  const cancelledOrders = orders.filter(
    (order) => order.status === 'CANCELLED'
  ).length;

  const completedOrders = completedOrdersList.length;

  const completedSalesTotal = completedOrdersList.reduce(
    (total, order) => total + Number(order.total ?? 0),
    0
  );

  const averageCompletedOrder =
    completedOrders > 0
      ? completedSalesTotal / completedOrders
      : 0;

  return {
    totalProducts: products.length,
    activeProducts,
    inactiveProducts,
    outdatedPrices,

    totalOrders: orders.length,
    createdOrders,
    confirmedOrders,
    completedOrders,
    cancelledOrders,

    completedSalesTotal,
    averageCompletedOrder,
  };
};

/**
 * Construye la lista de elementos que requieren atención.
 *
 * Actualmente considera:
 * - Productos con precio OUTDATED
 * - Pedidos CREATED pendientes de confirmación
 *
 * @param {Array} products Lista de productos
 * @param {Array} orders Lista de pedidos
 * @returns {Array} Elementos que requieren atención
 */
const buildAttentionItems = (products, orders) => {
  const outdatedProducts = products
    .filter((product) => product.priceStatus === 'OUTDATED')
    .map((product) => ({
      type: 'product',
      id: product.id,
      name: product.name,
      idFilament: product.idFilament,
      status: product.priceStatus,
    }));

  const createdOrders = orders.filter(
    (order) => order.status === 'CREATED'
  );

  const attentionItems = [...outdatedProducts];

  if (createdOrders.length > 0) {
    attentionItems.push({
      type: 'order',
      count: createdOrders.length,
      status: 'CREATED',
      message:
        createdOrders.length === 1
          ? 'Pedido pendiente de confirmación'
          : 'Pedidos pendientes de confirmación',
    });
  }

  return attentionItems;
};

/**
 * Obtiene toda la información necesaria para el Dashboard.
 *
 * Realiza una única consulta a ms_products y una única consulta
 * a ms_orders, reutilizando ambas respuestas para construir
 * métricas y elementos que requieren atención.
 *
 * @returns {Promise<Object>} Datos consolidados del Dashboard
 */
export const getDashboardData = async () => {
  const [productsResponse, ordersResponse] = await Promise.all([
    getProducts(),
    getOrders(),
  ]);

  const products = normalizeProducts(productsResponse);
  const orders = normalizeOrders(ordersResponse);

  return {
    metrics: buildMetrics(products, orders),
    attentionItems: buildAttentionItems(products, orders),
  };
};

export default {
  getDashboardData,
};