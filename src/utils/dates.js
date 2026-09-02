/**
 * Utilidades para formato de fechas
 */

/**
 * Formatea una fecha para Chile
 * @param {Date|string|number} date - Fecha a formatear
 * @returns {string} Fecha formateada (ej: 01/09/2026)
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
};

/**
 * Formatea una fecha con hora para Chile
 * @param {Date|string|number} date - Fecha a formatear
 * @returns {string} Fecha y hora formateada (ej: 01/09/2026 15:30)
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Formatea una fecha en formato relativo (hace X tiempo)
 * @param {Date|string|number} date - Fecha a formatear
 * @returns {string} Fecha relativa (ej: hace 2 horas)
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'ahora mismo';
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  if (diffDays < 7) return `hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  
  return formatDate(dateObj);
};

/**
 * Verifica si una fecha es hoy
 * @param {Date|string|number} date - Fecha a verificar
 * @returns {boolean} True si es hoy
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return false;
  
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};
