/**
 * Servicio para gestión de productos
 * 
 * Responsabilidades:
 * - Listar productos con filtros
 * - Obtener detalle de producto
 * - Crear producto
 * - Actualizar producto
 * - Activar/inactivar producto
 * - Recalcular precio de producto
 * - Gestionar imágenes de producto
 */

import { apiClient } from './apiClient';

/**
 * Obtiene lista de productos
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>} Lista de productos
 */
export const getProducts = async (filters = {}) => {
  // TODO: Reemplazar con apiClient.get('/products', { params: filters }) cuando esté disponible
  // Por ahora retorna datos mock
  return [
    {
      id: 1,
      name: 'Miniatura Space Marine',
      description: 'Figura coleccionable Warhammer 40k',
      tags: ['w40k', '40k', 'Warhammer'],
      filament: 'PLA Verde',
      grams: 120,
      hours: 4,
      margin: 50,
      price: 3900,
      commercialStatus: 'ACTIVE',
      priceStatus: 'CURRENT',
      updatedAt: '2026-09-01T10:00:00Z',
    },
    {
      id: 2,
      name: 'Dragón de Ébano',
      description: 'Figura de dragón en escala 1:72',
      tags: ['fantasía', 'dragón'],
      filament: 'ABS Negro',
      grams: 200,
      hours: 8,
      margin: 60,
      price: 7900,
      commercialStatus: 'INACTIVE',
      priceStatus: 'OUTDATED',
      updatedAt: '2026-08-15T14:30:00Z',
    },
  ];
};

/**
 * Obtiene detalle de un producto
 * @param {number} id - ID del producto
 * @returns {Promise<Object>} Detalle del producto
 */
export const getProduct = async (id) => {
  // TODO: Reemplazar con apiClient.get(`/products/${id}`) cuando esté disponible
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
};

/**
 * Crea un nuevo producto
 * @param {Object} productData - Datos del producto
 * @returns {Promise<Object>} Producto creado
 */
export const createProduct = async (productData) => {
  // TODO: Reemplazar con apiClient.post('/products', productData) cuando esté disponible
  return { id: Date.now(), ...productData };
};

/**
 * Actualiza un producto existente
 * @param {number} id - ID del producto
 * @param {Object} productData - Datos actualizados
 * @returns {Promise<Object>} Producto actualizado
 */
export const updateProduct = async (id, productData) => {
  // TODO: Reemplazar con apiClient.put(`/products/${id}`, productData) cuando esté disponible
  return { id, ...productData };
};

/**
 * Activa un producto
 * @param {number} id - ID del producto
 * @returns {Promise<Object>} Producto actualizado
 */
export const activateProduct = async (id) => {
  // TODO: Reemplazar con apiClient.put(`/products/${id}/activate`) cuando esté disponible
  return { id, commercialStatus: 'ACTIVE' };
};

/**
 * Inactiva un producto
 * @param {number} id - ID del producto
 * @returns {Promise<Object>} Producto actualizado
 */
export const deactivateProduct = async (id) => {
  // TODO: Reemplazar con apiClient.put(`/products/${id}/deactivate`) cuando esté disponible
  return { id, commercialStatus: 'INACTIVE' };
};

/**
 * Recalcula el precio de un producto
 * @param {number} id - ID del producto
 * @returns {Promise<Object>} Producto con precio recalculado
 */
export const recalculateProductPrice = async (id) => {
  // TODO: Reemplazar con apiClient.post(`/products/${id}/recalculate`) cuando esté disponible
  return { id, priceStatus: 'CURRENT' };
};

/**
 * Obtiene historial de imágenes de un producto
 * @param {number} id - ID del producto
 * @param {string} type - Tipo de imagen (FRONT, SIDE, TOP)
 * @returns {Promise<Array>} Historial de imágenes
 */
export const getProductImageHistory = async (id, type) => {
  // TODO: Reemplazar con apiClient.get(`/products/${id}/images/${type}/history`) cuando esté disponible
  return [];
};

/**
 * Actualiza imagen de un producto
 * @param {number} id - ID del producto
 * @param {string} type - Tipo de imagen (FRONT, SIDE, TOP)
 * @param {Object} imageData - Datos de la imagen
 * @returns {Promise<Object>} Imagen actualizada
 */
export const updateProductImage = async (id, type, imageData) => {
  // TODO: Reemplazar con apiClient.put(`/products/${id}/images/${type}`, imageData) cuando esté disponible
  return { productId: id, type, ...imageData };
};

/**
 * Restaura una imagen anterior del historial
 * @param {number} id - ID del producto
 * @param {string} type - Tipo de imagen (FRONT, SIDE, TOP)
 * @param {number} imageId - ID de la imagen a restaurar
 * @returns {Promise<Object>} Imagen restaurada
 */
export const restoreProductImage = async (id, type, imageId) => {
  // TODO: Reemplazar con apiClient.post(`/products/${id}/images/${type}/restore`, { imageId }) cuando esté disponible
  return { productId: id, type, imageId };
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  activateProduct,
  deactivateProduct,
  recalculateProductPrice,
  getProductImageHistory,
  updateProductImage,
  restoreProductImage,
};
