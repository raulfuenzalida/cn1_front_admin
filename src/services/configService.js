/**
 * Servicio para gestión de configuración
 * 
 * Responsabilidades:
 * - Obtener configuración de filamentos
 * - Crear filamento
 * - Actualizar filamento
 * - Actualizar estado de filamento
 * - Obtener configuración de impresión
 * - Actualizar configuración de impresión
 * 
 * Contrato API con cn1_ms_config:
 * - GET    /api/v1/config/filaments
 * - GET    /api/v1/config/filaments/{id}
 * - POST   /api/v1/config/filaments
 * - PUT    /api/v1/config/filaments/{id}
 * - PATCH  /api/v1/config/filaments/{id}/status
 * - GET    /api/v1/config/printing
 * - PUT    /api/v1/config/printing
 */

import { apiClient } from './apiClient';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

/**
 * Mock data para filamentos
 */
const mockFilaments = [
  {
    id: 1,
    name: 'PLA Verde',
    color: '#22C55E',
    pricePerKg: 25000,
    status: 'ACTIVE',
    updatedAt: '2024-01-15T10:30:00',
  },
  {
    id: 2,
    name: 'ABS Negro',
    color: '#1C1917',
    pricePerKg: 28000,
    status: 'ACTIVE',
    updatedAt: '2024-01-15T10:30:00',
  },
  {
    id: 3,
    name: 'PETG Azul',
    color: '#3B82F6',
    pricePerKg: 30000,
    status: 'INACTIVE',
    updatedAt: '2024-01-15T10:30:00',
  },
];

/**
 * Mock data para configuración de impresión
 */
const mockPrintConfig = {
  electricityPriceKwh: 150,
  printerConsumptionKwh: 0.11,
};

/**
 * Obtiene lista de filamentos
 * @returns {Promise<Array>} Lista de filamentos
 */
export const getFilaments = async () => {
  if (USE_MOCKS) {
    return mockFilaments;
  }
  return apiClient.get('/api/v1/config/filaments');
};

/**
 * Obtiene detalle de un filamento
 * @param {number} id - ID del filamento
 * @returns {Promise<Object>} Detalle del filamento
 */
export const getFilament = async (id) => {
  if (USE_MOCKS) {
    return mockFilaments.find(f => f.id === id) || null;
  }
  return apiClient.get(`/api/v1/config/filaments/${id}`);
};

/**
 * Crea un nuevo filamento
 * @param {Object} filamentData - Datos del filamento
 * @returns {Promise<Object>} Filamento creado
 */
export const createFilament = async (filamentData) => {
  if (USE_MOCKS) {
    return { id: Date.now(), ...filamentData, status: 'ACTIVE', updatedAt: new Date().toISOString() };
  }
  return apiClient.post('/api/v1/config/filaments', filamentData);
};

/**
 * Actualiza un filamento existente
 * @param {number} id - ID del filamento
 * @param {Object} filamentData - Datos actualizados
 * @returns {Promise<Object>} Filamento actualizado
 */
export const updateFilament = async (id, filamentData) => {
  if (USE_MOCKS) {
    return { id, ...filamentData, updatedAt: new Date().toISOString() };
  }
  return apiClient.put(`/api/v1/config/filaments/${id}`, filamentData);
};

/**
 * Actualiza el estado de un filamento
 * @param {number} id - ID del filamento
 * @param {string} status - Nuevo estado (ACTIVE o INACTIVE)
 * @returns {Promise<Object>} Filamento actualizado
 */
export const updateFilamentStatus = async (id, status) => {
  if (USE_MOCKS) {
    return { id, status, updatedAt: new Date().toISOString() };
  }
  return apiClient.patch(`/api/v1/config/filaments/${id}/status`, { status });
};

/**
 * Obtiene configuración de impresión
 * @returns {Promise<Object>} Configuración de impresión
 */
export const getPrintingConfig = async () => {
  if (USE_MOCKS) {
    return mockPrintConfig;
  }
  return apiClient.get('/api/v1/config/printing');
};

/**
 * Actualiza configuración de impresión
 * @param {Object} configData - Datos de configuración
 * @returns {Promise<Object>} Configuración actualizada
 */
export const updatePrintingConfig = async (configData) => {
  if (USE_MOCKS) {
    return { ...configData };
  }
  return apiClient.put('/api/v1/config/printing', configData);
};

// Métodos de compatibilidad (para mantener consistencia con código existente)
export const activateFilament = (id) => updateFilamentStatus(id, 'ACTIVE');
export const deactivateFilament = (id) => updateFilamentStatus(id, 'INACTIVE');
export const getPrintConfig = getPrintingConfig;
export const updatePrintConfig = updatePrintingConfig;

export default {
  getFilaments,
  getFilament,
  createFilament,
  updateFilament,
  updateFilamentStatus,
  activateFilament,
  deactivateFilament,
  getPrintingConfig,
  updatePrintingConfig,
  getPrintConfig,
  updatePrintConfig,
};
