import { apiClient } from './apiClient';

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : '';
};

// Listado administrativo de productos
export const getProducts = async (filters = {}) => {
  return apiClient.get(
    `/api/v1/products/admin${buildQuery(filters)}`
  );
};

// Obtener producto por ID
export const getProduct = async (id) => {
  return apiClient.get(`/api/v1/products/admin/${id}`);
};

// Crear producto
export const createProduct = async (productData) => {
  return apiClient.post('/api/v1/products', productData);
};

// Actualizar producto
export const updateProduct = async (id, productData) => {
  return apiClient.put(`/api/v1/products/${id}`, productData);
};

// Cambiar estado ACTIVE / INACTIVE
export const updateProductStatus = async (id, status) => {
  return apiClient.patch(
    `/api/v1/products/${id}/status`,
    { status }
  );
};

// Recalcular precio de un producto
export const recalculateProductPrice = async (id) => {
  return apiClient.post(
    `/api/v1/products/${id}/recalculate`
  );
};

// Recalcular todos los productos OUTDATED
export const recalculateOutdatedProducts = async () => {
  return apiClient.post(
    '/api/v1/products/recalculate-outdated'
  );
};