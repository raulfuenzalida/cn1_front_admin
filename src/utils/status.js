/**
 * Utilidades para estados de productos y pedidos
 */

// Estados comerciales de productos
export const COMMERCIAL_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

// Estados de precio de productos
export const PRICE_STATUS = {
  CURRENT: 'CURRENT',
  OUTDATED: 'OUTDATED',
};

// Estados de pedidos
export const ORDER_STATUS = {
  CREATED: 'CREATED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

/**
 * Obtiene el label para un estado comercial
 * @param {string} status - Estado comercial
 * @returns {string} Label del estado
 */
export const getCommercialStatusLabel = (status) => {
  const labels = {
    [COMMERCIAL_STATUS.ACTIVE]: 'Activo',
    [COMMERCIAL_STATUS.INACTIVE]: 'Inactivo',
  };
  return labels[status] || status;
};

/**
 * Obtiene el label para un estado de precio
 * @param {string} status - Estado de precio
 * @returns {string} Label del estado
 */
export const getPriceStatusLabel = (status) => {
  const labels = {
    [PRICE_STATUS.CURRENT]: 'Actualizado',
    [PRICE_STATUS.OUTDATED]: 'Desactualizado',
  };
  return labels[status] || status;
};

/**
 * Obtiene el label para un estado de pedido
 * @param {string} status - Estado de pedido
 * @returns {string} Label del estado
 */
export const getOrderStatusLabel = (status) => {
  const labels = {
    [ORDER_STATUS.CREATED]: 'Creado',
    [ORDER_STATUS.CONFIRMED]: 'Confirmado',
    [ORDER_STATUS.COMPLETED]: 'Completado',
    [ORDER_STATUS.CANCELLED]: 'Cancelado',
  };
  return labels[status] || status;
};

/**
 * Verifica si un producto puede activarse
 * Un producto OUTDATED no puede activarse
 * @param {string} priceStatus - Estado de precio
 * @returns {boolean} True si puede activarse
 */
export const canActivateProduct = (priceStatus) => {
  return priceStatus !== PRICE_STATUS.OUTDATED;
};

/**
 * Verifica si un estado de pedido permite confirmación
 * @param {string} status - Estado de pedido
 * @returns {boolean} True si puede confirmarse
 */
export const canConfirmOrder = (status) => {
  return status === ORDER_STATUS.CREATED;
};

/**
 * Verifica si un estado de pedido permite cancelación
 * @param {string} status - Estado de pedido
 * @returns {boolean} True si puede cancelarse
 */
export const canCancelOrder = (status) => {
  return status === ORDER_STATUS.CREATED || status === ORDER_STATUS.CONFIRMED;
};

/**
 * Verifica si un estado de pedido permite completado
 * @param {string} status - Estado de pedido
 * @returns {boolean} True si puede completarse
 */
export const canCompleteOrder = (status) => {
  return status === ORDER_STATUS.CONFIRMED;
};

/**
 * Obtiene las transiciones válidas para un estado de pedido
 * @param {string} status - Estado actual
 * @returns {Array} Array de estados válidos para transición
 */
export const getValidOrderTransitions = (status) => {
  const transitions = {
    [ORDER_STATUS.CREATED]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.COMPLETED]: [],
    [ORDER_STATUS.CANCELLED]: [],
  };
  return transitions[status] || [];
};

/**
 * Combina estados comerciales y de precio para validación
 * @param {string} commercialStatus - Estado comercial
 * @param {string} priceStatus - Estado de precio
 * @returns {Object} Objeto con estado combinado y validaciones
 */
export const getProductStatus = (commercialStatus, priceStatus) => {
  return {
    commercial: commercialStatus,
    price: priceStatus,
    canActivate: canActivateProduct(priceStatus),
    isOutdated: priceStatus === PRICE_STATUS.OUTDATED,
    isInactive: commercialStatus === COMMERCIAL_STATUS.INACTIVE,
  };
};
