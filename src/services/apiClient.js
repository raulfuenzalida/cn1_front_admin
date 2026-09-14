/**
 * API Client centralizado para llamadas a la API
 * 
 * Responsabilidades:
 * - URL base (VITE_API_BASE_URL)
 * - Headers comunes
 * - Token MSAL (Access Token)
 * - Authorization: Bearer
 * - Parseo de respuestas
 * - Soporte para respuestas JSON y Blob
 * - Normalización de errores HTTP
 */

import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Normaliza errores HTTP para dar feedback apropiado
 * @param {Response} response - Response object
 * @returns {Error} Error normalizado con mensaje apropiado
 */
const normalizeError = (response) => {
  const status = response.status;

  switch (status) {
    case 400:
      return new Error('Datos inválidos en la solicitud');
    case 401:
      return new Error(
        'Sesión expirada o inválida. Por favor inicie sesión nuevamente.'
      );
    case 403:
      return new Error('Acceso no autorizado');
    case 404:
      return new Error('Recurso no encontrado');
    case 409:
      return new Error(
        'Conflicto: el recurso ya existe o viola una regla de negocio'
      );
    default:
      if (status >= 500) {
        return new Error(
          'Error temporal del servidor. Por favor intente nuevamente.'
        );
      }

      return new Error(`Error HTTP: ${status}`);
  }
};

/**
 * Obtiene el token de acceso para la API
 * @returns {Promise<string|null>} Token de acceso o null
 */
const getApiToken = async () => {
  try {
    return await authService.acquireApiToken();
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
};

/**
 * Realiza una petición HTTP con headers comunes
 *
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones de fetch
 * @param {'json'|'blob'} responseType - Tipo de respuesta esperada
 * @returns {Promise<Object|Blob|null>} Respuesta parseada
 */
const fetchWithAuth = async (
  endpoint,
  options = {},
  responseType = 'json'
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = await getApiToken();

  const headers = {
    Accept:
      responseType === 'blob'
        ? 'application/pdf'
        : 'application/json',
    ...(options.body && {
      'Content-Type': 'application/json',
    }),
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw normalizeError(response);
  }

  if (responseType === 'blob') {
    return response.blob();
  }

  // Respuestas sin contenido
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');

  if (
    !contentType ||
    !contentType.includes('application/json')
  ) {
    return null;
  }

  return response.json();
};

/**
 * API Client con métodos CRUD básicos
 */
export const apiClient = {
  /**
   * GET request
   *
   * @param {string} endpoint - Endpoint
   * @param {Object} options - Opciones adicionales
   * @param {'json'|'blob'} options.responseType - Tipo de respuesta
   * @returns {Promise<Object|Blob|null>} Respuesta
   */
  get: (endpoint, options = {}) => {
    const {
      responseType = 'json',
      ...fetchOptions
    } = options;

    return fetchWithAuth(
      endpoint,
      {
        method: 'GET',
        ...fetchOptions,
      },
      responseType
    );
  },

  /**
   * POST request
   *
   * @param {string} endpoint - Endpoint
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object|null>} Respuesta
   */
  post: (endpoint, data) =>
    fetchWithAuth(endpoint, {
      method: 'POST',
      body: data !== undefined
        ? JSON.stringify(data)
        : undefined,
    }),

  /**
   * PUT request
   *
   * @param {string} endpoint - Endpoint
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object|null>} Respuesta
   */
  put: (endpoint, data) =>
    fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * PATCH request
   *
   * @param {string} endpoint - Endpoint
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object|null>} Respuesta
   */
  patch: (endpoint, data) =>
    fetchWithAuth(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * DELETE request
   *
   * @param {string} endpoint - Endpoint
   * @returns {Promise<Object|null>} Respuesta
   */
  delete: (endpoint) =>
    fetchWithAuth(endpoint, {
      method: 'DELETE',
    }),
};

export default apiClient;