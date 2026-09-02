/**
 * API Client centralizado para llamadas a API Gateway/BFF
 * 
 * Responsabilidades:
 * - URL base
 * - Headers comunes
 * - Token MSAL
 * - Authorization: Bearer
 * - Parseo básico
 * - Manejo común de errores HTTP
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Obtiene el token de acceso para la API
 * @returns {Promise<string|null>} Token de acceso o null
 */
const getApiToken = async () => {
  // TODO: Implementar adquisición de token MSAL cuando esté disponible
  // Por ahora retorna null para modo mock
  return null;
};

/**
 * Realiza una petición HTTP con headers comunes
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones de fetch
 * @returns {Promise<Object>} Respuesta parseada
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = await getApiToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * API Client con métodos CRUD básicos
 */
export const apiClient = {
  /**
   * GET request
   * @param {string} endpoint - Endpoint
   * @returns {Promise<Object>} Respuesta
   */
  get: (endpoint) => fetchWithAuth(endpoint, { method: 'GET' }),
  
  /**
   * POST request
   * @param {string} endpoint - Endpoint
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>} Respuesta
   */
  post: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  /**
   * PUT request
   * @param {string} endpoint - Endpoint
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>} Respuesta
   */
  put: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  /**
   * DELETE request
   * @param {string} endpoint - Endpoint
   * @returns {Promise<Object>} Respuesta
   */
  delete: (endpoint) => fetchWithAuth(endpoint, { method: 'DELETE' }),
};

export default apiClient;
