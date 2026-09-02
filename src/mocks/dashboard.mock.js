/**
 * Mock data para Dashboard
 * 
 * Representa métricas operativas y elementos que requieren atención
 */

export const dashboardMetrics = {
  activeProducts: 12,
  inactiveProducts: 3,
  outdatedPrices: 2,
  createdOrders: 5,
  confirmedOrders: 8,
  completedOrders: 15,
};

export const attentionRequired = [
  {
    type: 'product',
    id: 1,
    name: 'Miniatura Space Marine',
    filament: 'PLA Verde',
    status: 'OUTDATED',
    reason: 'Precio desactualizado tras cambio en costo kWh',
  },
  {
    type: 'product',
    id: 2,
    name: 'Dragón de Ébano',
    filament: 'ABS Negro',
    status: 'OUTDATED',
    reason: 'Precio desactualizado tras cambio en costo filamento',
  },
  {
    type: 'order',
    count: 5,
    status: 'CREATED',
    message: 'Pedidos pendientes de confirmación',
    reason: 'Requieren revisión antes de procesar',
  },
];
