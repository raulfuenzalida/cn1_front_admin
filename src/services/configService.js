/**
 * Servicio para gestión de configuración
 * 
 * Responsabilidades:
 * - Obtener configuración de filamentos
 * - Crear filamento
 * - Actualizar filamento
 * - Activar/inactivar filamento
 * - Obtener configuración de impresión
 * - Actualizar configuración de impresión
 */

import { apiClient } from './apiClient';

/**
 * Obtiene lista de filamentos
 * @returns {Promise<Array>} Lista de filamentos
 */
export const getFilaments = async () => {
  // TODO: Reemplazar con apiClient.get('/config/filaments') cuando esté disponible
  // Por ahora retorna datos mock
  return [
    {
      id: 1,
      name: 'PLA Verde',
      color: '#22C55E',
      pricePerKg: 25000,
      status: 'ACTIVE',
    },
    {
      id: 2,
      name: 'ABS Negro',
      color: '#1C1917',
      pricePerKg: 28000,
      status: 'ACTIVE',
    },
    {
      id: 3,
      name: 'PETG Azul',
      color: '#3B82F6',
      pricePerKg: 30000,
      status: 'INACTIVE',
    },
  ];
};

/**
 * Obtiene detalle de un filamento
 * @param {number} id - ID del filamento
 * @returns {Promise<Object>} Detalle del filamento
 */
export const getFilament = async (id) => {
  // TODO: Reemplazar con apiClient.get(`/config/filaments/${id}`) cuando esté disponible
  const filaments = await getFilaments();
  return filaments.find(f => f.id === id) || null;
};

/**
 * Crea un nuevo filamento
 * @param {Object} filamentData - Datos del filamento
 * @returns {Promise<Object>} Filamento creado
 */
export const createFilament = async (filamentData) => {
  // TODO: Reemplazar con apiClient.post('/config/filaments', filamentData) cuando esté disponible
  return { id: Date.now(), ...filamentData };
};

/**
 * Actualiza un filamento existente
 * @param {number} id - ID del filamento
 * @param {Object} filamentData - Datos actualizados
 * @returns {Promise<Object>} Filamento actualizado
 */
export const updateFilament = async (id, filamentData) => {
  // TODO: Reemplazar con apiClient.put(`/config/filaments/${id}`, filamentData) cuando esté disponible
  return { id, ...filamentData };
};

/**
 * Activa un filamento
 * @param {number} id - ID del filamento
 * @returns {Promise<Object>} Filamento actualizado
 */
export const activateFilament = async (id) => {
  // TODO: Reemplazar con apiClient.put(`/config/filaments/${id}/activate`) cuando esté disponible
  return { id, status: 'ACTIVE' };
};

/**
 * Inactiva un filamento
 * @param {number} id - ID del filamento
 * @returns {Promise<Object>} Filamento actualizado
 */
export const deactivateFilament = async (id) => {
  // TODO: Reemplazar con apiClient.put(`/config/filaments/${id}/deactivate`) cuando esté disponible
  return { id, status: 'INACTIVE' };
};

/**
 * Obtiene configuración de impresión
 * @returns {Promise<Object>} Configuración de impresión
 */
export const getPrintConfig = async () => {
  // TODO: Reemplazar con apiClient.get('/config/print') cuando esté disponible
  // Por ahora retorna datos mock
  return {
    kwhPrice: 150,
    printerConsumption: 0.11,
  };
};

/**
 * Actualiza configuración de impresión
 * @param {Object} configData - Datos de configuración
 * @returns {Promise<Object>} Configuración actualizada
 */
export const updatePrintConfig = async (configData) => {
  // TODO: Reemplazar con apiClient.put('/config/print', configData) cuando esté disponible
  return { ...configData };
};

export default {
  getFilaments,
  getFilament,
  createFilament,
  updateFilament,
  activateFilament,
  deactivateFilament,
  getPrintConfig,
  updatePrintConfig,
};
