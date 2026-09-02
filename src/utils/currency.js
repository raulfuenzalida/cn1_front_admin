/**
 * Utilidades para formato de moneda CLP
 */

/**
 * Formatea un valor numérico como CLP
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado en CLP (ej: $3.900)
 */
export const formatCLP = (amount) => {
  if (amount === null || amount === undefined) {
    return '$0';
  }

  const roundedAmount = Math.round(amount);
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedAmount);
};

/**
 * Parsea un string CLP a número
 * @param {string} clpString - String en formato CLP (ej: "$3.900")
 * @returns {number} Valor numérico
 */
export const parseCLP = (clpString) => {
  if (!clpString) return 0;
  const cleaned = clpString.replace(/[$.]/g, '').trim();
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
};
